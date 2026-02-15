import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./Component/navbar";
import MobileBottomNav from "./Component/MobileBottomNav";
import Home from "./pages/Home";
import BookList from "./pages/BookList";
import BookDetail from "./pages/BookDetail";
import Reader from "./pages/Reader";
import Search from "./pages/Search";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import { useAuth } from "./context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book" element={<BookList />} />
        <Route path="/book/:id" element={<BookDetail />} />
        <Route path="/read/:bookId/:chapterId" element={<Reader />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />
      </Routes>

      <MobileBottomNav />
    </>
  );
};

export default App;
