import calcTotalCartPrice from '../lib/calcTotalCartPrice';
import { useCart } from '../lib/cartState';
import formatMony from '../lib/formatMony';
import { useUser } from '../lib/userContext';
import CartItem from './CartItem';
import Checkout from './Checkout';
import CartStyles from './styles/CartStyles';
import CloseButton from './styles/CloseButton';
import Supreme from './styles/Supreme';

export default function Cart() {
  const { user: me } = useUser();
  const { closeCart, cartState } = useCart();

  if (!me) return null;
  return (
    <CartStyles open={cartState}>
      <header>
        <Supreme>{me.name}</Supreme>
        <CloseButton type='button' onClick={closeCart}>
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
