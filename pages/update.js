import PropTypes from 'prop-types';
import UpdateProduct from '../components/UpdateProduct';
import { privateRoute } from '../lib/PrivateRoute';

export default function UpdateProductPage({ query }) {
  return (
    <div>
      <UpdateProduct id={query.id} />
    </div>
  );
}

UpdateProductPage.propTypes = {
  query: PropTypes.object.isRequired,
};

export const getServerSideProps = privateRoute;
