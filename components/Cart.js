import { useContext } from 'react';
import CartStyles from './styles/CartStyles';
import CloseButton from './styles/CloseButton';
import Supreme from './styles/Supreme';
import CartItem from './CartItem';
import calcTotalCartPrice from '../lib/calcTotalCartPrice';
import formatMony from '../lib/formatMony';
import { useCart } from '../lib/cartState';
import Checkout from './Checkout';
import { LocalUserStateContext, useUser } from '../lib/userContext';

export default function Cart() {
  const { user: me } = useUser();
  const { closeCart, cartState } = useCart();

  if (!me) return null;
  return (
    <CartStyles open={cartState}>
      <header>
        <Supreme>{me.name}</Supreme>
        <CloseButton type="button" onClick={closeCart}>
          &times;
        </CloseButton>
      </header>
      <ul>
        {me.cart.map((cartItem) => (
          <CartItem key={cartItem.id} cartItem={cartItem} />
        ))}
      </ul>
      <footer>
        <p>{formatMony(calcTotalCartPrice(me.cart))}</p>
        <Checkout />
      </footer>
    </CartStyles>
  );
}
