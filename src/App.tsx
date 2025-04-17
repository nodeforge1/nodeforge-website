import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Checkout from "./pages/Checkout";
import DashboardHome from "./pages/dashboard/Products";
import Success from "./components/payment/success";
import Canceled from "./components/payment/Canceled";
import Dashboard from "./pages/dashboard/Dashboard";
import NewProduct from "./pages/dashboard/NewProduct";
import EditProduct from "./pages/dashboard/EditProduct";
import Orders from "./pages/dashboard/Orders";
import NotFound from "./pages/dashboard/NotFound";
import { AuthProvider } from "./context/AuthContext";
import RequireAuth from "./components/auth/RequireAuth";
import Login from "./pages/dashboard/Login";
import FAQPage from "./pages/FAQ";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/FAQPage" element={<FAQPage />} />
            <Route path="/login" element={<Login />} />
            <Route element={<RequireAuth />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard-home" element={<DashboardHome />} />
              <Route path="/products/new" element={<NewProduct />} />
              <Route path="/products/edit/:id" element={<EditProduct />} />
              <Route path="/orders" element={<Orders />} />
            </Route>

            <Route path="*" element={<NotFound />} />
            <Route path="/success" element={<Success />} />
            <Route path="/canceled" element={<Canceled />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
