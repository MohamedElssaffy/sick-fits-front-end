export const privateRoute = async ({ req }) => {
  const { user } = req.cookies;

  if (!user) {
    return {
      redirect: {
        destination: '/signin',
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};
