---
description: Run frontend CI checks (linting, type check, and tests) locally
---

1. Navigate to the frontend directory
2. Run linting
// turbo
```bash
npm run lint
```
3. Run type check
// turbo
```bash
npx tsc --noEmit
```
4. Run tests
// turbo
```bash
npm run test
```
5. Run build (optional, to verify production build)
// turbo
```bash
npm run build
```
