import type { AlertItem, ShelterItem, EmergencyServiceItem, InfrastructureItem, CitizenReportItem, DataFusionSource, ModelBenchmark } from "../types";

const BASE_URL = "/api";

function authorityHeaders(): HeadersInit {
  const token = sessionStorage.getItem("aapadraksha_authority_token");
  return token ? { Authorization: `Bearer ${token}` } : { "x-role": "authority" };
}

export async function createAuthorityAlert(alert: any): Promise<any> {
  const res = await fetch(`${BASE_URL}/authority/alerts`, { method: "POST", headers: { "Content-Type": "application/json", ...authorityHeaders() }, body: JSON.stringify(alert) });
  if (!res.ok) throw new Error(`Alert could not be created (${res.status})`);
  return await res.json();
}

export async function updateAuthorityAlert(id: string, updates: any): Promise<any> {
  const res = await fetch(`${BASE_URL}/authority/alerts/${encodeURIComponent(id)}`, { method: "PATCH", headers: { "Content-Type": "application/json", ...authorityHeaders() }, body: JSON.stringify(updates) });
  if (!res.ok) throw new Error(`Alert could not be updated (${res.status})`);
  return await res.json();
}

export async function deleteAuthorityAlert(id: string): Promise<any> {
  const res = await fetch(`${BASE_URL}/authority/alerts/${encodeURIComponent(id)}`, { method: "DELETE", headers: authorityHeaders() });
  if (!res.ok) throw new Error(`Alert could not be deleted (${res.status})`);
  return await res.json();
}

export async function fetchRiskData(state: string, district: string, zoneId?: string): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/risk?state=${encodeURIComponent(state)}&district=${encodeURIComponent(district)}${zoneId ? `&zoneId=${encodeURIComponent(zoneId)}` : ""}`);
    if (!res.ok) throw new Error("HTTP error " + res.status);
    return await res.json();
  } catch (err) {
    console.warn("fetchRiskData error, using client fallback:", err);
    return null;
  }
}

export async function fetchWeatherData(state: string, district: string): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/weather?state=${encodeURIComponent(state)}&district=${encodeURIComponent(district)}`);
    if (!res.ok) throw new Error("HTTP error " + res.status);
    return await res.json();
  } catch (err) {
    console.warn("fetchWeatherData error, using client fallback:", err);
    return null;
  }
}

export async function fetchFloodData(): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/flood`);
    if (!res.ok) throw new Error("HTTP error " + res.status);
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchForecastTimeline(): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/forecast`);
    if (!res.ok) throw new Error("HTTP error " + res.status);
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchAlerts(): Promise<AlertItem[]> {
  try {
    const res = await fetch(`${BASE_URL}/alerts`);
    if (!res.ok) throw new Error("HTTP error " + res.status);
    const data = await res.json();
    return data.alerts || [];
  } catch (err) {
    return [];
  }
}

export async function fetchShelters(): Promise<ShelterItem[]> {
  try {
    const res = await fetch(`${BASE_URL}/shelters`);
    if (!res.ok) throw new Error("HTTP error " + res.status);
    const data = await res.json();
    return data.shelters || [];
  } catch (err) {
    return [];
  }
}

export async function fetchEmergencyServices(): Promise<EmergencyServiceItem[]> {
  try {
    const res = await fetch(`${BASE_URL}/emergency-services`);
    if (!res.ok) throw new Error("HTTP error " + res.status);
    const data = await res.json();
    return data.services || [];
  } catch (err) {
    return [];
  }
}

export async function fetchInfrastructure(): Promise<InfrastructureItem[]> {
  try {
    const res = await fetch(`${BASE_URL}/infrastructure`);
    if (!res.ok) throw new Error("HTTP error " + res.status);
    const data = await res.json();
    return data.infrastructure || [];
  } catch (err) {
    return [];
  }
}

export async function fetchFusionSources(): Promise<{ fusionPipeline: DataFusionSource[]; fusionStatus: string; overallQualityIndex: string }> {
  try {
    const res = await fetch(`${BASE_URL}/fusion-sources`);
    if (!res.ok) throw new Error("HTTP error " + res.status);
    return await res.json();
  } catch (err) {
    return { fusionPipeline: [], fusionStatus: "Offline", overallQualityIndex: "N/A" };
  }
}

export async function fetchCitizenReports(): Promise<CitizenReportItem[]> {
  try {
    const res = await fetch(`${BASE_URL}/reports`);
    if (!res.ok) throw new Error("HTTP error " + res.status);
    const data = await res.json();
    return data.reports || [];
  } catch (err) {
    return [];
  }
}

