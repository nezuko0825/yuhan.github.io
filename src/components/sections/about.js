import React, { useEffect, useRef } from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledAboutSection = styled.section`
  max-width: 920px;

  .inner {
    display: grid;
    grid-template-columns: 3fr 2fr;
    gap: 60px;

    @media (max-width: 768px) {
      display: block;
    }
  }
`;

const StyledText = styled.div`
  p {
    margin-bottom: 18px;
  }

  .skills-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(140px, 220px));
    gap: 10px;
    padding: 0;
    margin: 28px 0 0;
    list-style: none;

    li {
      position: relative;
      padding-left: 22px;
      font-family: var(--font-mono);
      font-size: var(--fz-xs);

      &:before {
        content: '▹';
        position: absolute;
        left: 0;
        color: var(--green);
      }
    }
  }
`;

const StyledPic = styled.div`
  position: relative;
  max-width: 320px;

  @media (max-width: 768px) {
    width: 75%;
    margin: 50px auto 0;
  }

  .wrapper {
    ${({ theme }) => theme.mixins.boxShadow};
    position: relative;
    border-radius: var(--border-radius);
    background: var(--green);

    &:hover,
    &:focus {
      transform: translate(-5px, -5px);

      &:after {
        transform: translate(10px, 10px);
      }

      .img {
        filter: none;
        mix-blend-mode: normal;
      }
    }

    .img {
      border-radius: var(--border-radius);
      mix-blend-mode: multiply;
      filter: grayscale(100%) contrast(1.1);
      transition: var(--transition);
    }

    &:before,
    &:after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: var(--border-radius);
      transition: var(--transition);
    }

    &:before {
      inset: 0;
      background-color: var(--navy);
      mix-blend-mode: screen;
    }

    &:after {
      border: 2px solid var(--green);
      top: 16px;
      left: 16px;
      z-index: -1;
    }
  }
`;

const About = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    sr.reveal(revealContainer.current, srConfig());
  }, [prefersReducedMotion]);

  const skills = [
    'React',
    'Next.js',
    'TypeScript',
    'Node.js',
    'Nest.js',
    'FastAPI',
    'React Native',
    'Tailwind CSS',
    'PostgreSQL',
    'Docker',
  ];

  return (
    <StyledAboutSection id="about" ref={revealContainer}>
      <h2 className="numbered-heading">About Me</h2>

      <div className="inner">
        <StyledText>
          <div>
            <p>
              I’m a full stack developer with 5+ years of experience building
              scalable web applications, backend systems, and modern user
              interfaces. I enjoy creating products that are fast, reliable,
              and easy to use.
            </p>

            <p>
              My experience includes payment platforms, AI-powered
              applications, real-time dashboards, and cross-platform mobile
              apps. I’ve worked extensively with React, Next.js, Node.js,
              Nest.js, and Python to deliver production-ready solutions for
              global teams and businesses.
            </p>

            <p>
              Recently, I’ve been focused on performance optimization,
              reusable frontend architecture, API development, and integrating
              modern services like Stripe, OAuth authentication, and AI APIs.
            </p>

            <p>
              Here are some technologies I’ve been working with recently:
            </p>
          </div>

          <ul className="skills-list">
            {skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </StyledText>

        <StyledPic>
          <div className="wrapper">
            <StaticImage
              className="img"
              src="../../images/me.jpg"
              width={500}
              quality={95}
              formats={['AUTO', 'WEBP', 'AVIF']}
              alt="Profile photo"
            />
          </div>
        </StyledPic>
      </div>
    </StyledAboutSection>
  );
};

export default About;