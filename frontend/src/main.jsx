import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from 'react-router-dom';

import {
  ShoppingBag,
  MapPin,
  Phone,
  Clock3,
  Star,
  Menu as MenuIcon,
  X,
  ArrowRight,
  Fish,
  UtensilsCrossed,
  Search,
  Plus,
  Minus,
  CheckCircle2,
  Pencil,
  Trash2,
  LogOut,
  ShieldCheck,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';

import './styles.css';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
/* =========================================================
   FALLBACK DISHES
========================================================= */

const dishes = [
  {
    id: 1,
    name: 'Tandoori Crab',
    cat: 'Crab',
    price: 649,
    img: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=900&q=85',
    desc: 'Char-grilled crab marinated in Ya Basa coastal spices.',
    tag: 'Bestseller'
  },
  {
    id: 2,
    name: 'Prawn Biryani',
    cat: 'Rice & Biryani',
    price: 449,
    img: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=900&q=85',
    desc: 'Fragrant basmati rice, juicy prawns and aromatic masala.',
    tag: 'Popular'
  },
  {
    id: 3,
    name: 'Malvani Fish Curry',
    cat: 'Fish',
    price: 399,
    img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85',
    desc: 'Traditional coastal curry with coconut and Malvani spices.'
  },
  {
    id: 4,
    name: 'Prawns Masala',
    cat: 'Prawns',
    price: 469,
    img: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=900&q=85',
    desc: 'Succulent prawns tossed in a bold roasted masala.',
    tag: 'Chef Pick'
  },
  {
    id: 5,
    name: 'Fish Fry',
    cat: 'Seafood',
    price: 329,
    img: 'https://images.unsplash.com/photo-1516685018646-549198525c1b?auto=format&fit=crop&w=900&q=85',
    desc: 'Crispy coastal fish fry with a squeeze of lime.'
  },
  {
    id: 6,
    name: 'Sol Kadhi',
    cat: 'Drinks',
    price: 129,
    img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=85',
    desc: 'Cooling kokum and coconut digestive, served chilled.'
  },
  {
    id: 7,
    name: 'Chicken Tandoori',
    cat: 'Chicken',
    price: 379,
    img: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=900&q=85',
    desc: 'Smoky tandoor chicken with Ya Basa spice rub.'
  },
  {
    id: 8,
    name: 'Paneer Tikka',
    cat: 'Vegetarian',
    price: 299,
    img: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=900&q=85',
    desc: 'Charred paneer, peppers and onions with mint chutney.'
  }
];

/* =========================================================
   FALLBACK IMAGES
========================================================= */

function getFallbackImage(name) {
  const images = {
    'Tandoori Crab':
      'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=900&q=85',

    'Prawn Biryani':
      'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=900&q=85',

    'Malvani Fish Curry':
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85',

    'Prawns Masala':
      'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=900&q=85',

    'Fish Fry':
      'https://images.unsplash.com/photo-1516685018646-549198525c1b?auto=format&fit=crop&w=900&q=85',

    'Sol Kadhi':
      'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=85'
  };

  return (
    images[name] ||
    'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85'
  );
}

/* =========================================================
   APP
========================================================= */

function App() {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ya_basa_cart') || '[]'); }
    catch { return []; }
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('ya_basa_cart', JSON.stringify(cart));
  }, [cart]);

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('ya_basa_cart');
  };

  const add = (dish) => {
    setCart((currentCart) => {
      const existing = currentCart.find(
        (item) => item.id === dish.id
      );

      if (existing) {
        return currentCart.map((item) =>
          item.id === dish.id
            ? { ...item, q: item.q + 1 }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...dish,
          q: 1
        }
      ];
    });
  };

  const change = (id, amount) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                q: item.q + amount
              }
            : item
        )
        .filter((item) => item.q > 0)
    );
  };

  const total = cart.reduce(
    (sum, item) =>
      sum + Number(item.price) * item.q,
    0
  );

  return (
    <div>
      <Navbar
        count={cart.reduce(
          (sum, item) => sum + item.q,
          0
        )}
        onCart={() => setOpen(true)}
      />

      <Routes>
        <Route
          path="/"
          element={<Home add={add} />}
        />

        <Route
          path="/menu"
          element={<Menu add={add} />}
        />

        <Route
          path="/reserve"
          element={<Reserve />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

        <Route
          path="/checkout"
          element={
            <Checkout
              cart={cart}
              total={total}
            />
          }
        />

        <Route path="/payment" element={<Payment cart={cart} total={total} clearCart={clearCart} />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/my-orders" element={<MyOrders />} />

        <Route
          path="/login"
          element={<CustomerAuth mode="login" />}
        />

        <Route
          path="/register"
          element={<CustomerAuth mode="register" />}
        />


        <Route
          path="/admin"
          element={<Admin />}
        />
      </Routes>

      <Footer />

      {open && (
        <Cart
          items={cart}
          total={total}
          change={change}
          close={() => setOpen(false)}
        />
      )}
    </div>
  );
}

/* =========================================================
   NAVBAR
========================================================= */

function Navbar({ count, onCart }) {
  const [mobileOpen, setMobileOpen] =
    useState(false);

  const closeMobile = () =>
    setMobileOpen(false);

  return (
    <header className="nav">
      <div className="nav-inner">

        <Link
          to="/"
          className="brand"
          onClick={closeMobile}
        >
          <span>YA</span> BASA
          <small>KITCHEN & BAR</small>
        </Link>

        <nav
          className={
            mobileOpen
              ? 'mobile-open'
              : ''
          }
        >
          <Link
            to="/"
            onClick={closeMobile}
          >
            Home
          </Link>

          <Link
            to="/menu"
            onClick={closeMobile}
          >
            Menu
          </Link>

          <Link
            to="/reserve"
            onClick={closeMobile}
          >
            Reserve
          </Link>

          <Link
            to="/about"
            onClick={closeMobile}
          >
            About
          </Link>

          <Link
            to="/contact"
            onClick={closeMobile}
          >
            Contact
          </Link>
        </nav>

        <div className="nav-actions">

          <button
            className="cart-btn"
            onClick={onCart}
          >
            <ShoppingBag size={19} />
            <b>{count}</b>
          </button>

          <Link
            className="nav-cta"
            to="/reserve"
          >
            Reserve a Table
          </Link>

          <button
            className="hamb"
            onClick={() =>
              setMobileOpen(!mobileOpen)
            }
          >
            {mobileOpen ? (
              <X />
            ) : (
              <MenuIcon />
            )}
          </button>

        </div>
      </div>
    </header>
  );
}

/* =========================================================
   HOME
========================================================= */

function Home({ add }) {
  const [featuredDishes, setFeaturedDishes] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  useEffect(() => {
    const loadFeaturedDishes = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(
          `${API_BASE_URL}/api/menu`
        );

        if (!response.ok) {
          throw new Error(
            'Failed to load featured dishes'
          );
        }

        const result =
          await response.json();

        if (!result.success) {
          throw new Error(
            'Menu API returned an error'
          );
        }

        const items =
          result.data.map((item) => ({
            id: item.id,
            name: item.name,
            cat:
              item.category?.name ||
              'Other',
            price:
              Number(item.price),
            img:
              item.imageUrl ||
              getFallbackImage(
                item.name
              ),
            desc:
              item.description ||
              '',
            tag:
              item.isBestseller
                ? 'Bestseller'
                : undefined
          }));

        const sortedItems = [
          ...items.filter(
            (item) =>
              item.tag === 'Bestseller'
          ),
          ...items.filter(
            (item) =>
              item.tag !== 'Bestseller'
          )
        ];

        setFeaturedDishes(
          sortedItems.slice(0, 4)
        );
      } catch (err) {
        console.error(
          'Home menu loading error:',
          err
        );

        setError(
          'Unable to load featured dishes.'
        );

        setFeaturedDishes(
          dishes.slice(0, 4)
        );
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedDishes();
  }, []);

  return (
    <>
      <section className="hero">

        <div className="hero-overlay" />

        <div className="hero-content">

          <div className="eyebrow">
            <span />
            SEAFOOD SPECIAL
            <span />
          </div>

          <h1>
            Coastal fire.
            <br />
            <em>Bold flavour.</em>
          </h1>

          <p>
            Malvani soul, Goan inspiration
            and the freshest catch —
            served with a modern Ya Basa twist.
          </p>

          <div className="hero-buttons">

            <Link
              className="btn primary"
              to="/menu"
            >
              Explore Menu
              <ArrowRight size={18} />
            </Link>

            <Link
              className="btn ghost"
              to="/reserve"
            >
              Reserve a Table
            </Link>

          </div>

          <div className="rating">

            <Star
              fill="currentColor"
              size={17}
            />

            <strong>
              4.2
            </strong>

            <span>
              1,700+ reviews
            </span>

          </div>

        </div>
      </section>

      <section className="strip">

        <div>
          <Fish />
          Fresh Coastal Catch
        </div>

        <div>
          <UtensilsCrossed />
          Malvani & Goan
        </div>

        <div>
          <Clock3 />
          Dine-in · Takeaway
        </div>

        <div>
          <MapPin />
          Baner, Pune
        </div>

      </section>

      <section
        className="section"
        id="menu"
      >

        <div className="section-head">

          <div>

            <span className="eyebrow dark">
              FROM OUR KITCHEN
            </span>

            <h2>
              Signature <em>plates</em>
            </h2>

          </div>

          <Link
            to="/menu"
            className="text-link"
          >
            View full menu
            <ArrowRight size={17} />
          </Link>

        </div>

        {loading && (
          <div className="menu-status">
            <h3>
              Loading signature plates...
            </h3>

            <p>
              Fetching dishes from PostgreSQL.
            </p>
          </div>
        )}

        {!loading &&
          featuredDishes.length > 0 && (
            <div className="dish-grid">
              {featuredDishes.map(
                (dish) => (
                  <Dish
                    key={dish.id}
                    d={dish}
                    add={add}
                  />
                )
              )}
            </div>
          )}

        {!loading &&
          featuredDishes.length === 0 && (
            <div className="menu-status">
              <h3>
                No featured dishes found
              </h3>

              <p>
                Add menu items from the
                database to display them here.
              </p>
            </div>
          )}

        {!loading && error && (
          <p
            style={{
              marginTop: '15px'
            }}
          >
            {error}
          </p>
        )}

      </section>

      <section
        className="story"
        id="about"
      >

        <div className="story-img" />

        <div className="story-copy">

          <span className="eyebrow dark">
            THE YA BASA STORY
          </span>

          <h2>
            A little coast.
            <br />
            <em>A lot of character.</em>
          </h2>

          <p>
            Ya Basa brings the warmth of
            Maharashtra's coast to Baner.
            Think smoky grills, coconut-rich
            curries, fiery masalas and seafood
            that tastes like it was caught
            that morning.
          </p>

          <p>
            Come hungry. Leave with a new
            favourite.
          </p>

          <Link
            className="btn dark-btn"
            to="/reserve"
          >
            Come dine with us
            <ArrowRight size={18} />
          </Link>

        </div>

      </section>

      <section className="reviews">

        <span className="eyebrow dark">
          GUEST LOVE
        </span>

        <h2>
          “Worth the <em>visit.</em>”
        </h2>

        <p className="quote">
          “The seafood was fresh, the
          masala was brilliant and the vibe
          was exactly what we wanted for a
          relaxed dinner.”
        </p>

        <div className="review-stars">
          ★★★★★
        </div>

        <strong>
          — Happy Ya Basa guest
        </strong>

      </section>

      <section
        className="location"
        id="contact"
      >

        <div>

          <span className="eyebrow dark">
            FIND US
          </span>

          <h2>
            Come by for
            <br />
            <em>the good stuff.</em>
          </h2>

          <p>
            Murkute Complex, 45, Baner DP Road,
            <br />
            near Vijay Sales, Pallod Farms,
            <br />
            Baner, Pune, Maharashtra 411069
          </p>

          <div className="contact-row">

            <a href="tel:7058485934">
              <Phone size={18} />
              7058485934
            </a>

            <span>
              <Clock3 size={18} />
              Open for dine-in & takeaway
            </span>

          </div>

          <a
            className="btn dark-btn"
            href="https://www.google.com/maps/search/?api=1&query=Ya+Basa+Kitchen+Bar+Baner+Pune"
            target="_blank"
            rel="noreferrer"
          >
            Get Directions
            <ArrowRight size={18} />
          </a>

        </div>

        <div className="map-card">

          <MapPin size={42} />

          <strong>
            Ya Basa – Kitchen & Bar
          </strong>

          <span>
            Baner, Pune
          </span>

        </div>

      </section>
    </>
  );
}

/* =========================================================
   ABOUT PAGE
========================================================= */

function About() {
  return (
    <section className="story">

      <div className="story-img" />

      <div className="story-copy">

        <span className="eyebrow dark">
          THE YA BASA STORY
        </span>

        <h2>
          A little coast.
          <br />
          <em>A lot of character.</em>
        </h2>

        <p>
          Ya Basa brings the warmth,
          flavours and spirit of
          Maharashtra's coast to Baner,
          Pune.
        </p>

        <p>
          Our kitchen is inspired by
          Malvani and Goan coastal cooking —
          smoky grills, coconut-rich curries,
          fiery masalas and fresh seafood
          prepared with bold flavours.
        </p>

        <p>
          We believe great food should feel
          generous, memorable and full of
          character. Whether you're joining
          us for a family dinner, a casual
          meal with friends or a special
          evening, Ya Basa is here to make
          it worth remembering.
        </p>

        <p>
          Come hungry.
          <br />
          Leave with a new favourite.
        </p>

        <div
          style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            marginTop: '25px'
          }}
        >

          <Link
            className="btn dark-btn"
            to="/menu"
          >
            Explore Our Menu
            <ArrowRight size={18} />
          </Link>

          <Link
            className="btn outline"
            to="/reserve"
          >
            Reserve a Table
          </Link>

        </div>

      </div>

    </section>
  );
}

