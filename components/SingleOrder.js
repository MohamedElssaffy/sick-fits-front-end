import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import Head from 'next/head';

import OrderStyles from './styles/OrderStyles';
import DisplayError from './ErrorMessage';
import formatMony from '../lib/formatMony';

const SINGLE_ORDER_QUERY = gql`
  query SINGLE_ORDER_QUERY($id: ID!) {
    order: Order(where: { id: $id }) {
      id
      charge
      total
      user {
        id
      }
      items {
        id
        name
        price
        description
        quantity
        photo {
          image {
            publicUrlTransformed
          }
        }
      }
    }
  }
`;

function SingleOrder({ id }) {
  const { data, loading, error } = useQuery(SINGLE_ORDER_QUERY, {
    variables: { id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <DisplayError error={error} />;

  const { order } = data;
  return (
    <OrderStyles>
      <Head>
        <title>Sick Fits - {order.id}</title>
      </Head>
      <p>
        <span>Order Id:</span>
        <span>{order.id}</span>
      </p>
      <p>
        <span>Order Charge:</span>
        <span>{order.charge}</span>
      </p>
      <p>
        <span>Order Total:</span>
        <span>{formatMony(order.total)}</span>
      </p>
      <p>
        <span>Items Count:</span>
        <span>{order.items.length}</span>
      </p>

      <div className="items">
        {order.items.map((item) => (
          <div className="order-item" key={item.id}>
            <img src={item.photo.image.publicUrlTransformed} alt={item.name} />
            <div className="item-details">
              <h2>{item.name}</h2>
              <p>Qty: {item.quantity}</p>
              <p>Each: {formatMony(item.price)}</p>
              <p>Sub Total: {formatMony(item.price * item.quantity)}</p>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </OrderStyles>
  );
}

SingleOrder.propTypes = {
  id: PropTypes.string,
};

export default SingleOrder;
