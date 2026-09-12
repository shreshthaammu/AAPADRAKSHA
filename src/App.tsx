import React, { useState, useEffect } from "react";
import { INDIAN_STATES } from "./data/regions";
import {
  DEFAULT_ZONES,
  DEFAULT_WEATHER,
  DEFAULT_SHELTERS,
  DEFAULT_SERVICES,
  DEFAULT_ALERTS,
  DEFAULT_REPORTS,
  DEFAULT_FAMILY_MEMBERS
} from "./data/mockData";
import {
  NavTab,
  StateProfile,
  ZoneData,
  AlertItem,
  CitizenReportItem,
  ShelterItem,
  EmergencyServiceItem,
  WeatherData,
  FamilyMemberItem,
  AppMode,
  AuthorityAlertAudit,
  ThemeMode
} from "./types";
import { Navbar } from "./components/Navbar";
import { Sidebar, TabType } from "./components/Sidebar";
import { EmergencyAlertBanner } from "./components/EmergencyAlertBanner";
import { SOSModal } from "./components/SOSModal";
import { AuthGate } from "./components/AuthGate";

// Pages
import { DashboardPage } from "./pages/DashboardPage";
import { LiveMapPage } from "./pages/LiveMapPage";
import { WeatherPage } from "./pages/WeatherPage";
import { FloodForecastPage } from "./pages/FloodForecastPage";
import { AlertsPage } from "./pages/AlertsPage";
import { EvacuationPage } from "./pages/EvacuationPage";
import { EmergencyServicesPage } from "./pages/EmergencyServicesPage";
import { FamilySafetyPage } from "./pages/FamilySafetyPage";
import { EmergencySOSPage } from "./pages/EmergencySOSPage";
import { AIAssistantPage } from "./pages/AIAssistantPage";
import { AIPredictionPage } from "./pages/AIPredictionPage";
import { ModelArchitecturePage } from "./pages/ModelArchitecturePage";
import { RiskAnalysisPage } from "./pages/RiskAnalysisPage";
import { DataFusionPage } from "./pages/DataFusionPage";
import { DataPage } from "./pages/DataPage";
import { InfrastructurePage } from "./pages/InfrastructurePage";
import { CitizenAlertsPage } from "./pages/CitizenAlertsPage";
import { WhatIfSimulatorPage } from "./pages/WhatIfSimulatorPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { DisasterReportsPage } from "./pages/DisasterReportsPage";
import { NotificationsPage, NotificationItem } from "./pages/NotificationsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { AuthorityAlertControlPage } from "./pages/AuthorityAlertControlPage";
import { AuthorityDataSourcesPage } from "./pages/AuthorityDataSourcesPage";
import { CitizenSafetyPage } from "./pages/CitizenSafetyPage";
import { DemoModeBanner } from "./components/DemoModeBanner";
import {
  fetchAlerts,
  fetchCitizenReports,
  createAuthorityAlert,
  fetchEmergencyServices,
  fetchNotifications,
  fetchRiskData,
  fetchShelters,
  fetchWeatherData,
  markAllNotificationsRead,
  markNotificationRead,
  clearNotifications,
  updateAuthorityAlert
} from "./services/api";

