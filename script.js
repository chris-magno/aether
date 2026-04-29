// ----- Product Data -----
const products = [
  {
    id: "ae1",
    name: "Æ-1",
    price: 1299,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
    description: "The Aether Æ-1. Ultra-minimalist design with Neural Core 6 and all-day focus tuning.",
    variants: ["Obsidian Black", "Cloud Silver", "Aura Blue"],
    stock: true
  },
  {
    id: "aetherPods",
    name: "Æ Pods",
    price: 249,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    description: "Seamless sound integration with Æ devices and adaptive spatial balance.",
    variants: ["Single Color"],
    stock: true
  },
  {
    id: "ae2",
    name: "Æ-2",
    price: 1599,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80",
    description: "Extended architecture with dual-layer glass, adaptive core, and thermal precision.",
    variants: ["Graphite", "Mist"],
    stock: true
  },
  {
    id: "aetherCase",
    name: "Æ Shell",
    price: 119,
    image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=80",
    description: "Precision shell with soft-edge profile, ceramic finish, and impact micro-buffering.",
    variants: ["Obsidian", "Sand"],
    stock: true
  },
  {
    id: "aetherWatch",
    name: "Æ Time",
    price: 499,
    image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=900&q=80",
    description: "Minimal chronos with neural-assisted focus modes and breathable titanium frame.",
    variants: ["Lunar", "Onyx"],
    stock: true
  },
  {
    id: "aetherTab",
    name: "Æ Tab",
    price: 799,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=900&q=80",
    description: "Glass-laminate tablet built for clarity, flow, and studio-grade pen response.",
    variants: ["Graphite", "Silver"],
    stock: true
  },
  {
    id: "aetherCam",
    name: "Æ Lens",
    price: 899,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80",
    description: "Precision optics for studio-grade capture with low-light stability.",
    variants: ["Black"],
    stock: true
  },
  {
    id: "aetherKeyboard",
    name: "Æ Keys",
    price: 199,
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80",
    description: "Minimal keyboard with soft-travel tactile feel and silent mechanical switches.",
    variants: ["Cloud", "Graphite"],
    stock: true
  }
];

// ----- Navigation -----
const navLinks = document.querySelectorAll("[data-page]");
const nav = document.getElementById("primary-nav");
const navToggle = document.getElementById("nav-toggle");
const pages = document.querySelectorAll(".page");
const cartCount = document.getElementById("cart-count");

navLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    showPage(link.dataset.page);
    if (link.classList.contains("nav-link")) {
      document.querySelectorAll(".nav-link").forEach(item => item.classList.remove("active"));
      link.classList.add("active");
    }
    const targetId = link.dataset.scroll;
    if (targetId) {
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }

    if (nav.classList.contains("open")) {
      nav.classList.remove("open");
      navToggle.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
});

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  navToggle.classList.toggle("is-open", isOpen);
  navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
});