export async function submitCitizenReport(reportData: Partial<CitizenReportItem>): Promise<any> {
  const res = await fetch(`${BASE_URL}/reports`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reportData)
  });
  return await res.json();
}

export async function updateCitizenReport(id: string, updates: { status?: string; upvote?: boolean }): Promise<any> {
  const res = await fetch(`${BASE_URL}/reports/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates)
  });
  return await res.json();
}

export async function runPredictSimulation(params: any): Promise<any> {
  const res = await fetch(`${BASE_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params)
  });
  return await res.json();
}

export async function runImageDetection(data: { imageBase64?: string; filename?: string }): Promise<any> {
  const res = await fetch(`${BASE_URL}/image-detection`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return await res.json();
}

export async function runPersonalSafetyCheck(params: any): Promise<any> {
  const res = await fetch(`${BASE_URL}/safety-check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params)
  });
  return await res.json();
}

export async function askAiAssistant(query: string, location?: string, currentRisk?: string, floodProb?: number): Promise<{ answer: string; source: string; isAiPowered: boolean }> {
  const res = await fetch(`${BASE_URL}/assistant`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, location, currentRisk, floodProb })
  });
  return await res.json();
}

export async function checkMisinformation(message: string): Promise<any> {
  const res = await fetch(`${BASE_URL}/misinformation-check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });
  return await res.json();
}

export async function fetchModelBenchmarks(): Promise<ModelBenchmark[]> {
  try {
    const res = await fetch(`${BASE_URL}/models`);
    if (!res.ok) throw new Error("HTTP error " + res.status);
    const data = await res.json();
    return data.models || [];
  } catch (err) {
    return [];
  }
}

export async function fetchAnalyticsData(): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/analytics`);
    if (!res.ok) throw new Error("HTTP error " + res.status);
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function askAIAssistant(query: string, context?: string): Promise<{ reply: string; source?: string }> {
  try {
    const result = await askAiAssistant(query, context);
    return { reply: result.answer, source: result.source };
  } catch (err) {
    return {
      reply: "Immediate flood precautions: Please move to elevated structures or high-ground relief shelters immediately. Avoid wading through flowing waters.",
      source: "Offline NDMA Rulebook"
    };
  }
}

export async function predictRisk(params: any): Promise<any> {
  const response = await runPredictSimulation(params);
  const data = response?.data || response;
  const contributing_factors = (data.contributingFactors || []).length > 0
    ? data.contributingFactors.map((c: any) => ({
        name: c.factor || c.name,
        percentage: c.percentage,
        value: c.value
      }))
    : (data.featureNames || []).map((name: string, index: number) => ({
        name: name.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase()),
        percentage: Math.round(100 / Math.max(1, (data.featureNames || []).length)),
        value: data.features?.[name],
        index
      }));

  return {
    ...data,
    flood_probability: data.floodProbability,
    risk_level: data.riskLevel,
    inundation_depth_meters: data.waterDepthM,
    confidence: data.reliability === "HIGH" ? 1 : data.reliability === "MODERATE" ? 0.7 : 0.4,
    inundation_eta_hours: data.inundationEta,
    contributing_factors,
    engineType: data.engineType,
    modelVersion: data.modelVersion,
    metrics: data.metrics
  };
}

export async function triggerEmergencySOS(
  coordinatesOrData: any,
  message?: string,
  userName?: string,
  userPhone?: string
): Promise<any> {
  try {
    const payload = Array.isArray(coordinatesOrData)
      ? { coordinates: coordinatesOrData, message, userName, userPhone }
      : coordinatesOrData;

    const res = await fetch(`${BASE_URL}/sos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("SOS API returned status " + res.status);
    return await res.json();
  } catch (err) {
    throw new Error("Unable to contact the AAPADRAKSHA response server.");
  }
}

export async function fetchNotifications(): Promise<any[]> {
  const res = await fetch(`${BASE_URL}/notifications`);
  if (!res.ok) throw new Error(`Notification service unavailable (${res.status})`);
  const data = await res.json();
  return data.notifications || [];
}

export async function markNotificationRead(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/notifications/${encodeURIComponent(id)}/read`, { method: "PATCH" });
  if (!res.ok) throw new Error(`Notification could not be updated (${res.status})`);
}

export async function markAllNotificationsRead(): Promise<void> {
  const res = await fetch(`${BASE_URL}/notifications/read-all`, { method: "PATCH" });
  if (!res.ok) throw new Error(`Notifications could not be updated (${res.status})`);
}

export async function clearNotifications(): Promise<void> {
  const res = await fetch(`${BASE_URL}/notifications`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Notifications could not be cleared (${res.status})`);
}

