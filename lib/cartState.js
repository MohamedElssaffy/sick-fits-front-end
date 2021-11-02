const { createContext, useState, useContext } = require('react');

const LocalCartStateContext = createContext();

const LocalCartStateProvider = LocalCartStateContext.Provider;

// eslint-disable-next-line react/prop-types
const CartStateProvider = ({ children }) => {
  const [cartState, setCartState] = useState(false);

  const openCart = () => setCartState(true);
  const closeCart = () => setCartState(false);

  return (
    <LocalCartStateProvider value={{ cartState, openCart, closeCart }}>
      {children}
    </LocalCartStateProvider>
  );
};

const useCart = () => {
  const all = useContext(LocalCartStateContext);
  return all;
};

export { CartStateProvider, useCart };
