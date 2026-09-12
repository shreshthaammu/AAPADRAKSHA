"""Train the AAPADRAKSHA flood-risk classifier.

This intentionally uses only the Python standard library so the training
pipeline remains reproducible in a constrained SIH environment. The Node
runtime consumes the JSON artifact produced here when Python is unavailable.
"""

import argparse
import csv
import json
import math
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Iterable, List, Sequence, Tuple

FEATURES = [
    "rainfall_24h_mm",
    "forecast_6h_mm",
    "river_level_m",
    "slope_deg",
    "soil_saturation_pct",
    "drainage_impedance_pct",
]


def value(row: Dict[str, str], key: str, fallback: float) -> float:
    try:
        parsed = float(row.get(key, ""))
        return parsed if math.isfinite(parsed) else fallback
    except (TypeError, ValueError):
        return fallback


def vector(row: Dict[str, str]) -> List[float]:
    rainfall = value(row, "rainfall_24h_mm", 0.0)
    return [
        rainfall,
        value(row, "forecast_6h_mm", rainfall * 0.35),
        value(row, "river_level_m", 0.0),
        value(row, "slope_deg", 2.5),
        value(row, "soil_saturation_pct", value(row, "humidity_pct", 60.0)),
        value(row, "drainage_impedance_pct", 70.0),
    ]


def label(row: Dict[str, str]) -> int:
    return int(value(row, "flood_probability_pct", 0.0) >= 50.0)


def sigmoid(raw: float) -> float:
    return 1.0 / (1.0 + math.exp(-max(-30.0, min(30.0, raw))))


def normalize(rows: Sequence[Sequence[float]]) -> Tuple[List[float], List[float]]:
    means = [sum(row[index] for row in rows) / max(1, len(rows)) for index in range(len(FEATURES))]
    scales = []
    for index, mean in enumerate(means):
        variance = sum((row[index] - mean) ** 2 for row in rows) / max(1, len(rows))
        scales.append(max(0.001, math.sqrt(variance)))
    return means, scales


def train(rows: Sequence[Dict[str, str]]) -> Dict[str, object]:
    train_end = int(len(rows) * 0.70)
    validation_end = int(len(rows) * 0.85)
    train_rows = rows[:train_end]
    validation_rows = rows[train_end:validation_end]
    test_rows = rows[validation_end:]
    raw = [vector(row) for row in train_rows]
    means, scales = normalize(raw)

    def scaled(row: Dict[str, str]) -> List[float]:
        return [(item - means[index]) / scales[index] for index, item in enumerate(vector(row))]

    weights = [0.0] * len(FEATURES)
    bias = 0.0
    for _ in range(350):
        gradients = [0.0] * len(FEATURES)
        bias_gradient = 0.0
        for row in train_rows:
            features = scaled(row)
            prediction = sigmoid(sum(item * weights[index] for index, item in enumerate(features)) + bias)
            error = prediction - label(row)
            gradients = [gradients[index] + error * features[index] for index in range(len(FEATURES))]
            bias_gradient += error
        denominator = max(1, len(train_rows))
        weights = [weights[index] - 0.08 * gradients[index] / denominator for index in range(len(FEATURES))]
        bias -= 0.08 * bias_gradient / denominator

    def scored(dataset: Iterable[Dict[str, str]]) -> List[Tuple[float, int]]:
        return [(sigmoid(sum(item * weights[index] for index, item in enumerate(scaled(row))) + bias), label(row)) for row in dataset]

    def metrics(dataset: Iterable[Dict[str, str]]) -> Dict[str, float]:
        values = scored(dataset)
        tp = sum(prob >= 0.5 and target == 1 for prob, target in values)
        tn = sum(prob < 0.5 and target == 0 for prob, target in values)
        fp = sum(prob >= 0.5 and target == 0 for prob, target in values)
        fn = sum(prob < 0.5 and target == 1 for prob, target in values)
        precision = tp / max(1, tp + fp)
        recall = tp / max(1, tp + fn)
        return {
            "accuracy": (tp + tn) / max(1, len(values)),
            "precision": precision,
            "recall": recall,
            "f1": (2 * precision * recall) / max(0.0001, precision + recall),
        }

    return {
        "modelName": "AAPADRAKSHA Flood Risk Classifier",
        "modelType": "Trained Logistic Regression",
        "version": "v1.0.0",
        "trainedAt": datetime.now(timezone.utc).isoformat(),
        "featureNames": FEATURES,
        "means": means,
        "scales": scales,
        "weights": weights,
        "bias": bias,
        "thresholds": {"watch": 0.5, "prepare": 0.7, "emergency": 0.85},
        "split": {"train": len(train_rows), "validation": len(validation_rows), "test": len(test_rows)},
        "metrics": {"validation": metrics(validation_rows), "test": metrics(test_rows)},
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", default="data/connected/flood_history_2020_2026.csv")
    parser.add_argument("--output", default="data/models/flood-risk-logistic-v1.json")
    args = parser.parse_args()
    input_path = Path(args.input)
    with input_path.open(newline="", encoding="utf-8") as handle:
        rows = list(csv.DictReader(handle))
    if len(rows) < 100 or any(field not in rows[0] for field in ("timestamp", "flood_probability_pct")):
        raise ValueError("Input dataset must contain timestamp and flood_probability_pct with at least 100 rows")
    rows.sort(key=lambda row: row["timestamp"])
    artifact = train(rows)
    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(artifact, indent=2), encoding="utf-8")
    print(json.dumps({"output": str(output_path), "rows": len(rows), "metrics": artifact["metrics"]}, indent=2))


if __name__ == "__main__":
    main()
