import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Cart from "./Cart";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const homeTarget = (hash) => (location.pathname === "/" ? hash : `/${hash}`);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="nav-inner">
        <Link
          to="/"
          className="brand"
          onClick={closeMenu}
          aria-label="PizzaNee home"
        >
          <span className="brand-mark">N</span>
          <span>
            Pizza<span className="brand-accent">Nee</span>
            <small>YOUR SLICE. YOUR RULES.</small>
          </span>
        </Link>

        <button
          className="mobile-menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <nav
          className={menuOpen ? "main-nav is-open" : "main-nav"}
          aria-label="Main navigation"
        >
          <a href="#menu">Menu</a>
          <a href="#builder">Build your pizza</a>
          <a href="#about">About</a>

          <Cart />
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