/* =========================================================
   CONTACT PAGE
========================================================= */

function Contact() {
  return (
    <section className="location">

      <div>

        <span className="eyebrow dark">
          CONTACT YA BASA
        </span>

        <h2>
          Come by for
          <br />
          <em>the good stuff.</em>
        </h2>

        <p>
          We'd love to welcome you to
          Ya Basa – Kitchen & Bar.
          <br />
          Visit us in Baner for coastal
          flavours, seafood and good food.
        </p>

        <div
          style={{
            marginTop: '25px',
            marginBottom: '25px'
          }}
        >

          <strong
            style={{
              display: 'block',
              marginBottom: '8px'
            }}
          >
            Our Address
          </strong>

          <p>
            Murkute Complex, 45,
            Baner DP Road,
            <br />
            near Vijay Sales,
            Pallod Farms,
            <br />
            Baner, Pune,
            Maharashtra 411069
          </p>

        </div>

        <div className="contact-row">

          <a href="tel:7058485934">
            <Phone size={18} />
            7058485934
          </a>

          <span>
            <Clock3 size={18} />
            Open for dine-in & takeaway
          </span>

        </div>

        <div
          style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            marginTop: '25px'
          }}
        >

          <a
            className="btn dark-btn"
            href="tel:7058485934"
          >
            <Phone size={18} />
            Call Us
          </a>

          <a
            className="btn outline"
            href="https://www.google.com/maps/search/?api=1&query=Ya+Basa+Kitchen+Bar+Baner+Pune"
            target="_blank"
            rel="noreferrer"
          >
            <MapPin size={18} />
            Get Directions
          </a>

        </div>

      </div>

      <div className="map-card">

        <MapPin size={42} />

        <strong>
          Ya Basa – Kitchen & Bar
        </strong>

        <span>
          Baner, Pune
        </span>

        <a
          href="https://www.google.com/maps/search/?api=1&query=Ya+Basa+Kitchen+Bar+Baner+Pune"
          target="_blank"
          rel="noreferrer"
          style={{
            marginTop: '15px'
          }}
        >
          Open in Google Maps
        </a>

      </div>

    </section>
  );
}

/* =========================================================
   MENU
========================================================= */

