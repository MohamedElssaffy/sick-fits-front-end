import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { ALL_PRODUCTS_FOR_SIGNIN_QUERY } from './Products';

const DELETE_PRODUCT_MUTATION = gql`
  mutation DELETE_PRODUCT_MUTATION($id: ID!) {
    deleteProduct(where: { id: $id }) {
      id
    }
  }
`;

const update = (cache, payload) => {
  cache.evict(cache.identify(payload.data.deleteProduct));
};

export default function DeleteProduct({ id, children }) {
  const [loading, setLoading] = useState(false);

  const [deleteProduct] = useMutation(DELETE_PRODUCT_MUTATION, {
    variables: { id },
    update,
    onError: () => {
      setLoading(false);
    },
  });

  return (
    <button
      type='button'
      disabled={loading}
      onClick={async () => {
        // eslint-disable-next-line no-restricted-globals
        if (confirm('Are you sure you want to delete this item')) {
          setLoading(true);
          await deleteProduct().catch((err) => alert(err.message));
        }
      }}
    >
      {children}
    </button>
  );
}

DeleteProduct.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.node,
};
