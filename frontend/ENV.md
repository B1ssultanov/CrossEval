# Frontend environment variables (local dev)

Create a file `frontend/.env.local` with these variables:

```env
# Public (used in the browser)
# Use a relative URL so requests go through Next rewrites (see next.config.js)
NEXT_PUBLIC_API_URL=/api/v1

# Server-side (used by Next dev server to proxy to your backend)
BACKEND_ORIGIN=http://127.0.0.1:8000
```

Notes:
- `NEXT_PUBLIC_API_URL=/api/v1` means the browser will call `http://localhost:3000/api/v1/...`.
- `next.config.js` rewrites proxy those calls to your backend `http://127.0.0.1:8000/api/v1/...`.
- File downloads use `/file/...` and are also proxied to the backend.


