# Copilot Instructions for Frontend Project

## Architecture Overview
This is a React-based social collaboration platform using Vite for build tooling. Key architectural components:
- **State Management**: Redux Toolkit with a single `userSlice` handling authentication state (user data and token) persisted in localStorage
- **API Layer**: Centralized Axios instance in `src/api/axios.js` with automatic Bearer token injection via request interceptor
- **Routing**: React Router with protected routes using `ProtectedRoute` component for authenticated pages
- **UI Framework**: TailwindCSS for styling, Lucide React for icons, React Toastify for notifications

## Developer Workflows
- **Development**: `npm run dev` starts Vite dev server with HMR
- **Build**: `npm run build` produces production bundle in `dist/`
- **Linting**: `npm run lint` uses ESLint with React hooks and refresh plugins; custom rule ignores unused vars starting with uppercase (e.g., imported components)
- **Preview**: `npm run preview` serves built app locally

## Code Patterns & Conventions
- **File Structure**: Components in `src/components/`, pages in `src/pages/`, utilities in `src/utils/`, Redux in `src/redux/`
- **API Calls**: Always wrap in try/catch, use toast for user feedback (success/error). Example from `Login.jsx`:
  ```jsx
  try {
    const { data } = await API.post("/auth/login", { email, password });
    toast.success(`Welcome back, ${data.user.name}! 🎉`);
  } catch (err) {
    toast.error(err?.response?.data?.message || "Error message");
  }
  ```
- **Authentication**: Check `useSelector((s) => s.user.user)` for current user; dispatch `setUser` action on login, `logout` on sign out
- **Modals**: Use dedicated modal components (e.g., `CreatePostModal`, `LikesModal`) for user interactions, managed with local state
- **Protected Routes**: Wrap routes with `<ProtectedRoute>` and include `<Navbar />` for authenticated pages
- **Data Fetching**: Use `useEffect` for initial loads, implement refresh functions for optimistic updates

## Key Files
- `src/App.jsx`: Central routing configuration with public/protected route separation
- `src/redux/userSlice.js`: Authentication state management with localStorage persistence
- `src/api/axios.js`: API client with auth headers
- `src/utils/ProtectedRoute.jsx`: Route guard component
- `src/components/PostCard.jsx`: Example of complex component with likes/comments/sharing logic

## Integration Points
- Backend API at `https://collab-backend-2.onrender.com/api` (update baseURL if deploying)
- External auth providers (GitHub/Twitter icons present but implementation may vary)
- Browser native sharing API used in post sharing functionality