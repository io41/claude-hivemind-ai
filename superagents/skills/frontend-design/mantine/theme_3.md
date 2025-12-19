# Mantine: theme

Pass [theme object](https://mantine.dev/theming/theme-object) override to `theme` prop. It will be merged with the default
theme and used in all components.

```tsx
import { createTheme, MantineProvider } from '@mantine/core';

const theme = createTheme({
  fontFamily: 'Open Sans, sans-serif',
  primaryColor: 'cyan',
});

function Demo() {
  return (
    <MantineProvider theme={theme}>
      {/* Your app here */}
    </MantineProvider>
  );
}
```