function Menu({ add }) {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');

  const [menuItems, setMenuItems] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  useEffect(() => {
    const loadMenu = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(
          `${API_BASE_URL}/api/menu`
        );

        if (!response.ok) {
          throw new Error(
            'Failed to load menu'
          );
        }

        const result =
          await response.json();

        if (!result.success) {
          throw new Error(
            'Menu API returned an error'
          );
        }

        const items =
          result.data.map((item) => ({
            id: item.id,
            name: item.name,
            cat:
              item.category?.name ||
              'Other',
            price:
              Number(item.price),
            img:
              item.imageUrl ||
              getFallbackImage(
                item.name
              ),
            desc:
              item.description ||
              '',
            tag:
              item.isBestseller
                ? 'Bestseller'
                : undefined
          }));

        setMenuItems(items);
      } catch (err) {
        console.error(
          'Menu loading error:',
          err
        );

        setError(
          'Unable to load menu. Please make sure the backend is running.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadMenu();
  }, []);

  const cats = [
    'All',
    ...new Set(
      menuItems.map(
        (dish) => dish.cat
      )
    )
  ];

  const shown =
    menuItems.filter((dish) => {

      const categoryMatch =
        cat === 'All' ||
        dish.cat === cat;

      const searchMatch =
        dish.name
          .toLowerCase()
          .includes(
            q.toLowerCase()
          );

      return (
        categoryMatch &&
        searchMatch
      );
    });

  return (
    <section className="menu-page">

      <div className="menu-hero">

        <span className="eyebrow">
          THE MENU
        </span>

        <h1>
          From the coast
          <br />
          <em>to your table.</em>
        </h1>

      </div>

      <div className="menu-tools">

        <div className="search">

          <Search size={18} />

          <input
            placeholder="Search dishes..."
            value={q}
            onChange={(e) =>
              setQ(e.target.value)
            }
          />

        </div>

        <div className="cats">

          {cats.map((category) => (

            <button
              key={category}
              className={
                cat === category
                  ? 'active'
                  : ''
              }
              onClick={() =>
                setCat(category)
              }
            >
              {category}
            </button>

          ))}

        </div>

      </div>

      <div className="section">

        {loading && (
          <div className="menu-status">
            <h3>
              Loading menu...
            </h3>

            <p>
              Fetching the latest dishes
              from Ya Basa.
            </p>
          </div>
        )}

        {!loading &&
          error && (
            <div className="menu-status">
              <h3>
                Menu unavailable
              </h3>

              <p>
                {error}
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          shown.length === 0 && (
            <div className="menu-status">
              <h3>
                No dishes found
              </h3>

              <p>
                Try another search
                or category.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          shown.length > 0 && (
            <div className="dish-grid">

              {shown.map((dish) => (

                <Dish
                  key={dish.id}
                  d={dish}
                  add={add}
                />

              ))}

            </div>
          )}

      </div>

    </section>
  );
}

/* =========================================================
   DISH CARD
========================================================= */

function Dish({ d, add }) {
  return (
    <article className="dish">

      <div className="dish-img">

        <img
          src={d.img}
          alt={d.name}
          onError={(e) => {
            e.currentTarget.src =
              getFallbackImage(
                d.name
              );
          }}
        />

        {d.tag && (
          <span>
            {d.tag}
          </span>
        )}

        <button
          onClick={() => add(d)}
          aria-label={`Add ${d.name} to cart`}
        >
          <Plus size={20} />
        </button>

      </div>

      <div className="dish-info">

        <div>

          <h3>
            {d.name}
          </h3>

          <small>
            {d.desc}
          </small>

        </div>

        <strong>
          ₹{Number(d.price)}
        </strong>

      </div>

    </article>
  );
}

/* =========================================================
   RESERVATION
========================================================= */

function Reserve() {
  const [done, setDone] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const submit = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const f = new FormData(form);

    try {
      setLoading(true);

      const mobile =
        String(
          f.get('mobile') || ''
        ).trim();

      const payload = {
        name:
          String(
            f.get('name') || ''
          ).trim(),

        /*
         * Backend route accepts phone.
         */
        phone: mobile,

        /*
         * Prisma database currently
         * uses mobile.
         *
         * Sending both keeps the
         * frontend compatible with
         * the current backend.
         */
        mobile: mobile,

        email:
          String(
            f.get('email') || ''
          ).trim(),

        date:
          f.get('date'),

        time:
          f.get('time'),

        guests:
          Number(
            f.get('guests')
          ),

        specialRequest:
          String(
            f.get(
              'specialRequest'
            ) || ''
          ).trim()
      };

      console.log(
        'Reservation payload:',
        payload
      );

      const response =
        await fetch(
          `${API_BASE_URL}/api/reservations`,
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json'
            },

            body:
              JSON.stringify(
                payload
              )
          }
        );

      const result =
        await response
          .json()
          .catch(() => ({}));

      console.log(
        'Reservation response:',
        result
      );

      if (
        !response.ok ||
        result.success === false
      ) {
        throw new Error(
          result.message ||
          `Reservation failed with status ${response.status}`
        );
      }

      setDone(true);

    } catch (error) {
      console.error(
        'Reservation error:',
        error
      );

      alert(
        `Reservation failed: ${
          error.message ||
          'Please try again.'
        }`
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="reserve-page">

      <div className="reserve-card">

        <div>

          <span className="eyebrow dark">
            TABLE RESERVATION
          </span>

          <h1>
            Make a <em>night of it.</em>
          </h1>

          <p>
            Choose your date and
            we'll take care of the rest.
          </p>

        </div>

        {done ? (

          <div className="success">

            <CheckCircle2 size={54} />

            <h2>
              Reservation request received
            </h2>

            <p>
              We'll confirm your
              table shortly.
            </p>

            <Link
              className="btn dark-btn"
              to="/"
            >
              Back home
            </Link>

          </div>

        ) : (

          <form onSubmit={submit}>

            <div className="form-grid">

              <label>
                Date

                <input
                  type="date"
                  name="date"
                  required
                />
              </label>

              <label>
                Time

                <select
                  name="time"
                  required
                >
                  <option value="">
                    Choose
                  </option>

                  <option>
                    12:30 PM
                  </option>

                  <option>
                    1:30 PM
                  </option>

                  <option>
                    7:30 PM
                  </option>

                  <option>
                    8:30 PM
                  </option>

                  <option>
                    9:30 PM
                  </option>
                </select>
              </label>

              <label>
                Guests

                <select
                  name="guests"
                  required
                >
                  <option value="2">
                    2 Guests
                  </option>

                  <option value="3">
                    3 Guests
                  </option>

                  <option value="4">
                    4 Guests
                  </option>

                  <option value="6">
                    6 Guests
                  </option>

                  <option value="8">
                    8 Guests
                  </option>
                </select>
              </label>

              <label>
                Name

                <input
                  name="name"
                  placeholder="Your name"
                  required
                />
              </label>

              <label>
                Mobile

                <input
                  name="mobile"
                  placeholder="10-digit mobile"
                  required
                />
              </label>

              <label>
                Email

                <input
                  name="email"
                  type="email"
                  placeholder="you@email.com"
                />
              </label>

            </div>

            <label>
              Special request

              <textarea
                name="specialRequest"
                placeholder="Birthday, anniversary, seating preference..."
              />

            </label>

            <button
              className="btn dark-btn"
              type="submit"
              disabled={loading}
            >
              {loading
                ? 'Sending...'
                : 'Request reservation'}

              {!loading && (
                <ArrowRight size={18} />
              )}
            </button>

          </form>

        )}

      </div>

    </section>
  );
}


/* =========================================================
   CUSTOMER LOGIN / REGISTER
========================================================= */

function CustomerAuth({ mode = "login" }) {
  const isRegister = mode === "register";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const endpoint = isRegister
        ? "/api/auth/register"
        : "/api/auth/login";

      const body = isRegister
        ? {
            name,
            email,
            password,
            phone
          }
        : {
            email,
            password
          };

      const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(body)
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Authentication failed"
        );
      }

      /*
       * Login returns a JWT token.
       * Store it using the exact key expected
       * by the Checkout component.
       */
      if (result.token) {
        localStorage.setItem(
          "ya_basa_token",
          result.token
        );
      }

      if (result.user) {
        localStorage.setItem(
          "ya_basa_user",
          JSON.stringify(result.user)
        );
      }

      if (result.token) {
        const returnTo = sessionStorage.getItem("ya_basa_return_to") || "/checkout";
        sessionStorage.removeItem("ya_basa_return_to");
        window.location.href = returnTo;
      } else {
        window.location.href = "/login";
      }
    } catch (err) {
      setError(
        err.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 20px",
        background: "#f7f3ed"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          background: "#ffffff",
          padding: "40px",
          borderRadius: "18px",
          boxShadow:
            "0 15px 45px rgba(0,0,0,0.10)"
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "30px"
          }}
        >
          <div
            style={{
              fontSize: "13px",
              letterSpacing: "3px",
              fontWeight: "700",
              color: "#9b6b35",
              marginBottom: "10px"
            }}
          >
            YA BASA
          </div>

          <h1
            style={{
              margin: "0 0 10px",
              fontSize: "34px"
            }}
          >
            {isRegister
              ? "Create Account"
              : "Welcome Back"}
          </h1>

          <p
            style={{
              margin: 0,
              color: "#777"
            }}
          >
            {isRegister
              ? "Create your account to order from Ya Basa."
              : "Login to continue with your order."}
          </p>
        </div>

        {error && (
          <div
            style={{
              background: "#fff0f0",
              color: "#b42318",
              border: "1px solid #f3b4b4",
              padding: "12px 14px",
              borderRadius: "8px",
              marginBottom: "20px"
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={submit}>

          {isRegister && (
            <>
              <label
                style={{
                  display: "block",
                  marginBottom: "7px",
                  fontWeight: "600"
                }}
              >
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Enter your name"
                required
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "13px",
                  marginBottom: "18px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "15px"
                }}
              />

              <label
                style={{
                  display: "block",
                  marginBottom: "7px",
                  fontWeight: "600"
                }}
              >
                Phone
              </label>

              <input
                type="tel"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                placeholder="Enter phone number"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "13px",
                  marginBottom: "18px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "15px"
                }}
              />
            </>
          )}

          <label
            style={{
              display: "block",
              marginBottom: "7px",
              fontWeight: "600"
            }}
          >
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="you@example.com"
            required
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "13px",
              marginBottom: "18px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "15px"
            }}
          />

          <label
            style={{
              display: "block",
              marginBottom: "7px",
              fontWeight: "600"
            }}
          >
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="Enter password"
            required
            minLength={6}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "13px",
              marginBottom: "24px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "15px"
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              border: "none",
              borderRadius: "8px",
              background: "#171717",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: "700",
              cursor: loading
                ? "not-allowed"
                : "pointer",
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading
              ? "Please wait..."
              : isRegister
              ? "Create Account"
              : "Login"}
          </button>
        </form>

        <div
          style={{
            textAlign: "center",
            marginTop: "25px",
            color: "#666"
          }}
        >
          {isRegister
            ? "Already have an account?"
            : "Don't have an account?"}

          <button
            type="button"
            onClick={() => {
              window.location.href = isRegister
                ? "/login"
                : "/register";
            }}
            style={{
              marginLeft: "7px",
              border: "none",
              background: "none",
              color: "#9b6b35",
              fontWeight: "700",
              cursor: "pointer"
            }}
          >
            {isRegister
              ? "Login"
              : "Create Account"}
          </button>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   CHECKOUT
