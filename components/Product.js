import PropTypes from 'prop-types';
import Link from 'next/link';

import DeleteProduct from './DeleteProduct';
import AddToCart from './AddToCart';
import ItemStyles from './styles/ItemStyles';
import Title from './styles/Title';
import PriceTag from './styles/PriceTag';
import formatMoney from '../lib/formatMony';
import { useUser } from '../lib/userContext';

export default function Product({ product }) {
  const { user } = useUser();
  return (
    <ItemStyles>
      <img
        src={product?.photo?.image?.publicUrlTransformed}
        alt={product.name}
      />
      <Title>
        <Link href={`/product/${product.id}`}>{product.name}</Link>
      </Title>
      <PriceTag>{formatMoney(product.price)}</PriceTag>
      <p>{product.description}</p>
      <div className="buttonList">
        {user && user.id === product.user?.id && (
          <Link
            href={{
              pathname: '/update',
              query: {
                id: product.id,
              },
            }}
          >
            Edit
          </Link>
        )}
        {user && <AddToCart id={product.id} />}
        {user && user.id === product.user?.id && (
          <DeleteProduct id={product.id}>Delete</DeleteProduct>
        )}
      </div>
    </ItemStyles>
  );
}

Product.propTypes = {
  product: PropTypes.object.isRequired,
};
