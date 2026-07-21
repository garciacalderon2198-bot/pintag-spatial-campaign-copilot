# PINTAG Spatial Campaign Copilot

Status: OpenAI Build Week 2026 independent prototype

Track: Work & Productivity

Problem:
Local businesses often have temporary inventory, unused capacity, or time-sensitive opportunities, but existing digital channels do not reliably reach people who are nearby and ready to act.

Solution:
PINTAG Spatial Campaign Copilot is designed to use GPT-5.6 to transform a merchant's natural-language business need into a structured, place-bound, time-bound, and measurable local activation.

Repository separation:
This repository is an independent hackathon prototype. It does not modify or replace the contractual PINTAG MVP repository.

Build Week evidence:
The project documentation will distinguish pre-existing PINTAG concepts from the new implementation developed during OpenAI Build Week.

Implementation status:
The local prototype implements the deterministic compose, review, publish, discover, claim, redeem, and measure flow. Azure OpenAI through Microsoft Foundry is the optional GPT-5.6 provider target, using model `gpt-5.6-sol` and intended deployment `pintag-gpt-5-6-sol`.

Azure availability:
Azure OpenAI quota has been requested and remains externally controlled. A successful live GPT-5.6 call has not yet been verified. When Azure configuration, quota, deployment, credentials, or structured output is unavailable, the complete demo uses a clearly labeled deterministic fallback.

Security:
Azure credentials are read only by server-side route handlers and are never included in browser responses or Git. Copy `.env.example` for local reference, but do not commit `.env.local` or real credentials.

License:
The prototype source code is released under the MIT License. PINTAG names, logos, visual identity, and trademarks are not granted by the software license. This repository is an independent Build Week prototype and does not include the contractual PINTAG MVP.
