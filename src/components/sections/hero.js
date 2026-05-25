import React, { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { navDelay, loaderDelay } from '@utils';
import { usePrefersReducedMotion } from '@hooks';

const StyledHeroSection = styled.section`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  align-items: flex-start;
  min-height: 100vh;
  padding: 0;

  @media (max-height: 700px) and (min-width: 700px),
    (max-width: 480px) {
    min-height: auto;
    padding-top: var(--nav-height);
  }

  .intro {
    margin-bottom: 24px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: clamp(14px, 5vw, 18px);
    font-weight: 400;
  }

  .headline {
    margin: 0;
    font-size: clamp(40px, 8vw, 78px);
    line-height: 1.1;
  }

  .subheadline {
    margin-top: 12px;
    color: var(--slate);
    font-size: clamp(32px, 7vw, 68px);
    line-height: 1;
  }

  .description {
    margin-top: 28px;
    max-width: 620px;
    color: var(--light-slate);
  }

  .cta-group {
    display: flex;
    gap: 18px;
    margin-top: 50px;
    flex-wrap: wrap;
  }

  .primary-btn {
    ${({ theme }) => theme.mixins.bigButton};
  }

  .secondary-btn {
    ${({ theme }) => theme.mixins.bigButton};
    background: transparent;
  }
`;

const Hero = () => {
  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const timeout = setTimeout(() => {
      setIsMounted(true);
    }, navDelay);

    return () => clearTimeout(timeout);
  }, [prefersReducedMotion]);

  const content = [
    <p className="intro">Hello, I’m</p>,

    <h1 className="headline">Zhang Yu Han.</h1>,

    <h2 className="subheadline">
      
      Crafting scalable web apps.
    </h2>,

    <div className="description">
      <p>
        I specialize in developing high-performance web applications and backend
        systems with React, Next.js, Node.js, and Python. Over the last 5+
        years, I’ve worked on payment platforms, AI-powered products, internal
        dashboards, and mobile applications used by global teams.
      </p>

      <p>
        Currently focused on building reliable and user-friendly systems with
        modern frontend architecture, scalable APIs, and clean engineering
        practices.
      </p>
    </div>,

    <div className="cta-group">
      <a
        className="primary-btn"
        href="/resume.pdf"
        target="_blank"
        rel="noopener noreferrer">
        View Resume
      </a>

      <a
        className="secondary-btn"
        href="#projects">
        Explore Projects
      </a>
    </div>,
  ];

  return (
    <StyledHeroSection id="hero">
      {prefersReducedMotion ? (
        <>
          {content.map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        </>
      ) : (
        <TransitionGroup component={null}>
          {isMounted &&
            content.map((item, index) => (
              <CSSTransition
                key={index}
                classNames="fadeup"
                timeout={loaderDelay}>
                <div
                  style={{
                    transitionDelay: `${index * 120}ms`,
                  }}>
                  {item}
                </div>
              </CSSTransition>
            ))}
        </TransitionGroup>
      )}
    </StyledHeroSection>
  );
};

export default Hero;