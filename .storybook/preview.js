import React from 'react'
import '../civictechprojects/static/css/styles.scss';

const BREAKPOINTS = {
  mobile: 375,
  tablet: 768,
  desktop: 1024,
};

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    viewport: {
      viewports: {
        mobile1: {
          name: 'Mobile (375px)',
          styles: {
            width: `${BREAKPOINTS.mobile}px`,
            height: '667px',
          },
        },
        tablet1: {
          name: 'Tablet (768px)',
          styles: {
            width: `${BREAKPOINTS.tablet}px`,
            height: '1024px',
          },
        },
        desktop1: {
          name: 'Desktop (1024px)',
          styles: {
            width: `${BREAKPOINTS.desktop}px`,
            height: '768px',
          },
        },
      },
    },
  },
}

export default preview
