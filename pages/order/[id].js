import React from 'react';
import PropTypes from 'prop-types';
import SingleOrder from '../../components/SingleOrder';

function SingeleOrderPage({ query }) {
  return <SingleOrder id={query.id} />;
}

SingeleOrderPage.propTypes = {
  query: PropTypes.object,
};

export default SingeleOrderPage;
