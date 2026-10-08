const fs = require("fs");

const file = "frontend/src/main.jsx";

let code = fs.readFileSync(file, "utf8");

/* Add customer routes */
const oldRoutes = `
        <Route
          path="/checkout"
          element={
            <Checkout
              cart={cart}
              total={total}
            />
          }
        />`;

const newRoutes = `
        <Route
          path="/checkout"
          element={
            <Checkout
              cart={cart}
              total={total}
            />
          }
        />

        <Route
          path="/login"
          element={<CustomerAuth mode="login" />}
        />

        <Route
          path="/register"
          element={<CustomerAuth mode="register" />}
        />`;

if (!code.includes('path="/login"')) {
  if (!code.includes(oldRoutes)) {
    console.error("Could not find checkout route.");
    process.exit(1);
  }

  code = code.replace(oldRoutes, newRoutes);
}

/* Add CustomerAuth component before Checkout */
const marker = `/* =========================================================
   CHECKOUT
========================================================= */`;

if (!code.includes("function CustomerAuth(")) {
  const customerAuth = `
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
        \`\${API_BASE_URL}\${endpoint}\`,
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
        window.location.href = "/checkout";
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

`;

  if (!code.includes(marker)) {
    console.error("Could not find checkout component marker.");
    process.exit(1);
  }

  code = code.replace(
    marker,
    customerAuth + marker
  );
}

fs.writeFileSync(file, code, "utf8");

console.log("Customer Login/Register added successfully.");
