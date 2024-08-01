/** @type { import('@storybook/react-webpack5').StorybookConfig } */

const merge = require('webpack-merge')
const webpack = require("webpack");
const common = require('../webpack.common.js');

const config = {
  stories: ['../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-viewport',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  webpackFinal: async (config) => {
    console.info("merge",merge)
    const newConfig = merge(config, common, {
      mode: 'development',
      devtool: 'source-map',
    })
    return newConfig
  }
}
export default config
