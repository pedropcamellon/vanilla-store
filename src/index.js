console.clear();

import prodsjsonfile from "./products.json";

// import "./styles.css";

/**
 *  HTML Elements
 */
// Navbar
const navbarTotalCartItems = document.querySelector(
  ".navbar__total-cart-items"
);

// Header
const bannerBagBtn = document.querySelector(".banner__cta-btn");

// Cart
const cartSection = document.querySelector(".cart-section");
const cartOverlay = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".cart__close-cart-btn");
const cartBtn = document.querySelector(".navbar__cart-btn");
const removeCartItem = document.querySelector(".cart-item__remove");
const cartTotal = document.querySelector(".cart-total");
const clearCart = document.querySelector(".clear-cart");
const cartContent = document.querySelector(".cart__content");

// Products Section
const productsList = document.querySelector(".products__list");
const product = document.querySelector(".product");
const productBagBtn = document.querySelector(".product__bag-btn");
