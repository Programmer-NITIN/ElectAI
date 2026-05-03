# 🏗️ Architecture — ElectAI

> A concise reference for how the codebase is organized, how data flows, and where to find things.

---

## Module Dependency Graph

```
┌──────────────────────────────────────────────────────────────────┐
│                        app/layout.tsx                            │
│  Root HTML shell · fonts · skip-link · SR announcer · <main>     │
└─────────────────────────┬────────────────────────────────────────┘
                          │
              ┌───────────▼──────────────┐
              │      app/page.tsx        │
              │  Header + ErrorBoundary  │
              │    └─ ChatInterface      │
              └───────────┬──────────────┘
                          │ fetch("/api/chat")
              ┌───────────▼──────────────┐
              │   app/api/chat/route.ts  │
              │  Zod validation          │
              │  sanitizeInput()         │
              │  Demo mode OR Gemini AI  │
              └───────────┬──────────────┘
                          │
          ┌───────────────┼───────────────────┐
          ▼               ▼                   ▼
    ai/agents.ts    ai/tools.ts       ai/system-prompts.ts
    Model factory   Generative UI     Agent-specific
    Vertex / Studio tool definitions   prompt constraints
```

---

## Directory Structure

| Path | Responsibility |
|------|---------------|
| `src/app/` | Next.js App Router pages and API routes |
| `src/ai/` | Gemini model configs, tools, and system prompts |
| `src/components/` | React components (chat, generative UI, shared UI) |
| `src/hooks/` | Custom React hooks (TTS, voice input, analytics) |
| `src/lib/` | Shared utilities, schemas, constants, i18n, logger |
| `src/lib/google/` | Google Cloud service wrappers (7 services) |
| `src/types/` | Shared TypeScript interfaces and type aliases |
| `src/__tests__/` | 447 tests across 24 suites in 6 categories |

---

## Data Flow

### 1. User → Server

```
User Input
  → sanitizeInput() (DOMPurify + regex)
  → chatMessageSchema.safeParse() (Zod validation)
  → Rate limit check (Edge Middleware)
  → POST /api/chat
```

### 2. Server → AI

```
/api/chat
  → isApiKeyConfigured()?
    ├─ No  → matchDemoIntent() → SSE stream
    └─ Yes → streamText(Gemini 2.5 Pro)
              → tools: showEVMSimulator, showFactCard, etc.
              → toTextStreamResponse()
```

### 3. Server → Client

```
SSE Stream
  → parseStreamResponse() (client-side)
  → MessageBubble (ReactMarkdown + DOMPurify)
  → Generative UI components (EVM, Timeline, Checklist, FactCard)
```

---

## Security Layers

| Layer | Mechanism | File |
|-------|-----------|------|
| **Edge** | Rate limiting (30 req/min per IP) | `middleware.ts` |
| **Edge** | 10 HTTP security headers (CSP, HSTS, etc.) | `middleware.ts` |
| **Framework** | Security headers in `next.config.mjs` | `next.config.mjs` |
| **Validation** | Zod `.strict()` schemas on all inputs | `lib/schemas.ts` |
| **Sanitization** | DOMPurify + regex on all user text | `lib/utils.ts` |
| **Rendering** | DOMPurify before ReactMarkdown | `MessageBubble.tsx` |
| **Auth** | Firebase Auth + Google OAuth | `lib/firebase.ts` |
| **Bot Protection** | reCAPTCHA v3 server verification | `lib/google/recaptcha.ts` |
| **Container** | Non-root user, multi-stage Docker build | `Dockerfile` |

---

## Key Design Decisions

1. **Dual AI Provider**: Vertex AI (production) with AI Studio fallback — avoids vendor lock-in.
2. **Demo Mode**: Full functionality without API keys — critical for evaluators and offline use.
3. **Generative UI**: AI tools return structured data rendered as React components, not raw text.
4. **Strict Schemas**: Every data boundary uses `z.object().strict()` — rejects unknown fields.
5. **Edge Middleware**: Rate limiting and headers at the edge layer — zero server overhead.
6. **Progressive Enhancement**: Web Speech API for TTS/STT with Cloud API upgrades available.
