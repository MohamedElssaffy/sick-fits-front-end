import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { perPage } from '../config';
import { useUser } from '../lib/userContext';
import Product from './Product';

export const ALL_PRODUCTS_FOR_SIGNIN_QUERY = gql`
  query ALL_PRODUCTS_FOR_SIGNIN_QUERY($skip: Int = 0, $take: Int) {
    products(skip: $skip, take: $take) {
      id
      name
      price
      description
      user {
        id
      }
      photo {
        id
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;

const ALL_PRODUCTS_QUERY = gql`
  query ALL_PRODUCTS_FOR_SIGNIN_QUERY($skip: Int = 0, $take: Int) {
    products(skip: $skip, take: $take) {
      id
      name
      price
      description
      photo {
        id
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;

const ProductsListStyles = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export default function Products({ page }) {
  const { user } = useUser();
  const { data, error, loading } = useQuery(
    user && user.id ? ALL_PRODUCTS_FOR_SIGNIN_QUERY : ALL_PRODUCTS_QUERY,
    {
      variables: {
        skip: page * perPage - perPage,
        take: perPage,
      },
    }
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <ProductsListStyles>
        {data?.products.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </ProductsListStyles>
    </div>
  );
}

Products.propTypes = {
  page: PropTypes.number.isRequired,
};
