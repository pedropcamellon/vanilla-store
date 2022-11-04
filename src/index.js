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
const removeCartItem = document.querySelector(".cart-item__remove-btn");
const cartTotal = document.querySelector(".cart-total");
const clearCart = document.querySelector(".clear-cart");
const cartContent = document.querySelector(".cart__content");

// Products Section
const productsList = document.querySelector(".products__list");
const product = document.querySelector(".product");
const productBagBtn = document.querySelector(".product__bag-btn");

/**
 * Cart
 */
let CART = [];

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
    } catch (error) {
      console.log(`There was an error while getting products: ${error}`);
    }
  }
}

/**
 *
 */
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

  /**
   * Display last product added to cart
   * @param {Object} product
   */
  addProdToCartUI(prod) {
    try {
      // Create a new element for the new item
      const newCartItem = document.createElement("div");

      // Populate it
      newCartItem.innerHTML = `
      <div class="cart-item" data-id="${prod.id}">
        <h4 class="cart-item__name">${prod.title}</h4>
        <h5 class="cart-item__price">$ ${prod.price}</h4>
        <span class="cart-item-amount">${prod.amount}</span>
        <button class="cart-item__remove-btn" type=button data-id="${prod.id}">X</button>
      <div>
      `;

      // Add item to cart
      cartContent.appendChild(newCartItem);

      // Add product to cart when clicking on btn
      // Reference product id using corresponding custom data attribute
      document.querySelector(`.cart-item__remove-btn[data-id="${prod.id}"]`)
        .addEventListener("click", () => this.removeProdFromCart(prod.id));
    } catch (error) {
      console.log(error);
    }
  };

  /**
    * Update product count shown in cart
    * @param {int} id
    * @param {int} newAmount
    */
  updProdCntInCartUI(id, newAmount) {
    // Replace only the content of the element that holds the product count
    cartContent.querySelector(`[data-id="${id}"] > .cart-item-amount`).innerHTML = newAmount;
  }

  /**
   * Check if a product is already in the cart
   * @param {int} id
   */
  isProdInCart(id) {
    try {
      let inCart = CART.find((prod) => prod.id === id);
      if (!inCart) {
        console.log(`Product ${id} not found`);
      }
      return inCart;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Add product to cart
   * @param {int} id
   */
  addProdToCart(id) {
    try {
      // Get product from products
      let prod = Storage.getProduct(id);

      // If product is not in cart already ...
      if (!this.isProdInCart(id)) {
        // Add product to cart
        let newProd = { ...prod, amount: 1 };
        CART.push(newProd);

        // console.log(`${JSON.stringify(CART)}`);

        this.addProdToCartUI(newProd);
      } else {
        // // Add more of the same product to the cart
        // const idxInCart = CART.findIndex((p) => p.id === id);

        // CART[idxInCart].amount += 1;

        // this.updateProdCountInCartUI(id, CART[idxInCart].amount);
        // console.log(`${prod.title} in cart: ${CART[idxInCart].amount}`);
      }

      // // Save cart to storage
      // Storage.saveCart();

      // // Set cart total
      // this.setCartTotalUI();
    } catch (error) {
      console.log(error);
    }
    // console.log(`${Storage.getProduct(id).title} was added to cart`);
    // console.log(`Cart: ${JSON.stringify(CART)}`);
  }

  /**
     * Remove product from cart
     * @param {int} id
     */
  removeProdFromCart(id) {
    try {
      // Get product from list of products given its id
      let prod = Storage.getProduct(id);

      // If product is not in cart do nothing
      if (!this.isProdInCart(id)) { return; }

      // Look for product index in cart
      const idxInCart = CART.findIndex((p) => p.id === id);

      // Only splice array when item is found
      // if (index > -1) {
      //   CART.splice(idxInCart, 1); // 2nd parameter means remove one item only
      // }

      // this.updateProdCountInCartUI(id, CART[idxInCart].amount);
      console.log(`${JSON.stringify(CART[idxInCart])} ${JSON.stringify(CART)}`);
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Show total amount of prods in cart and total cost
   */
  setCartTotalUI() {
    let tempTotal = 0;
    let totalProds = 0;

    CART.map((prod) => {
      tempTotal += prod.amount * prod.price;
      totalProds += prod.amount;
    });

    cartTotal.innerHTML = tempTotal.toFixed(2);
    navbarTotalCartItems.innerHTML = totalProds;

    // console.log(
    //   `$ ${parseFloat(tempTotal.toFixed(2))} in ${totalProds} products`
    // );
  }
}

/**
 *
 */
class Storage {
  /**
   * Save products to local storage
   * @param {Array} products
   */
  static saveProducts(products) {
    try {
      localStorage.setItem("products", JSON.stringify(products));
      console.log(`All products were saved to local storage`);
    } catch (error) {
      console.log(
        `There was an error saving the products to local storage: ${error}`
      );
    }
  }

  /**
   * Get product given its id
   * @param {int} id
   */
  static getProduct(id) {
    try {
      let products = JSON.parse(localStorage.getItem("products"));

      return products.find((prod) => prod.id === id);
    } catch (error) {
      console.log(`There was an error getting the product: ${error}`);
    }
  }

  /**
   * Save cart to local storage
   */
  static saveCart() {
    try {
      localStorage.setItem("cart", JSON.stringify(CART));

      // console.log(`All products in the CART were saved to local storage`);
    } catch (error) {
      console.log(
        `There was an error saving the products in the CART to local storage: ${error}`
      );
    }
  }
}

/**
 * When finished loading the DOM ...
 */
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
      const addToCartBtns = [...document.querySelectorAll(".product__bag-btn")];

      addToCartBtns.forEach((btn) => {
        // Add product to cart when clicking on btn
        // Reference product id using corresponding custom data attribute
        btn.addEventListener("click", () => ui.addProdToCart(btn.dataset.id));
      });
    });
});
