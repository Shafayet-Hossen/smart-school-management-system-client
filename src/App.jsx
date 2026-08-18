import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Login from "./pages/Login.jsx";
import JwtTest from "./pages/JwtTest.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Register from "./pages/Register.jsx";

function App() {
  return (
    <BrowserRouter>``
      <Routes>
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
        />
        <Route
          path="/jwt-test"
          element={
            <ProtectedRoute>
              <JwtTest/>
            </ProtectedRoute>  
          }
        />

        <Route
          path="*"
          element={<Login />}
        />

        

      </Routes>
    </BrowserRouter>
  );
}

export default App;