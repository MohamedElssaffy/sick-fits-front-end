/* eslint-disable react/jsx-props-no-spreading */
import { ApolloProvider } from '@apollo/client';
import Router from 'next/router';
import { parseCookies } from 'nookies';
import NProgress from 'nprogress';
import PropTypes from 'prop-types';
import Page from '../components/Page';
import '../components/styles/nprogress.css';
import { CartStateProvider } from '../lib/cartState';
import { UserStateProvider } from '../lib/userContext';
import withData from '../lib/withData';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({ Component, pageProps, apollo, cookie }) {
  return (
    <ApolloProvider client={apollo}>
      <UserStateProvider>
        <CartStateProvider>
          <Page cookie={cookie}>
            <Component {...pageProps} />
          </Page>
        </CartStateProvider>
      </UserStateProvider>
    </ApolloProvider>
  );
}

MyApp.getInitialProps = async ({ Component, ctx }) => {
  let pageProps = {};
  const cookie = parseCookies(ctx);
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  pageProps.query = ctx.query;

  return { pageProps, cookie };
};

MyApp.propTypes = {
  Component: PropTypes.elementType,
  pageProps: PropTypes.object,
  apollo: PropTypes.object,
  cookie: PropTypes.string,
};

export default withData(MyApp);
