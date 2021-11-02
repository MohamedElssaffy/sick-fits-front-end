import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import gql from 'graphql-tag';
import nProgress from 'nprogress';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import styled from 'styled-components';

import { useRouter } from 'next/dist/client/router';
import SickButton from './styles/SickButton';
import { useCart } from '../lib/cartState';
import { useUser } from '../lib/userContext';

const CheckoutFormStyles = styled.form`
  box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 0.5rem;
  padding: 1rem;
  display: grid;
  gap: 1rem;
  .error-message {
    font-size: 2rem;
  }
`;

const CHECKOUT_MUTATION = gql`
  mutation CHECKOUT_MUTATION($token: String!) {
    checkout(token: $token) {
      id
      total
      charge
      items {
        id
        name
      }
    }
  }
`;

const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

function CheckoutForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const router = useRouter();
  const { getUser } = useUser();
  const { closeCart } = useCart();

  const [checkout, { error: graphQlError }] = useMutation(CHECKOUT_MUTATION, {
    onCompleted() {
      getUser();
    },
  });

  const stripe = useStripe();

  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    nProgress.start();

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (error) {
      setError(error);
      nProgress.done();
      return;
    }

    const order = await checkout({ variables: { token: paymentMethod.id } });

    router.push({
      pathname: '/order/[id]',
      query: { id: order.data.checkout.id },
    });

    closeCart();

    setLoading(false);
    nProgress.done();
  };

  return (
    <CheckoutFormStyles onSubmit={handleSubmit}>
      {error && <p className="error-message">{error.message}</p>}
      {graphQlError && <p className="error-message">{graphQlError.message}</p>}
      <CardElement />
      <SickButton>Checkout</SickButton>
    </CheckoutFormStyles>
  );
}

export default function CheckOut() {
  return (
    <Elements stripe={stripeLib}>
      <CheckoutForm />
    </Elements>
  );
}
