var cart = [];
var cartTotal = 0;

function addToCart(name) {
  cart.push(name);
  console.log("added to cart:", name);
  console.log("cart is now", cart);
  alert(name + " added to cart");
}

function removeFromCart(i) {
  cart.splice(i, 1);
}

var lastClicked = null;

document.addEventListener('click', function(e) {
  lastClicked = e.target;
});
