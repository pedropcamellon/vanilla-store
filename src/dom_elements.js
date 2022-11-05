/**
 *  HTML Elements
 */
// Navbar
export const navbarTotalCartItems = document.querySelector(
  ".navbar__total-cart-items"
);

// Cart
export const cartElements = {
  "cartSection": document.querySelector(".cart-section"),
  "cartOverlay": document.querySelector(".cart-btn"),
  "closeCartBtn": document.querySelector(".cart__close-cart-btn"),
  "cartBtn": document.querySelector(".navbar__cart-btn"),
  "removeCartItem": document.querySelector(".cart-item__remove-btn"),
  "cartTotal": document.querySelector(".cart-total"),
  "clearCart": document.querySelector(".clear-cart"),
  "cartContent": document.querySelector(".cart__content")
}

// Products Section
export const productElements = {
  "productsList": document.querySelector(".products__list"),
  "product": document.querySelector(".product"),
  "productBagBtn": document.querySelector(".product__bag-btn")
}