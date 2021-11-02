import { useState } from 'react';
import Router from 'next/router';
import useForm from '../lib/useForm';
import { useUser } from '../lib/userContext';
import DisplayError from './ErrorMessage';
import Form from './styles/Form';

export default function SignIn() {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
    password: '',
  });

  const { signinUser, user } = useUser();
  if (user) {
    Router.push('/');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await signinUser(inputs);

    setLoading(false);
    if (res) {
      return setError(res);
    }
    resetForm();
  };

  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <h2>Sign In With Your Account</h2>
      <DisplayError error={{ message: error }} />
      <fieldset disabled={loading} aria-busy={loading}>
        <label htmlFor="email">
          Email
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Your Email Address"
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
        <button type="submit">Sign In!</button>
      </fieldset>
    </Form>
  );
}