========================================================= */
function Checkout({ cart, total }) {
  const [customer, setCustomer] = useState(null);
  const [mobile, setMobile] = useState("");
  const [orderType, setOrderType] = useState("DELIVERY");
  const [address, setAddress] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");

  useEffect(() => {
    try {
      const token = localStorage.getItem("ya_basa_token");
      const savedUser = localStorage.getItem("ya_basa_user");
      if (!token || !savedUser) {
        sessionStorage.setItem("ya_basa_return_to", "/checkout");
        window.location.replace("/login");
        return;
      }
      const user = JSON.parse(savedUser);
      setCustomer(user);
      setMobile(user.phone || "");
      const saved = sessionStorage.getItem("ya_basa_checkout");
      if (saved) {
        const c = JSON.parse(saved);
        setMobile(c.mobile || user.phone || "");
        setOrderType(c.orderType || "DELIVERY");
        setAddress(c.address || "");
        setSpecialInstructions(c.specialInstructions || "");
      }
    } catch {
      localStorage.removeItem("ya_basa_token");
      localStorage.removeItem("ya_basa_user");
      window.location.replace("/login");
    }
  }, []);

  const submit = (e) => {
    e.preventDefault();
    if (!cart.length) return alert("Your cart is empty.");
    if (!mobile.trim()) return alert("Please enter your mobile number.");
    if (orderType === "DELIVERY" && !address.trim()) return alert("Please enter your delivery address.");
    sessionStorage.setItem("ya_basa_checkout", JSON.stringify({
      customer, mobile: mobile.trim(), orderType,
      address: address.trim(), specialInstructions: specialInstructions.trim()
    }));
    window.location.href = "/payment";
  };

  if (!customer) return <section className="checkout"><div><span className="eyebrow dark">CHECKOUT</span><h1>Checking your <em>account.</em></h1></div></section>;

  return <section className="checkout">
    <div>
      <span className="eyebrow dark">CHECKOUT</span>
      <h1>Almost <em>there.</em></h1>
      <p>Complete your order details and continue to payment.</p>
      <div style={{marginBottom:"24px",padding:"16px",borderRadius:"12px",background:"#f5f5f5"}}>
        <strong>Logged in as</strong><div style={{marginTop:"6px"}}>{customer.name}</div><div style={{marginTop:"4px",opacity:.7}}>{customer.email}</div>
      </div>
      <form onSubmit={submit}>
        <div className="form-grid">
          <label>Customer Name<input value={customer.name || ""} readOnly /></label>
          <label>Mobile<input type="tel" value={mobile} onChange={e=>setMobile(e.target.value)} required /></label>
          <label>Email<input value={customer.email || ""} readOnly /></label>
          <label>Order Type<select value={orderType} onChange={e=>setOrderType(e.target.value)}><option value="DELIVERY">Delivery</option><option value="TAKEAWAY">Takeaway</option></select></label>
        </div>
        <label>{orderType === "DELIVERY" ? "Delivery Address" : "Pickup Note"}<textarea value={address} onChange={e=>setAddress(e.target.value)} required={orderType === "DELIVERY"} /></label>
        <label>Special Instructions<textarea value={specialInstructions} onChange={e=>setSpecialInstructions(e.target.value)} placeholder="Any cooking or order instructions..." /></label>
        <button className="btn dark-btn" type="submit">Continue to Payment · ₹{total}<ArrowRight size={18}/></button>
      </form>
    </div>
    <OrderSummary cart={cart} total={total}/>
  </section>;
}

function OrderSummary({cart,total}) {
  return <aside className="order-box"><h3>Your order</h3>{cart.map(item=><div className="order-line" key={item.id}><span>{item.q} × {item.name}</span><strong>₹{item.q*Number(item.price)}</strong></div>)}<hr/><div className="order-total"><span>Total</span><strong>₹{total}</strong></div></aside>;
}

function Payment({ cart, total, clearCart }) {
  const [method,setMethod]=useState("COD");
  const [checkout,setCheckout]=useState(null);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
 useEffect(() => {
  if (!localStorage.getItem("ya_basa_token")) {
    sessionStorage.setItem(
      "ya_basa_return_to",
      "/checkout"
    );

    window.location.replace("/login");
    return;
  }

  try {
    const c = JSON.parse(
      sessionStorage.getItem("ya_basa_checkout") || "null"
    );

    if (!c) {
      window.location.replace("/checkout");
      return;
    }

    setCheckout(c);
  } catch {
    window.location.replace("/checkout");
  }
}, []);

  const cod=async()=>{
    try{
      setLoading(true);setError("");
      const token=localStorage.getItem("ya_basa_token");
      const r=await fetch(`${API_BASE_URL}/api/orders`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},body:JSON.stringify({items:cart.map(i=>({menuItemId:i.id,quantity:Number(i.q),price:Number(i.price)})),totalAmount:Number(total),address:checkout.address||"",phone:checkout.mobile,mobile:checkout.mobile,type:checkout.orderType,specialInstructions:checkout.specialInstructions||"",paymentMethod:"COD"})});
      const result=await r.json().catch(()=>({}));
      if(r.status===401){localStorage.removeItem("ya_basa_token");localStorage.removeItem("ya_basa_user");return window.location.replace("/login");}
      if(!r.ok||!result.success) throw new Error(result.message||"Order failed");
      const o=result.data||result.order||{};
      sessionStorage.setItem("ya_basa_last_order",JSON.stringify({id:o.id||"",customerName:o.customerName||checkout.customer?.name||"",total:Number(o.total??total),paymentMethod:"Cash on Delivery",paymentStatus:o.paymentStatus||"PENDING",status:o.status||"PENDING"}));
      sessionStorage.removeItem("ya_basa_checkout");clearCart();window.location.href="/order-success";
    }catch(e){setError(e.message||"Order failed. Please try again.");}finally{setLoading(false);}
  };
  if(!checkout) return <section className="checkout"><div><span className="eyebrow dark">PAYMENT</span><h1>Preparing <em>payment.</em></h1></div></section>;
  return <section className="checkout"><div><span className="eyebrow dark">PAYMENT</span><h1>Choose how to <em>pay.</em></h1><p>Confirm your payment method before we send your order to the kitchen.</p>
    {error&&<div style={{padding:"14px",marginBottom:"20px",background:"#fff0f0",color:"#b42318",borderRadius:"8px"}}>{error}</div>}
    <div style={{display:"grid",gap:"12px",margin:"25px 0"}}>
      <label style={{padding:"18px",border:method==="COD"?"2px solid #171717":"1px solid #ddd",borderRadius:"12px"}}><input type="radio" checked={method==="COD"} onChange={()=>setMethod("COD")}/> <strong>Cash on Delivery</strong></label>
      <label style={{padding:"18px",border:method==="ONLINE"?"2px solid #171717":"1px solid #ddd",borderRadius:"12px"}}><input type="radio" checked={method==="ONLINE"} onChange={()=>setMethod("ONLINE")}/> <strong>Online Payment</strong><div style={{marginTop:"5px",opacity:.7}}>Razorpay requires backend test keys/endpoints.</div></label>
    </div>
    <button className="btn dark-btn" disabled={loading} onClick={method==="COD"?cod:()=>setError("Online payment needs Razorpay backend endpoints and test keys. Cash on Delivery is available now.")}>{loading?"Placing Order...":method==="COD"?`Place COD Order · ₹${total}`:`Pay Online · ₹${total}`} {!loading&&<ArrowRight size={18}/>}</button>
  </div><OrderSummary cart={cart} total={total}/></section>;
}

function OrderSuccess(){
  const [order,setOrder]=useState(null);useEffect(()=>{try{setOrder(JSON.parse(sessionStorage.getItem("ya_basa_last_order")||"null"));}catch{}},[]);
  if(!order)return <section className="reserve-page"><div className="reserve-card"><div className="success"><h2>No recent order found</h2><Link className="btn dark-btn" to="/my-orders">View My Orders</Link></div></div></section>;
  return <section className="reserve-page"><div className="reserve-card"><div className="success"><CheckCircle2 size={54}/><h2>Order placed successfully</h2><p>Thanks {order.customerName}. Your order has been received.</p>{order.id&&<div className="order-line"><span>Order ID</span><strong>{order.id}</strong></div>}<div className="order-line"><span>Total</span><strong>₹{order.total}</strong></div><div className="order-line"><span>Payment</span><strong>{order.paymentMethod}</strong></div><div className="order-line"><span>Payment Status</span><strong>{order.paymentStatus}</strong></div><div className="order-line"><span>Order Status</span><strong>{order.status}</strong></div><div style={{display:"flex",gap:"12px",justifyContent:"center",flexWrap:"wrap",marginTop:"25px"}}><Link className="btn dark-btn" to="/my-orders">View My Orders</Link><Link className="btn outline" to="/menu">Continue Browsing Menu</Link></div></div></div></section>;
}

