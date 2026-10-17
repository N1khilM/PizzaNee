import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import OrderSummary from "./pages/OrderSummary";
import "./App.css";

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<OrderSummary />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <div className="footer-brand"><span className="brand-mark">N</span><span>PizzaNee</span></div>
        <p>Your slice. Your rules.</p>
        <small>Fictional portfolio project · Stripe test mode only · Built by Nikhil Mugali</small>
      </footer>
    </div>
  );
}

export default App;