function DashboardApp({ onLogout }: { onLogout: () => void }) {
  // Navigation & View Mode
  const [activeTab, setActiveTab] = useState<NavTab>("dashboard");
  const [mode, setMode] = useState<AppMode>(() => {
    if (typeof window === "undefined") return "citizen";
    const storedMode = localStorage.getItem("aapadraksha_mode");
    return storedMode === "authority" ? "authority" : "citizen";
  });
  const isAuthorityMode = mode === "authority";
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isSOSModalOpen, setIsSOSModalOpen] = useState<boolean>(false);

  // Theme
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "system";
    const storedTheme = localStorage.getItem("aapadraksha-theme-mode");
    return storedTheme === "light" || storedTheme === "dark" || storedTheme === "system"
      ? storedTheme
      : "system";
  });
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const storedTheme = localStorage.getItem("aapadraksha-theme-mode");
    if (storedTheme === "dark") return true;
    if (storedTheme === "light") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const syncTheme = () => {
      const shouldUseDark = themeMode === "dark" || (themeMode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
      setIsDarkMode(shouldUseDark);
      document.documentElement.classList.toggle("dark", shouldUseDark);
      document.documentElement.style.colorScheme = shouldUseDark ? "dark" : "light";
      localStorage.setItem("aapadraksha-theme", shouldUseDark ? "dark" : "light");
      localStorage.setItem("aapadraksha-theme-mode", themeMode);
    };

    syncTheme();
    const matcher = window.matchMedia("(prefers-color-scheme: dark)");
    if (themeMode === "system") {
      matcher.addEventListener("change", syncTheme);
      return () => matcher.removeEventListener("change", syncTheme);
    }
    return undefined;
  }, [themeMode]);

  useEffect(() => {
    localStorage.setItem("aapadraksha_mode", mode);
  }, [mode]);

  useEffect(() => {
    const authorityOnlyTabs: NavTab[] = [
      "authority-alerts",
      "authority-sources",
      "data",
      "ai-prediction",
      "risk-analysis",
      "data-fusion",
      "infrastructure",
      "what-if",
      "analytics",
      "disaster-reports",
      "model-training"
    ];

    if (mode === "citizen" && authorityOnlyTabs.includes(activeTab)) {
      setActiveTab("dashboard");
    }
  }, [mode, activeTab]);

  // Regional selection
  const [selectedState, setSelectedState] = useState<StateProfile>(INDIAN_STATES[0]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("Hyderabad");

  // Dynamic Data States
  const [zones, setZones] = useState<ZoneData[]>(DEFAULT_ZONES);
  const [selectedZone, setSelectedZone] = useState<ZoneData>(DEFAULT_ZONES[0]);
  const [weather, setWeather] = useState<WeatherData>(DEFAULT_WEATHER);
  const [shelters, setShelters] = useState<ShelterItem[]>(DEFAULT_SHELTERS);
  const [services, setServices] = useState<EmergencyServiceItem[]>(DEFAULT_SERVICES);
  const [alerts, setAlerts] = useState<AlertItem[]>(DEFAULT_ALERTS);
  const [reports, setReports] = useState<CitizenReportItem[]>(DEFAULT_REPORTS);
  const [familyMembers] = useState<FamilyMemberItem[]>(DEFAULT_FAMILY_MEMBERS);
  const [alertAuditLog, setAlertAuditLog] = useState<AuthorityAlertAudit[]>([
    {
      id: "AUD-001",
      alertId: "ALT-2026-0891",
      createdBy: "Authority Operator",
      createdTime: "10 Sep 2026, 11:42 AM",
      modifiedBy: "Authority Operator",
      modifiedTime: "10 Sep 2026, 11:58 AM",
      previousSeverity: "HIGH",
      newSeverity: "EMERGENCY",
      statusChange: "Draft → Published",
      source: "IMD Hyderabad & CWC",
      publicationStatus: "Published"
    }
  ]);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "notif-1",
      title: "RED INUNDATION ALERT: Moosarambagh",
      message: "River Musi over-topping stage 512.4m. Evacuate ground floors immediately.",
      time: "10 mins ago",
      unread: true,
      type: "CRITICAL"
    },
    {
      id: "notif-2",
      title: "Doppler Radar Convective Surge",
      message: "Intense squall line with 34mm/hr rainfall tracking across central Hyderabad.",
      time: "25 mins ago",
      unread: true,
      type: "ALERT"
    },
    {
      id: "notif-3",
      title: "Shelter Activated: Amberpet Stadium",
      message: "1,160 slots available with medical post and power generators.",
      time: "1 hour ago",
      unread: false,
      type: "INFO"
    }
  ]);

  useEffect(() => {
    try {
      const storedNotifications = localStorage.getItem("aapadraksha_notifications");
      if (storedNotifications) {
        const parsed = JSON.parse(storedNotifications) as NotificationItem[];
        if (Array.isArray(parsed)) setNotifications(parsed);
      }
    } catch {
      localStorage.removeItem("aapadraksha_notifications");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("aapadraksha_notifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    let cancelled = false;

    const hydrateFromBackend = async () => {
      const [riskData, weatherData, backendAlerts, backendReports, backendShelters, backendServices, backendNotifications] = await Promise.all([
        fetchRiskData(selectedState.name, selectedDistrict, selectedZone.id),
        fetchWeatherData(selectedState.name, selectedDistrict),
        fetchAlerts(),
        fetchCitizenReports(),
        fetchShelters(),
        fetchEmergencyServices(),
        fetchNotifications().catch(() => [])
      ]);

      if (cancelled) return;
      if (riskData?.zones?.length) setZones(riskData.zones);
      if (riskData?.selectedZone) setSelectedZone(riskData.selectedZone);
      if (weatherData?.current) setWeather(weatherData.current);
      if (backendAlerts?.length) setAlerts(backendAlerts);
      if (backendReports?.length) setReports(backendReports);
      if (backendShelters?.length) setShelters(backendShelters);
      if (backendServices?.length) setServices(backendServices);
      if (Array.isArray(backendNotifications)) setNotifications(backendNotifications.map(item => ({ ...item, time: new Date(item.timestamp).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }), unread: !item.read, type: item.severity === "EMERGENCY" ? "CRITICAL" : item.severity === "INFO" ? "INFO" : "ALERT" })));
    };

    void hydrateFromBackend();
    return () => {
      cancelled = true;
    };
  }, [selectedState.name, selectedDistrict]);

  // Switch State / District handler
  const handleSelectState = (state: StateProfile) => {
    setSelectedState(state);
    setSelectedDistrict(state.defaultDistrict);
  };

  // Citizen Report Submission
  const handleNewReport = (report: CitizenReportItem) => {
    setReports(prev => [report, ...prev]);
    // Also push a notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: `New Citizen Report: ${report.category}`,
        message: `${report.location}: ${report.description.slice(0, 80)}...`,
        time: "Just now",
        unread: true,
        type: report.severity === "CRITICAL" ? "CRITICAL" : "ALERT"
      },
      ...prev
    ]);
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    void markAllNotificationsRead().catch(() => undefined);
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
    void clearNotifications().catch(() => undefined);
  };

  const handleToggleRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, unread: !n.unread } : n))
    );
    void markNotificationRead(id).catch(() => undefined);
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleToggleMode = () => {
    const nextMode: AppMode = mode === "citizen" ? "authority" : "citizen";
    setMode(nextMode);
    setActiveTab("dashboard");
  };

  const handleSetThemeMode = (nextThemeMode: ThemeMode) => {
    setThemeMode(nextThemeMode);
  };

  const handleToggleTheme = () => {
    setThemeMode(current => {
      if (current === "system") return "dark";
      return current === "dark" ? "light" : "dark";
    });
  };

  const handlePredictionUpdate = (prediction: { floodProb: number; depth: number; risk: any; eta: string }) => {
    setSelectedZone(prev => ({ ...prev, floodProb: prediction.floodProb, depth: prediction.depth, risk: prediction.risk, inundationEta: prediction.eta, status: "Updated from active prediction" }));
    setZones(prev => prev.map(zone => zone.id === selectedZone.id ? { ...zone, floodProb: prediction.floodProb, depth: prediction.depth, risk: prediction.risk, inundationEta: prediction.eta, status: "Updated from active prediction" } : zone));
  };

  const handleCreateAlert = async (draft: AlertItem) => {
    const response = await createAuthorityAlert({ ...draft, status: draft.status || "Draft", verificationStatus: draft.verificationStatus || "Draft", time: draft.time || "Just now" });
    const newAlert = response.alert as AlertItem;
    setAlerts(prev => [newAlert, ...prev]);
    if (newAlert.status === "Published") {
      const isAllClear = newAlert.category.toLowerCase().includes("all clear") || newAlert.title.toLowerCase().includes("all clear");
      const backendNotifications = await fetchNotifications();
      setNotifications(backendNotifications.map(item => ({ ...item, time: new Date(item.timestamp).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }), unread: !item.read, type: item.severity === "EMERGENCY" ? "CRITICAL" : item.severity === "INFO" ? "INFO" : "ALERT" })));
      const matchingZone = DEFAULT_ZONES.find(zone => zone.district === newAlert.district || newAlert.location.toLowerCase().includes(zone.district.toLowerCase()));
      if (matchingZone && !isAllClear) {
        const risk = newAlert.severity === "EMERGENCY" || newAlert.severity === "CRITICAL" ? "EMERGENCY" : newAlert.severity === "HIGH" ? "PREPARE" : "WATCH";
        setSelectedZone({ ...matchingZone, risk, floodProb: Math.max(matchingZone.floodProb, Number.parseInt(newAlert.floodProbability || "0", 10) || 0) });
      }
    }
    setAlertAuditLog(prev => [{
      id: `AUD-${Date.now()}`,
      alertId: newAlert.id,
      createdBy: "Authority Operator",
      createdTime: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
      modifiedBy: "Authority Operator",
      modifiedTime: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
      previousSeverity: "NEW",
      newSeverity: newAlert.severity,
      statusChange: "Draft → Published",
      source: newAlert.source,
      publicationStatus: newAlert.status || "Published"
    }, ...prev]);
  };

  const handleUpdateAlert = async (updated: AlertItem) => {
    const wasPublished = alerts.find(item => item.id === updated.id)?.status === "Published";
    const response = await updateAuthorityAlert(updated.id, updated);
    const savedAlert = response.alert as AlertItem;
    setAlerts(prev => prev.map(item => item.id === savedAlert.id ? { ...item, ...savedAlert } : item));
    if (updated.status === "Published" && !wasPublished) {
      const backendNotifications = await fetchNotifications();
      setNotifications(backendNotifications.map(item => ({ ...item, time: new Date(item.timestamp).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }), unread: !item.read, type: item.severity === "EMERGENCY" ? "CRITICAL" : item.severity === "INFO" ? "INFO" : "ALERT" })));
    }
    setAlertAuditLog(prev => [{
      id: `AUD-${Date.now()}`,
      alertId: updated.id,
      createdBy: "Authority Operator",
      createdTime: updated.createdAt || new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
      modifiedBy: "Authority Operator",
      modifiedTime: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
      previousSeverity: updated.previousSeverity || "UNCHANGED",
      newSeverity: updated.severity,
      statusChange: `${updated.status || "Published"}`,
      source: updated.source,
      publicationStatus: updated.status || "Published"
    }, ...prev]);
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(item => item.id !== id));
  };

  const handleDuplicateAlert = (alert: AlertItem) => {
    const dup: AlertItem = { ...alert, id: `${alert.id}-COPY-${Date.now().toString().slice(-4)}`, title: `${alert.title} (Copy)`, status: "Draft" };
    setAlerts(prev => [dup, ...prev]);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-blue-500 selection:text-white transition-colors duration-200">
      {/* Global Navbar */}
      <Navbar
        selectedState={selectedState}
        selectedDistrict={selectedDistrict}
        onSelectState={handleSelectState}
        onSelectDistrict={setSelectedDistrict}
        isAuthorityMode={isAuthorityMode}
        appMode={mode}
        onToggleAuthorityMode={handleToggleMode}
        onOpenSOS={() => setIsSOSModalOpen(true)}
        theme={isDarkMode ? "dark" : "light"}
        onToggleTheme={handleToggleTheme}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
        isMobileSidebarOpen={isMobileSidebarOpen}
      />

      <DemoModeBanner />

      {/* Critical Inundation Emergency Alert Banner */}
      {(selectedZone.risk === "EMERGENCY" || selectedZone.floodProb >= 75) && (
        <EmergencyAlertBanner
          riskLevel={selectedZone.risk}
          location={`${selectedZone.name}, ${selectedDistrict}`}
          waterDepth={selectedZone.depth}
          inundationEta={selectedZone.inundationEta}
          onEvacuateClick={() => setActiveTab("evacuation")}
          onSosClick={() => setIsSOSModalOpen(true)}
        />
      )}

      {/* Main Layout: Sidebar + Dynamic Workspace */}
      <div className="flex-1 flex w-full">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab as TabType}
          onSelectTab={(tab: TabType) => setActiveTab(tab as NavTab)}
          isAuthorityMode={isAuthorityMode}
          unreadNotificationsCount={unreadCount}
          isOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onLogout={onLogout}
        />

        {/* Dynamic Main Content Container */}
        <main className="flex-1 p-4 sm:p-6 min-w-0 max-w-full overflow-x-hidden">
          {activeTab === "dashboard" && (
            <DashboardPage
              selectedZone={selectedZone}
              zones={zones}
              selectedState={selectedState}
              selectedDistrict={selectedDistrict}
              isAuthorityMode={isAuthorityMode}
              onSelectZone={setSelectedZone}
              onNavigateTab={(tab: any) => setActiveTab(tab)}
              onOpenSOS={() => setIsSOSModalOpen(true)}
            />
          )}

          {activeTab === "live-map" && (
            <LiveMapPage
              zones={zones}
              selectedZone={selectedZone}
              onSelectZone={setSelectedZone}
              shelters={shelters}
              selectedState={selectedState}
              selectedDistrict={selectedDistrict}
              onNavigateTab={(tab: any) => setActiveTab(tab)}
            />
          )}

          {activeTab === "weather" && (
            <WeatherPage
              weather={weather}
              selectedState={selectedState}
              selectedDistrict={selectedDistrict}
              selectedZone={selectedZone}
            />
          )}

          {(activeTab === "flood-forecast" || activeTab === "forecast") && (
            <FloodForecastPage
              selectedZone={selectedZone}
              selectedDistrict={selectedDistrict}
              onNavigateTab={(tab: any) => setActiveTab(tab)}
            />
          )}

          {activeTab === "risk-analysis" && (
            <RiskAnalysisPage selectedZone={selectedZone} />
          )}

          {activeTab === "ai-prediction" && <AIPredictionPage onPrediction={handlePredictionUpdate} />}

          {(activeTab === "architecture" || activeTab === "model-training") && (
            <ModelArchitecturePage />
          )}

          {activeTab === "data-fusion" && <DataFusionPage />}

          {activeTab === "data" && <DataPage />}

          {activeTab === "alerts" && (
            <AlertsPage
              alerts={alerts}
              selectedDistrict={selectedDistrict}
              onNavigateTab={(tab: any) => setActiveTab(tab)}
            />
          )}

          {activeTab === "safety" && <CitizenSafetyPage selectedZone={selectedZone} />}

          {activeTab === "authority-alerts" && (
            <AuthorityAlertControlPage
              alerts={alerts}
              auditLog={alertAuditLog}
              onCreateAlert={handleCreateAlert}
              onUpdateAlert={handleUpdateAlert}
              onDeleteAlert={handleDeleteAlert}
              onDuplicateAlert={handleDuplicateAlert}
            />
          )}

          {activeTab === "authority-sources" && (
            <AuthorityDataSourcesPage />
          )}

          {activeTab === "infrastructure" && <InfrastructurePage />}

          {activeTab === "citizen-alerts" && (
            <CitizenAlertsPage
              reports={reports}
              selectedZone={selectedZone}
              onNewReport={handleNewReport}
            />
          )}

          {activeTab === "what-if" && <WhatIfSimulatorPage />}

          {activeTab === "analytics" && <AnalyticsPage />}

          {activeTab === "disaster-reports" && (
            <DisasterReportsPage
              reports={reports}
              isAuthorityMode={isAuthorityMode}
            />
          )}

          {activeTab === "evacuation" && (
            <EvacuationPage
              shelters={shelters}
              selectedZone={selectedZone}
              onNavigateTab={(tab: any) => setActiveTab(tab)}
            />
          )}

          {activeTab === "emergency-services" && (
            <EmergencyServicesPage
              services={services}
              onOpenSOS={() => setIsSOSModalOpen(true)}
              selectedState={selectedState}
              selectedDistrict={selectedDistrict}
            />
          )}

          {activeTab === "family-safety" && (
            <FamilySafetyPage initialMembers={familyMembers} />
          )}

          {activeTab === "sos" && (
            <EmergencySOSPage
              selectedZone={selectedZone}
              selectedDistrict={selectedDistrict}
              onOpenSOSModal={() => setIsSOSModalOpen(true)}
            />
          )}

          {(activeTab === "ai-assistant" || activeTab === "assistant") && (
            <AIAssistantPage
              selectedZone={selectedZone}
              selectedState={selectedState}
              selectedDistrict={selectedDistrict}
              onNavigateTab={(tab: any) => setActiveTab(tab)}
            />
          )}

          {activeTab === "notifications" && (
            <NotificationsPage
              notifications={notifications}
              onMarkAllRead={handleMarkAllRead}
              onClearAll={handleClearAllNotifications}
              onToggleRead={handleToggleRead}
            />
          )}

          {activeTab === "settings" && (
            <SettingsPage
              isDarkMode={isDarkMode}
              themeMode={themeMode}
              onToggleTheme={handleToggleTheme}
              onSetThemeMode={handleSetThemeMode}
            />
          )}

          {activeTab === "profile" && (
            <ProfilePage
              selectedZone={selectedZone}
              selectedDistrict={selectedDistrict}
              selectedState={selectedState}
            />
          )}
        </main>
      </div>

      {/* Global Interactive Emergency SOS Modal */}
      <SOSModal
        isOpen={isSOSModalOpen}
        onClose={() => setIsSOSModalOpen(false)}
        locationName={`${selectedZone.name}, ${selectedDistrict}`}
        coordinates={[selectedZone.latitude, selectedZone.longitude]}
        onNavigateToShelters={() => {
          setIsSOSModalOpen(false);
          setActiveTab("evacuation");
        }}
      />
    </div>
  );
}

export default function App() {
  return <AuthGate>{onLogout => <DashboardApp onLogout={onLogout} />}</AuthGate>;
}
