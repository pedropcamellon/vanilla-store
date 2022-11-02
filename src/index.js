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

/**
 *
 */
class Products {
  async getProducts() {
    try {
      // Testing with local data
      let products = prodsjsonfile.items.map((prod) => {
        const id = prod.sys.id;
        const { title, price } = prod.fields;
        const image = prod.fields.image.fields.file.url;

        return { id, title, price, image };
      });

      return products;
    } catch (err) {
      console.log(`There was an error while getting products: ${err}`);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();

  products.getProducts().then((products) => {
    console.log(products);
  });
});
