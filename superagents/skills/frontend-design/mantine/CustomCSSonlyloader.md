# Mantine: Custom CSS only loader

Note that in order for `size` and `color` props to work with custom loaders, you need to
use `--loader-size` and `--loader-color` CSS variables in your loader styles.

#### Example: cssLoader

```tsx
import { MantineProvider, Loader } from '@mantine/core';
import { CssLoader } from './CssLoader';

const theme = createTheme({
  components: {
    Loader: Loader.extend({
      defaultProps: {
        loaders: { ...Loader.defaultLoaders, custom: CssLoader },
        type: 'custom',
      },
    }),
  },
});

function Demo() {
  return (
    <MantineThemeProvider theme={theme}>
      <Loader />
    </MantineThemeProvider>
  );
}
```