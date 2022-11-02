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

class UI {
  /**
   * Display all the products
   * @param {Array} products
   */
  displayProducts(products) {
    products.forEach((prod) => {
      productsList.innerHTML += `
      <article class="product">
				<div class="product__img-container">
					<img
					src=${prod.image}
					class="product__img"
					>
					<button type=button class="product__bag-btn" data-id=${prod.id}>
						Shop Now
					</button>
				</div>
				<h3 class="product__name">${prod.title}</h3>
        <h4 class="product__price">${prod.price}</h4>
			</article>
      `;
    });
  }
}

class Storage {
  static saveProducts(products) {
    try {
      localStorage.setItem("products", JSON.stringify(products));
      console.log(`All products were saved to local storage`);
    } catch (err) {
      console.log(
        `There was an error saving the products to local storage: ${err}`
      );
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  const ui = new UI();

  products
    .getProducts()
    .then((products) => {
      ui.displayProducts(products);
      Storage.saveProducts(products);
    })
    .then(() => {
      const buttons = [...document.querySelectorAll(".product__bag-btn")];
      buttons.forEach((btn) => {
        // Reference product id using corresponding custom data attribute
        btn.addEventListener("click", () => ui.addProdToCart(btn.dataset.id));
      });
    });
});
