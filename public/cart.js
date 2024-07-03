window.onload = function () {
  displayCartItems();
};

function displayCartItems() {
  const cartList = document.getElementById("cart-list");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cartList.innerHTML = "";

  cart.forEach((cartItem) => {
    const productElement = createCartItemElement(cartItem);
    cartList.appendChild(productElement);
  });
}

function createCartItemElement(cartItem) {
  const productElement = document.createElement("div");
  productElement.classList.add("product");

  const nameElement = document.createElement("div");
  nameElement.textContent = cartItem.name;
  nameElement.classList.add("product-name");
  productElement.appendChild(nameElement);

  const priceElement = document.createElement("div");
  priceElement.textContent = `$${(cartItem.price * cartItem.quantity).toFixed(
    2
  )}`;
  priceElement.classList.add("product-price");
  productElement.appendChild(priceElement);

  const quantityElement = document.createElement("div"); //creates a new <div> element and assigns it to the variable quantityElement.
  quantityElement.textContent = `Quantity: ${cartItem.quantity}`;
  quantityElement.classList.add("product-quantity");
  productElement.appendChild(quantityElement);

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.classList.add("delete-btn");
  deleteBtn.addEventListener("click", () => removeFromCart(cartItem.id));
  productElement.appendChild(deleteBtn);

  return productElement;
}

function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter((item) => item.id !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCartItems();
}
