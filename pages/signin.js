// import gql from 'graphql-tag';
import styled from 'styled-components';
import ResetRequest from '../components/ResetRequest';
import SignIn from '../components/SignIn';
import SignUp from '../components/SignUp';

// import { createClient } from '../lib/withData';

const GridStyles = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
`;

export default function SignInPage() {
  return (
    <GridStyles>
      <SignIn />
      <SignUp />
      <ResetRequest />
    </GridStyles>
  );
}

export const getServerSideProps = async ({ req }) => {
  const { user } = req.cookies;

  if (user) {
    return {
      redirect: {
        destination: '/',
        permenant: false,
      },
    };
  }
  return { props: {} };
};
