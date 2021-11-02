import { useLazyQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { createContext, useContext, useMemo, useState } from 'react';

const initState = {
  user: null,
  setState: () => {},
};

export const LocalUserStateContext = createContext(initState);

const LocalUserStateProvider = LocalUserStateContext.Provider;

export const CURRENT_USER_QUERY = gql`
  query {
    authenticatedItem {
      ... on User {
        id
        email
        name
        cart {
          id
          quantity
          product {
            name
            description
            price
            photo {
              image {
                publicUrlTransformed
              }
            }
          }
        }
      }
    }
  }
`;

const SIGN_IN_MUTATION = gql`
  mutation SIGN_IN_MUTATION($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
      ... on UserAuthenticationWithPasswordSuccess {
        sessionToken
        item {
          id
          email
          name
        }
      }

      ... on UserAuthenticationWithPasswordFailure {
        code
        message
      }
    }
  }
`;

const SIGN_OUT_MUTATION = gql`
  mutation SIGN_OUT_MUTATION {
    endSession
  }
`;

// eslint-disable-next-line react/prop-types
const UserStateProvider = ({ children }) => {
  const [state, setState] = useState({ ...initState });

  const context = { ...state, setState };

  return (
    <LocalUserStateProvider value={context}>{children}</LocalUserStateProvider>
  );
};

export function useUser() {
  const all = useContext(LocalUserStateContext);
  const { setState } = all;
  const [getSignInUser] = useLazyQuery(CURRENT_USER_QUERY, {
    fetchPolicy: 'network-only',
    onCompleted(data) {
      const user = data?.authenticatedItem;
      if (user) {
        setState({ user });
        document.cookie = `user=${JSON.stringify(user)}`;
      } else {
        document.cookie = 'user= ; expires = Thu, 01 Jan 1970 00:00:00 GMT';
      }
    },
    onError() {
      document.cookie = 'user= ; expires = Thu, 01 Jan 1970 00:00:00 GMT';
    },
  });
  const [signout] = useMutation(SIGN_OUT_MUTATION);
  const [signin] = useMutation(SIGN_IN_MUTATION);

  const methods = useMemo(
    () => ({
      getUser: () => {
        getSignInUser();
      },

      signoutUser: async () => {
        await signout();
        setState({ user: null });
        document.cookie = 'user= ; expires = Thu, 01 Jan 1970 00:00:00 GMT';
      },
      signinUser: async (variables) => {
        const { data } = await signin({ variables });
        const error =
          data?.authenticateUserWithPassword.__typename ===
            'UserAuthenticationWithPasswordFailure' &&
          'Invalid Email or Password';
        if (error) {
          return error;
        }
        methods.getUser();
      },
    }),
    [getSignInUser, setState, signin, signout]
  );

  return { ...all, ...methods };
}

export { UserStateProvider };
