import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import Router from 'next/router';

import useForm from '../lib/useForm';
import { useUser } from '../lib/userContext';
import DisplayError from './ErrorMessage';
import { PAGINTATION_QUERY } from './Pagination';
import { ALL_PRODUCTS_FOR_SIGNIN_QUERY } from './Products';
import Form from './styles/Form';

const CREATE_PRODUCT_MUTATION = gql`
  mutation CREATE_PRODUCT_MUTATION(
    $name: String!
    $price: Int!
    $description: String!
    $image: Upload
    $userId: ID!
  ) {
    createProduct(
      data: {
        name: $name
        price: $price
        description: $description
        photo: { create: { image: $image, altText: $name } }
        status: "AVAILABLE"
        user: { connect: { id: $userId } }
      }
    ) {
      id
      name
    }
  }
`;

export default function CreateProduct() {
  const { inputs, handleChange, clearForm } = useForm({
    image: '',
    name: 'product',
    price: 5165,
    description: 'a test description',
  });
  const { user } = useUser();
  const [createProduct, { loading, error }] = useMutation(
    CREATE_PRODUCT_MUTATION,
    {
      variables: { ...inputs, userId: user?.id },
      refetchQueries: [
        { query: ALL_PRODUCTS_FOR_SIGNIN_QUERY },
        { query: PAGINTATION_QUERY },
      ],
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await createProduct();
    clearForm();

    Router.push({
      pathname: `/product/${res.data.createProduct.id}`,
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <DisplayError error={error} />

      <fieldset disabled={loading} aria-busy={loading}>
        <label htmlFor="image">
          Product Image
          <input
            type="file"
            required
            id="image"
            name="image"
            onChange={handleChange}
          />
        </label>
        <label htmlFor="name">
          Product Name
          <input
            type="text"
            id="name"
            name="name"
            placeholder="ProductName"
            value={inputs.name}
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
            value={inputs.price}
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
            value={inputs.description}
            onChange={handleChange}
          />
        </label>

        <button type="submit">+Add Product</button>
      </fieldset>
    </Form>
  );
}
