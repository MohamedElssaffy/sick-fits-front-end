import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Head from 'next/head';
import Link from 'next/link';

import styled from 'styled-components';
import OrderItemStyles from './styles/OrderItemStyles';
import DisplayError from './ErrorMessage';
import formatMony from '../lib/formatMony';

const USER_ORDERS_QUERY = gql`
  query {
    allOrders {
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

const OrderUl = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 3rem;
`;

const countOrderItems = (order) =>
  order.items.reduce((accu, current) => accu + current.quantity, 0);

function SingleOrder() {
  const { data, loading, error } = useQuery(USER_ORDERS_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <DisplayError error={error} />;

  const { allOrders } = data;
  return (
    <div>
      <Head>
        <title>Your Orders ({allOrders.length})</title>
      </Head>
      <OrderUl>
        {allOrders.length === 0 ? (
          <p>You dont make any order yet</p>
        ) : (
          allOrders.map((order) => (
            <OrderItemStyles key={order.id}>
              <Link href={`/order/${order.id}`}>
                <a>
                  <div className="order-meta">
                    <p>
                      {countOrderItems(order)} Item
                      {countOrderItems(order) === 1 ? '' : 's'}
                    </p>
                    <p>
                      {order.items.length} Product
                      {order.items.length === 1 ? '' : 's'}
                    </p>
                    <p>{formatMony(order.total)}</p>
                  </div>
                  <div className="images">
                    {order.items.map((item) => (
                      <img
                        key={item.id}
                        src={item.photo?.image?.publicUrlTransformed}
                        alt={item.name}
                      />
                    ))}
                  </div>
                </a>
              </Link>
            </OrderItemStyles>
          ))
        )}
      </OrderUl>
    </div>
  );
}

export default SingleOrder;
