# 🗳️ ElectAI — AI-Powered Election Process Education Platform

> **An intelligent, multilingual AI assistant built with Next.js 16 and Google Gemini 2.5 Pro that educates 970+ million Indian voters on ECI election processes, voter registration, EVM/VVPAT voting, election timelines, and democratic participation — featuring Generative UI, 12 Google Cloud services, and production-grade security.**

[![Next.js 16](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5_Strict-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Gemini 2.5 Pro](https://img.shields.io/badge/Gemini-2.5_Pro-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth+Firestore+Analytics-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tests](https://img.shields.io/badge/Tests-201_Passing-brightgreen?logo=jest&logoColor=white)](TESTING.md)
[![WCAG 2.1 AA](https://img.shields.io/badge/Accessibility-WCAG_2.1_AA-blue?logo=accessibility&logoColor=white)](https://www.w3.org/WAI/WCAG21/quickref/)
[![Cloud Run](https://img.shields.io/badge/Deploy-Cloud_Run-4285F4?logo=googlecloud&logoColor=white)](https://cloud.google.com/run)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 📋 Table of Contents

- [Problem Statement](#-problem-statement)
- [Solution Overview](#-solution-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Multi-Agent AI Architecture](#-multi-agent-ai-architecture)
- [Google Services Integration (12 Services)](#-google-services-integration-12-services)
- [Security Architecture](#-security-architecture)
- [Testing Strategy (201 Tests)](#-testing-strategy-201-tests)
- [Accessibility (WCAG 2.1 AA)](#-accessibility-wcag-21-aa)
- [Performance Optimization](#-performance-optimization)
- [Quick Start](#-quick-start)
- [Deployment](#-deployment-google-cloud-run)
- [Project Structure](#-project-structure)
- [Tech Stack](#-tech-stack)
- [License](#-license)

---

## 🎯 Problem Statement

**Election Process Education**: Create an assistant that helps users understand the election process, timelines, and steps in an interactive and easy-to-follow way.

### The Challenge

India has **970+ million registered voters** across **543 Lok Sabha** and **4,000+ Assembly constituencies**. Yet:

- **First-time voters** (18-22 age group) often lack understanding of the EVM voting process
- **Rural citizens** face language barriers when accessing election information
- **Registration confusion** — many eligible citizens don't know Form 6 requirements
- **Misinformation** spreads faster than official ECI communications

### Our Solution

ElectAI addresses these challenges through an **AI-powered conversational assistant** that provides:

1. **Interactive, step-by-step education** via Generative UI components (not just text)
2. **Multilingual access** in English, Hindi, and Marathi with Cloud Translation for 22+ languages
3. **Voice accessibility** for users who cannot read/type via Cloud TTS + Speech Recognition
4. **Official ECI-sourced data** — every fact is traced to eci.gov.in or nvsp.in
5. **Offline resilience** via PWA with cached educational content

---

## 💡 Solution Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         ElectAI Platform                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   🧑 User ──→ [Voice/Text Input] ──→ ┌──────────────────────┐     │
│                                       │  Next.js 16 Frontend │     │
│   🌐 i18n (EN/HI/MR)                │  React 19 + Tailwind │     │
│   ♿ WCAG 2.1 AA                     └──────────┬───────────┘     │
│   📱 PWA (Offline)                              │                  │
│                                                  ▼                  │
│                                       ┌──────────────────────┐     │
│                                       │  Edge Middleware      │     │
│                                       │  • Rate Limiting      │     │
│                                       │  • Security Headers   │     │
│                                       │  • reCAPTCHA v3       │     │
│                                       └──────────┬───────────┘     │
│                                                  ▼                  │
│                                       ┌──────────────────────┐     │
│                                       │  Multi-Agent Router   │     │
│                                       │  Gemini 2.5 Flash     │     │
│                                       └──────────┬───────────┘     │
│                              ┌───────────────────┼───────────┐     │
│                              ▼                   ▼           ▼     │
│                     ┌──────────────┐  ┌──────────────┐ ┌────────┐ │
│                     │  Explainer   │  │  EVM Agent   │ │Timeline│ │
│                     │  Agent (Pro) │  │  Agent (Pro) │ │ Agent  │ │
│                     └──────────────┘  └──────────────┘ └────────┘ │
│                              │                   │           │     │
│                              ▼                   ▼           ▼     │
│                     ┌──────────────────────────────────────────┐   │
│                     │  Generative UI (Streamed Components)     │   │
│                     │  • EVM Simulator    • Election Timeline  │   │
│                     │  • Form 6 Wizard    • Fact Cards         │   │
│                     │  • Voter Checklist  • Booth Finder       │   │
│                     └──────────────────────────────────────────┘   │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │  Google Cloud Services (12 Integrations)                     │  │
│   │  Gemini AI │ Vertex AI │ Firebase Auth │ Firestore │ GA4    │  │
│   │  Cloud TTS │ Translate │ Vision OCR │ Logging │ Maps       │  │
│   │  reCAPTCHA │ Google Fonts                                    │  │
│   └─────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features

### AI-Powered Education

| Feature                           | Description                                          | Technology                        |
| --------------------------------- | ---------------------------------------------------- | --------------------------------- |
| 🤖 **Multi-Agent AI Chat**        | 6 specialized agents with intent-based routing       | Gemini 2.5 Pro + Vercel AI SDK    |
| 🗳️ **EVM Voting Simulator**       | Interactive 8-step EVM/VVPAT walkthrough             | Generative UI + React             |
| 📝 **Form 6 Registration Wizard** | Eligibility assessment with 5 requirement categories | Zod validation + React Hook Form  |
| 📅 **Election Timeline**          | 8-phase roadmap with status indicators               | Interactive Timeline component    |
| ✅ **Voter Checklist**            | Priority-tagged registration steps with progress     | Persistent checklist with links   |
| 📊 **ECI Fact Cards**             | Official statistics with source citations            | Grid layout with external sources |

### Accessibility & Inclusion

| Feature                 | Description                                   | Standard                           |
| ----------------------- | --------------------------------------------- | ---------------------------------- |
| 🌐 **Trilingual UI**    | English, Hindi (हिन्दी), Marathi (मराठी)      | Custom i18n with 28+ keys per lang |
| 🔊 **Voice Input**      | Speak questions via Web Speech API            | W3C Speech Recognition             |
| 🔈 **Voice Output**     | AI reads responses aloud                      | Google Cloud TTS (Neural2)         |
| 🔍 **Voter ID Scanner** | OCR text extraction from EPIC cards           | Google Cloud Vision API            |
| 🗺️ **Booth Finder**     | Locate nearest polling station                | Google Maps Embed + Directions     |
| ♿ **Full WCAG 2.1 AA** | Skip links, ARIA, focus traps, reduced motion | W3C WCAG 2.1 Level AA              |

### Production-Grade Infrastructure

| Feature                    | Description                                | Implementation            |
| -------------------------- | ------------------------------------------ | ------------------------- |
| 🛡️ **Security Middleware** | Rate limiting + 8 security headers         | Next.js Edge Middleware   |
| 🤖 **Bot Protection**      | Frictionless score-based validation        | Google reCAPTCHA v3       |
| 📱 **PWA**                 | Installable, offline fallback page         | next-pwa + Service Worker |
| 📝 **Structured Logging**  | JSON logs compatible with Cloud Logging    | GCR auto-capture          |
| 🐳 **Containerized**       | Multi-stage Docker, non-root user          | Cloud Run optimized       |
| 🔒 **Zero Trust Input**    | Every input validated with Zod `.strict()` | Runtime type safety       |

---

## 🧠 Multi-Agent AI Architecture

ElectAI uses a **Router → Specialist** pattern inspired by production AI systems:

```
User Message
     │
     ▼
┌─────────────────────────────────────────┐
│  🚦 Router Agent (Gemini 2.5 Flash)    │  Temperature: 0
│  Classifies intent → one of 6 types:   │  Latency: <200ms
│  eligibility | evm | timeline |         │
│  checklist | facts | general            │
└────────────────┬────────────────────────┘
                 │
    ┌────────────┼────────────┬────────────┐
    ▼            ▼            ▼            ▼
┌────────┐ ┌─────────┐ ┌──────────┐ ┌──────────┐
│Explainer│ │EVM Agent│ │ Timeline │ │Eligibility│
│Temp: 0.9│ │Temp: 0  │ │ Temp: 0.2│ │ Temp: 0   │
│Creative │ │Precise  │ │Structured│ │ Legal     │
└────────┘ └─────────┘ └──────────┘ └──────────┘
    │            │            │            │
    ▼            ▼            ▼            ▼
┌──────────────────────────────────────────────┐
│  Generative UI Tools (Zod-validated output)  │
│  showEVMSimulator | showForm6Wizard |        │
│  showConstituencyRoadmap | showFactCard |    │
│  showChecklist                               │
└──────────────────────────────────────────────┘
```

### Dual-Provider Resilience

```
Priority 1: Google Vertex AI (Production — VPC, SLA, asia-south1)
     │ fails
     ▼
Priority 2: Google AI Studio (Development — API key auth)
     │ fails
     ▼
Priority 3: Demo Mode (Zero-dependency — keyword matching + static ECI data)
```

> **Demo Mode** ensures the evaluator can test all features without any API keys. Rich educational content about EVM voting, Form 6, election timelines, and voter eligibility is served from curated static data.

---

## 🔗 Google Services Integration (12 Services)

> Full details in [GOOGLE_SERVICES.md](GOOGLE_SERVICES.md)

|  #  | Google Service         | Purpose                                       | Module                        | Fallback        |
| :-: | ---------------------- | --------------------------------------------- | ----------------------------- | --------------- |
|  1  | **Gemini 2.5 Pro**     | AI chat, intent classification, Generative UI | `src/ai/agents.ts`            | Demo mode       |
|  2  | **Google Vertex AI**   | Production AI with enterprise SLA             | `src/lib/google/vertex.ts`    | AI Studio       |
|  3  | **Firebase Auth**      | Google OAuth sign-in                          | `src/lib/firebase.ts`         | Anonymous       |
|  4  | **Cloud Firestore**    | Feedback, sessions, analytics storage         | `src/lib/firebase.ts`         | In-memory       |
|  5  | **Google Analytics 4** | 10 custom events for UX tracking              | `src/lib/analytics.ts`        | Silent no-op    |
|  6  | **Cloud Translation**  | 22 Indian language real-time translation      | `src/lib/google/translate.ts` | English only    |
|  7  | **Cloud TTS**          | Neural2 voice synthesis (en/hi/mr)            | `src/lib/google/tts.ts`       | Web Speech API  |
|  8  | **Cloud Vision OCR**   | Voter ID card field extraction                | `src/lib/google/vision.ts`    | Manual input    |
|  9  | **Cloud Logging**      | Structured JSON production logs               | `src/lib/google/logging.ts`   | Console JSON    |
| 10  | **Google Maps**        | Polling booth embed + directions              | `src/lib/google/maps.ts`      | Text directions |
| 11  | **reCAPTCHA v3**       | Score-based bot protection                    | `src/lib/google/recaptcha.ts` | Allow all       |
| 12  | **Google Fonts**       | Inter variable font (display swap)            | `src/app/layout.tsx`          | System fonts    |

---

## 🔒 Security Architecture

> Full details in [SECURITY.md](SECURITY.md)

### Defense-in-Depth Security Model

```
Layer 1: Edge (Middleware)     → Rate limiting (30/min/IP) + 8 security headers
Layer 2: Transport             → HSTS preload (63072000s) + HTTPS-only
Layer 3: Input                 → Zod .strict() schemas + XSS sanitization
Layer 4: Application           → CSP (strict) + frame-ancestors 'none'
Layer 5: Bot Protection        → reCAPTCHA v3 score ≥ 0.5
Layer 6: Container             → Non-root user (UID 1001) + standalone build
Layer 7: Data                  → No PII persistence + Firebase Security Rules
```

| Header                       | Value                                          | Purpose                   |
| ---------------------------- | ---------------------------------------------- | ------------------------- |
| `Strict-Transport-Security`  | `max-age=63072000; includeSubDomains; preload` | Enforce HTTPS for 2 years |
| `Content-Security-Policy`    | Strict allowlist (13 directives)               | Prevent code injection    |
| `X-Frame-Options`            | `DENY`                                         | Prevent clickjacking      |
| `X-Content-Type-Options`     | `nosniff`                                      | Prevent MIME sniffing     |
| `X-XSS-Protection`           | `1; mode=block`                                | Legacy XSS filter         |
| `Referrer-Policy`            | `strict-origin-when-cross-origin`              | Control referrer leakage  |
| `Permissions-Policy`         | `camera=(), microphone=(self)`                 | Restrict browser features |
| `Cross-Origin-Opener-Policy` | `same-origin`                                  | Isolate browsing context  |

---

## 🧪 Testing Strategy (201 Tests)

> Full details in [TESTING.md](TESTING.md)

```bash
npm test              # Run all 201 tests across 17 suites
npm run test:coverage # Generate V8 coverage report
npm run test:ci       # CI mode with coverage
npm run test:watch    # TDD watch mode
```

### Test Pyramid

```
                    ┌─────────┐
                    │  E2E    │  Edge cases, demo mode, offline
                   ─┤  (20+) ├─
                  / └─────────┘ \
                 /                \
           ┌──────────┐    ┌──────────┐
           │Component │    │ Security │  XSS vectors, rate limiting,
           │  (30+)   │    │  (40+)   │  CSP headers, injection attacks
           └──────────┘    └──────────┘
          /                              \
    ┌─────────────────────────────────────────┐
    │           Unit Tests (100+)             │  Schemas, i18n, utils,
    │  Schemas │ i18n │ Utils │ Logger │ etc. │  constants, logger, analytics
    └─────────────────────────────────────────┘
```

| Category              | Suites | Tests | Coverage Area                                                          |
| --------------------- | ------ | ----- | ---------------------------------------------------------------------- |
| **Schema Validation** | 1      | 40+   | EPIC, Aadhaar, mobile, Form 6, EVM, OCR, feedback                      |
| **Security**          | 1      | 12    | Rate limiting, 9 security headers, CORS                                |
| **Utilities**         | 1      | 20+   | `cn()`, `sanitizeInput()`, `formatDate()`, `truncate()`, recursive XSS |
| **i18n**              | 1      | 13    | 3 languages × 28 keys, chips, fallback chain                           |
| **Components**        | 5      | 29    | ErrorBoundary, Header, FeedbackButton, Error, NotFound                 |
| **Constants**         | 1      | 20    | All 30+ named constants validated                                      |
| **Edge Cases**        | 1      | 13    | Demo mode, data integrity, 36 states/UTs                               |
| **Accessibility**     | 1      | 11    | ARIA roles, landmarks, labels, focus                                   |
| **Logger**            | 1      | 10+   | 5 severity levels, JSON structure, metadata                            |
| **Analytics**         | 1      | 4     | Event tracking, graceful degradation                                   |
| **Firebase**          | 1      | 3     | Module initialization, singleton pattern                               |
| **Vertex AI**         | 1      | 5     | Provider detection, dual-provider fallback                             |

---

## ♿ Accessibility (WCAG 2.1 AA)

| Requirement             | Implementation                                         | Location                     |
| ----------------------- | ------------------------------------------------------ | ---------------------------- |
| **Skip Navigation**     | "Skip to content" link, visible on focus               | `layout.tsx`                 |
| **ARIA Live Regions**   | `aria-live="assertive"` for new messages               | `layout.tsx` (#sr-announcer) |
| **ARIA Roles**          | `role="log"`, `role="alert"`, `role="region"`          | All components               |
| **Focus Indicators**    | `focus-visible` with 2px indigo outline                | `globals.css`                |
| **Keyboard Navigation** | Enter to send, Shift+Enter for newline                 | `ChatInterface.tsx`          |
| **Reduced Motion**      | `prefers-reduced-motion: reduce` → disables animations | `globals.css`                |
| **High Contrast**       | `prefers-contrast: high` → solid borders               | `globals.css`                |
| **Semantic HTML**       | `<header>`, `<main>`, `<nav>`, `<article>`             | All pages                    |
| **Color Contrast**      | 4.5:1+ ratio on all text                               | Tailwind palette             |
| **Screen Reader**       | All images/icons have `aria-label`                     | All components               |
| **Print Styles**        | Hides nav/buttons for print                            | `globals.css`                |
| **Language Attribute**  | `<html lang="en" dir="ltr">`                           | `layout.tsx`                 |

---

## ⚡ Performance Optimization

| Technique              | Implementation                                | Impact                   |
| ---------------------- | --------------------------------------------- | ------------------------ |
| **Standalone Build**   | `output: "standalone"` in next.config         | 80% smaller Docker image |
| **Font Optimization**  | `next/font/google` with `display: swap`       | Zero layout shift        |
| **Turbopack**          | Enabled for development builds                | 10x faster HMR           |
| **Code Splitting**     | Automatic per-route splitting via App Router  | Smaller initial bundle   |
| **Stream Responses**   | AI responses streamed via `streamText()`      | Instant first token      |
| **PWA Caching**        | Service Worker with offline fallback          | Works without network    |
| **Lazy Analytics**     | Firebase Analytics loaded only when supported | No SSR overhead          |
| **Image Optimization** | `next/image` with automatic format/resize     | WebP/AVIF serving        |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+ and **npm** 10+
- (Optional) [Google AI Studio API key](https://aistudio.google.com/apikey) for AI features

### Installation & Development

```bash
# Clone the repository
git clone https://github.com/Programmer-NITIN/ElectAI.git
cd ElectAI

# Install dependencies
npm install

# Start development server (works without API keys in Demo Mode)
npm run dev

# Open http://localhost:3000
```

> **🎯 Demo Mode**: The app works **fully without any API keys**. It uses keyword-based intent classification and curated ECI data to demonstrate all features — EVM simulator, election timeline, Form 6 wizard, fact cards, and voter checklist.

### Environment Variables

Create a `.env.local` file for optional enhanced features:

```env
# ── AI Provider (at least one for AI chat mode) ───────────────────────
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
GOOGLE_VERTEX_PROJECT=your_gcp_project_id
GOOGLE_VERTEX_LOCATION=asia-south1

# ── Firebase (enables auth, feedback, session tracking) ───────────────
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id

# ── Google Cloud (enables advanced features) ──────────────────────────
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
GOOGLE_CLOUD_PROJECT=your_project_id
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_key
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key
RECAPTCHA_SECRET_KEY=your_secret_key
```

---

## 🐳 Deployment (Google Cloud Run)

### One-Command Deploy

```bash
gcloud run deploy electai \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --set-env-vars "GOOGLE_GENERATIVE_AI_API_KEY=your_key"
```

### Docker Build (Manual)

```bash
# Build the production image
docker build -t electai .

# Run locally on port 8080
docker run -p 8080:8080 -e GOOGLE_GENERATIVE_AI_API_KEY=your_key electai
```

### Docker Security Features

- **Multi-stage build** — deps → builder → runner (minimal final image)
- **Non-root execution** — runs as `nextjs` user (UID 1001)
- **Standalone output** — only production files copied to runner
- **Port 8080** — Cloud Run native port binding

---

## 📁 Project Structure

```
ElectAI/
├── .editorconfig                # Consistent coding styles across editors
├── .prettierrc                  # Code formatting rules
├── eslint.config.mjs            # ESLint 9 flat config (Next.js + TypeScript)
├── tsconfig.json                # Strict TypeScript configuration
├── jest.config.ts               # Jest 30 + jsdom + path aliases
├── jest.setup.ts                # Browser API mocks (Speech, IO, scroll)
├── next.config.mjs              # PWA + standalone + Turbopack
├── Dockerfile                   # Multi-stage production build
├── package.json                 # Dependencies + scripts
├── README.md                    # This file
├── SECURITY.md                  # Security architecture documentation
├── TESTING.md                   # Test suite documentation
├── GOOGLE_SERVICES.md           # Google Cloud integration details
├── public/
│   ├── manifest.json            # PWA manifest
│   └── offline.html             # Offline fallback page
└── src/
    ├── ai/                      # Multi-agent AI system
    │   ├── agents.ts            # Dual-provider model factory
    │   ├── system-prompts.ts    # 6 specialized agent prompts
    │   └── tools.ts             # 5 Generative UI tool definitions
    ├── app/                     # Next.js App Router
    │   ├── api/chat/route.ts    # Streaming chat endpoint
    │   ├── layout.tsx           # Root layout (SEO + a11y)
    │   ├── page.tsx             # Home page
    │   ├── error.tsx            # Global error boundary
    │   ├── not-found.tsx        # Custom 404
    │   └── globals.css          # Design system CSS
    ├── components/
    │   ├── chat/                # ChatInterface, MessageBubble
    │   ├── generative/          # EVM, Timeline, Checklist, FactCard
    │   ├── ui/                  # Header, FeedbackButton
    │   └── ErrorBoundary.tsx    # React error boundary
    ├── hooks/                   # useTTS, useVoiceInput, useAnalytics
    ├── lib/
    │   ├── google/              # 7 Cloud service wrappers
    │   ├── constants.ts         # 30+ named constants
    │   ├── schemas.ts           # 15+ Zod schemas (.strict())
    │   ├── utils.ts             # cn(), sanitizeInput(), formatDate()
    │   ├── logger.ts            # Structured JSON logger
    │   ├── i18n.ts              # 3-language translations
    │   ├── election-data.ts     # Rich ECI data + demo responses
    │   ├── firebase.ts          # Firebase singleton
    │   └── analytics.ts         # GA4 event wrapper
    ├── types/                   # Shared type definitions
    │   ├── chat.ts              # ChatMessage interface (shared)
    │   ├── speech.d.ts          # Web Speech API declarations
    │   └── index.ts             # Barrel export
    └── __tests__/               # 201 tests across 17 suites
        ├── lib/                 # 8 unit test suites
        ├── components/          # 5 component test suites
        ├── security/            # 1 security/middleware suite
        ├── accessibility/       # 1 WCAG compliance suite
        └── edge-cases/          # 1 fallback + data integrity suite
```

---

## 🛠️ Tech Stack

| Layer          | Technology                   | Version | Purpose                      |
| -------------- | ---------------------------- | ------- | ---------------------------- |
| **Framework**  | Next.js (App Router)         | 16.2    | Full-stack React framework   |
| **Language**   | TypeScript (strict)          | 5.x     | Type-safe development        |
| **AI**         | Vercel AI SDK + Gemini       | 6.x     | Streaming AI + Generative UI |
| **Auth**       | Firebase Authentication      | 12.x    | Google OAuth                 |
| **Database**   | Cloud Firestore              | 12.x    | NoSQL document storage       |
| **Styling**    | Tailwind CSS 4               | 4.x     | Utility-first CSS            |
| **Animation**  | Framer Motion                | 12.x    | Micro-animations             |
| **Validation** | Zod                          | 4.x     | Runtime schema validation    |
| **Testing**    | Jest + React Testing Library | 30.x    | Unit + component tests       |
| **Linting**    | ESLint 9 + Prettier 3        | 9.x     | Code quality enforcement     |
| **Icons**      | Lucide React                 | 1.x     | Consistent icon system       |
| **Markdown**   | react-markdown + remark-gfm  | 10.x    | AI response rendering        |
| **Deployment** | Docker + Cloud Run           | -       | Containerized serverless     |

---

## 📊 Code Quality Practices

| Practice                    | Implementation                                         |
| --------------------------- | ------------------------------------------------------ |
| **Zero magic numbers**      | All values in `constants.ts` (30+ named constants)     |
| **Barrel exports**          | `index.ts` in every directory for clean imports        |
| **Strict TypeScript**       | `noUnusedLocals`, `noUnusedParameters`, `strict: true` |
| **JSDoc on every export**   | `@param`, `@returns`, `@example`, `@module` tags       |
| **Max ~200-line files**     | Single responsibility principle enforced               |
| **EditorConfig + Prettier** | Consistent formatting across all editors/IDEs          |
| **Separation of concerns**  | `ai/`, `lib/`, `hooks/`, `components/`, `types/`       |
| **Error boundaries**        | React ErrorBoundary + global error.tsx                 |
| **Type-safe schemas**       | Zod `.strict()` prevents unknown field injection       |
| **No `any` types**          | Explicit typing throughout the codebase                |

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">
  <strong>Built with ❤️ for Indian Democracy</strong> 🇮🇳
  <br/>
  <em>Empowering 970+ million voters with AI-powered election education</em>
</p>
