import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import Head from 'next/head';

import styled from 'styled-components';
import DisplayError from './ErrorMessage';
import AddToCart from './AddToCart';

const SINGLE_PRODUCT_QUERY = gql`
  query SINGLE_PRODUCT_QUERY($id: ID!) {
    product(where: { id: $id }) {
      id
      name
      price
      description
      photo {
        image {
          publicUrlTransformed
        }
        altText
      }
    }
  }
`;

const ProductStyles = styled.div`
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  justify-content: center;
  align-items: top;
  gap: 2rem;
  max-width: var(--max-width);
  img {
    width: 100%;
    object-fit: contain;
  }
  button {
    background: none;
    border: none;
    border-bottom: 1px solid var(--red);
    font-size: 2rem;

    cursor: pointer;
  }
`;

export default function SingleProduct({ id }) {
  const { loading, error, data } = useQuery(SINGLE_PRODUCT_QUERY, {
    variables: { id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <DisplayError error={error} />;

  const { product } = data;
  if (!product) return <DisplayError error={{ message: 'No Product Found' }} />;
  return (
    <ProductStyles>
      <Head>
        <title>Sick Fits | {product.name}</title>
      </Head>
      <img
        src={product.photo?.image?.publicUrlTransformed}
        alt={product.photo?.altText}
      />
      <div className='detials'>
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <AddToCart id={product.id} />
      </div>
    </ProductStyles>
  );
}

SingleProduct.propTypes = {
  id: PropTypes.string.isRequired,
};
