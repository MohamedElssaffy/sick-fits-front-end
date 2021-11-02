import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import Form from './styles/Form';
import useForm from '../lib/useForm';
import DisplayError from './ErrorMessage';
// import { CURRENT_USER_QUERY } from '../lib/useUser';

const RESET_REQUEST_MUTATION = gql`
  mutation RESET_REQUEST_MUTATION($email: String!) {
    sendUserPasswordResetLink(email: $email) {
      code
      message
    }
  }
`;

export default function ResetRequest() {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
  });

  const [restRequest, { loading, data }] = useMutation(RESET_REQUEST_MUTATION, {
    variables: inputs,
    // refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await restRequest().catch(console.error(e.message));

    resetForm();
  };

  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <h2>Reset Password</h2>
      <DisplayError
        error={
          data?.sendUserPasswordResetLink?.code === 'IDENTITY_NOT_FOUND'
            ? {
                message: 'There is no account with this email',
              }
            : null
        }
      />
      {data?.sendUserPasswordResetLink === null && (
        <p>Success! Please Check your email for a link!</p>
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

        <button type="submit">Resuest to Reset Password!</button>
      </fieldset>
    </Form>
  );
}
