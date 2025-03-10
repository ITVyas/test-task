import type { Preview } from '@storybook/react'
import '../src/index.css';
import { getPokemonNames } from '../src/api/requests';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },

  loaders: [
    async () => ({
      options: await getPokemonNames()
    }),
  ],
};

export default preview;