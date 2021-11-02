import Router from 'next/router';
import { useUser } from '../lib/userContext';

export default function SignOut() {
  const { signoutUser } = useUser();
  const handleClick = async () => {
    await signoutUser();
    Router.push('/');
  };
  return (
    <button type="button" onClick={handleClick}>
      Sign Out
    </button>
  );
}
