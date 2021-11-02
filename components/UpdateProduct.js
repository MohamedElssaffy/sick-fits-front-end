import Router from 'next/router';
import gql from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/client';
import PropTypes from 'prop-types';

import useForm from '../lib/useForm';
import Form from './styles/Form';
import DisplayError from './ErrorMessage';

const SINGLE_PRODUCT_QUERY = gql`
  query SINGLE_PRODUCT_QUERY($id: ID!) {
    Product(where: { id: $id }) {
      id
      name
      price
      description
    }
  }
`;

const UPDATE_PRODUCT_MUTATION = gql`
  mutation UPDATE_PRODUCT_MUTATION(
    $id: ID!
    $name: String
    $price: Int
    $description: String
  ) {
    updateProduct(
      id: $id
      data: { name: $name, price: $price, description: $description }
    ) {
      id
      name
      price
      description
    }
  }
`;

export default function UpdateProduct({ id }) {
  const { loading, error, data } = useQuery(SINGLE_PRODUCT_QUERY, {
    variables: { id },
  });

  const { inputs, clearForm, handleChange } = useForm(
    {
      name: data?.Product?.name,
      price: data?.Product?.price,
      description: data?.Product?.description,
    },
    true
  );

  const [updateProduct, updateRes] = useMutation(UPDATE_PRODUCT_MUTATION);

  if (loading) return <p>Loading...</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await updateProduct({
      variables: {
        id,
        ...inputs,
      },
    });
    clearForm();

    Router.push({
      pathname: `/product/${res.data.updateProduct.id}`,
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <DisplayError error={updateRes.error || error} />

      <fieldset disabled={updateRes.loading} aria-busy={updateRes.loading}>
        <label htmlFor="name">
          Product Name
          <input
            type="text"
            id="name"
            name="name"
            placeholder="ProductName"
            value={inputs.name || ''}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="price">
          Product Price
          <input
            type="number"
            id="price"
            name="price"
            placeholder="Productprice"
            value={inputs.price || 0}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="description">
          Product Description
          <textarea
            type="text"
            id="description"
            name="description"
            placeholder="Product Description"
            value={inputs.description || ''}
            onChange={handleChange}
          />
        </label>

        <button type="submit">Save Chages</button>
      </fieldset>
    </Form>
  );
}

UpdateProduct.propTypes = {
  id: PropTypes.string.isRequired,
};
