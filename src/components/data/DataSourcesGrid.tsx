import React, { useState } from "react";
import { OfficialDataSource } from "../../types";
import { ExternalLink, ShieldAlert, KeyRound, WifiOff, RefreshCw, CheckCircle2, Info } from "lucide-react";
import { testDataSourceApi } from "../../services/api";

interface Props {
  sources: OfficialDataSource[];
}

export const DataSourcesGrid: React.FC<Props> = ({ sources }) => {
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, { status: string; message: string }>>({});

  const handleTestConnection = async (sourceId: string) => {
    setTestingId(sourceId);
    try {
      const res = await testDataSourceApi(sourceId);
      setTestResults(prev => ({
        ...prev,
        [sourceId]: {
          status: res.status || "NOT CONNECTED",
          message: res.message || "Official data not connected. Authorized API key required."
        }
      }));
    } catch (err: any) {
      setTestResults(prev => ({
        ...prev,
        [sourceId]: {
          status: "NOT CONNECTED",
          message: "Connection failed: Official live server requires institution credentials."
        }
      }));
    } finally {
      setTestingId(null);
    }
  };

  return (
    <section aria-labelledby="official-sources-heading" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h2 id="official-sources-heading" className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            Official Meteorological & Earth Observation Sources
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            National weather authorities, orbital satellite constellations, and telemetric river networks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono">
            <WifiOff className="w-3.5 h-3.5 text-amber-500" />
            <span>State: Official Feeds Unlinked</span>
          </div>
        </div>
      </div>

      {/* Warning banner about data accuracy */}
      <div className="p-3.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 dark:text-amber-200 space-y-1">
          <p className="font-semibold">
            Official Data Integrity Policy
          </p>
          <p className="text-amber-800/90 dark:text-amber-300/80 leading-relaxed">
            All 8 official data sources below are marked <strong className="font-mono bg-amber-100 dark:bg-amber-900 px-1 py-0.5 rounded">NOT CONNECTED</strong>.
            AAPADRAKSHA never simulates or fakes official observational connections. To ingest live telemetry, organizations configure verified API tokens or ingest approved NetCDF/CSV archives through the Data Console.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {sources.map(source => {
          const testResult = testResults[source.id];
          const isTesting = testingId === source.id;

          return (
            <div
              key={source.id}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-4 flex flex-col justify-between shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {source.category}
                    </span>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-1" title={source.provider}>
                      {source.shortName}
                    </h3>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 shrink-0">
                    <WifiOff className="w-2.5 h-2.5 text-amber-500" />
                    {source.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
                  {source.description}
                </p>

                {/* Data Types */}
                <div className="space-y-1.5 mb-3">
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
                    Supported Products:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {source.dataTypes.slice(0, 3).map((dt, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 line-clamp-1 max-w-[200px]"
                      >
                        {dt}
                      </span>
                    ))}
                    {source.dataTypes.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-400">
                        +{source.dataTypes.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Connection State indicator */}
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-850 text-[11px] mb-3 space-y-1">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span>Connection State:</span>
                    <span className="font-medium text-amber-600 dark:text-amber-400 font-mono">
                      {source.connectionState}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span>Latency:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">{source.latency}</span>
                  </div>
                </div>

                {/* Auth Requirement Note */}
                <div className="flex items-start gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                  <KeyRound className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-2 italic">{source.authRequirement}</span>
                </div>

                {/* Test Result feedback if clicked */}
                {testResult && (
                  <div className="p-2 mb-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-[11px] text-amber-800 dark:text-amber-300">
                    <p className="font-semibold flex items-center gap-1">
                      <WifiOff className="w-3 h-3" />
                      Status: {testResult.status}
                    </p>
                    <p className="mt-0.5 text-[10px]">{testResult.message}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <a
                    href={source.officialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    <span>Visit Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    type="button"
                    onClick={() => handleTestConnection(source.id)}
                    disabled={isTesting}
                    className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${isTesting ? "animate-spin" : ""}`} />
                    <span>{isTesting ? "Testing..." : "Test"}</span>
                  </button>
                </div>

                {/* Deep links if available */}
                {source.links && source.links.length > 1 && (
                  <div className="flex flex-wrap gap-1 text-[10px] text-blue-600 dark:text-blue-400">
                    {source.links.slice(1, 4).map((l, idx) => (
                      <a
                        key={idx}
                        href={l.url}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline flex items-center gap-0.5"
                      >
                        {l.label}
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
