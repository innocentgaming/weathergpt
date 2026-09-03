/**
 * WeatherGPT Dynamic Backend API URL Resolver
 * 
 * Automatically resolves:
 * 1. If running in browser on Render (e.g. weathergpt-frontend-*.onrender.com), dynamically routes to matching weathergpt-backend-*.onrender.com
 * 2. If running in browser on Vercel, routes to Render backend
 * 3. If running in browser on localhost, routes to localhost:8000
 * 4. NEXT_PUBLIC_API_URL if configured and not overridden by environment
 * 5. Default http://localhost:8000
 */
export function getBackendUrl(): string {
  if (typeof window !== "undefined") {
    const host = window.location.host;
    const protocol = window.location.protocol;

    // If on render.com
    if (host.includes(".onrender.com")) {
      // If frontend is 'weathergpt-frontend-xxxx.onrender.com', backend is 'weathergpt-backend-xxxx.onrender.com'
      if (host.includes("frontend")) {
        const backendHost = host.replace("frontend", "backend");
        return `${protocol}//${backendHost}`;
      }
      return `${protocol}//weathergpt-backend.onrender.com`;
    }

    // If on Vercel
    if (host.includes("vercel.app")) {
      return "https://weathergpt-backend.onrender.com";
    }

    // If running locally in browser
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return "http://localhost:8000";
    }
  }

  if (process.env.NEXT_PUBLIC_API_URL && !process.env.NEXT_PUBLIC_API_URL.includes("localhost:8000")) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
}

export const BACKEND_URL = getBackendUrl();
