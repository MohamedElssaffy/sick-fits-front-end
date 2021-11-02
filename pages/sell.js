import CreateProduct from '../components/CreateProduct';
import { privateRoute } from '../lib/PrivateRoute';

export default function SellPage() {
  return (
    <div>
      <CreateProduct />
    </div>
  );
}

export const getServerSideProps = privateRoute;
