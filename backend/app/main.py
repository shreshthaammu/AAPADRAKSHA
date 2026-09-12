"""Legacy backend marker.

AAPADRAKSHA has one active API architecture: React/Vite -> Node/Express
(`server.ts`). The former FastAPI routes duplicated the active API and were
removed so they could not return conflicting risk, alert, or prediction data.

Keep this module only as a migration marker. Do not start it in parallel with
the Node server. Python ML training lives in ``backend/ml/train.py`` and the
active inference artifact is served by ``server.ts``.
"""

from typing import NoReturn


def legacy_backend_removed() -> NoReturn:
    raise RuntimeError(
        "The FastAPI duplicate backend is retired. Run `npm run dev` to start the active Node/Express API."
    )


if __name__ == "__main__":
    legacy_backend_removed()
