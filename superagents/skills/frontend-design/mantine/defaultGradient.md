# Mantine: defaultGradient

`theme.defaultGradient` controls the default gradient configuration for components that support `variant="gradient"`
([Button](https://mantine.dev/core/button), [ActionIcon](https://mantine.dev/core/action-icon), [Badge](https://mantine.dev/core/badge), etc.).

#### Example: defaultGradient

```tsx
import { MantineProvider, createTheme, Button } from '@mantine/core';

const theme = createTheme({
  defaultGradient: {
    from: 'orange',
    to: 'red',
    deg: 45,
  },
});

function Demo() {
  return (
    <MantineProvider theme={theme}>
      <Button variant="gradient">Button with custom default gradient</Button>
    </MantineProvider>
  );
}
```