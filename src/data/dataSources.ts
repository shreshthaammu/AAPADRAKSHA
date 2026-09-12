import { OfficialDataSource } from "../types";

export const OFFICIAL_DATA_SOURCES: OfficialDataSource[] = [
  {
    id: "imd",
    provider: "India Meteorological Department (IMD)",
    shortName: "IMD",
    category: "Meteorological & Radar",
    dataTypes: [
      "Surface AWS/ARG Gauges",
      "Doppler Weather Radar (DWR)",
      "District Nowcasts",
      "Heavy Rainfall Warnings (Color Coded)"
    ],
    status: "NOT CONNECTED",
    connectionState: "Official data not connected",
    officialUrl: "https://mausam.imd.gov.in/",
    links: [
      { label: "Main Portal", url: "https://mausam.imd.gov.in/" },
      { label: "Data Service Portal", url: "https://dsp.imdpune.gov.in/" },
      { label: "Rainfall Info", url: "https://mausam.imd.gov.in/responsive/rainfallinformation.php" },
      { label: "Radar Network", url: "https://mausam.imd.gov.in/responsive/radar.php" },
      { label: "District Warnings GIS", url: "https://mausam.imd.gov.in/responsive/districtWiseWarningGIS.php" }
    ],
    description:
      "National meteorological agency of India providing official observational gauge networks, 37 Doppler radars, numerical forecasts, and color-coded district inundation advisories.",
    requiresRegistration: true,
    authRequirement: "IMD Data Service Portal API token & institutional approval",
    envKeyName: "IMD_API_KEY",
    spatialCoverage: "Pan-India & Indian Ocean Basins",
    latency: "15 min AWS / 10 min Radar"
  },
  {
    id: "nasa-gpm",
    provider: "NASA Global Precipitation Measurement (GPM / IMERG)",
    shortName: "NASA GPM / IMERG",
    category: "Satellite Precipitation",
    dataTypes: [
      "IMERG Early Run (4hr latency)",
      "IMERG Late Run (14hr)",
      "IMERG Final (2.5 months)",
      "Gridded 0.1° x 0.1° Rain Rates"
    ],
    status: "NOT CONNECTED",
    connectionState: "Official data not connected",
    officialUrl: "https://gpm.nasa.gov/data/directory",
    links: [
      { label: "GPM Data Directory", url: "https://gpm.nasa.gov/data/directory" },
      { label: "NASA Earthdata Login", url: "https://www.earthdata.nasa.gov/" }
    ],
    description:
      "Joint NASA-JAXA multi-satellite constellation providing global 30-minute precipitation estimates at 0.1° resolution (~10km), essential for un-gauged catchment monitoring.",
    requiresRegistration: true,
    authRequirement: "NASA Earthdata Login (URS) username & application authorization token",
    envKeyName: "NASA_API_KEY",
    spatialCoverage: "Global Coverage (60°N - 60°S)",
    latency: "3.5 - 4 Hours (Early Run)"
  },
  {
    id: "copernicus-era5",
    provider: "ECMWF Copernicus Climate Change Service (ERA5)",
    shortName: "Copernicus ERA5",
    category: "Atmospheric Reanalysis & NWP",
    dataTypes: [
      "Total Precipitation",
      "2m Temperature",
      "Surface Pressure",
      "10m Wind U/V",
      "Soil Moisture Volumetric"
    ],
    status: "NOT CONNECTED",
    connectionState: "Official data not connected",
    officialUrl: "https://cds.climate.copernicus.eu/datasets/reanalysis-era5-single-levels",
    links: [
      { label: "ERA5 Single Levels", url: "https://cds.climate.copernicus.eu/datasets/reanalysis-era5-single-levels" }
    ],
    description:
      "The 5th generation ECMWF global atmospheric reanalysis combining model data with observations worldwide into a globally complete and consistent dataset.",
    requiresRegistration: true,
    authRequirement: "Copernicus Climate Data Store (CDS) API Key & license terms acceptance",
    envKeyName: "COPERNICUS_CDS_KEY",
    spatialCoverage: "Global 0.25° Grid (~31km)",
    latency: "5 days (ERA5T short latency)"
  },
  {
    id: "copernicus-ems",
    provider: "Copernicus Emergency Management Service (EMS / GloFAS)",
    shortName: "Copernicus EMS",
    category: "Disaster Early Warning",
    dataTypes: [
      "Rapid Mapping Flood Extent",
      "Global Flood Awareness System (GloFAS)",
      "River Discharge Projections"
    ],
    status: "NOT CONNECTED",
    connectionState: "Official data not connected",
    officialUrl: "https://ewds.climate.copernicus.eu/",
    links: [
      { label: "Early Warning Data Store", url: "https://ewds.climate.copernicus.eu/" }
    ],
    description:
      "On-demand satellite delineation of flooded zones and operational hydrological ensemble flood forecasting for international civil protection authorities.",
    requiresRegistration: true,
    authRequirement: "Copernicus Early Warning Data Store (EWDS) account credentials",
    envKeyName: "COPERNICUS_EWDS_KEY",
    spatialCoverage: "Global River Networks",
    latency: "Daily Hydrological Ensembles"
  },
  {
    id: "india-wris",
    provider: "India Water Resources Information System (India-WRIS)",
    shortName: "India-WRIS",
    category: "Hydrological & River Basins",
    dataTypes: [
      "Central Water Commission River Gauges",
      "Reservoir Storage (Live/Capacity)",
      "Canal & Dam Outflow",
      "Groundwater Telemetry"
    ],
    status: "NOT CONNECTED",
    connectionState: "Official data not connected",
    officialUrl: "https://indiawris.gov.in/",
    links: [
      { label: "WRIS Portal", url: "https://indiawris.gov.in/" }
    ],
    description:
      "National water data hub developed by Ministry of Jal Shakti (DoWR) and ISRO, integrating real-time telemetry from CWC river monitoring stations across all Indian river basins.",
    requiresRegistration: true,
    authRequirement: "Ministry of Jal Shakti WRIS API access key",
    envKeyName: "INDIA_WRIS_API_KEY",
    spatialCoverage: "Pan-India River Basins (Ganga, Krishna, Godavari, Brahmaputra, etc.)",
    latency: "3 - 6 Hours Telemetric Sync"
  },
  {
    id: "isro-bhuvan",
    provider: "ISRO National Remote Sensing Centre (Bhuvan)",
    shortName: "ISRO / NRSC Bhuvan",
    category: "Geospatial & Flood Inundation",
    dataTypes: [
      "Satellite Flood Inundation Maps",
      "CartoDEM High-Res Terrain",
      "Land Use / Land Cover (LULC)",
      "Disaster Support Services (DSS)"
    ],
    status: "NOT CONNECTED",
    connectionState: "Official data not connected",
    officialUrl: "https://bhuvan.nrsc.gov.in/",
    links: [
      { label: "Bhuvan Geospatial Hub", url: "https://bhuvan.nrsc.gov.in/" }
    ],
    description:
      "ISRO's geoportal delivering Indian Earth Observation satellite imagery (Cartosat, Resourcesat, RISAT), flood hazard zonation, and digital drainage basemaps.",
    requiresRegistration: true,
    authRequirement: "Bhuvan Geoportal Developer Account & OGC WMS/WFS Access Token",
    envKeyName: "BHUVAN_TOKEN",
    spatialCoverage: "Indian Subcontinent & Offshore Territorials",
    latency: "Near Real-Time during active disaster campaigns"
  },
  {
    id: "nasa-earthdata",
    provider: "NASA Earth Science Data Systems (Earthdata)",
    shortName: "NASA Earthdata",
    category: "Earth Observation & Sensors",
    dataTypes: [
      "MODIS / VIIRS Surface Reflectance",
      "SMAP Soil Moisture",
      "ASTER GDEM",
      "Atmospheric Water Vapor"
    ],
    status: "NOT CONNECTED",
    connectionState: "Official data not connected",
    officialUrl: "https://www.earthdata.nasa.gov/",
    links: [
      { label: "NASA Earthdata Portal", url: "https://www.earthdata.nasa.gov/" }
    ],
    description:
      "Unified discovery and access portal to NASA's Earth Observing System Data and Information System (EOSDIS), archiving petabytes of climate and hydrological satellite products.",
    requiresRegistration: true,
    authRequirement: "NASA Earthdata Bearer Token or EDL credentials",
    envKeyName: "EARTHDATA_TOKEN",
    spatialCoverage: "Global Satellite Swaths",
    latency: "1 - 3 Hours LANCE NRT"
  },
  {
    id: "usgs-srtm",
    provider: "USGS Shuttle Radar Topography Mission (SRTM)",
    shortName: "USGS SRTM",
    category: "Digital Elevation Models",
    dataTypes: [
      "1-Arcsecond (30m) Global DEM",
      "Void-Filled Elevation Rasters (GeoTIFF)",
      "Hydrologically Conditioned Elevation"
    ],
    status: "NOT CONNECTED",
    connectionState: "Official data not connected",
    officialUrl: "https://www.usgs.gov/centers/eros/science/usgs-eros-archive-digital-elevation-shuttle-radar-topography-mission-srtm",
    links: [
      { label: "USGS EROS Archive SRTM", url: "https://www.usgs.gov/centers/eros/science/usgs-eros-archive-digital-elevation-shuttle-radar-topography-mission-srtm" }
    ],
    description:
      "High-resolution digital topographic database of Earth generated by Endeavour Space Shuttle radar, serving as the core baseline for hydrodynamic overland runoff and flood depth models.",
    requiresRegistration: true,
    authRequirement: "USGS EROS registration for automated bulk machine downloads",
    envKeyName: "USGS_EROS_KEY",
    spatialCoverage: "Global Landmass between 60°N and 56°S",
    latency: "Static Reference Baseline"
  }
];
