import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import styled from 'styled-components';

const Dot = styled.div`
  background: var(--red);
  color: white;
  border-radius: 50%;
  padding: 0.5rem;
  margin-left: 1rem;
  line-height: 2rem;
  min-width: 3rem;
  font-feature-settings: 'tnum';
  font-variant-numeric: tabular-nums;
`;

const AnimationStyles = styled.div`
  position: relative;
  .count {
    display: block;
    position: relative;
    transition: transform 0.4s;
    backface-visibility: hidden;
  }

  .count-enter {
    transform: scale(4) rotateX(180deg);
  }

  .count-enter-active {
    transform: rotateX(0);
  }

  .count-exit {
    position: absolute;
    top: 0;
    transform: rotateX(0);
  }

  .count-exit-active {
    transform: scale(4) rotateX(180deg);
  }
`;

function CartCount({ count }) {
  return (
    <AnimationStyles>
      <TransitionGroup>
        <CSSTransition
          unmountOnExit
          classNames="count"
          className="count"
          key={count}
          timeout={{ enter: 500, exit: 500 }}
        >
          <Dot>{count}</Dot>
        </CSSTransition>
      </TransitionGroup>
    </AnimationStyles>
  );
}

CartCount.propTypes = {
  count: PropTypes.number,
};
CartCount.defaultProps = {
  count: 0,
};

export default CartCount;
