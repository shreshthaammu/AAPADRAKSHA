export type ProviderStatus = "LIVE" | "SIMULATED" | "REFERENCE" | "DEGRADED" | "UNAVAILABLE";

export interface NormalizedProviderInput {
  provider: string;
  status: ProviderStatus;
  observedAt: string;
  freshnessMinutes: number | null;
  qualityScore: number | null;
  location: { state: string; district: string };
  features: {
    rainfall_1h_mm?: number;
    rainfall_3h_mm?: number;
    rainfall_6h_mm?: number;
    rainfall_24h_mm?: number;
    forecast_6h_mm?: number;
    river_level_m?: number;
    soil_saturation_pct?: number;
    elevation_m?: number;
    slope_deg?: number;
    drainage_impedance_pct?: number;
    temperature_c?: number;
    humidity_pct?: number;
    wind_speed_kmh?: number;
  };
  missingFields: string[];
}

export interface DataProvider {
  readonly name: string;
  readonly status: ProviderStatus;
  getInput(state: string, district: string): Promise<NormalizedProviderInput>;
}

export class SimulationProvider implements DataProvider {
  constructor(
    public readonly name: string,
    public readonly status: ProviderStatus,
    private readonly featureFactory: (state: string, district: string) => NormalizedProviderInput["features"]
  ) {}

  async getInput(state: string, district: string): Promise<NormalizedProviderInput> {
    return {
      provider: this.name,
      status: this.status,
      observedAt: new Date().toISOString(),
      freshnessMinutes: null,
      qualityScore: 78,
      location: { state, district },
      features: this.featureFactory(state, district),
      missingFields: []
    };
  }
}

export function buildSimulationProviders(): DataProvider[] {
  return [
    new SimulationProvider("IMD weather/radar adapter", "SIMULATED", () => ({ rainfall_1h_mm: 18.5, rainfall_3h_mm: 42, rainfall_6h_mm: 76, rainfall_24h_mm: 124.6, forecast_6h_mm: 64, temperature_c: 25.4, humidity_pct: 94, wind_speed_kmh: 24.5 })),
    new SimulationProvider("CWC river adapter", "SIMULATED", () => ({ river_level_m: 5.1 })),
    new SimulationProvider("Satellite rainfall adapter", "SIMULATED", () => ({ rainfall_24h_mm: 124.6 })),
    new SimulationProvider("Terrain/DEM adapter", "REFERENCE", () => ({ elevation_m: 498, slope_deg: 1.2, drainage_impedance_pct: 88, soil_saturation_pct: 85 }))
  ];
}

export async function collectNormalizedInputs(state: string, district: string): Promise<NormalizedProviderInput[]> {
  return Promise.all(buildSimulationProviders().map(provider => provider.getInput(state, district)));
}
