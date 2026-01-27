---
description: "Guidance for AI coding agents working on this Next.js plugin web project"
applyTo: "**"
---

# Copilot Instructions for plugin-web

## Project Overview

This is a **Next.js 16.1.4 web application** targeting **TypeScript 5.x / ES2022** with **React 19.2**, styled with **Tailwind CSS 4** and **PostCSS 4**. It uses the **App Router** architecture (not Pages Router). The project is a foundation for a web plugin interface with a focus on accessibility and modern web standards.

## Essential Architecture

- **App Router**: Uses `app/layout.tsx` (root layout) and `app/page.tsx` (home page); each directory level can have its own layout and nested routes.
- **Styling**: Tailwind CSS 4 with PostCSS; global styles in `app/globals.css`; use Tailwind classes for all styling, not inline CSS.
- **Fonts**: Google Fonts (Geist and Geist Mono) imported via Next.js font optimization in [app/layout.tsx](app/layout.tsx#L2).
- **Image Optimization**: Use Next.js `Image` component from `next/image` for automatic optimization (as seen in [app/page.tsx](app/page.tsx#L1)).
- **Path Alias**: `@/*` resolves to repository root; use for cleaner imports.

## Developer Workflows

**Build & Run:**
- `yarn dev` — Start dev server (hot reload at http://localhost:3000)
- `yarn build` — Production build
- `yarn start` — Run production server
- `yarn lint` — Run ESLint (ESLint 9, Next.js config)
- `yarn test` — Run Jest test suite

**Linting:** Run `yarn lint` before submitting changes. Config in [eslint.config.mjs](eslint.config.mjs) extends `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`.

**Testing:** Jest is configured for unit and integration tests. Create test files colocated with source: `ComponentName.test.tsx` or `utility.test.ts` (not in separate `__tests__` directories).

## Code Patterns & Conventions

**File Naming & Folder Structure:** Use atomic folder structure with component name as the folder, not `index.tsx`. Example:
```
app/
  components/
    UserCard/
      UserCard.tsx      (component file, not index.tsx)
      UserCard.test.tsx
      UserCard.module.css (if needed)
    LoginForm/
      LoginForm.tsx
      LoginForm.test.tsx
  utils/
    formatDate.ts
    formatDate.test.ts
```

Use kebab-case for utility files and directories (e.g., `user-session.ts`, `data-service.ts`), but component files use the component name (PascalCase).

**TypeScript:**
- Target ES2017 (transpile to esnext module); strict mode enabled.
- Avoid `any`; prefer `unknown` with type narrowing.
- Use utility types (`Readonly`, `Partial`, `Record`, `Omit`, `Pick`) to express intent.
- Keep types focused; centralize shared contracts in `app/types/` directory.
- Use discriminated unions for state machines or component variants:
  ```typescript
  type ButtonState = { status: 'idle' } | { status: 'loading' } | { status: 'error'; error: string };
  ```
- Use `const` assertions for literal types and readonly arrays where appropriate.
- Document complex types with JSDoc comments for IDE IntelliSense.

**Next.js Patterns: Server vs. Client Components:**

By default, components are Server Components (run only on server). Use `'use client'` directive when you need interactivity:

- **Server Components** (no directive): Use for static content, data fetching, database queries. Example: listing products fetched from a DB.
  ```typescript
  // app/components/ProductList/ProductList.tsx
  export default async function ProductList() {
    const products = await fetch('...'); // OK in Server Component
    return <ul>{/* render products */}</ul>;
  }
  ```
  
- **Client Components** (`'use client'`): Use for interactivity (click handlers, state, hooks, event listeners). Fetch data at parent level if possible, pass as props.
  ```typescript
  // app/components/SearchBox/SearchBox.tsx
  'use client';
  
  import { useState } from 'react';
  
  export default function SearchBox({ onSearch }: { onSearch: (term: string) => void }) {
    const [term, setTerm] = useState('');
    return (
      <input value={term} onChange={(e) => {
        setTerm(e.target.value);
        onSearch(e.target.value);
      }} />
    );
  }
  ```

- **Data Fetching in Server Components**: Use `fetch()` with Next.js caching; avoid client-side data fetching unless necessary for real-time updates.
  ```typescript
  export default async function Page() {
    const data = await fetch('https://...', { next: { revalidate: 3600 } });
    // ...
  }
  ```

- **Route Handlers**: For API endpoints, create `app/api/[route]/route.ts` with handlers: `GET`, `POST`, etc.

**React Components:**
- Prefer functional components with hooks (standard in modern Next.js).
- Use `Readonly<{ children: React.ReactNode }>` for layout and wrapper prop typing (see [app/layout.tsx](app/layout.tsx#L13)).
- Keep component logic thin; move heavy logic to separate utility functions or custom hooks.
- Colocate hooks near their usage; extract custom hooks to separate files only if reused across multiple components.

**Styling:**
- Use Tailwind CSS 4 utility classes exclusively; no inline CSS or separate CSS modules unless absolutely necessary.
- Dark mode support via Tailwind's `dark:` prefix (inherited from layout; see [app/layout.tsx](app/layout.tsx#L17)).
- Example: `className="bg-white dark:bg-black text-black dark:text-white"`
- For dynamic classes, use template literals or conditional operators, not string concatenation.

**Image Optimization:**
- Always use Next.js `Image` component from `next/image` (as in [app/page.tsx](app/page.tsx#L1)).
- Provide `alt` text for accessibility.
- Specify `width` and `height` for proper layout shift prevention.
- Use `priority` prop for above-the-fold images.

**Accessibility (WCAG 2.2 Level AA):**
See [a11y.instructions.md](../a11y.instructions.md) for detailed guidance. Key points:
- Use semantic HTML (`<main>`, `<nav>`, `<header>`, `<footer>`).
- All interactive elements must be keyboard navigable with visible focus.
- Provide skip links for repeated content blocks.
- Use `aria-*` attributes where ARIA roles/states are required.
- Test with keyboard navigation and screen readers (Accessibility Insights).
- Use `.sr-only` for screen-reader-only content.

## Critical Integration Points

**Next.js Configuration** ([next.config.ts](next.config.ts)): Currently minimal; extend here for custom webpack, redirects, rewrites, or environment variables.

**Metadata & SEO:** Set `Metadata` in [app/layout.tsx](app/layout.tsx#L4) and route-level `layout.tsx` files. Use `generateMetadata()` for dynamic routes.

**Environment Variables:** Define in `.env.local` (not committed); access via `process.env.*` in Server Components and `process.env.NEXT_PUBLIC_*` in Client Components.

## Type System Expectations

- All TypeScript files must pass strict type checking.
- Use `as const` for literal types when appropriate.
- Prefer discriminated unions for state machines or event payloads.
- Document complex types with JSDoc comments.

## Security & Best Practices

- Never hardcode secrets or API keys; use environment variables.
- Sanitize external input before rendering; use Next.js escaping and avoid `dangerouslySetInnerHTML`.
- Validate and normalize external responses.
- Apply retries and backoff to network calls.
- Keep dependencies up to date; run `yarn audit` regularly.

## Deployment & Environment Setup

Three environments are required: **development**, **staging**, and **production**.

**Environment Variables:**
- Create `.env.local` (gitignored), `.env.staging`, `.env.production` files in the project root.
- Prefix public variables with `NEXT_PUBLIC_` (accessible in browser); keep API keys and secrets unprefixed (Server Components / Route Handlers only).
- Example `.env.local`:
  ```
  NEXT_PUBLIC_API_URL=http://localhost:3000
  API_SECRET=dev-secret-key
  ```

**Development:**
- `yarn dev` runs on `http://localhost:3000` using `.env.local`.
- Use `NEXT_PUBLIC_API_URL=http://localhost:3000` for local API calls.
- Enable verbose logging; keep TypeScript strict.

**Staging:**
- Build with `NEXT_PUBLIC_API_URL=https://staging.example.com yarn build`.
- Load env from `.env.staging`: `NODE_ENV=staging yarn build`.
- Deploy staging image to staging infrastructure; test before production.
- Use the same build artifact when promoting to production (do not rebuild).

**Production:**
- Build with `yarn build` and `.env.production` loaded.
- `yarn start` runs the optimized production server.
- Deploy to production infrastructure (Vercel, Docker, etc.).
- Implement health checks and error monitoring (e.g., Sentry).
- Keep production configuration minimal and read-only.

**Vercel Deployment (Recommended):**
1. Connect repository to Vercel.
2. Set environment variables per-environment in Vercel dashboard: project settings > Environment Variables.
3. Staging domain: auto-generated preview URL; Production domain: custom domain.
4. Automatic deployments on git push; manual rollback available.

**Docker Deployment (Alternative):**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production
COPY . .
RUN yarn build
EXPOSE 3000
CMD ["yarn", "start"]
```

**Deployment Checklist:**
- [ ] Run `yarn lint` and `yarn test` before deploying.
- [ ] Verify environment variables are set in target environment.
- [ ] Test core functionality in staging before promoting to production.
- [ ] Enable monitoring and error tracking in production.
- [ ] Plan rollback strategy if issues arise.

## References

- [TypeScript Development Guidelines](../typescript-5-es2022.instructions.md) — Full TypeScript 5.x conventions.
- [Accessibility Instructions](../a11y.instructions.md) — WCAG 2.2 Level AA compliance and inclusive design.
- [Next.js App Router Docs](https://nextjs.org/docs/app) — Official documentation for routing and features.
- [Jest Documentation](https://jestjs.io/) — Testing framework guide.

## Testing with Jest

**Setup:**
Jest is configured as the test runner. Test files colocate with source code using the `.test.ts` or `.test.tsx` suffix (not in separate `__tests__` directories).

**Writing Tests:**
- Unit tests for utilities: `app/utils/formatDate.test.ts`
- Component tests for React components: `app/components/UserCard/UserCard.test.tsx`
- Use descriptive test names: `describe('UserCard', () => { it('renders user name and avatar', () => { ... }); })`
- Mock Next.js modules (e.g., `next/image`, `next/font`) as needed.
- Use a TDD approach: write tests before implementing features.
- Structure tests in the AAA pattern (Arrange, Act, Assert).
- Tests should always have the user perspective in mind.

**Running Tests:**
- `yarn test` — Run all tests
- `yarn test --watch` — Watch mode (re-run on changes)
- `yarn test --coverage` — Coverage report

**Example Jest Test:**
```typescript
// app/components/UserCard/UserCard.test.tsx
import { render, screen } from '@testing-library/react';
import UserCard from './UserCard';

describe('UserCard', () => {
  it('renders user name and email', () => {
    render(<UserCard name="John" email="john@example.com" />);
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('calls onSelect when clicked', () => {
    const onSelect = jest.fn();
    render(<UserCard name="John" email="john@example.com" onSelect={onSelect} />);
    screen.getByRole('button').click();
    expect(onSelect).toHaveBeenCalled();
  });
});
```

## Debugging

- Use `yarn dev` with Chrome DevTools (F12) or VS Code debugger.
- Add `debugger;` statements in code, then debug in DevTools.
- Server Component logs appear in terminal; Client Component logs appear in browser console.
- For production issues, use error monitoring (Sentry, LogRocket, etc.).
