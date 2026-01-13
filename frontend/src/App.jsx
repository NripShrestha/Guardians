import Signup from "./auth/Signup";
import Login from "./auth/Login";
import CharacterSelection from "./scenes/gameUI/CharacterSelect";
import Home from "./Home";
import ProtectedRoute from "./auth/ProtectedRoute";
import { Routes, Route, Navigate } from "react-router-dom";
import { BrightnessProvider } from "./scenes/utils/BrightnessContext";
import { VolumeProvider } from "./scenes/utils/VolumeContext"; // Add this

export default function App() {
  return (
    <BrightnessProvider>
      <VolumeProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/choose-character"
            element={
              <ProtectedRoute>
                <CharacterSelection />
              </ProtectedRoute>
            }
          />

          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
        </Routes>
      </VolumeProvider>{" "}
      {/* Close wrapper */}
    </BrightnessProvider>
  );
}