function showPage(pageId) {
  pages.forEach(p => p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
  if (pageId !== "home") window.scrollTo(0,0);
  setActiveNav(pageId);
}

function setActiveNav(pageId) {
  const navLink = document.querySelector(`.nav-link[data-page="${pageId}"]`);
  if (!navLink) return;
  document.querySelectorAll(".nav-link").forEach(item => item.classList.remove("active"));
  navLink.classList.add("active");
}

// ----- Parallax Effect -----
const parallaxItems = document.querySelectorAll("[data-depth]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function handleParallax(event) {
  if (reduceMotion) return;
  const { innerWidth, innerHeight } = window;
  const x = (event.clientX / innerWidth) - 0.5;
  const y = (event.clientY / innerHeight) - 0.5;

  parallaxItems.forEach(item => {
    const depth = parseFloat(item.dataset.depth || "0");
    const moveX = x * depth * 60;
    const moveY = y * depth * 60;
    item.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
  });
}

window.addEventListener("mousemove", handleParallax);
window.addEventListener("mouseleave", () => {
  parallaxItems.forEach(item => {
    item.style.transform = "translate3d(0, 0, 0)";
  });
});

// ----- Populate Product Grid -----
const grid = document.getElementById("product-grid");
grid.innerHTML = products.map(p => `
  <div class="product-card" data-id="${p.id}">
    <div class="product-media">
      <img src="${p.image}" alt="${p.name}" loading="lazy" />
      <span class="product-chip">${p.variants[0]}</span>
    </div>
    <div class="product-info">
      <h3>${p.name}</h3>
      <p class="product-desc">${p.description}</p>
      <div class="product-meta">
        <span>$${p.price}</span>
        <span>${p.stock ? "In stock" : "Out of stock"}</span>
      </div>
    </div>
  </div>
`).join("");

grid.querySelectorAll(".product-card").forEach(card => {
  card.addEventListener("click", () => showProductDetail(card.dataset.id));
});

// ----- Product Detail -----
function showProductDetail(id) {
  const p = products.find(pr => pr.id === id);
  if (!p) {
    showToast("Product not found");
    return;
  }
  showPage("product-detail");
  const detail = document.getElementById("product-detail-container");
  detail.innerHTML = `
    <img src="${p.image}" />
    <div>
      <h2>${p.name}</h2>
      <p>${p.description}</p>
      <label>Variant:</label>
      <select id="variant">
        ${p.variants.map(v => `<option>${v}</option>`).join("")}
      </select>
      <p><strong>$${p.price}</strong></p>
      <button class="btn primary" id="add-to-cart">Add to Cart</button>
    </div>
  `;

  document.getElementById("add-to-cart").addEventListener("click", () => {
    addToCart(p);
  });
}

document.getElementById("back-to-products").onclick = () => showPage("products");

// ----- Cart Logic -----
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(product) {
  const existing = cart.find(i => i.id === product.id);
  if (existing) existing.qty += 1;
  else cart.push({ ...product, qty: 1 });
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  showToast("Added to cart");
}

function updateCartCount() {
  const total = cart.reduce((sum, i) => sum + i.qty, 0);
  cartCount.textContent = total;
}

updateCartCount();

// ----- Cart Page -----
const cartContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");

document.querySelector("[data-page='cart']").addEventListener("click", () => {
  renderCart();
  showPage("cart");
});

function renderCart() {
  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    cartTotal.innerHTML = "<p class=\"cart-empty-note\">Add items to continue to checkout.</p>";
    checkoutBtn.disabled = true;
    return;
  }
  checkoutBtn.disabled = false;
  cartContainer.innerHTML = cart.map(i => `
    <div class="cart-item">
      <h4>${i.name}</h4>
      <p>$${i.price} x ${i.qty}</p>
      <button class="btn small" data-id="${i.id}" data-action="dec">–</button>
      <button class="btn small" data-id="${i.id}" data-action="inc">+</button>
    </div>
  `).join("");
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  cartTotal.textContent = `Total: $${total}`;
  
  cartContainer.querySelectorAll(".btn.small").forEach(btn => {
    btn.onclick = () => changeQty(btn.dataset.id, btn.dataset.action);
  });
}

function changeQty(id, action) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  if (action === "dec") item.qty--;
  if (action === "inc") item.qty++;
  cart = cart.filter(i => i.qty > 0);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  updateCartCount();
}

// ----- Checkout Flow -----
checkoutBtn.onclick = () => {
  if (cart.length === 0) {
    showToast("Your cart is empty");
    return;
  }
  showPage("checkout");
};
document.getElementById("to-method").onclick = () => {
  const fullName = document.getElementById("ship-name").value.trim();
  const nameParts = fullName.split(/\s+/).filter(Boolean);
  if (nameParts.length < 2) {
    showToast("Please enter your full name");
    document.getElementById("ship-name").focus();
    return;
  }
  document.getElementById("step-shipping").classList.add("hidden");
  document.getElementById("step-method").classList.remove("hidden");
};
document.getElementById("to-review").onclick = () => {
  document.getElementById("step-method").classList.add("hidden");
  document.getElementById("step-review").classList.remove("hidden");
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  document.getElementById("review-summary").innerHTML = `
    <p>Order total: $${total}</p>
  `;
};
document.getElementById("confirm-checkout").onclick = () => {
  cart = [];
  localStorage.removeItem("cart");
  updateCartCount();
  document.getElementById("step-review").classList.add("hidden");
  document.getElementById("step-success").classList.remove("hidden");
};

// ----- Toast -----
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}
