import Link from 'next/link';
import { useCart } from '../lib/cartState';
import { useUser } from '../lib/userContext';
import CartCount from './CartCount';
import SignOut from './SignOut';
import NavStyles from './styles/NavStyles';

export default function Nav() {
  const { user } = useUser();
  const { openCart } = useCart();
  return (
    <NavStyles>
      <Link href="/products">Products</Link>
      {user ? (
        <>
          <Link href="/orders">Orders</Link>
          <Link href="/account">Account</Link>
          <Link href="/sell">Sell</Link>
          <SignOut />
          <button type="button" onClick={openCart}>
            My Cart{' '}
            <CartCount
              count={user?.cart?.reduce(
                (acc, curr) => acc + (curr.product ? curr.quantity : 0),
                0
              )}
            />
          </button>
        </>
      ) : (
        <Link href="/signin">Sign In</Link>
      )}
    </NavStyles>
  );
}