function MyOrders(){
  const [orders,setOrders]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState("");
  useEffect(()=>{(async()=>{const token=localStorage.getItem("ya_basa_token");if(!token)return window.location.replace("/login");try{const r=await fetch(`${API_BASE_URL}/api/orders`,{headers:{Authorization:`Bearer ${token}`}});const x=await r.json().catch(()=>({}));if(r.status===401){localStorage.removeItem("ya_basa_token");localStorage.removeItem("ya_basa_user");return window.location.replace("/login");}if(!r.ok||!x.success)throw new Error(x.message||"Unable to load orders");setOrders(Array.isArray(x.data)?x.data:[]);}catch(e){setError(e.message);}finally{setLoading(false);}})();},[]);
  return <section className="menu-page"><div className="menu-hero"><span className="eyebrow">YOUR ORDERS</span><h1>My <em>Orders.</em></h1></div><div className="section">{loading?<div className="menu-status"><h3>Loading your orders...</h3></div>:error?<div className="menu-status"><h3>Unable to load orders</h3><p>{error}</p></div>:!orders.length?<div className="menu-status"><h3>No orders yet</h3><Link className="btn dark-btn" to="/menu">Explore Menu</Link></div>:<div style={{display:"grid",gap:"20px"}}>{orders.map(o=><div className="panel" key={o.id}><div style={{display:"flex",justifyContent:"space-between",gap:"20px",flexWrap:"wrap"}}><div><span className="eyebrow dark">ORDER</span><h3>{o.id}</h3><small>{o.createdAt?new Date(o.createdAt).toLocaleString():""}</small></div><div><strong>{o.status}</strong><div>₹{Number(o.total||0)}</div></div></div>{(o.items||[]).map(i=><div className="order-line" key={i.id}><span>{i.quantity} × {i.menuItem?.name||"Menu item"}</span><strong>₹{Number(i.unitPrice||0)*Number(i.quantity||0)}</strong></div>)}<hr/><div className="order-line"><span>Order Type</span><strong>{o.type||"—"}</strong></div><div className="order-line"><span>Payment Status</span><strong>{o.paymentStatus||"PENDING"}</strong></div></div>)}</div>}</div></section>;
}

/* =========================================================
   CART
========================================================= */

function Cart({
  items,
  total,
  change,
  close
}) {
  return (
    <div
      className="cart-backdrop"
      onClick={close}
    >

      <aside
        className="cart"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        <div className="cart-head">

          <h2>
            Your order
          </h2>

          <button onClick={close}>
            <X />
          </button>

        </div>

        {items.length ? (

          items.map((item) => (

            <div
              className="cart-item"
              key={item.id}
            >

              <img
                src={item.img}
                alt={item.name}
              />

              <div>

                <strong>
                  {item.name}
                </strong>

                <span>
                  ₹
                  {Number(
                    item.price
                  )}
                </span>

                <div className="qty">

                  <button
                    onClick={() =>
                      change(
                        item.id,
                        -1
                      )
                    }
                  >
                    <Minus size={14} />
                  </button>

                  {item.q}

                  <button
                    onClick={() =>
                      change(
                        item.id,
                        1
                      )
                    }
                  >
                    <Plus size={14} />
                  </button>

                </div>

              </div>

            </div>

          ))

        ) : (

          <div className="empty">

            <ShoppingBag size={42} />

            <p>
              Your basket is waiting
              for something delicious.
            </p>

          </div>

        )}

        <div className="cart-bottom">

          <div>

            <span>
              Subtotal
            </span>

            <strong>
              ₹{total}
            </strong>

          </div>

          <Link
            to={localStorage.getItem("ya_basa_token") && localStorage.getItem("ya_basa_user") ? "/checkout" : "/login"}
            onClick={() => { sessionStorage.setItem("ya_basa_return_to", "/checkout"); close(); }}
            className="btn dark-btn"
          >
            Checkout
            <ArrowRight size={18} />
          </Link>

        </div>

      </aside>

    </div>
  );
}

/* =========================================================
   ADMIN LOGIN
========================================================= */

