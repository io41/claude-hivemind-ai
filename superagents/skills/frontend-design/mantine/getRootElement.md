# Mantine: getRootElement

`getRootElement` is a function that returns the root application (usually `html`) element to set `data-mantine-color-scheme` attribute.
Default value is `() => document.documentElement` which means that `data-mantine-color-scheme`
attribute will be added to `<html />` tag. You can learn more about color scheme management in the
[color schemes guide](https://mantine.dev/theming/color-schemes).

```tsx
import { MantineProvider } from '@mantine/core';

const getRootElement = () =>
  typeof window === 'undefined' ? undefined : document.body;

function Demo() {
  return (
    <MantineProvider getRootElement={getRootElement}>
      {/* Your app here */}
    </MantineProvider>
  );
}
```