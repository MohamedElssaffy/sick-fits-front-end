import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import Form from './styles/Form';
import useForm from '../lib/useForm';
import DisplayError from './ErrorMessage';
// import { CURRENT_USER_QUERY } from '../lib/useUser';

const SIGN_UP_MUTATION = gql`
  mutation SIGN_UP_MUTATION(
    $name: String!
    $email: String!
    $password: String!
  ) {
    createUser(data: { name: $name, email: $email, password: $password }) {
      id
      email
    }
  }
`;

export default function SignUp() {
  const { inputs, handleChange, resetForm } = useForm({
    name: '',
    email: '',
    password: '',
  });

  const [signun, { loading, data, error }] = useMutation(SIGN_UP_MUTATION, {
    variables: inputs,
    // refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signun().catch(console.error(e.message));

    resetForm();
  };

  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <h2>Create An Account</h2>
      <DisplayError
        error={
          error?.message.includes('duplicate')
            ? { message: 'This account is already exist' }
            : error
        }
      />
      {data?.createUser && (
        <p>Account has been created successfuly please login</p>
      )}
      <fieldset disabled={loading} aria-busy={loading}>
        <label htmlFor="name">
          Your name
          <input
            type="text"
            name="name"
            placeholder="Your name"
            autoComplete="name"
            required
            value={inputs.name}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="email">
          Email
          <input
            type="email"
            name="email"
            placeholder="Your Email Address"
            autoComplete="email"
            required
            value={inputs.email}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="password">
          Password
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            minLength="8"
            value={inputs.password}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Sign In!</button>
      </fieldset>
    </Form>
  );
}
