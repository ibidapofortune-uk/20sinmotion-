import { useEffect, useState } from "react";
import "./App.css";

const VIDEO_ONE = "/lv_0_20261024185045.mp4";
const VIDEO_TWO = "/lv_0_20261024185001.mp4";

const LOGO =
  "https://raw.githubusercontent.com/ibidapofortune-uk/20sinmotion-/main/IMG_9431.PNG";

function Header() {
  return (
    <header className="topbar">
      <a className="wordmark" href="/" aria-label="20sinmotion home">
        <img src={LOGO} alt="20sinmotion logo" />
      </a>

      <span className="topbar-note">INDEPENDENT STREETWEAR</span>

      <a className="menu-link" href="/collection">
        SHOP ↗
      </a>
    </header>
  );
}

function HomePage() {
  const [introFinished, setIntroFinished] = useState(false);
  const [activeVideo, setActiveVideo] = useState(0);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIntroFinished(true), 2400);
    return () => window.clearTimeout(timer);
  }, []);

  const handleVideoEnd = () => {
    if (activeVideo === 0) {
      setActiveVideo(1);
    } else {
      setActiveVideo(0);
    }
  };

  return (
    <main className="site">
      <Header />

      <section className="hero" id="home">
        <div className={`intro ${introFinished ? "intro-hidden" : ""}`}>
          <span className="intro-index">EST. IN MOTION</span>
          <h1 className="intro-logo">
            20<span>sin</span>motion.
          </h1>
          <span className="intro-caption">A DIFFERENT STATE OF MIND</span>
        </div>

        <div className={`hero-content ${introFinished ? "hero-visible" : ""}`}>
          <div className="hero-copy">
            <span className="eyebrow">COLLECTION 001 — LAGOS, NIGERIA</span>

            <h2>
              BUILT FOR
              <br />
              THE ONES
              <br />
              IN MOTION.
            </h2>

            <p>More than clothing. A different state of mind.</p>

            <a href="/collection" className="cta">
              ENTER THE COLLECTION ↗
            </a>
          </div>

          <div className="visual-panel">
            {!videoFailed ? (
              <video
                key={activeVideo}
                className="campaign-video"
                src={activeVideo === 0 ? VIDEO_ONE : VIDEO_TWO}
                autoPlay
                muted
                playsInline
                onEnded={handleVideoEnd}
                onError={() => setVideoFailed(true)}
                aria-label={`20sinmotion fashion campaign video ${activeVideo + 1}`}
              />
            ) : (
              <div className="visual-placeholder">
                <span className="visual-number">20 / SM</span>
                <span className="visual-message">
                  YOUR MOVEMENT.
                  <br />
                  YOUR WORLD.
                </span>
                <span className="visual-index">CAMPAIGN 001 — 2026</span>
              </div>
            )}

            <span className="video-label">
              CAMPAIGN 00{activeVideo + 1} / 02
            </span>
          </div>
        </div>

        <div className="hero-footer">
          <span>LAGOS, NIGERIA</span>
          <span>DESIGNED TO MOVE</span>
          <a href="/collection">EXPLORE COLLECTION ↓</a>
        </div>
      </section>

      <section className="brand-statement">
        <span className="eyebrow">A DIFFERENT STATE OF MIND</span>
        <h2>
          MOVE DIFFERENT.
          <br />
          LIVE IN MOTION.
        </h2>
        <a className="main-cta" href="/collection">
          DISCOVER THE COLLECTION ↗
        </a>
      </section>

      <footer className="footer" id="contact">
        <h2>20sinmotion.</h2>
        <p>BUILT FOR THE ONES IN MOTION.</p>
        <span>© 2026 20SINMOTION — LAGOS, NIGERIA</span>
      </footer>
    </main>
  );
}

function CollectionPage() {
  return (
    <main className="site collection-page">
      <Header />

      <section className="collection-hero">
        <span className="eyebrow">20SINMOTION — COLLECTION 001</span>
        <h1>
          THE FIRST
          <br />
          MOVEMENT.
        </h1>
        <p>Designed for people who move differently.</p>
        <span className="collection-edition">INDEPENDENT STREETWEAR · LAGOS</span>
      </section>

      <section className="collection" id="collection">
        <div className="section-heading">
          <span>THE COLLECTION</span>
          <span>001 / 2026</span>
        </div>

        <h2>Not made to blend in.</h2>
        <p className="collection-description">
          The first movement starts here.
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
              <p>Price and availability confirmed when ordering.</p>
            </div>

            <a
              href="https://wa.me/"
              className="product-link"
              target="_blank"
              rel="noreferrer"
            >
              ENQUIRE ↗
            </a>
          </div>
        </div>

        <section className="preorder" id="preorder">
          <span className="eyebrow">YOUR NEXT MOVE</span>
          <h2>Make it yours.</h2>
          <p>
            Interested in the first collection? Contact us to enquire about
            pre-orders, sizes, prices, and availability.
          </p>
          <a
            href="https://wa.me/"
            className="cta"
            target="_blank"
            rel="noreferrer"
          >
            ENQUIRE ABOUT PRE-ORDERS ↗
          </a>
        </section>
      </section>

      <footer className="footer" id="contact">
        <h2>20sinmotion.</h2>
        <p>BUILT FOR THE ONES IN MOTION.</p>
        <a
          href="https://instagram.com/"
          target="_blank"
          rel="noreferrer"
        >
          FOLLOW THE MOVEMENT ON INSTAGRAM ↗
        </a>
        <span>© 2026 20SINMOTION — LAGOS, NIGERIA</span>
      </footer>
    </main>
  );
}

export default function App() {
  const isCollectionPage = window.location.pathname.replace(/\/+$/, "") === "/collection";

  return isCollectionPage ? <CollectionPage /> : <HomePage />;
}
