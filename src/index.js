console.clear();

import prodsjsonfile from "./products.json";
import {
  navbarTotalCartItems,
  cartElements,
  productElements
} from "./dom_elements";

/**
 *  TODO
 * 
 *  DB Name
 */
const DB_NAME = "products";
let DB;

/**
 * 
 */
class Cart {
  #products;
  #totalCost;
  #productsCount;

  constructor(prods = []) {
    // Initialize products as empty array 
    this.products = prods;
    this.#totalCost = 0;
    this.#productsCount = 0;
  }

  // Getters
  get products() {
    return this.#products;
  }

  // Setters
  set products(prods) {
    this.#products = prods;
  }

  // Methods
  /**
   * Add product to cart
   * @param {int} id Product id
   */
  async addProduct(id) {
    try {
      const idxInCart = this.prodIdxInCart(id);

      // If product is not in cart already ...
      if (idxInCart === -1) {
        // Get product from products
        const newProd = { ...await Storage.getProduct(id), amount: 1 };

        // Append it to cart list
        this.products = [...this.products, newProd];

        this.addProdToTotals(newProd);

        // Show it in DOM
        UI.addProdToCart(newProd);
      } else {
        // Add one more product of the same type to the cart

        // We look for a product with the same id as the id parameter value 
        // for not getting the product from storage 
        // const idxInCart = this.products.findIndex((p) => p.id === id);
        this.products[idxInCart].amount += 1;

        // Add again same product to total cost
        this.addProdToTotals(this.products[idxInCart]);

        // Update the UI / DOM
        UI.updProdCntInCart(id, this.products[idxInCart].amount);
      }

      // Display updated totals
      UI.setCartTotals({
        'cost': this.#totalCost,
        'products': this.#productsCount
      });

      // Save cart to storage
      Storage.saveCart(this.products);

      // Update cart total
      // this.setCartTotalUI();
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Check if a product is already in the cart
   * @param {int} id
   */
  prodIdxInCart(id) {
    try {
      return this.products.findIndex((p) => p.id === id);
    } catch (error) {
      console.log(`prodIdxInCart. ${error}`);
    }
  }

  /**
   * Add product cost to total cost
   * Increase by 1 total products in cart 
   */
  addProdToTotals(prod) {
    this.#totalCost += prod.price;
    this.#productsCount += 1;
  }

  clearCart() {
    try {
      this.products = [];
      this.#totalCost = 0;
      this.#productsCount = 0;

      UI.clearCart();

      Storage.removeCart();
    } catch (error) {
      console.error(error);
    }
  }
}

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
      console.error(`There was an error getting the product from server. ${error}`);
    }
  }
}

