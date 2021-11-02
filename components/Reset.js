import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import PropTypes from 'prop-types';
import Form from './styles/Form';
import useForm from '../lib/useForm';
import DisplayError from './ErrorMessage';
// import { CURRENT_USER_QUERY } from '../lib/useUser';

const RESET_MUTATION = gql`
  mutation RESET_MUTATION(
    $email: String!
    $password: String!
    $token: String!
  ) {
    redeemUserPasswordResetToken(
      email: $email
      password: $password
      token: $token
    ) {
      code
      message
    }
  }
`;

export default function Reset({ token }) {
  const { inputs, handleChange, resetForm } = useForm({
    token,
    email: '',
    password: '',
  });

  const [resetPassword, { loading, data, validationError }] = useMutation(
    RESET_MUTATION,
    {
      variables: inputs,
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    await resetPassword().catch(console.error(e.message));

    resetForm();
  };

  const error = data?.redeemUserPasswordResetToken?.code
    ? data.redeemUserPasswordResetToken
    : null;

  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <h2>Reset Password</h2>
      <DisplayError error={error || validationError} />
      {data?.redeemUserPasswordResetToken === null && (
        <p>Success! You can sign in with new Password</p>
      )}

      <fieldset disabled={loading} aria-busy={loading}>
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
            value={inputs.password}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Resuest to Reset Password!</button>
      </fieldset>
    </Form>
  );
}

Reset.propTypes = {
  token: PropTypes.string,
};
