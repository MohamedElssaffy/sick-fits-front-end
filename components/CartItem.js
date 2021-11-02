import PropTypes from 'prop-types';
import styled from 'styled-components';

import formatMony from '../lib/formatMony';
import DeleteCart from './DeleteCart';

const CartItemStyles = styled.li`
  display: grid;
  grid-template-columns: auto 1fr auto;
  padding: 1rem 0;
  border-bottom: 1px solid var(--lightGray);
  img {
    margin-right: 1rem;
  }
  h3,
  p {
    margin: 0;
  }
`;

export default function CartItem({ cartItem }) {
  const { product } = cartItem;

  if (!product) return null;
  return (
    <CartItemStyles>
      <img
        width="100"
        src={product.photo.image.publicUrlTransformed}
        alt={product.name}
      />
      <div>
        <h3>{product.name}</h3>
        <p>
          {formatMony(product.price * cartItem.quantity)} -{' '}
          <em>
            {cartItem.quantity} &times; {formatMony(product.price)} each
          </em>
        </p>
      </div>
      <DeleteCart id={cartItem.id} />
    </CartItemStyles>
  );
}

CartItem.propTypes = {
  cartItem: PropTypes.object,
};