export async function fetchIncidents(): Promise<any[]> {
  const res = await fetch(`${BASE_URL}/incidents`, { headers: authorityHeaders() });
  if (!res.ok) throw new Error(`Incident service unavailable (${res.status})`);
  const data = await res.json();
  return data.incidents || [];
}

export async function updateIncident(id: string, updates: any): Promise<any> {
  const res = await fetch(`${BASE_URL}/incidents/${encodeURIComponent(id)}`, { method: "PATCH", headers: { "Content-Type": "application/json", ...authorityHeaders() }, body: JSON.stringify(updates) });
  if (!res.ok) throw new Error(`Incident could not be updated (${res.status})`);
  return await res.json();
}

// ==========================================
// DATASET MANAGEMENT CONSOLE API CLIENT
// ==========================================

export async function fetchDatasets(): Promise<{ datasets: any[]; summary: any }> {
  try {
    const res = await fetch(`${BASE_URL}/datasets`);
    if (!res.ok) throw new Error("HTTP error " + res.status);
    return await res.json();
  } catch (err) {
    console.warn("fetchDatasets error, using fallback:", err);
    return { datasets: [], summary: { totalDatasets: 0, officialDatasets: 0, liveSources: 0, demoDatasets: 0, validatedDatasets: 0, trainingReady: 0, trainingSelected: 0 } };
  }
}

export async function fetchDatasetDetails(id: string): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/datasets/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error("HTTP error " + res.status);
    return await res.json();
  } catch (err) {
    console.error("fetchDatasetDetails error:", err);
    return null;
  }
}

export async function fetchDatasetPreview(id: string, rows: number = 50): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/datasets/${encodeURIComponent(id)}/preview?rows=${rows}`);
    if (!res.ok) throw new Error("HTTP error " + res.status);
    return await res.json();
  } catch (err) {
    console.error("fetchDatasetPreview error:", err);
    return { error: "Failed to load preview data" };
  }
}

export async function uploadDataset(filename: string, content: string, metadata: any): Promise<any> {
  const res = await fetch(`${BASE_URL}/datasets/upload`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename, content, metadata })
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({ error: "Upload failed" }));
    throw new Error(errData.error || "Upload failed");
  }
  return await res.json();
}

export async function validateDataset(id: string): Promise<any> {
  const res = await fetch(`${BASE_URL}/datasets/${encodeURIComponent(id)}/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({ error: "Validation failed" }));
    throw new Error(errData.error || "Validation failed");
  }
  return await res.json();
}

export async function preprocessDataset(id: string, options: any): Promise<any> {
  const res = await fetch(`${BASE_URL}/datasets/${encodeURIComponent(id)}/preprocess`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options)
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({ error: "Preprocessing failed" }));
    throw new Error(errData.error || "Preprocessing failed");
  }
  return await res.json();
}

export async function toggleDatasetTraining(id: string, selected: boolean): Promise<any> {
  const res = await fetch(`${BASE_URL}/datasets/${encodeURIComponent(id)}/training`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ selected })
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({ error: "Failed to update training selection" }));
    throw new Error(errData.error || "Failed to update training selection");
  }
  return await res.json();
}

export async function fetchDatasetVersions(id: string): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/datasets/${encodeURIComponent(id)}/versions`);
    if (!res.ok) throw new Error("HTTP error " + res.status);
    return await res.json();
  } catch (err) {
    return { versions: [] };
  }
}

export async function deleteDatasetApi(id: string): Promise<any> {
  const res = await fetch(`${BASE_URL}/datasets/${encodeURIComponent(id)}`, {
    method: "DELETE"
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({ error: "Deletion failed" }));
    throw new Error(errData.error || "Deletion failed");
  }
  return await res.json();
}

export async function fetchDataSources(): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/data-sources`);
    if (!res.ok) throw new Error("HTTP error " + res.status);
    return await res.json();
  } catch (err) {
    console.warn("fetchDataSources error:", err);
    return { sources: [] };
  }
}

export async function testDataSourceApi(id: string): Promise<any> {
  const res = await fetch(`${BASE_URL}/data-sources/${encodeURIComponent(id)}/test`, {
    method: "POST"
  });
  return await res.json();
}

