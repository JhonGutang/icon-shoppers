---
description: Run backend CI checks (linting and tests) locally
---

This workflow replicates the backend CI pipeline logic for local development.

1. Navigate to the backend directory
```bash
cd backend
```

// turbo
2. Run Lint Check (Pint)
```bash
./vendor/bin/pint --test
```

// turbo
3. Run Tests (Pest)
```bash
php artisan test
```
