console.clear();

import prodsjsonfile from "./products.json";
import {
  navbarTotalCartItems,
  cartElements,
  productElements
} from "./dom_elements";

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
      productElements.productsList.innerHTML += `
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
   * Check if a product is already in the cart
   * @param {int} id
   */
  isProdInCart(id) {
    try {
      let inCart = CART.find((prod) => prod.id === id);

      // if (!inCart) {
      //   console.log(`Adding new product with id: ${id}`);
      // }

      return inCart;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Update product count shown in cart
   * @param {int} id
   * @param {int} newAmount
   */
  updProdCntInCartUI(id, newAmount) {
    cartElements.cartContent.querySelector(
      `[data-id="${id}"] > .cart-item-amount`
    ).innerHTML = newAmount;
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

    // Display total cost like $ 0.33
    cartElements.cartTotal.innerHTML = tempTotal.toFixed(2);
    // Display total products in cart in navbar
    navbarTotalCartItems.innerHTML = totalProds;
  }

  /**
   * Show last product added in DOM
   * @param {Object} prod
   */
  addProdToCartUI(prod) {
    try {
      // Create a new element for the new item like:
      //  `<div class="cart-item" data-id="8">`
      const newCartItem = document.createElement("div");
      newCartItem.classList.add("cart-item");
      newCartItem.setAttribute("data-id", prod.id);

      // Populate it
      newCartItem.innerHTML = `
        <h4 class="cart-item__name">${prod.title}</h4>
        <h5 class="cart-item__price">$ ${prod.price}</h4>
        <span class="cart-item-amount">${prod.amount}</span>
        <button class="cart-item__remove-btn" type=button data-id="${prod.id}">X</button>
      `;

      // Add item to cart
      cartElements.cartContent.appendChild(newCartItem);

      // Add product to cart when clicking on btn
      // Reference product id using corresponding custom data attribute
      document
        .querySelector(`.cart-item__remove-btn[data-id="${prod.id}"]`)
        .addEventListener("click", (ev) => this.removeProdFromCart(ev));
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Add product to cart
   * @param {int} id Product id
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

        // Show it in DOM
        this.addProdToCartUI(newProd);
      } else {
        // Add one more product of the same type to the cart
        const idxInCart = CART.findIndex((p) => p.id === id);

        CART[idxInCart].amount += 1;

        this.updProdCntInCartUI(id, CART[idxInCart].amount);
      }

      // Save cart to storage
      Storage.saveCart();

      // Update cart total
      this.setCartTotalUI();
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Remove product from DOM
   * @param {int} id Product id
   */
  removeProdFromCartUI(btn) {
    try {
      // Product element to be removed
      const targetEl = btn.parentElement;

      // Remove it from DOM
      targetEl.parentElement.removeChild(targetEl);

      // Update total cost
      this.setCartTotalUI();
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Remove product from cart
   * @param {int} id Product id
   */
  removeProdFromCart(ev) {
    try {
      const removeProdBtn = ev.target;
      const id = removeProdBtn.dataset.id;

      // If product is not in cart do nothing
      if (!this.isProdInCart(id)) return;

      // Look for product index in cart
      const idxInCart = CART.findIndex((p) => p.id === id);

      // Only splice array when item is found
      if (idxInCart > -1) {
        CART.splice(idxInCart, 1); // 2nd parameter means remove one item only
      }

      Storage.saveCart();

      // Remove product from cart in DOM
      this.removeProdFromCartUI(removeProdBtn);
    } catch (error) {
      console.log(error);
    }
  }

  /**
   *
   */
  clearCart() {
    // Empty cart
    CART = [];

    // Clear cart element content
    cartElements.cartContent.innerHTML = "";

    cartElements.cartTotal.innerHTML = "0.00";

    Storage.removeCart();
  }
}

/**
 *
 */
class Storage {
  /**
   * Get product from local storage given its id
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
   * Save products to local storage
   * @param {Array} prods
   */
  static saveProducts(prodData) {
    try {
      // Check for browser support
      if (!('indexedDB' in window)) {
        console.log("This browser doesn't support IndexedDB");
        return;
      }

      const dbName = "products";

      const request = indexedDB.open(dbName, 2);

      request.onerror = (event) => {
        console.error(`Database error: ${event.target.errorCode}`);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create an objectStore to hold information about our customers. We're
        // going to use "ssn" as our key path because it's guaranteed to be
        // unique - or at least that's what I was told during the kickoff meeting.
        const objectStore = db.createObjectStore("products", { keyPath: "id" });

        // Create an index to search products by title.
        // We want to ensure that no two products 
        // have the same email, so use a unique index.
        objectStore.createIndex("id", "id", { unique: true });

        // Create an index to search products by id. 
        objectStore.createIndex("title", "title", { unique: true });

        // Use transaction oncomplete to make sure the objectStore creation is
        // finished before adding data into it.
        objectStore.transaction.oncomplete = (event) => {
          // Store values in the newly created objectStore.
          const productObjectStore = db.transaction("products", "readwrite").objectStore("products");
          prodData.forEach((prod) => {
            productObjectStore.add(prod);
          });
        };
      };

      // console.log(`All products were saved to local storage`);
    } catch (error) {
      console.log(
        `There was an error saving the products to local storage: ${error}`
      );
    }
  }

  /**
   * Get cart content from local storage
   */
  static getCart() {
    try {
      // getItem returns a string
      const str = localStorage.getItem("cart");
      // if it is not empty parse the str to an json object
      // else returns an empty array
      return str ? JSON.parse(str) : [];

      // console.log(`All products in CART were loaded from local storage`);
    } catch (error) {
      console.log(
        `There was an error loading the CART from local storage: ${error}`
      );
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

  /**
   * Remove cart from local storage
   */
  static removeCart() {
    try {
      localStorage.removeItem("cart");
    } catch (error) {
      console.log(error);
    }
  }
}

/**
 * When finished loading the DOM ...
 */
document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  const ui = new UI();

  // Get products from server
  products
    .getProducts()
    .then((products) => {
      // When finished getting products display them
      ui.displayProducts(products);

      // Save the products to local storage
      Storage.saveProducts(products);

      // Get cart content from local storage
      CART = Storage.getCart();

      // Display cart loaded content
      CART.forEach((prod) => {
        ui.addProdToCartUI(prod);
      });
    })
    .then(() => {
      // When finished displaying products ...
      productElements.productsList.addEventListener("contextmenu", (ev) => {
        let t = ev.target.parentElement;
        const optionsMenu = document.createElement("ul");
        optionsMenu.innerHTML = `<ul><li>Option 1</li><li>Option 2</li></ul>`;

        // Prevent browser from showing default context menu
        // when right clicking
        ev.preventDefault();

        if (
          t.tagName.toLowerCase() !== "article" ||
          !t.classList.contains("product")
        )
          return;

        t.appendChild(optionsMenu);

        setTimeout(() => {
          t.removeChild(document.querySelector("article > ul"));
        }, 2000);
      });

      // Select all "add to cart" btns
      const addToCartBtns = [...document.querySelectorAll(".product__bag-btn")];

      // Add product to cart when clicking on btn
      // Reference product id using corresponding custom data attribute
      addToCartBtns.forEach((btn) => {
        btn.addEventListener("click", () => ui.addProdToCart(btn.dataset.id));
      });
    });

  cartElements.clearCartBtn.addEventListener("click", ui.clearCart);
});
