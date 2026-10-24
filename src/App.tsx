import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [introFinished, setIntroFinished] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIntroFinished(true), 2800);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className="site">
      <header className="topbar">
      <a className="wordmark" href="#home">
  <img
    src="https://github.com/ibidapofortune-uk/20sinmotion-/raw/refs/heads/main/IMG_9431.PNG"
    alt="20sinmotion logo"
  />
</a>
        <span className="topbar-note">INDEPENDENT STREETWEAR</span>
        <a className="menu-link" href="#contact">CONTACT ↗</a>
      </header>

      <section className="hero" id="home">
        <div className={`intro ${introFinished ? "intro-hidden" : ""}`}>
          <span className="intro-index">EST. IN MOTION</span>
          <h1 className="intro-logo">20<span>sin</span>motion.</h1>
          <span className="intro-caption">A DIFFERENT STATE OF MIND</span>
        </div>

        <div className={`hero-content ${introFinished ? "hero-visible" : ""}`}>
          <div className="hero-copy">
            <span className="eyebrow">COLLECTION 001 — LAGOS</span>
            <h2>BUILT FOR<br />THE ONES<br />IN MOTION.</h2>
            <p>More than clothing. A different state of mind.</p>
            <a href="#collection" className="cta">
              DISCOVER THE COLLECTION ↗
            </a>
          </div>

          <div className="visual-panel">
            <div className="visual-placeholder">
              <span className="visual-number">20 / SM</span>
              <span className="visual-message">
                YOUR MOVEMENT.<br />YOUR WORLD.
              </span>
              <span className="visual-index">CAMPAIGN 001 — 2026</span>
            </div>
          </div>
        </div>

        <div className="hero-footer">
          <span>LAGOS, NIGERIA</span>
          <span>DESIGNED TO MOVE</span>
          <a href="#collection">SCROLL TO EXPLORE ↓</a>
        </div>
      </section>

      <section className="collection" id="collection">
        <div className="section-heading">
          <span>THE FIRST MOVEMENT</span>
          <span>COLLECTION 001</span>
        </div>

        <h2>Not made to blend in.</h2>
        <p className="collection-description">
          Designed for people who move differently.
        </p>

        <div className="collection-card">
          <div className="product-placeholder">
            <span>20SINMOTION</span>
            <span>THE FIRST EDITION</span>
          </div>
          <div className="product-info">
            <div>
              <h3>THE GRAPHIC TEE</h3>
              <p>First collection · Limited release</p>
            </div>
            <a href="#preorder" className="product-link">PRE-ORDER ↗</a>
          </div>
        </div>

        <a href="#preorder" className="main-cta">
          ENTER THE PRE-ORDER ↗
        </a>
      </section>

      <section className="preorder" id="preorder">
        <span className="eyebrow">YOUR NEXT MOVE</span>
        <h2>Make it yours.</h2>
        <p>
          Interested in the first collection? Contact us to enquire about
          pre-orders, sizes and availability.
        </p>
        <a href="#contact" className="cta">ENQUIRE ABOUT PRE-ORDERS ↗</a>
      </section>

      <footer className="footer" id="contact">
        <h2>20sinmotion.</h2>
        <p>BUILT FOR THE ONES IN MOTION.</p>
        <span>© 2026 20SINMOTION — LAGOS, NIGERIA</span>
      </footer>
    </main>
  );
      }