/**
 *  UI handling methods
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
   * Update product count shown in cart
   * @param {int} id
   * @param {int} newAmnt
   */
  static updProdCntInCart(id, newAmnt) {
    cartElements.cartContent.querySelector(
      `[data-id="${id}"] > .cart-item-amount`
    ).innerHTML = newAmnt;
  }

  /**
   * Show total amount of prods in cart and total cost
   */
  static setCartTotals(totals) {
    // Display total cost like $ 0.33
    cartElements.cartTotal.innerHTML = totals.cost.toFixed(2);

    // Display total products in cart in navbar
    navbarTotalCartItems.innerHTML = totals.products;
  }

  /**
   * Show last product added in DOM
   * @param {Object} prod
   */
  static addProdToCart(prod) {
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
      `;

      // <button class="cart-item__remove-btn" type=button data-id="${prod.id}">X</button>


      // Add item to cart
      cartElements.cartContent.appendChild(newCartItem);

      // TODO
      // Add product to cart when clicking on btn
      // Reference product id using corresponding custom data attribute
      // document
      //   .querySelector(`.cart-item__remove-btn[data-id="${prod.id}"]`)
      //   .addEventListener("click", (ev) => this.removeProdFromCart(ev));
    } catch (error) {
      console.error(error);
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

      // TODO
      // Update total cost
      // this.setCartTotalUI();
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Remove product from cart
   * @param {int} id Product id
   */
  removeProdFromCart(ev) {
    console.warn('TODO: removeProdFromCart');
    // try {
    //   const removeProdBtn = ev.target;
    //   const id = removeProdBtn.dataset.id;

    //   // If product is not in cart do nothing
    //   if (!this.prodIdxInCart(id)) return;

    //   // Look for product index in cart
    //   const idxInCart = CART.findIndex((p) => p.id === id);

    //   // Only splice array when item is found
    //   if (idxInCart > -1) {
    //     CART.splice(idxInCart, 1); // 2nd parameter means remove one item only
    //   }

    //   Storage.saveCart();

    //   // Remove product from cart in DOM
    //   this.removeProdFromCartUI(removeProdBtn);
    // } catch (error) {
    //   console.log(error);
    // }
  }

  /**
   * 
   */
  static clearCart() {
    try {
      // Clear cart element content
      cartElements.cartContent.innerHTML = "";

      // Reset total cost of items in cart 
      cartElements.cartTotal.innerHTML = "0.00";
    } catch (error) {
      console.error(error);
    }
  }


  static showContextMenu(ev) {
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
    return new Promise((resolve, reject) => {
      // Check for browser support
      if (!('indexedDB' in window)) {
        console.log("This browser doesn't support IndexedDB");
        return;
      }

      const request = indexedDB.open(DB_NAME, 2);

      request.onerror = (event) => {
        console.error(`Database error: ${event.target.errorCode}`);
        reject(`Database error: ${event.target.errorCode}`);
      };

      request.onsuccess = (event) => {
        // Do something with request.result!
        DB = event.target.result;

        // "readonly" transaction
        DB.transaction([DB_NAME])
          .objectStore("products")
          .get(id).onsuccess = (ev) => {
            // Product
            resolve(ev.target.result);
          };
      };

      // console.error(`
      // There was an error getting the product from storage. ${error}
    });
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

      const request = indexedDB.open(DB_NAME, 2);

      request.onerror = (event) => {
        console.error(`Database error: ${event.target.errorCode}`);
      };

      request.onsuccess = (event) => {
        // const db = event.target.result;
        DB = event.target.result;
      }

      request.onupgradeneeded = (event) => {
        // const db = event.target.result;
        DB = event.target.result;

        // Create an objectStore to hold information about our customers. We're
        // going to use "ssn" as our key path because it's guaranteed to be
        // unique - or at least that's what I was told during the kickoff meeting.
        const objectStore = DB.createObjectStore("products", { keyPath: "id" });

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
          const productObjectStore = DB
            .transaction("products", "readwrite")
            .objectStore("products");

          prodData.forEach((prod) => {
            productObjectStore.add(prod);
          });
        };
      };

      // not shown
      // console.log(`All products were saved to local storage`, DB);
    } catch (error) {
      console.error(
        `There was an error saving the products to storage: ${error}`
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
      console.error(
        `There was an error loading the CART from storage: ${error}`
      );
    }
  }

  /**
   * Save cart to local storage
   */
  static saveCart(products) {
    try {
      localStorage.setItem("cart", JSON.stringify(products));

      // console.log(`All products in the CART were saved to local storage`);
    } catch (error) {
      console.error(
        `There was an error saving the products in CART to storage. ${error}`
      );
    }
  }

  /**
   * Remove cart from local storage
   * 
   */
  static removeCart() {
    try {
      localStorage.removeItem('cart');
    } catch (error) {
      console.error(error);
    }
  }
}

/**
 * When finished loading the DOM ...
 */
document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  const ui = new UI();

  // Get cart content from local storage
  const CART = new Cart(Storage.getCart());

  // Get products from server
  products
    .getProducts()
    .then((prods) => {
      // When finished getting products display them
      ui.displayProducts(prods);

      // Save the products to local storage
      Storage.saveProducts(prods);

      // Display cart loaded content
      // CART.products.forEach((prod) => {
      //   ui.addProdToCartUI(prod);
      // });
    })
    .then(() => {
      // When finished displaying products ...
      productElements.productsList.addEventListener("contextmenu",
        (ev) => UI.showContextMenu(ev));

      // Select all "add to cart" btns
      const addToCartBtns = [...document.querySelectorAll(".product__bag-btn")];

      // Add product to cart when clicking on btn
      // Reference product id using corresponding custom data attribute
      addToCartBtns.forEach((btn) => {
        btn.addEventListener("click", () => CART.addProduct(btn.dataset.id));
      });
    });

  cartElements.clearCartBtn.addEventListener("click", () => CART.clearCart());
});
