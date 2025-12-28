import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./utils/ProtectedRoute";
import Navbar from "./components/Navbar";
import ErrorBoundary from "./components/ErrorBoundary";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Lazy load pages
const Home = lazy(() => import("./pages/Home"));
const TechNewsFeed = lazy(() => import("./pages/Explore"));
const Projects = lazy(() => import("./pages/Projects"));
const ProjectDetails = lazy(() => import("./pages/ProjectDetails"));
const EditProject = lazy(() => import("./pages/EditProject"));
const Profile = lazy(() => import("./pages/Profile"));
const Notifications = lazy(() => import("./pages/Notifications"));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>

        {/* GLOBAL TOAST */}
        <ToastContainer
          position="top-right"
          autoClose={1500}
          pauseOnHover={false}
          draggable
          theme="light"
        />

        <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* HOME */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navbar />
              <Suspense fallback={<LoadingSpinner />}>
                <Home />
              </Suspense>
            </ProtectedRoute>
          }
        />

        {/* NOTIFICATIONS */}
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Navbar />
              <Suspense fallback={<LoadingSpinner />}>
                <Notifications />
              </Suspense>
            </ProtectedRoute>
          }
        />

        {/* PROFILE */}
        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <Navbar />
              <Suspense fallback={<LoadingSpinner />}>
                <Profile />
              </Suspense>
            </ProtectedRoute>
          }
        />

        {/* EXPLORE */}
        <Route path="/explore" element={<TechNewsFeed />} />

        {/* PROJECTS LIST */}
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <Navbar />
              <Suspense fallback={<LoadingSpinner />}>
                <Projects />
              </Suspense>
            </ProtectedRoute>
          }
        />

        {/* PROJECT DETAILS */}
        <Route
          path="/projects/:id"
          element={
            <ProtectedRoute>
              <Navbar />
              <Suspense fallback={<LoadingSpinner />}>
                <ProjectDetails />
              </Suspense>
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/:id/edit"
          element={
            <ProtectedRoute>
              <Navbar />
              <Suspense fallback={<LoadingSpinner />}>
                <EditProject />
              </Suspense>
            </ProtectedRoute>
          }
        />

      </Routes>



    </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
