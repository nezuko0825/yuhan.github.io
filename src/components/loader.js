import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import anime from 'animejs';
import styled from 'styled-components';
import { IconLoader } from '@components/icons';

const StyledLoader = styled.div`
  ${({ theme }) => theme.mixins.flexCenter};
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  background-color: var(--dark-navy);
  z-index: 99;

  .logo-wrapper {
    width: max-content;
    max-width: 110px;
    opacity: ${({ isMounted }) => (isMounted ? 1 : 0)};
    transition: var(--transition);

    svg {
      width: 100%;
      height: 100%;
      display: block;
      fill: none;
      user-select: none;

      #ZH {
        opacity: 0;
      }
    }
  }
`;

const Loader = ({ finishLoading }) => {
  const [isMounted, setIsMounted] = useState(false);

  const animateLoader = () => {
    const timeline = anime.timeline({
      complete: () => finishLoading(),
    });

    timeline
      .add({
        targets: '#logo path',
        delay: 250,
        duration: 1400,
        easing: 'easeInOutQuart',
        strokeDashoffset: [anime.setDashoffset, 0],
      })
      .add({
        targets: '#logo #ZH',
        duration: 600,
        easing: 'easeInOutQuart',
        opacity: 1,
      })
      .add({
        targets: '#logo',
        delay: 400,
        duration: 350,
        easing: 'easeInOutQuart',
        opacity: 0,
        scale: 0.15,
      })
      .add({
        targets: '.loader',
        duration: 250,
        easing: 'easeInOutQuart',
        opacity: 0,
        zIndex: -1,
      });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsMounted(true);
    }, 10);

    animateLoader();

    return () => clearTimeout(timeout);
  }, []);

  return (
    <StyledLoader className="loader" isMounted={isMounted}>
      <Helmet bodyAttributes={{ class: 'hidden' }} />

      <div className="logo-wrapper">
        <IconLoader />
      </div>
    </StyledLoader>
  );
};

Loader.propTypes = {
  finishLoading: PropTypes.func.isRequired,
};

export default Loader;