# Contributing to ElectAI

Thank you for your interest in contributing to ElectAI! This guide will help you get started.

## Development Setup

### Prerequisites

- **Node.js** ≥ 20.x (LTS)
- **npm** ≥ 10.x
- A Google Cloud account (for Gemini AI integration)

### Getting Started

```bash
# Clone the repository
git clone https://github.com/Programmer-NITIN/ElectAI.git
cd ElectAI

# Install dependencies
npm ci

# Copy environment variables
cp .env.example .env.local

# Fill in your API keys in .env.local
# At minimum, set GOOGLE_GENERATIVE_AI_API_KEY for AI features

# Start the development server
npm run dev
```

## Coding Standards

### TypeScript

- **Strict mode** is enforced — no `any` types, no unused variables.
- All functions must have JSDoc comments with `@param` and `@returns` tags.
- Use `interface` for object shapes and `type` for unions/intersections.

### File Organization

```
src/
├── ai/          # AI agent configs, prompts, tools
├── app/         # Next.js App Router pages and API routes
├── components/  # React components (chat/, generative/, ui/)
├── hooks/       # Custom React hooks
├── lib/         # Shared utilities, constants, schemas
├── types/       # TypeScript type definitions
└── __tests__/   # Jest test suites (mirrors src/ structure)
```

### Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Files | `camelCase.ts` | `electionData.ts` |
| Components | `PascalCase.tsx` | `ChatInterface.tsx` |
| Constants | `SCREAMING_SNAKE_CASE` | `MAX_MESSAGE_LENGTH` |
| Functions | `camelCase` | `sanitizeInput()` |
| Interfaces | `PascalCase` | `ChatMessage` |

## Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

- All new features must include corresponding tests.
- Maintain the existing test structure under `src/__tests__/`.
- Use `@jest-environment node` docblock for server-side tests.

## Linting & Formatting

```bash
# Lint the codebase
npm run lint

# Auto-fix lint issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check formatting without writing
npm run format:check
```

## Pull Request Process

1. **Fork** the repository and create a feature branch from `main`.
2. **Write tests** for any new functionality.
3. **Run the full quality gate** before submitting:
   ```bash
   npm run lint && npx tsc --noEmit && npm run test && npm run build
   ```
4. **Submit a PR** with a clear description of the changes.
5. Ensure all CI checks pass.

## Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add Hindi language support for EVM simulator
fix: correct Form 6 validation for overseas voters
docs: update API endpoint documentation
test: add edge case tests for rate limiting
chore: update dependencies to latest versions
```

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
