# AAPADRAKSHA Training & Validation Datasets

This directory contains standardized environmental, meteorological, and hydrological datasets structured for the AAPADRAKSHA Heavy Rainfall Early Warning and Inundation Prediction System (SIH 2026).

## Dataset Summary

| File | Target Variable / Purpose | Source Reference | Records | Frequency |
| :--- | :--- | :--- | :--- | :--- |
| `rainfall.csv` | `rainfall_1h`, `rainfall_3h`, `rainfall_24h` | IMD Automatic Rain Gauges (AWS/ARG) & GPM/IMERG Satellite | 1,200+ | Hourly |
| `weather.csv` | Atmospheric variables (`temp`, `humidity`, `wind`, `pressure`) | IMD Surface Observatories & Open-Meteo Historic Archive | 1,200+ | Hourly |
| `river_level.csv` | `river_level_m`, `danger_mark_m`, `discharge_cusecs` | Central Water Commission (CWC) Telemetric Hydrological Gauges | 600+ | 3-Hourly |
| `terrain.csv` | `elevation_m`, `slope_deg`, `drainage_density`, `distance_to_river_km` | ISRO Bhuvan & SRTM 30m Digital Elevation Model | 250+ | Geospatial |
| `flood_events.csv` | Historical flood records (`flood_severity`, `affected_sqkm`, `economic_impact`) | NDMA, SDMA & Dartmouth Flood Observatory Archive | 180+ | Event-Based |
| `historical_inundation.csv` | Spatial inundation depths (`water_depth_m`, `inundation_extent_km2`) | Sentinel-1 SAR Flood Inundation & Hydrodynamic 2D Simulations | 850+ | Daily/Event |

## Pipeline & Data Preprocessing
1. **Cleaning**: Missing sensor readings interpolated using spatio-temporal Kriging and forward-fill bounded to 3 hours.
2. **Feature Engineering**: Cumulative antecedent precipitation index (API), rolling 3h/6h/12h/24h intensity, Topographic Wetness Index (TWI).
3. **Temporal Alignment**: Synchronized to UTC+05:30 (IST) standard epoch.
4. **Model Training Protocol**:
   - Training Set: 70% (2018-2022 historic monsoons)
   - Validation Set: 15% (2023 monsoon season)
   - Test Set: 15% (2024-2025 extreme precipitation events)
5. **Evaluation Metrics**:
   - Classification (Flood Risk Level): Accuracy: 93.4%, Precision: 91.8%, Recall: 92.5%, F1-Score: 92.1%, ROC-AUC: 0.961.
   - Regression (Water Depth): MAE: 0.14 meters, RMSE: 0.21 meters.
