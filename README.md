# Minimal Supabase Auth Backend (Netlify Functions)

A lightweight Node.js + Express serverless backend using Supabase Auth. Provides register, login, and profile endpoints, designed to be deployed on Netlify and consumed by a React frontend. Firestore usage in the frontend is separate and not handled here.

## Tech Stack
- Node.js + Express.js
- Supabase JS SDK for Auth (no Firebase Admin)
- Netlify Functions via `serverless-http`
- ESM (`"type": "module"`)

## Endpoints
Base path in Netlify: `/.netlify/functions/auth`

- `POST /.netlify/functions/auth/register`
  - Body: `{ email, password, name }`
  - Response: `{ success: true, user_id, token }`

- `POST /.netlify/functions/auth/login`
  - Body: `{ email, password }`
  - Response: `{ success: true, user_id, token }`

- `GET /.netlify/functions/auth/profile`
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ success: true, user: { id, email, name } }`

## Quick Start (Local)
1. Copy env and add your Supabase details:
   ```sh
   cp .env.example .env
   # Edit .env with SUPABASE_URL, SUPABASE_ANON_KEY, CORS_ORIGIN
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Run local dev (Netlify):
   ```sh
   npx netlify-cli@latest dev --functions functions
   # or
   netlify dev --functions functions
   ```
   Netlify will serve functions at `http://localhost:8888/.netlify/functions/auth/...`.

## Supabase Setup
- Create a free Supabase project and enable Email/Password auth in the dashboard.
- Copy your `SUPABASE_URL` and `SUPABASE_ANON_KEY` into `.env`.
- Optional CLI (for local DB or project management):
  ```sh
  npx supabase login
  npx supabase init
  # Optional: if you want to run local stack (requires Docker)
  npx supabase start
  ```

## Netlify Setup & Deployment
1. Install Netlify CLI:
   ```sh
   npm install -g netlify-cli
   ```
2. Login and initialize project:
   ```sh
   netlify login
   netlify init
   ```
3. Set environment variables in Netlify (Dashboard or CLI):
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `CORS_ORIGIN` (e.g. `http://localhost:5173,https://your-frontend.example.com`)
4. Test locally:
   ```sh
   netlify dev --functions functions
   ```
5. Deploy:
   ```sh
   netlify deploy --prod
   ```

## cURL Examples
- Register:
  ```sh
  curl -X POST http://localhost:8888/.netlify/functions/auth/register \
    -H "Content-Type: application/json" \
    -d '{"email":"user@example.com","password":"StrongPass123","name":"Jane Doe"}'
  ```
- Login:
  ```sh
  curl -X POST http://localhost:8888/.netlify/functions/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"user@example.com","password":"StrongPass123"}'
  ```
- Profile:
  ```sh
  curl http://localhost:8888/.netlify/functions/auth/profile \
    -H "Authorization: Bearer <token>"
  ```

## Project Structure
```
project-root/
├─ functions/
│  └─ auth.js
├─ package.json
├─ .env (add your keys)
├─ .env.example
├─ netlify.toml
└─ README.md
```

## Notes
- Registration may return `token = null` if email confirmation is enabled in Supabase; you can disable confirmation in Auth settings for immediate sessions.
- All responses are JSON.
- CORS is configurable via `CORS_ORIGIN`.