function AdminLogin({ onLogin }) {
  const [email, setEmail] =
    useState('admin@yabasa.com');

  const [password, setPassword] =
    useState('Admin@123');

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');

      const response =
        await fetch(
          `${API_BASE_URL}/api/auth/login`,
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json'
            },

            body: JSON.stringify({
              email,
              password
            })
          }
        );

      const result =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
          'Login failed'
        );
      }

      if (
        result.user.role !== 'ADMIN' &&
        result.user.role !== 'STAFF'
      ) {
        throw new Error(
          'This account does not have admin access'
        );
      }

      localStorage.setItem(
        'ya_basa_admin_token',
        result.token
      );

      localStorage.setItem(
        'ya_basa_admin_user',
        JSON.stringify(
          result.user
        )
      );

      onLogin(result.user);

    } catch (error) {
      console.error(error);

      setError(
        error.message ||
        'Admin login failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      style={{
        minHeight: '75vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px'
      }}
    >

      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          background: '#fff',
          padding: '40px',
          borderRadius: '18px',
          boxShadow:
            '0 20px 60px rgba(0,0,0,.12)'
        }}
      >

        <div
          style={{
            textAlign: 'center',
            marginBottom: '30px'
          }}
        >

          <ShieldCheck
            size={52}
          />

          <h1>
            Admin Login
          </h1>

          <p>
            Ya Basa Restaurant
            Administration
          </p>

        </div>

        {error && (
          <div
            style={{
              padding: '12px',
              marginBottom: '20px',
              background: '#ffe7e7',
              color: '#b00020',
              borderRadius: '8px'
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={submit}>

          <label>
            Email

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />
          </label>

          <label>
            Password

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              required
            />
          </label>

          <button
            type="submit"
            className="btn dark-btn"
            disabled={loading}
            style={{
              width: '100%',
              marginTop: '15px'
            }}
          >
            {loading
              ? 'Signing in...'
              : 'Login to Admin'}

            {!loading && (
              <ArrowRight size={18} />
            )}
          </button>

        </form>

        <p
          style={{
            marginTop: '20px',
            fontSize: '13px',
            opacity: .65,
            textAlign: 'center'
          }}
        >
          Admin access only
        </p>

      </div>

    </section>
  );
}

/* =========================================================
   ADMIN PANEL
========================================================= */

function Admin() {
  const [user, setUser] =
    useState(null);

  const [checking, setChecking] =
    useState(true);

  useEffect(() => {
    const savedUser =
      localStorage.getItem(
        'ya_basa_admin_user'
      );

    const token =
      localStorage.getItem(
        'ya_basa_admin_token'
      );

    if (savedUser && token) {
      try {
        setUser(
          JSON.parse(savedUser)
        );
      } catch {
        localStorage.removeItem(
          'ya_basa_admin_user'
        );

        localStorage.removeItem(
          'ya_basa_admin_token'
        );
      }
    }

    setChecking(false);
  }, []);

  const logout = () => {
    localStorage.removeItem(
      'ya_basa_admin_token'
    );

    localStorage.removeItem(
      'ya_basa_admin_user'
    );

    setUser(null);
  };

  if (checking) {
    return (
      <section
        style={{
          padding: '100px',
          textAlign: 'center'
        }}
      >
        Loading admin...
      </section>
    );
  }

  if (!user) {
    return (
      <AdminLogin
        onLogin={(loggedInUser) =>
          setUser(loggedInUser)
        }
      />
    );
  }

  return (
    <AdminDashboard
      user={user}
      logout={logout}
    />
  );
}

/* =========================================================
   ADMIN DASHBOARD
========================================================= */

function AdminDashboard({
  user,
  logout
}) {
  const [menuItems, setMenuItems] =
    useState([]);

  const [categories, setCategories] =
    useState([]);

  const [orders, setOrders] =
    useState([]);

  const [ordersLoading, setOrdersLoading] =
    useState(true);

  const [updatingOrderId, setUpdatingOrderId] =
    useState(null);

  const [reservations, setReservations] =
    useState([]);

  const [reservationsLoading, setReservationsLoading] =
    useState(true);

  const [updatingReservationId, setUpdatingReservationId] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState('');

  const [message, setMessage] =
    useState('');

  const [editingId, setEditingId] =
    useState(null);

  const emptyForm = {
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    categoryId: '',
    isVeg: false,
    isSpicy: false,
    isBestseller: false,
    isAvailable: true
  };

  const [form, setForm] =
    useState(emptyForm);

  const token =
    localStorage.getItem(
      'ya_basa_admin_token'
    );

  const headers = {
    'Content-Type':
      'application/json',

    Authorization:
      `Bearer ${token}`
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      const [
        menuResponse,
        categoryResponse
      ] = await Promise.all([
        fetch(
          `${API_BASE_URL}/api/admin/menu`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        ),

        fetch(
          `${API_BASE_URL}/api/admin/categories`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        )
      ]);

      const menuResult =
        await menuResponse.json();

      const categoryResult =
        await categoryResponse.json();

      if (
        menuResponse.status === 401 ||
        menuResponse.status === 403
      ) {
        logout();
        return;
      }

      if (
        !menuResponse.ok ||
        !menuResult.success
      ) {
        throw new Error(
          menuResult.message ||
          'Failed to load menu'
        );
      }

      if (
        !categoryResponse.ok ||
        !categoryResult.success
      ) {
        throw new Error(
          categoryResult.message ||
          'Failed to load categories'
        );
      }

      setMenuItems(
        menuResult.data
      );

      setCategories(
        categoryResult.data
      );

    } catch (error) {
      console.error(error);

      setError(
        error.message ||
        'Failed to load admin data'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    loadOrders();
    loadReservations();
  }, []);

  const updateForm = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const submitDish = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError('');
      setMessage('');

      if (!form.name.trim()) {
        throw new Error(
          'Dish name is required'
        );
      }

      if (
        form.price === '' ||
        Number(form.price) < 0
      ) {
        throw new Error(
          'Enter a valid price'
        );
      }

      if (!form.categoryId) {
        throw new Error(
          'Please select a category'
        );
      }

      const url = editingId
        ? `${API_BASE_URL}/api/admin/menu/${editingId}`
        : `${API_BASE_URL}/api/admin/menu`;

      const method =
        editingId
          ? 'PUT'
          : 'POST';

      const response =
        await fetch(url, {
          method,
          headers,

          body: JSON.stringify({
            name:
              form.name.trim(),

            description:
              form.description.trim(),

            price:
              Number(form.price),

            imageUrl:
              form.imageUrl.trim(),

            categoryId:
              form.categoryId,

            isVeg:
              Boolean(form.isVeg),

            isSpicy:
              Boolean(form.isSpicy),

            isBestseller:
              Boolean(
                form.isBestseller
              ),

            isAvailable:
              Boolean(
                form.isAvailable
              )
          })
        });

      const result =
        await response.json();

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        logout();
        return;
      }

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
          'Failed to save dish'
        );
      }

      setMessage(
        editingId
          ? 'Dish updated successfully.'
          : 'Dish added successfully.'
      );

      resetForm();

      await loadData();

    } catch (error) {
      console.error(error);

      setError(
        error.message ||
        'Failed to save dish'
      );
    } finally {
      setSaving(false);
    }
  };

  const editDish = (item) => {
    setEditingId(item.id);

    setForm({
      name:
        item.name || '',

      description:
        item.description || '',

      price:
        Number(item.price),

      imageUrl:
        item.imageUrl || '',

      categoryId:
        item.categoryId || '',

      isVeg:
        Boolean(item.isVeg),

      isSpicy:
        Boolean(item.isSpicy),

      isBestseller:
        Boolean(
          item.isBestseller
        ),

      isAvailable:
        Boolean(
          item.isAvailable
        )
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const deleteDish = async (item) => {
    const confirmed =
      window.confirm(
        `Delete "${item.name}" permanently?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setError('');
      setMessage('');

      const response =
        await fetch(
          `${API_BASE_URL}/api/admin/menu/${item.id}`,
          {
            method: 'DELETE',
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      const result =
        await response.json();

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        logout();
        return;
      }

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
          'Failed to delete dish'
        );
      }

      setMessage(
        'Dish deleted successfully.'
      );

      await loadData();

    } catch (error) {
      console.error(error);

      setError(
        error.message ||
        'Failed to delete dish'
      );
    }
  };

  const quickUpdate = async (
    item,
    changes
  ) => {
    try {
      setError('');
      setMessage('');

      const response =
        await fetch(
          `${API_BASE_URL}/api/admin/menu/${item.id}`,
          {
            method: 'PUT',
            headers,

            body: JSON.stringify(
              changes
            )
          }
        );

      const result =
        await response.json();

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        logout();
        return;
      }

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
          'Update failed'
        );
      }

      await loadData();

    } catch (error) {
      console.error(error);

      setError(
        error.message ||
        'Update failed'
      );
    }
  };

  const loadOrders = async () => {
    try {
      setOrdersLoading(true);
      setError('');

      const response = await fetch(
        `${API_BASE_URL}/api/admin/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const result =
        await response.json();

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        logout();
        return;
      }

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
          'Failed to load orders'
        );
      }

      setOrders(
        Array.isArray(result.data)
          ? result.data
          : []
      );
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
        'Failed to load orders'
      );
    } finally {
      setOrdersLoading(false);
    }
  };

  const updateOrderStatus = async (
    orderId,
    status
  ) => {
    try {
      setUpdatingOrderId(orderId);
      setError('');
      setMessage('');

      const response = await fetch(
        `${API_BASE_URL}/api/admin/orders/${orderId}/status`,
        {
          method: 'PATCH',
          headers,
          body: JSON.stringify({
            status
          })
        }
      );

      const result =
        await response.json();

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        logout();
        return;
      }

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
          'Failed to update order'
        );
      }

      setOrders((current) =>
        current.map((order) =>
          order.id === orderId
            ? result.data
            : order
        )
      );

      setMessage(
        `Order status changed to ${status}.`
      );
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
        'Failed to update order'
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const loadReservations = async () => {
    try {
      setReservationsLoading(true);
      setError('');

      const response = await fetch(
        `${API_BASE_URL}/api/admin/reservations`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const result =
        await response.json();

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        logout();
        return;
      }

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
          'Failed to load reservations'
        );
      }

      setReservations(
        Array.isArray(result.data)
          ? result.data
          : []
      );
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
        'Failed to load reservations'
      );
    } finally {
      setReservationsLoading(false);
    }
  };

  const updateReservationStatus = async (
    reservationId,
    status
  ) => {
    try {
      setUpdatingReservationId(
        reservationId
      );
      setError('');
      setMessage('');

      const response = await fetch(
        `${API_BASE_URL}/api/admin/reservations/${reservationId}/status`,
        {
          method: 'PATCH',
          headers,
          body: JSON.stringify({
            status
          })
        }
      );

      const result =
        await response.json();

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        logout();
        return;
      }

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
          'Failed to update reservation'
        );
      }

      setReservations((current) =>
        current.map((reservation) =>
          reservation.id === reservationId
            ? result.data
            : reservation
        )
      );

      setMessage(
        `Reservation status changed to ${status.replaceAll('_', ' ')}.`
      );
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
        'Failed to update reservation'
      );
    } finally {
      setUpdatingReservationId(null);
    }
  };

  return (
    <section className="admin">

      <aside>

        <div className="brand">
          <span>YA</span> BASA
        </div>

        <p>
          ADMIN CONSOLE
        </p>

        <a
          className="sel"
          href="#overview"
        >
          Overview
        </a>

        <a href="#menu-management">
          Menu
        </a>

        <a href="#orders">
          Orders
        </a>

        <a href="#reservations">
          Reservations
        </a>

        <a href="#customers">
          Customers
        </a>

        <a href="#settings">
          Settings
        </a>

        <button
          onClick={logout}
          style={{
            marginTop: '30px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'transparent',
            border: 0,
            cursor: 'pointer'
          }}
        >
          <LogOut size={17} />
          Logout
        </button>

      </aside>

      <main id="overview">

        <div className="admin-top">

          <div>

            <span className="eyebrow dark">
              RESTAURANT ADMIN
            </span>

            <h1>
              Good evening,
              <em> Chef.</em>
            </h1>

            <p>
              Welcome, {user.name}
            </p>

          </div>

          <div
            style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center'
            }}
          >

            <Link
              to="/"
              className="btn outline"
            >
              View website
            </Link>

            <button
              className="btn dark-btn"
              onClick={logout}
            >
              <LogOut size={17} />
              Logout
            </button>

          </div>

        </div>

        <div className="stats">

          <Stat
            title="Menu Items"
            value={
              String(
                menuItems.length
              )
            }
            change="Live from PostgreSQL"
          />

          <Stat
            title="Available"
            value={
              String(
                menuItems.filter(
                  (x) =>
                    x.isAvailable
                ).length
              )
            }
            change="Currently visible"
          />

          <Stat
            title="Bestsellers"
            value={
              String(
                menuItems.filter(
                  (x) =>
                    x.isBestseller
                ).length
              )
            }
            change="Featured dishes"
          />

          <Stat
            title="Categories"
            value={
              String(
                categories.length
              )
            }
            change="Database categories"
          />

        </div>

        {error && (
          <div
            style={{
              padding: '15px',
              marginBottom: '20px',
              background: '#ffe7e7',
              color: '#a40000',
              borderRadius: '8px'
            }}
          >
            {error}
          </div>
        )}

        {message && (
          <div
            style={{
              padding: '15px',
              marginBottom: '20px',
              background: '#e7f8ec',
              color: '#146c2e',
              borderRadius: '8px'
            }}
          >
            {message}
          </div>
        )}

        {/* ==========================================
            MENU FORM
        ========================================== */}

        <div
          className="panel"
          id="menu-management"
          style={{
            marginBottom: '30px'
          }}
        >

          <div
            style={{
              display: 'flex',
              justifyContent:
                'space-between',
              alignItems: 'center',
              gap: '15px',
              marginBottom: '25px'
            }}
          >

            <div>

              <span className="eyebrow dark">
                MENU MANAGEMENT
              </span>

              <h2>
                {editingId
                  ? 'Edit dish'
                  : 'Add new dish'}
              </h2>

            </div>

            {editingId && (
              <button
                className="btn outline"
                type="button"
                onClick={resetForm}
              >
                Cancel edit
              </button>
            )}

          </div>

          <form
            onSubmit={submitDish}
          >

            <div className="form-grid">

              <label>
                Dish name

                <input
                  value={form.name}
                  onChange={(e) =>
                    updateForm(
                      'name',
                      e.target.value
                    )
                  }
                  placeholder="Example: Butter Garlic Prawns"
                  required
                />
              </label>

              <label>
                Price

                <input
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) =>
                    updateForm(
                      'price',
                      e.target.value
                    )
                  }
                  placeholder="499"
                  required
                />
              </label>

              <label>
                Category

                <select
                  value={
                    form.categoryId
                  }
                  onChange={(e) =>
                    updateForm(
                      'categoryId',
                      e.target.value
                    )
                  }
                  required
                >

                  <option value="">
                    Select category
                  </option>

                  {categories.map(
                    (category) => (
                      <option
                        key={
                          category.id
                        }
                        value={
                          category.id
                        }
                      >
                        {category.name}
                      </option>
                    )
                  )}

                </select>

              </label>

              <label>
                Image URL

                <input
                  value={
                    form.imageUrl
                  }
                  onChange={(e) =>
                    updateForm(
                      'imageUrl',
                      e.target.value
                    )
                  }
                  placeholder="https://..."
                />
              </label>

            </div>

            <label>
              Description

              <textarea
                value={
                  form.description
                }
                onChange={(e) =>
                  updateForm(
                    'description',
                    e.target.value
                  )
                }
                placeholder="Describe the dish..."
              />

            </label>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '20px',
                margin:
                  '20px 0'
              }}
            >

              <label
                style={{
                  display: 'flex',
                  flexDirection:
                    'row',
                  alignItems:
                    'center',
                  gap: '8px'
                }}
              >

                <input
                  type="checkbox"
                  checked={
                    form.isVeg
                  }
                  onChange={(e) =>
                    updateForm(
                      'isVeg',
                      e.target.checked
                    )
                  }
                />

                Vegetarian

              </label>

              <label
                style={{
                  display: 'flex',
                  flexDirection:
                    'row',
                  alignItems:
                    'center',
                  gap: '8px'
                }}
              >

                <input
                  type="checkbox"
                  checked={
                    form.isSpicy
                  }
                  onChange={(e) =>
                    updateForm(
                      'isSpicy',
                      e.target.checked
                    )
                  }
                />

                Spicy

              </label>

              <label
                style={{
                  display: 'flex',
                  flexDirection:
                    'row',
                  alignItems:
                    'center',
                  gap: '8px'
                }}
              >

                <input
                  type="checkbox"
                  checked={
                    form.isBestseller
                  }
                  onChange={(e) =>
                    updateForm(
                      'isBestseller',
                      e.target.checked
                    )
                  }
                />

                Bestseller

              </label>

              <label
                style={{
                  display: 'flex',
                  flexDirection:
                    'row',
                  alignItems:
                    'center',
                  gap: '8px'
                }}
              >

                <input
                  type="checkbox"
                  checked={
                    form.isAvailable
                  }
                  onChange={(e) =>
                    updateForm(
                      'isAvailable',
                      e.target.checked
                    )
                  }
                />

                Available

              </label>

            </div>

            <button
              className="btn dark-btn"
              type="submit"
              disabled={saving}
            >

              {saving ? (
                'Saving...'
              ) : editingId ? (
                <>
                  <Save size={18} />
                  Update dish
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Add dish
                </>
              )}

            </button>

          </form>

        </div>

        {/* ==========================================
            MENU TABLE
        ========================================== */}

        <div
          className="panel"
          style={{
            marginBottom: '30px'
          }}
        >

          <div
            style={{
              display: 'flex',
              justifyContent:
                'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}
          >

            <div>

              <span className="eyebrow dark">
                DATABASE
              </span>

              <h2>
                Menu items
              </h2>

            </div>

            <button
              className="btn outline"
              onClick={loadData}
              disabled={loading}
            >
              {loading
                ? 'Loading...'
                : 'Refresh'}
            </button>

          </div>

          {loading ? (

            <div
              style={{
                padding: '40px',
                textAlign: 'center'
              }}
            >
              Loading menu from
              PostgreSQL...
            </div>

          ) : menuItems.length === 0 ? (

            <div
              style={{
                padding: '40px',
                textAlign: 'center'
              }}
            >
              No menu items found.
            </div>

          ) : (

            <div
              style={{
                overflowX:
                  'auto'
              }}
            >

              <table
                style={{
                  width: '100%',
                  borderCollapse:
                    'collapse'
                }}
              >

                <thead>

                  <tr>

                    <th
                      style={{
                        textAlign:
                          'left',
                        padding:
                          '12px'
                      }}
                    >
                      Dish
                    </th>

                    <th
                      style={{
                        textAlign:
                          'left',
                        padding:
                          '12px'
                      }}
                    >
                      Category
                    </th>

                    <th
                      style={{
                        textAlign:
                          'left',
                        padding:
                          '12px'
                      }}
                    >
                      Price
                    </th>

                    <th
                      style={{
                        textAlign:
                          'left',
                        padding:
                          '12px'
                      }}
                    >
                      Status
                    </th>

                    <th
                      style={{
                        textAlign:
                          'left',
                        padding:
                          '12px'
                      }}
                    >
                      Bestseller
                    </th>

                    <th
                      style={{
                        textAlign:
                          'left',
                        padding:
                          '12px'
                      }}
                    >
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {menuItems.map(
                    (item) => (

                      <tr
                        key={
                          item.id
                        }
                        style={{
                          borderTop:
                            '1px solid #ddd'
                        }}
                      >

                        <td
                          style={{
                            padding:
                              '12px'
                          }}
                        >

                          <div
                            style={{
                              display:
                                'flex',
                              alignItems:
                                'center',
                              gap:
                                '12px'
                            }}
                          >

                            <img
                              src={
                                item.imageUrl ||
                                getFallbackImage(
                                  item.name
                                )
                              }
                              alt={
                                item.name
                              }
                              style={{
                                width:
                                  '55px',
                                height:
                                  '55px',
                                objectFit:
                                  'cover',
                                borderRadius:
                                  '8px'
                              }}
                              onError={(
                                e
                              ) => {
                                e.currentTarget.src =
                                  getFallbackImage(
                                    item.name
                                  );
                              }}
                            />

                            <div>

                              <strong>
                                {item.name}
                              </strong>

                              <small
                                style={{
                                  display:
                                    'block',
                                  opacity:
                                    '.65',
                                  marginTop:
                                    '4px'
                                }}
                              >
                                {item.description ||
                                  'No description'}
                              </small>

                            </div>

                          </div>

                        </td>

                        <td
                          style={{
                            padding:
                              '12px'
                          }}
                        >
                          {item.category?.name ||
                            'Other'}
                        </td>

                        <td
                          style={{
                            padding:
                              '12px'
                          }}
                        >
                          <strong>
                            ₹
                            {Number(
                              item.price
                            )}
                          </strong>
                        </td>

                        <td
                          style={{
                            padding:
                              '12px'
                          }}
                        >

                          <button
                            type="button"
                            onClick={() =>
                              quickUpdate(
                                item,
                                {
                                  isAvailable:
                                    !item.isAvailable
                                }
                              )
                            }
                            style={{
                              border:
                                'none',
                              cursor:
                                'pointer',
                              padding:
                                '7px 10px',
                              borderRadius:
                                '20px'
                            }}
                          >

                            {item.isAvailable ? (
                              <>
                                <Eye
                                  size={
                                    15
                                  }
                                />
                                Available
                              </>
                            ) : (
                              <>
                                <EyeOff
                                  size={
                                    15
                                  }
                                />
                                Hidden
                              </>
                            )}

                          </button>

                        </td>

                        <td
                          style={{
                            padding:
                              '12px'
                          }}
                        >

                          <button
                            type="button"
                            onClick={() =>
                              quickUpdate(
                                item,
                                {
                                  isBestseller:
                                    !item.isBestseller
                                }
                              )
                            }
                            style={{
                              border:
                                'none',
                              cursor:
                                'pointer',
                              padding:
                                '7px 10px',
                              borderRadius:
                                '20px'
                            }}
                          >

                            {item.isBestseller
                              ? '⭐ Yes'
                              : '☆ No'}

                          </button>

                        </td>

                        <td
                          style={{
                            padding:
                              '12px'
                          }}
                        >

                          <div
                            style={{
                              display:
                                'flex',
                              gap:
                                '8px'
                            }}
                          >

                            <button
                              type="button"
                              onClick={() =>
                                editDish(
                                  item
                                )
                              }
                              title="Edit"
                              style={{
                                border:
                                  'none',
                                cursor:
                                  'pointer',
                                padding:
                                  '8px'
                              }}
                            >
                              <Pencil
                                size={
                                  17
                                }
                              />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                deleteDish(
                                  item
                                )
                              }
                              title="Delete"
                              style={{
                                border:
                                  'none',
                                cursor:
                                  'pointer',
                                padding:
                                  '8px'
                              }}
                            >
                              <Trash2
                                size={
                                  17
                                }
                              />
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

        {/* ==========================================
            OTHER ADMIN SECTIONS
        ========================================== */}

        <div
          className="admin-grid"
          id="orders"
        >

          <div className="panel">

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '15px',
                marginBottom: '20px',
                flexWrap: 'wrap'
              }}
            >
              <div>
                <span className="eyebrow dark">
                  LIVE ORDERS
                </span>

                <h3>
                  Orders
                </h3>
              </div>

              <button
                type="button"
                className="btn outline"
                onClick={loadOrders}
                disabled={ordersLoading}
              >
                {ordersLoading
                  ? 'Loading...'
                  : 'Refresh'}
              </button>
            </div>

            {ordersLoading ? (
              <p>
                Loading orders...
              </p>
            ) : orders.length === 0 ? (
              <p>
                No orders received yet.
              </p>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gap: '18px'
                }}
              >
                {orders.map((order) => {
                  const statuses =
                    order.type === 'TAKEAWAY'
                      ? [
                          'PENDING',
                          'CONFIRMED',
                          'PREPARING',
                          'READY_FOR_PICKUP',
                          'PICKED_UP',
                          'CANCELLED'
                        ]
                      : [
                          'PENDING',
                          'CONFIRMED',
                          'PREPARING',
                          'READY',
                          'OUT_FOR_DELIVERY',
                          'DELIVERED',
                          'CANCELLED'
                        ];

                  return (
                    <div
                      key={order.id}
                      style={{
                        border:
                          '1px solid rgba(0,0,0,0.12)',
                        borderRadius: '16px',
                        padding: '18px'
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent:
                            'space-between',
                          alignItems:
                            'flex-start',
                          gap: '20px',
                          flexWrap: 'wrap'
                        }}
                      >
                        <div>
                          <small>
                            ORDER
                          </small>

                          <h4
                            style={{
                              margin:
                                '5px 0 10px',
                              wordBreak:
                                'break-all'
                            }}
                          >
                            {order.id}
                          </h4>

                          <strong>
                            {order.customerName}
                          </strong>

                          <div>
                            {order.mobile}
                          </div>

                          {order.email && (
                            <div>
                              {order.email}
                            </div>
                          )}
                        </div>

                        <div
                          style={{
                            textAlign: 'right'
                          }}
                        >
                          <strong
                            style={{
                              fontSize: '20px'
                            }}
                          >
                            ₹{Number(
                              order.total || 0
                            )}
                          </strong>

                          <div>
                            {order.type}
                          </div>

                          <small>
                            {order.createdAt
                              ? new Date(
                                  order.createdAt
                                ).toLocaleString()
                              : ''}
                          </small>
                        </div>
                      </div>

                      <hr />

                      <div>
                        {(order.items || []).map(
                          (item) => (
                            <div
                              className="order-line"
                              key={item.id}
                            >
                              <span>
                                {item.quantity} ×{' '}
                                {item.menuItem?.name ||
                                  'Menu item'}
                              </span>

                              <strong>
                                ₹
                                {Number(
                                  item.unitPrice ||
                                    0
                                ) *
                                  Number(
                                    item.quantity ||
                                      0
                                  )}
                              </strong>
                            </div>
                          )
                        )}
                      </div>

                      {order.address && (
                        <div
                          style={{
                            marginTop: '12px'
                          }}
                        >
                          <strong>
                            Address:
                          </strong>{' '}
                          {order.address}
                        </div>
                      )}

                      {order.specialInstructions && (
                        <div
                          style={{
                            marginTop: '8px'
                          }}
                        >
                          <strong>
                            Instructions:
                          </strong>{' '}
                          {
                            order.specialInstructions
                          }
                        </div>
                      )}

                      <div
                        style={{
                          marginTop: '15px',
                          display: 'grid',
                          gap: '7px'
                        }}
                      >
                        <div>
                          <strong>
                            Payment:
                          </strong>{' '}
                          {order.payment?.provider ||
                            'COD'}
                        </div>

                        <div>
                          <strong>
                            Payment Status:
                          </strong>{' '}
                          {order.payment?.status ||
                            order.paymentStatus ||
                            'PENDING'}
                        </div>

                        <div>
                          <strong>
                            Current Status:
                          </strong>{' '}
                          {order.status}
                        </div>
                      </div>

                      <div
                        style={{
                          marginTop: '16px'
                        }}
                      >
                        <label>
                          <strong>
                            Change Order Status
                          </strong>
                        </label>

                        <select
                          value={order.status}
                          disabled={
                            updatingOrderId ===
                            order.id
                          }
                          onChange={(e) =>
                            updateOrderStatus(
                              order.id,
                              e.target.value
                            )
                          }
                          style={{
                            width: '100%',
                            marginTop: '8px',
                            padding: '12px',
                            borderRadius: '8px'
                          }}
                        >
                          {statuses.map(
                            (status) => (
                              <option
                                key={status}
                                value={status}
                              >
                                {status.replaceAll(
                                  '_',
                                  ' '
                                )}
                              </option>
                            )
                          )}
                        </select>

                        {updatingOrderId ===
                          order.id && (
                          <small>
                            Updating...
                          </small>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>

          <div
            className="panel"
            id="reservations"
          >

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '15px',
                marginBottom: '20px',
                flexWrap: 'wrap'
              }}
            >
              <div>
                <span className="eyebrow dark">
                  LIVE RESERVATIONS
                </span>

                <h3>
                  Reservations
                </h3>
              </div>

              <button
                type="button"
                className="btn outline"
                onClick={loadReservations}
                disabled={reservationsLoading}
              >
                {reservationsLoading
                  ? 'Loading...'
                  : 'Refresh'}
              </button>
            </div>

            {reservationsLoading ? (
              <p>
                Loading reservations...
              </p>
            ) : reservations.length === 0 ? (
              <p>
                No reservations received yet.
              </p>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gap: '18px'
                }}
              >
                {reservations.map(
                  (reservation) => {
                    const statuses = [
                      'PENDING',
                      'CONFIRMED',
                      'SEATED',
                      'COMPLETED',
                      'CANCELLED',
                      'NO_SHOW'
                    ];

                    return (
                      <div
                        key={reservation.id}
                        style={{
                          border:
                            '1px solid rgba(0,0,0,0.12)',
                          borderRadius: '16px',
                          padding: '18px'
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent:
                              'space-between',
                            alignItems:
                              'flex-start',
                            gap: '20px',
                            flexWrap: 'wrap'
                          }}
                        >
                          <div>
                            <small>
                              RESERVATION
                            </small>

                            <h4
                              style={{
                                margin:
                                  '5px 0 10px',
                                wordBreak:
                                  'break-all'
                              }}
                            >
                              {reservation.id}
                            </h4>

                            <strong>
                              {reservation.name}
                            </strong>

                            <div>
                              {reservation.mobile}
                            </div>

                            {reservation.email && (
                              <div>
                                {reservation.email}
                              </div>
                            )}
                          </div>

                          <div
                            style={{
                              textAlign: 'right'
                            }}
                          >
                            <strong
                              style={{
                                fontSize: '18px'
                              }}
                            >
                              {reservation.guests}{' '}
                              {Number(
                                reservation.guests
                              ) === 1
                                ? 'Guest'
                                : 'Guests'}
                            </strong>

                            <div>
                              {reservation.date
                                ? new Date(
                                    reservation.date
                                  ).toLocaleDateString()
                                : ''}
                            </div>

                            <div>
                              {reservation.time}
                            </div>
                          </div>
                        </div>

                        {reservation.table && (
                          <div
                            style={{
                              marginTop: '12px'
                            }}
                          >
                            <strong>
                              Table:
                            </strong>{' '}
                            {reservation.table.name}
                          </div>
                        )}

                        {reservation.specialRequest && (
                          <div
                            style={{
                              marginTop: '12px'
                            }}
                          >
                            <strong>
                              Special Request:
                            </strong>{' '}
                            {
                              reservation.specialRequest
                            }
                          </div>
                        )}

                        <div
                          style={{
                            marginTop: '15px'
                          }}
                        >
                          <strong>
                            Current Status:
                          </strong>{' '}
                          {reservation.status.replaceAll(
                            '_',
                            ' '
                          )}
                        </div>

                        <div
                          style={{
                            marginTop: '16px'
                          }}
                        >
                          <label>
                            <strong>
                              Change Reservation Status
                            </strong>
                          </label>

                          <select
                            value={
                              reservation.status
                            }
                            disabled={
                              updatingReservationId ===
                              reservation.id
                            }
                            onChange={(e) =>
                              updateReservationStatus(
                                reservation.id,
                                e.target.value
                              )
                            }
                            style={{
                              width: '100%',
                              marginTop: '8px',
                              padding: '12px',
                              borderRadius: '8px'
                            }}
                          >
                            {statuses.map(
                              (status) => (
                                <option
                                  key={status}
                                  value={status}
                                >
                                  {status.replaceAll(
                                    '_',
                                    ' '
                                  )}
                                </option>
                              )
                            )}
                          </select>

                          {updatingReservationId ===
                            reservation.id && (
                            <small>
                              Updating...
                            </small>
                          )}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}

          </div>

        </div>

      </main>

    </section>
  );
}

/* =========================================================
   STAT
========================================================= */

function Stat({
  title,
  value,
  change
}) {
  return (
    <div className="stat">

      <span>
        {title}
      </span>

      <strong>
        {value}
      </strong>

      <small>
        {change}
      </small>

    </div>
  );
}

/* =========================================================
   FOOTER
========================================================= */

function Footer() {
  return (
    <footer>

      <div>

        <div className="brand">
          <span>YA</span> BASA
        </div>

        <p>
          Seafood Special · Baner, Pune
        </p>

      </div>

      <div>

        <strong>
          QUICK LINKS
        </strong>

        <Link to="/menu">
          Menu
        </Link>

        <Link to="/reserve">
          Reserve a table
        </Link>

        <Link to="/about">
          About
        </Link>

        <Link to="/contact">
          Contact
        </Link>

      </div>

      <div>

        <strong>
          VISIT
        </strong>

        <p>
          Murkute Complex,
          Baner DP Road
          <br />
          Pune 411069
        </p>

        <a href="tel:7058485934">
          7058485934
        </a>

      </div>

    </footer>
  );
}

/* =========================================================
   START APPLICATION
========================================================= */

createRoot(
  document.getElementById('root')
).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);