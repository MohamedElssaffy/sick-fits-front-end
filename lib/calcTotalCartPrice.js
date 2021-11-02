export default function calcTotalCartPrice(cart) {
  return cart.reduce((accum, currentCart) => {
    if (!currentCart.product) return accum;
    return accum + currentCart.quantity * currentCart.product.price;
  }, 0);
}
