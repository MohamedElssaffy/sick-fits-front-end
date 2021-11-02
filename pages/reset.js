import PropTypes from 'prop-types';

import ResetRequest from '../components/ResetRequest';
import Reset from '../components/Reset';

export default function ResetPage({ query }) {
  if (!query?.token) {
    return (
      <div>
        <p>Sorry you must supply a token</p>
        <ResetRequest />
      </div>
    );
  }

  return (
    <div>
      <Reset token={query.token} />
    </div>
  );
}

ResetPage.propTypes = {
  query: PropTypes.object,
};
