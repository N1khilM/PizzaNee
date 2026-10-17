import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchPizzas } from "../features/pizzas/pizzaSlice";
import PizzaCard from "../components/PizzaCard";
import PizzaBuilder from "./PizzaBuilder";
import About from "../components/About";

function Home() {
  const dispatch = useDispatch();
  const { items: pizzas, status, error, usingFallback } = useSelector((state) => state.pizzas);

  useEffect(() => {
    dispatch(fetchPizzas());
  }, [dispatch]);

  const scrollToMenu = () => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="home-page">
      <section className="hero section-container">
        <div className="hero-copy">
          <div className="hero-pill"><span className="sun-dot">✦</span> YOUR HUNGER, YOUR RULES</div>
          <h1>A little more<br /> <span>pizza joy.</span></h1>
          <p>Big flavours. Happy bites. And a pizza you can make completely your own.</p>
          <div className="hero-actions"><button className="button button-primary" onClick={scrollToMenu} type="button">Explore the menu <span>↘</span></button><a className="text-link" href="#builder">Build your own <span>→</span></a></div>
          <div className="hero-proof"><span className="proof-icon">✦</span><div><strong>Made for your mood</strong><small>Classics or your own creation</small></div><span className="proof-divider" /><span className="proof-icon">♡</span><div><strong>Made for your kind of fun</strong><small>Customise every layer</small></div></div>
        </div>
        <div className="hero-art" aria-label="Illustration of a pizza">
          <div className="hero-sun" />
          <div className="hero-sticker sticker-top">GOOD<br />MOOD FOOD</div>
          <div className="pizza-illustration"><div className="pizza-crust"><div className="pizza-cheese"><i className="pepper p1"/><i className="pepper p2"/><i className="pepper p3"/><i className="pepper p4"/><i className="olive o1"/><i className="olive o2"/><i className="olive o3"/><i className="tomato t1"/><i className="tomato t2"/></div></div></div>
          <div className="hero-sticker sticker-bottom">100%<br />YOUR VIBE</div>
          <span className="hero-spark spark-one">✳</span><span className="hero-spark spark-two">✦</span>
        </div>
      </section>

      <section className="menu-section section-pad" id="menu">
        <div className="section-container">
          <div className="section-heading-row"><div><p className="eyebrow">THE LINE-UP</p><h2>Meet your new <span>favourites.</span></h2><p className="section-lead">A little cheesy, a little crunchy, and totally worth the first bite.</p></div><Link className="text-link menu-cart-link" to="/cart">Review your cart <span>→</span></Link></div>
          {status === "loading" && <div className="loading-note"><span className="loader" /> Getting the menu ready…</div>}
          {usingFallback && status === "failed" && <div className="api-notice"><strong>Showing the sample menu.</strong> The API couldn't be reached ({error || "connection unavailable"}). Connect the backend to load database pizzas and enable checkout.</div>}
          {usingFallback && status === "loading" && <p className="sample-note">Previewing the sample menu while we contact the API.</p>}
          <div className="pizza-grid">{pizzas.map((pizza) => <PizzaCard key={pizza._id || pizza.id || pizza.name} pizza={pizza} fallbackMode={usingFallback} />)}</div>
          <div className="menu-bottom-cta"><span>Feeling creative?</span><p>There's no wrong way to pizza.</p><a className="button button-dark" href="#builder">Build your own <span>↗</span></a></div>
        </div>
      </section>

      <PizzaBuilder />
      <About />
    </div>
  );
}

export default Home;
