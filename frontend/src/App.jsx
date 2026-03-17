import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DashboardLayout from './components/DashboardLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PropertyDetails from './pages/PropertyDetails';
import AddProperty from './pages/AddProperty';
import ContactSeller from './pages/ContactSeller';
import Dashboard from './pages/Dashboard';
import MyListings from './pages/MyListings';
import Pricing from './pages/Pricing';
import Settings from './pages/Settings';
import { useAuth } from './context/AuthContext';
import { LoadingSpinner } from './components/ui';

function PrivateRoute({ children, requireSeller }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner label="Checking auth..." />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (requireSeller && user.role !== 'seller') return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/property/:id/contact" element={<ContactSeller />} />
          <Route path="/app" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="listings" element={<MyListings />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route
            path="/add-property"
            element={
              <PrivateRoute requireSeller>
                <AddProperty />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
