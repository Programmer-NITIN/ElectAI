# 🔗 Google Services Integration — ElectAI

> **ElectAI integrates 12 Google Cloud and Firebase services to deliver a production-grade, AI-powered election education platform with natural language understanding, multilingual accessibility, computer vision, and real-time analytics.**

---

## 📋 Table of Contents

- [Integration Architecture](#integration-architecture)
- [Services Summary](#services-summary)
- [Service Details](#service-details)
  - [1. Gemini 2.5 Pro (AI Studio)](#1-gemini-25-pro--google-ai-studio)
  - [2. Google Vertex AI](#2-google-vertex-ai)
  - [3. Firebase Authentication](#3-firebase-authentication)
  - [4. Cloud Firestore](#4-cloud-firestore)
  - [5. Google Analytics 4](#5-google-analytics-4)
  - [6. Cloud Translation API](#6-cloud-translation-api)
  - [7. Cloud Text-to-Speech](#7-cloud-text-to-speech)
  - [8. Cloud Vision OCR](#8-cloud-vision-ocr)
  - [9. Cloud Logging](#9-cloud-logging)
  - [10. Google Maps Platform](#10-google-maps-platform)
  - [11. Google reCAPTCHA v3](#11-google-recaptcha-v3)
  - [12. Google Fonts](#12-google-fonts)
- [Fallback Strategy](#fallback-strategy)
- [Configuration Guide](#configuration-guide)

---

## Integration Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        ElectAI Application                              │
│                                                                         │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                    AI & Machine Learning                           │ │
│  │                                                                    │ │
│  │  ┌──────────────────┐   ┌──────────────────┐   ┌──────────────┐  │ │
│  │  │ ① Gemini 2.5 Pro │   │ ② Vertex AI      │   │ ⑧ Vision OCR │  │ │
│  │  │   (AI Studio)    │   │   (Production)    │   │   (EPIC Scan)│  │ │
│  │  │   Streaming Chat │   │   Enterprise SLA  │   │   Field Parse│  │ │
│  │  │   Multi-Agent    │   │   VPC Support     │   │   Confidence │  │ │
│  │  └──────────────────┘   └──────────────────┘   └──────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                  Authentication & Data                             │ │
│  │                                                                    │ │
│  │  ┌──────────────────┐   ┌──────────────────┐   ┌──────────────┐  │ │
│  │  │ ③ Firebase Auth  │   │ ④ Firestore      │   │ ⑤ Analytics  │  │ │
│  │  │   Google OAuth   │   │   4 Collections   │   │   GA4 (10+   │  │ │
│  │  │   Session Mgmt   │   │   Feedback/Users  │   │   events)    │  │ │
│  │  └──────────────────┘   └──────────────────┘   └──────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                  Language & Accessibility                          │ │
│  │                                                                    │ │
│  │  ┌──────────────────┐   ┌──────────────────┐   ┌──────────────┐  │ │
│  │  │ ⑥ Translation    │   │ ⑦ Text-to-Speech │   │ ⑫ Google     │  │ │
│  │  │   22 Languages   │   │   Neural2 Voices │   │   Fonts      │  │ │
│  │  │   Real-time      │   │   EN/HI/MR       │   │   Inter var  │  │ │
│  │  └──────────────────┘   └──────────────────┘   └──────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                  Infrastructure & Security                         │ │
│  │                                                                    │ │
│  │  ┌──────────────────┐   ┌──────────────────┐   ┌──────────────┐  │ │
│  │  │ ⑨ Cloud Logging  │   │ ⑩ Maps Platform  │   │ ⑪ reCAPTCHA  │  │ │
│  │  │   Structured JSON│   │   Booth Finder   │   │   v3 Scores  │  │ │
│  │  │   4 Log Channels │   │   Embed + Dir    │   │   Zero UX    │  │ │
│  │  └──────────────────┘   └──────────────────┘   └──────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Services Summary

|  #  | Service            | Category  | Module                        | SDK/API                        | Fallback    |
| :-: | ------------------ | --------- | ----------------------------- | ------------------------------ | ----------- |
|  1  | Gemini 2.5 Pro     | AI/ML     | `src/ai/agents.ts`            | `@ai-sdk/google`               | Demo mode   |
|  2  | Vertex AI          | AI/ML     | `src/lib/google/vertex.ts`    | `@ai-sdk/google-vertex`        | AI Studio   |
|  3  | Firebase Auth      | Identity  | `src/lib/firebase.ts`         | `firebase/auth`                | Anonymous   |
|  4  | Cloud Firestore    | Database  | `src/lib/firebase.ts`         | `firebase/firestore`           | In-memory   |
|  5  | Google Analytics 4 | Analytics | `src/lib/analytics.ts`        | `firebase/analytics`           | No-op       |
|  6  | Cloud Translation  | NLP       | `src/lib/google/translate.ts` | `@google-cloud/translate`      | English     |
|  7  | Cloud TTS          | Speech    | `src/lib/google/tts.ts`       | `@google-cloud/text-to-speech` | Web Speech  |
|  8  | Cloud Vision       | Vision    | `src/lib/google/vision.ts`    | `@google-cloud/vision`         | Manual      |
|  9  | Cloud Logging      | Ops       | `src/lib/google/logging.ts`   | `@google-cloud/logging`        | console.log |
| 10  | Maps Platform      | Location  | `src/lib/google/maps.ts`      | Embed API                      | Text        |
| 11  | reCAPTCHA v3       | Security  | `src/lib/google/recaptcha.ts` | HTTP API                       | Allow all   |
| 12  | Google Fonts       | Design    | `src/app/layout.tsx`          | `next/font/google`             | System      |

---

## Service Details

### 1. Gemini 2.5 Pro — Google AI Studio

**Category**: AI / Machine Learning  
**Module**: `src/ai/agents.ts`  
**SDK**: `@ai-sdk/google` (Vercel AI SDK)

#### Purpose

Primary AI model powering the multi-agent chat system. Handles natural language understanding, intent classification, election knowledge responses, and Generative UI tool invocations.

#### Architecture

```
User Input → Router Agent (Flash, temp=0) → Intent Classification
                                              │
                    ┌─────────────┬────────────┼─────────────┬──────────┐
                    ▼             ▼            ▼             ▼          ▼
              Explainer     EVM Agent    Legal Agent   Timeline    Checklist
              (temp=0.9)    (temp=0)     (temp=0)     (temp=0.2)  (temp=0.3)
```

#### Key Features

- **Streaming responses** via `streamText()` — first token appears in <500ms
- **Temperature tuning** — creative explanations (0.9) vs precise legal info (0)
- **Generative UI** — 5 interactive components rendered server-side
- **Multi-agent routing** — specialized agents for different query types
- **System prompts** — ECI-grounded, factual, bias-free responses

#### Configuration

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key
```

---

### 2. Google Vertex AI

**Category**: AI / Machine Learning  
**Module**: `src/lib/google/vertex.ts`  
**SDK**: `@ai-sdk/google-vertex`

#### Purpose

Production-grade AI inference with enterprise SLAs, VPC support, and regional data residency (asia-south1) for compliance with Indian data localization requirements.

#### Dual-Provider Architecture

```
┌──────────────────┐     ┌──────────────────┐     ┌─────────────┐
│  Vertex AI       │ ──► │  AI Studio       │ ──► │ Demo Mode   │
│  (Production)    │     │  (Development)    │     │ (Offline)   │
│  VPC, SLA, IAM   │     │  API key auth    │     │ Static data │
└──────────────────┘     └──────────────────┘     └─────────────┘
   Priority 1               Priority 2              Priority 3
```

#### Configuration

```env
GOOGLE_VERTEX_PROJECT=your_project_id
GOOGLE_VERTEX_LOCATION=asia-south1
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
```

---

### 3. Firebase Authentication

**Category**: Identity & Access  
**Module**: `src/lib/firebase.ts`  
**SDK**: `firebase/auth`

#### Purpose

Secure user authentication via Google OAuth for personalized experiences, session tracking, and feedback attribution.

#### Features

- **GoogleAuthProvider** — one-click Google sign-in
- **Session management** — automatic token refresh
- **Anonymous fallback** — full functionality without sign-in
- **Singleton pattern** — single Firebase app instance

#### Configuration

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

---

### 4. Cloud Firestore

**Category**: Database  
**Module**: `src/lib/firebase.ts`  
**SDK**: `firebase/firestore`

#### Purpose

Real-time NoSQL document database for persistent storage of user feedback, chat sessions, daily analytics aggregations, and user profiles.

#### Collections Schema

| Collection        | Documents   | Fields                                             | Purpose          |
| ----------------- | ----------- | -------------------------------------------------- | ---------------- |
| `feedback`        | Per-message | `messageId`, `rating`, `comment`, `timestamp`      | Quality tracking |
| `sessions`        | Per-session | `userId`, `messageCount`, `language`, `tools`      | Usage analytics  |
| `daily_analytics` | Per-day     | `date`, `totalChats`, `popularTopics`, `languages` | Dashboard data   |
| `users`           | Per-user    | `uid`, `displayName`, `language`, `firstSeen`      | Personalization  |

---

### 5. Google Analytics 4

**Category**: Analytics  
**Module**: `src/lib/analytics.ts`  
**SDK**: `firebase/analytics`

#### Purpose

Comprehensive user interaction tracking with 10+ custom events for understanding usage patterns and improving the educational experience.

#### Custom Events

| Event              | Parameters            | Trigger                   |
| ------------------ | --------------------- | ------------------------- |
| `chat_message`     | `language`            | User sends a message      |
| `tool_used`        | `toolName`            | Generative UI rendered    |
| `voice_input_used` | —                     | Microphone activated      |
| `tts_played`       | —                     | AI reads response aloud   |
| `language_changed` | `to`                  | Language selector changed |
| `theme_toggled`    | `theme`               | Dark/light mode switch    |
| `feedback_given`   | `rating`, `messageId` | Thumbs up/down clicked    |
| `ocr_used`         | —                     | Voter ID scanned          |
| `booth_search`     | `query`               | Polling booth searched    |
| `page_view`        | `path`                | Page navigation           |

---

### 6. Cloud Translation API

**Category**: Natural Language Processing  
**Module**: `src/lib/google/translate.ts`  
**SDK**: `@google-cloud/translate` (v3)

#### Purpose

Real-time translation enabling access for India's diverse linguistic population. Supports 22 scheduled Indian languages.

#### Supported Languages

| Language  | Code | Script     | Speakers |
| --------- | ---- | ---------- | -------- |
| Hindi     | `hi` | Devanagari | 528M     |
| Bengali   | `bn` | Bengali    | 228M     |
| Telugu    | `te` | Telugu     | 83M      |
| Marathi   | `mr` | Devanagari | 83M      |
| Tamil     | `ta` | Tamil      | 75M      |
| Gujarati  | `gu` | Gujarati   | 55M      |
| Kannada   | `kn` | Kannada    | 44M      |
| Malayalam | `ml` | Malayalam  | 34M      |
| Odia      | `or` | Odia       | 33M      |
| Punjabi   | `pa` | Gurmukhi   | 29M      |
| Urdu      | `ur` | Nastaliq   | 70M      |
| Assamese  | `as` | Bengali    | 15M      |

#### Fallback

When Cloud Translation is unavailable, the app serves pre-translated UI strings in English, Hindi, and Marathi from the built-in i18n module.

---

### 7. Cloud Text-to-Speech

**Category**: Speech Synthesis  
**Module**: `src/lib/google/tts.ts`  
**SDK**: `@google-cloud/text-to-speech`

#### Purpose

Natural speech synthesis enabling AI to read responses aloud — critical for accessibility, rural users, and low-literacy populations.

#### Voice Configuration

| Language        | Voice ID           | Type     | Sample Rate |
| --------------- | ------------------ | -------- | ----------- |
| English (India) | `en-IN-Neural2-A`  | Neural2  | 24kHz       |
| Hindi           | `hi-IN-Neural2-A`  | Neural2  | 24kHz       |
| Marathi         | `mr-IN-Standard-A` | Standard | 24kHz       |

#### Fallback Chain

```
Cloud TTS (Neural2 quality) → Web Speech API (browser built-in) → Text only
```

---

### 8. Cloud Vision OCR

**Category**: Computer Vision  
**Module**: `src/lib/google/vision.ts`  
**SDK**: `@google-cloud/vision`

#### Purpose

Extracts text from photographs of voter ID cards (EPIC cards), automatically detecting the EPIC number, voter name, and other fields.

#### Processing Pipeline

```
Photo Upload → Validation (5MB, JPEG/PNG/WebP)
     │
     ▼
Cloud Vision TEXT_DETECTION → Raw OCR Text
     │
     ▼
Regex Field Extraction:
  • EPIC: /[A-Z]{3}\d{7}/
  • Name: /Name\s*:\s*(.+)/i
  • Father: /Father.*Name\s*:\s*(.+)/i
  • Address: /Address\s*:\s*(.+)/i
     │
     ▼
Structured Result { text, confidence, detectedFields }
```

#### Security

- **File size limit**: 5MB maximum
- **Allowed types**: JPEG, PNG, WebP only
- **Server-side only**: Images never stored, processed in memory
- **Confidence score**: Returned for reliability assessment

---

### 9. Cloud Logging

**Category**: Operations & Monitoring  
**Module**: `src/lib/google/logging.ts`  
**SDK**: `@google-cloud/logging`

#### Purpose

Structured JSON logging compatible with Google Cloud Logging for production monitoring, debugging, and alerting.

#### Log Channels

| Log Name           | Purpose                           | Severity |
| ------------------ | --------------------------------- | -------- |
| `electai-chat`     | Chat API requests and responses   | INFO     |
| `electai-security` | Rate limiting, auth failures      | WARNING  |
| `electai-errors`   | Application errors and exceptions | ERROR    |
| `electai-ai`       | AI model latency and fallbacks    | INFO     |

#### Auto-Detection

Automatically detects Cloud Run environment via `K_SERVICE` env var and routes logs to Cloud Logging. Falls back to structured `console.log` JSON for local development.

---

### 10. Google Maps Platform

**Category**: Location Services  
**Module**: `src/lib/google/maps.ts`  
**SDK**: Maps Embed API + URLs API

#### Purpose

Helps voters locate their nearest polling station by embedding Google Maps with search and directions.

#### APIs Used

| API                 | Purpose                              | Usage              |
| ------------------- | ------------------------------------ | ------------------ |
| **Maps Embed API**  | Iframe map with polling booth search | Zero JavaScript    |
| **Directions URL**  | Link to Google Maps directions       | Native app handoff |
| **Static Maps API** | Map thumbnail images                 | Preview without JS |

---

### 11. Google reCAPTCHA v3

**Category**: Security  
**Module**: `src/lib/google/recaptcha.ts`  
**SDK**: HTTP API (siteverify)

#### Purpose

Invisible bot protection for API endpoints. Score-based validation eliminates bot traffic without any user friction (no challenges).

#### Flow

```
Client: Execute reCAPTCHA → Token → Send with API request
Server: Token → Google siteverify API → Score (0.0–1.0)
        Score ≥ 0.5 → Allow request
        Score < 0.5 → Block (429 response)
```

---

### 12. Google Fonts

**Category**: Design & Typography  
**Module**: `src/app/layout.tsx`  
**SDK**: `next/font/google`

#### Purpose

Premium typography using the Inter variable font family for a professional, modern interface.

#### Configuration

```typescript
const inter = Inter({
  subsets: ["latin"],
  display: "swap", // No FOIT (Flash of Invisible Text)
  variable: "--font-inter", // CSS custom property
});
```

#### Performance

- **Zero layout shift** — `display: swap` prevents flash of invisible text
- **Subset loading** — only Latin glyphs loaded initially
- **Variable font** — single file for all weights (300-900)
- **Self-hosted** — Next.js downloads and serves from same origin

---

## Fallback Strategy

Every Google service has a graceful fallback to ensure the application works **without any API keys**:

```
┌───────────────────────────────────────────────────────────────┐
│              Graceful Degradation Matrix                      │
├─────────────────────┬───────────────────┬────────────────────┤
│  Service            │  With API Key     │  Without (Fallback)│
├─────────────────────┼───────────────────┼────────────────────┤
│  Gemini AI          │  AI chat          │  Demo responses    │
│  Vertex AI          │  Production AI    │  AI Studio         │
│  Firebase Auth      │  Google sign-in   │  Anonymous use     │
│  Firestore          │  Persistent data  │  In-memory state   │
│  Analytics          │  GA4 tracking     │  Silent no-op      │
│  Translation        │  22 languages     │  EN/HI/MR built-in │
│  TTS                │  Neural2 voice    │  Web Speech API    │
│  Vision OCR         │  Photo scan       │  Manual text input │
│  Cloud Logging      │  Cloud capture    │  console.log JSON  │
│  Maps               │  Embedded map     │  Text directions   │
│  reCAPTCHA          │  Bot protection   │  Allow all traffic │
│  Google Fonts       │  Inter family     │  System font stack │
└─────────────────────┴───────────────────┴────────────────────┘
```

---

## Configuration Guide

### Minimal Setup (Demo Mode — works immediately)

```env
# No environment variables needed!
# App runs in Demo Mode with full functionality
```

### AI Chat Mode

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_key
```

### Full Production Setup

```env
# AI
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key
GOOGLE_VERTEX_PROJECT=your_project_id
GOOGLE_VERTEX_LOCATION=asia-south1
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id

# Google Cloud
GOOGLE_CLOUD_PROJECT=your_project_id
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_key
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key
RECAPTCHA_SECRET_KEY=your_secret_key
```

---

<p align="center">
  <em>12 Google services. One unified platform. Zero voter left behind.</em>
</p>
