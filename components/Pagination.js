import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Link from 'next/link';
import Head from 'next/head';
import PropTypes from 'prop-types';

import PaginationStyles from './styles/PaginationStyles';
import DisplayError from './ErrorMessage';
import { perPage } from '../config';

export const PAGINTATION_QUERY = gql`
  query {
    productsCount
  }
`;

export default function Pagination({ page }) {
  const { data, error, loading } = useQuery(PAGINTATION_QUERY);

  if (loading) return <p>Loading...</p>;

  if (error) return <DisplayError error={error} />;

  const count = data.productsCount;

  const pageCount = Math.ceil(count / perPage);

  return (
    <PaginationStyles>
      <Head>
        <title>
          Sick Fits - Page {page} of {pageCount}
        </title>
      </Head>
      <Link href={`/products/${page - 1}`}>
        <a aria-disabled={page <= 1}> &larr; Prev</a>
      </Link>
      <p>
        Page {page} of {pageCount}{' '}
      </p>
      <p>{count} Item Total</p>
      <Link href={`/products/${page + 1}`}>
        <a aria-disabled={page >= pageCount}> Next &rarr;</a>
      </Link>
    </PaginationStyles>
  );
}

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
};
