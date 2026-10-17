import "./About.css";

function About() {
  return (
    <section className="about-section section-pad" id="about">
      <div className="section-container">
        <div className="about-heading">
          <p className="eyebrow">A LITTLE SUNSHINE IN EVERY SLICE</p>
          <h2>Good pizza.<br /><span>Good energy.</span></h2>
          <p className="section-lead">PizzaNee is a playful, Bengaluru-inspired pizza concept built around freedom, creativity, and making your food your own.</p>
        </div>

        <div className="about-grid">
          <article className="about-card"><span className="about-number">01 / THE IDEA</span><h3>Make it yours</h3><p>Choose a favourite from the menu or build a pizza from the base up. Your combinations, your call.</p></article>
          <article className="about-card"><span className="about-number">02 / THE EXPERIENCE</span><h3>Simple and personal</h3><p>Explore the menu, customise ingredients, manage your cart, and move through a streamlined checkout.</p></article>
          <article className="about-card"><span className="about-number">03 / THE SPIRIT</span><h3>Joy without limits</h3><p>Inspired by sunshine, freedom, and a little bit of playful mischief—without taking pizza too seriously.</p></article>
        </div>

        <div className="about-founder">
          <div className="founder-mark" aria-hidden="true">N.</div>
          <div><p className="eyebrow">THE CREATOR BEHIND THE PROJECT</p><h3>Nikhil Mugali</h3><p className="founder-role">Creator & Full-Stack Developer</p><p>PizzaNee was built by Nikhil Mugali as a personal software portfolio project, bringing together a React interface, a custom pizza builder, an Express API, MongoDB order storage, and Stripe test checkout.</p></div>
        </div>

        <aside className="demo-notice"><strong>Portfolio project notice</strong><p>PizzaNee is a fictional brand created to demonstrate software development. It is not an operating restaurant and does not fulfil real food orders. Checkout is for Stripe test mode only.</p></aside>
      </div>
    </section>
  );
}

export default About;
