let products = []; // Array to store products
let productsPerPage = 10; // Number of products to display per page
let currentPage = 1; // Current page of products

window.onload = function () {
  loadProductsFromLocalStorage();
  const addProductBtn = document.getElementById("add-product-btn");
  addProductBtn.addEventListener("click", addProduct);
};

function displayProducts() {
  const productList = document.getElementById("product-list");
  productList.innerHTML = "";

  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;

  const productsToDisplay = products.slice(startIndex, endIndex);

  const productRows = chunkArray(productsToDisplay, 4); // Split products into rows

  productRows.forEach((row) => {
    const rowElement = document.createElement("div");
    rowElement.classList.add("product-row");

    row.forEach((product) => {
      const productElement = createProductElement(product);
      rowElement.appendChild(productElement);
    });

    productList.appendChild(rowElement);
  });

  // Only add "Load More" button if there are more products to display
  if (products.length > endIndex) {
    const loadMoreBtn = document.createElement("button");
    loadMoreBtn.innerText = "Load More";
    loadMoreBtn.classList.add("load-more-btn");
    loadMoreBtn.addEventListener("click", loadMoreProducts);
    productList.appendChild(loadMoreBtn);
  }
}

function chunkArray(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

function createProductElement(product) {
  const productElement = document.createElement("div");
  productElement.classList.add("product");

  const imageElement = document.createElement("img");
  imageElement.src = product.image;
  imageElement.alt = product.name;
  imageElement.classList.add("product-image");
  productElement.appendChild(imageElement);

  const nameElement = document.createElement("div");
  nameElement.textContent = product.name;
  nameElement.classList.add("product-name");
  productElement.appendChild(nameElement);

  const descriptionElement = document.createElement("div");
  descriptionElement.textContent = product.description;
  descriptionElement.classList.add("product-description");
  productElement.appendChild(descriptionElement);

  const priceElement = document.createElement("div");
  priceElement.textContent = `$${product.price.toFixed(2)}`;
  priceElement.classList.add("product-price");
  productElement.appendChild(priceElement);

  const quantityControls = document.createElement("div");
  quantityControls.classList.add("quantity-controls");
  productElement.appendChild(quantityControls);

  const decreaseBtn = document.createElement("button");
  decreaseBtn.textContent = "-";
  decreaseBtn.addEventListener("click", () => decreaseQuantity(product.id));
  quantityControls.appendChild(decreaseBtn);

  const quantityInput = document.createElement("input");
  quantityInput.type = "number";
  quantityInput.value = 1;
  quantityInput.min = 1;
  quantityInput.id = `quantity-${product.id}`;
  quantityControls.appendChild(quantityInput);

  const increaseBtn = document.createElement("button");
  increaseBtn.textContent = "+";
  increaseBtn.addEventListener("click", () => increaseQuantity(product.id));
  quantityControls.appendChild(increaseBtn);

  const buttonsContainer = document.createElement("div");
  buttonsContainer.classList.add("buttons");
  productElement.appendChild(buttonsContainer);

  const updateBtn = document.createElement("button");
  updateBtn.textContent = "Update";
  updateBtn.classList.add("update-btn");
  updateBtn.addEventListener("click", () => updateProduct(product.id));
  buttonsContainer.appendChild(updateBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.classList.add("delete-btn");
  deleteBtn.addEventListener("click", () => deleteProduct(product.id));
  buttonsContainer.appendChild(deleteBtn);

  const addToCartBtn = document.createElement("button");
  addToCartBtn.textContent = "Add to Cart";
  addToCartBtn.classList.add("add-to-cart-btn");
  addToCartBtn.addEventListener("click", () => addToCart(product.id));
  buttonsContainer.appendChild(addToCartBtn);

  return productElement;
}

function addProduct() {
  const productName = document.getElementById("productName").value;
  const productDescription =
    document.getElementById("productDescription").value;
  const productPrice = parseFloat(
    document.getElementById("productPrice").value
  );
  const productImage = document.getElementById("productImage").files[0];

  if (
    productName &&
    productDescription &&
    !isNaN(productPrice) &&
    productImage
  ) {
    const reader = new FileReader(); //used to read the content of file
    reader.onload = function (event) {
      const imageData = event.target.result; // refers to the result of the file reading operation
      const newProduct = {
        id: Date.now().toString(),
        name: productName,
        description: productDescription,
        price: productPrice,
        image: imageData,
      };
      products.push(newProduct);
      saveProductsToLocalStorage();
      displayProducts();
    };
    reader.readAsDataURL(productImage);
  } else {
    alert("Please enter valid data for the product.");
  }
}

function updateProduct(productId) {
  const productToUpdate = products.find((product) => product.id === productId);
  if (productToUpdate) {
    const newName = prompt("Enter new name:", productToUpdate.name);
    const newDescription = prompt(
      "Enter new description:",
      productToUpdate.description
    );
    const newPrice = parseFloat(
      prompt("Enter new price:", productToUpdate.price)
    );

    if (newName && newDescription && !isNaN(newPrice)) {
      productToUpdate.name = newName;
      productToUpdate.description = newDescription;
      productToUpdate.price = newPrice;
      saveProductsToLocalStorage();
      displayProducts();
    } else {
      alert("Invalid input. Please try again.");
    }
  }
}

function deleteProduct(productId) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this product?"
  );
  if (confirmDelete) {
    products = products.filter((product) => product.id !== productId);
    saveProductsToLocalStorage();
    displayProducts();
  }
}

function increaseQuantity(productId) {
  const quantityInput = document.getElementById(`quantity-${productId}`);
  quantityInput.value = parseInt(quantityInput.value) + 1;
}

function decreaseQuantity(productId) {
  const quantityInput = document.getElementById(`quantity-${productId}`);
  const currentValue = parseInt(quantityInput.value);
  if (currentValue > 1) {
    quantityInput.value = currentValue - 1;
  }
}

function addToCart(productId) {
  const quantityInput = document.getElementById(`quantity-${productId}`);
  const quantity = parseInt(quantityInput.value);

  const isLoggedIn = checkIfUserIsLoggedIn();
  if (isLoggedIn) {
    let cart = JSON.parse(localStorage.getItem("cart")) || {}; //If the cart is empty or not yet initialized (null ), it initializes an empty object {}
    cart[productId] = (cart[productId] || 0) + quantity; //Updates the quantity of productId in the cart. If productId already exists in the cart, it adds quantity to its current value. If not, it initializes productId with quantity
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`Added ${quantity} of product ${productId} to cart`);

    // Redirect to cart page
    window.location.href = "/cart";
  } else {
    // Redirect to login page
    window.location.href = "/login";
  }
}

function checkIfUserIsLoggedIn() {
  return true; // For demo purposes, always return true
}

function saveProductsToLocalStorage() {
  localStorage.setItem("products", JSON.stringify(products));
}

function loadProductsFromLocalStorage() {
  const storedProducts = localStorage.getItem("products");
  if (storedProducts) {
    products = JSON.parse(storedProducts);
    displayProducts();
  }
}

function loadMoreProducts() {
  currentPage++;
  displayProducts();
}
