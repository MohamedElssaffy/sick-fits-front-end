import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { useUser } from '../lib/userContext';

const ADD_TO_CART_MUTATION = gql`
  mutation ADD_TO_CART_MUTATION($id: ID!) {
    addToCart(productId: $id) {
      id
    }
  }
`;
function AddToCart({ id }) {
  const { getUser, user } = useUser();
  const [addtoCart, { loading }] = useMutation(ADD_TO_CART_MUTATION, {
    variables: { id },
    onCompleted() {
      getUser();
    },
  });

  const router = useRouter();

  const handleAddToCart = () => {
    if (!user) {
      router.push('/signin');
      return;
    }

    addtoCart();
  };

  return (
    <button disabled={loading} onClick={handleAddToCart} type="button">
      Add{loading && 'ing'} To Cart
    </button>
  );
}

AddToCart.propTypes = {
  id: PropTypes.string,
};

export default AddToCart;
