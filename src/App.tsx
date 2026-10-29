import { useEffect, useState } from "react";
import "./App.css";

const VIDEO_ONE = "/lv_0_20261024185045.mp4";
const VIDEO_TWO = "/lv_0_20261024185001.mp4";

const LOGO =
  "https://raw.githubusercontent.com/ibidapofortune-uk/20sinmotion-/main/IMG_9431.PNG";

// TEMPORARY PRICE — change when your final price is confirmed.
const TEE_PRICE = 25000;

const PRODUCTS = [
  {
    id: "tee-1",
    name: "THE FIRST TEE",
    image: "/lv_0_20261025135636.jpg",
    description: "Collection 001 · First edition",
  },
  {
    id: "tee-2",
    name: "THE MOVEMENT TEE",
    image: "/lv_0_20261025135524.jpg",
    description: "Collection 001 · Limited release",
  },
  {
    id: "tee-3",
    name: "THE STATEMENT TEE",
    image: "/lv_0_20261025122800.jpg",
    description: "Collection 001 · Independent streetwear",
  },
];

const SIZES = ["S", "M", "L", "XL", "XXL"];

type CartItem = {
  productId: string;
  size: string;
  quantity: number;
};

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

function Header() {
  const isCollectionPage = window.location.pathname.startsWith("/collection");

  return (
    <header className="topbar">
      <a className="wordmark" href="/" aria-label="20sinmotion home">
        <img src={LOGO} alt="20sinmotion logo" />
      </a>

      <span className="topbar-note">INDEPENDENT STREETWEAR</span>

      <nav className="main-navigation" aria-label="Main navigation">
        <a
          className={`menu-link ${!isCollectionPage ? "active" : ""}`}
          href="/"
          aria-current={!isCollectionPage ? "page" : undefined}
        >
          HOME
        </a>

        <a
          className={`menu-link ${isCollectionPage ? "active" : ""}`}
          href="/collection"
          aria-current={isCollectionPage ? "page" : undefined}
        >
          SHOP ↗
        </a>
      </nav>
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
    setActiveVideo((current) => (current === 0 ? 1 : 0));
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
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>(
    {},
  );
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [fulfilment, setFulfilment] = useState("delivery");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [orderNote, setOrderNote] = useState("");

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const total = cart.reduce(
    (sum, item) => sum + TEE_PRICE * item.quantity,
    0,
  );

  function addToCart(productId: string) {
    const size = selectedSizes[productId];

    if (!size) {
      window.alert("Please select a T-shirt size first.");
      return;
    }

    setCart((current) => {
      const existing = current.find(
        (item) => item.productId === productId && item.size === size,
      );

      if (existing) {
        return current.map((item) =>
          item.productId === productId && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...current, { productId, size, quantity: 1 }];
    });

    setCartOpen(true);
  }

  function changeQuantity(productId: string, size: string, change: number) {
    setCart((current) =>
      current
        .map((item) =>
          item.productId === productId && item.size === size
            ? { ...item, quantity: item.quantity + change }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function continueToWhatsApp() {
  if (!customerName.trim() || !customerPhone.trim()) {
    window.alert("Please enter your name and phone number.");
    return;
  }

  if (fulfilment === "delivery" && !deliveryAddress.trim()) {
    window.alert("Please enter your delivery address.");
    return;
  }

  const orderLines = cart.map((item) => {
    const product = PRODUCTS.find((p) => p.id === item.productId);
    return `${product?.name} — Size ${item.size} × ${item.quantity}`;
  });

  const itemsText = orderLines.join("\n");
  const totalText = formatPrice(total);

  const message = [
    "Hello 20sinmotion! I'd like to place an order.",
    "",
    `Name: ${customerName}`,
    `Phone: ${customerPhone}`,
    `Fulfilment: ${
      fulfilment === "delivery"
        ? "Delivery"
        : "Pickup (arrange after ordering)"
    }`,
    ...(fulfilment === "delivery"
      ? [`Delivery address: ${deliveryAddress}`]
      : []),
    "",
    ...orderLines,
    "",
    `Items total: ${totalText}`,
    "Please confirm delivery/pickup arrangements and the final amount.",
    ...(orderNote.trim() ? [`Note: ${orderNote.trim()}`] : []),
  ].join("\n");

  const whatsappNumber = "2347031629769";

  // Open WhatsApp immediately so the browser does not block it.
  window.open(
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
    "_blank",
    "noopener,noreferrer",
  );

  // Send the order details to the email notification backend.
  void fetch("/api/order-notification", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: customerName.trim(),
      phone: customerPhone.trim(),
      fulfilment:
        fulfilment === "delivery" ? "Delivery" : "Pickup",
      address: fulfilment === "delivery" ? deliveryAddress.trim() : "",
      items: itemsText,
      total: totalText,
      note: orderNote.trim(),
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Email notification failed");
      }
    })
    .catch((error) => {
      console.error("Order email notification failed:", error);
    });
  }

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
        <span className="collection-edition">
          INDEPENDENT STREETWEAR · LAGOS
        </span>
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

        <div className="shop-toolbar">
          <span>THREE PIECES. ONE MOVEMENT.</span>
          <button
            type="button"
            className="cart-toggle"
            onClick={() => setCartOpen(!cartOpen)}
          >
            BAG ({itemCount}) ↗
          </button>
        </div>
        <button
  type="button"
  className="floating-cart-button"
  onClick={() => {
    setCartOpen(true);
    setTimeout(() => {
      document.getElementById("cart-panel")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 150);
  }}
  aria-label={`Open shopping bag with ${itemCount} items`}
>
  <span>YOUR BAG</span>
  <span className="floating-cart-count">{itemCount}</span>
  <span>↗</span>
</button>

        <div className="product-grid">
          {PRODUCTS.map((product, index) => (
            <article className="product-card" key={product.id}>
              <div className="product-image-wrap">
                <img
                  className="product-image"
                  src={product.image}
                  alt={product.name}
                  loading={index === 0 ? "eager" : "lazy"}
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
                <span className="product-index">0{index + 1} / 03</span>
              </div>

              <div className="product-info">
                <div>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <p className="product-price">{formatPrice(TEE_PRICE)}</p>
                  <p className="temporary-price">TEMPORARY DISPLAY PRICE</p>
                </div>
              </div>

              <label className="size-label" htmlFor={`size-${product.id}`}>
                SELECT SIZE
              </label>
              <select
                id={`size-${product.id}`}
                className="size-select"
                value={selectedSizes[product.id] || ""}
                onChange={(event) =>
                  setSelectedSizes((current) => ({
                    ...current,
                    [product.id]: event.target.value,
                  }))
                }
              >
                <option value="">Choose a size</option>
                {SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="product-link add-to-cart"
                onClick={() => addToCart(product.id)}
              >
                ADD TO BAG ↗
              </button>
            </article>
          ))}
        </div>

        {cartOpen && (
          <section id="cart-panel" className="cart-panel" aria-label="Shopping bag">
            <div className="section-heading">
              <span>YOUR BAG</span>
              <button
                type="button"
                className="text-button"
                onClick={() => setCartOpen(false)}
              >
                CLOSE ×
              </button>
            </div>

            {cart.length === 0 ? (
              <p>Your bag is empty. Choose a piece from the collection.</p>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => {
                    const product = PRODUCTS.find(
                      (p) => p.id === item.productId,
                    );

                    return (
                      <div
                        className="cart-item"
                        key={`${item.productId}-${item.size}`}
                      >
                        <div>
                          <strong>{product?.name}</strong>
                          <p>Size {item.size}</p>
                          <p>{formatPrice(TEE_PRICE)} each</p>
                        </div>

                        <div className="quantity-controls">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() =>
                              changeQuantity(item.productId, item.size, -1)
                            }
                          >
                            −
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() =>
                              changeQuantity(item.productId, item.size, 1)
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="cart-total">
                  <span>ITEMS TOTAL</span>
                  <strong>{formatPrice(total)}</strong>
                </div>
                <p className="checkout-note">
                  Delivery charges, if applicable, will be confirmed before
                  payment.
                </p>

                <button
                  type="button"
                  className="cta checkout-button"
                  onClick={() => {
                    setCheckoutOpen(true);
                    setCartOpen(false);
                  }}
                >
                  CONTINUE TO CHECKOUT ↗
                </button>
              </>
            )}
          </section>
        )}

        {checkoutOpen && (
          <section className="checkout-panel" id="checkout">
            <div className="section-heading">
              <span>CHECKOUT</span>
              <button
                type="button"
                className="text-button"
                onClick={() => setCheckoutOpen(false)}
              >
                CLOSE ×
              </button>
            </div>

            <h2>Almost yours.</h2>
            <p>
              Enter your details so we can confirm your order and fulfilment
              arrangements.
            </p>

            <form
              className="checkout-form"
              onSubmit={(event) => {
                event.preventDefault();
                continueToWhatsApp();
              }}
            >
              <label htmlFor="customer-name">FULL NAME</label>
              <input
                id="customer-name"
                autoComplete="name"
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                required
              />

              <label htmlFor="customer-phone">PHONE NUMBER</label>
              <input
                id="customer-phone"
                type="tel"
                autoComplete="tel"
                value={customerPhone}
                onChange={(event) => setCustomerPhone(event.target.value)}
                required
              />

              <label htmlFor="fulfilment">FULFILMENT METHOD</label>
              <select
                id="fulfilment"
                className="size-select"
                value={fulfilment}
                onChange={(event) => setFulfilment(event.target.value)}
              >
                <option value="delivery">Delivery</option>
                <option value="pickup">Pickup — arrange after ordering</option>
              </select>

              {fulfilment === "delivery" && (
                <>
                  <label htmlFor="delivery-address">DELIVERY ADDRESS</label>
                  <textarea
                    id="delivery-address"
                    autoComplete="street-address"
                    value={deliveryAddress}
                    onChange={(event) =>
                      setDeliveryAddress(event.target.value)
                    }
                    required
                    rows={3}
                  />
                </>
              )}

              <label htmlFor="order-note">ORDER NOTE (OPTIONAL)</label>
              <textarea
                id="order-note"
                value={orderNote}
                onChange={(event) => setOrderNote(event.target.value)}
                rows={2}
              />

              <div className="cart-total">
                <span>ITEMS TOTAL</span>
                <strong>{formatPrice(total)}</strong>
              </div>

              <p className="checkout-note">
                This step sends your order request to WhatsApp. It does not
                collect payment yet. Your final total will be confirmed before
                you pay.
              </p>

              <button type="submit" className="cta checkout-button">
                SEND ORDER REQUEST ↗
              </button>
            </form>
          </section>
        )}

        <section className="preorder" id="preorder">
          <span className="eyebrow">YOUR NEXT MOVE</span>
          <h2>Make it yours.</h2>
          <p>
            The first collection is here. Choose your piece, select your size,
            and send an order request.
          </p>
          <a className="cta" href="#collection">
            EXPLORE THE COLLECTION ↑
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
  const isCollectionPage =
    window.location.pathname.replace(/\/+$/, "") === "/collection";

  return isCollectionPage ? <CollectionPage /> : <HomePage />;
    }
