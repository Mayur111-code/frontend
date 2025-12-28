import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ProtectedRoute from "./utils/ProtectedRoute";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TechNewsFeed from "./pages/Explore";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import EditProject from "./pages/EditProject";

function App() {
  return (
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
              <Home />
            </ProtectedRoute>
          }
        />

        {/* NOTIFICATIONS */}
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Navbar />
              <Notifications />
            </ProtectedRoute>
          }
        />

        {/* PROFILE */}
        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <Navbar />
              <Profile />
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
              <Projects />
            </ProtectedRoute>
          }
        />

        {/* PROJECT DETAILS */}
        <Route
          path="/projects/:id"
          element={
            <ProtectedRoute>
              <Navbar />
              <ProjectDetails />
            </ProtectedRoute>
          }
        />


        <Route
  path="/projects/:id/edit"
  element={
    <ProtectedRoute>
      <Navbar />
      <EditProject />
    </ProtectedRoute>
  }
/>


      </Routes>



    </BrowserRouter>
  );
}

export default App;
