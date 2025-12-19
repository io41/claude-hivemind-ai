# Mantine: cssVariablesSelector

`cssVariablesSelector` is a CSS selector to which [CSS variables](https://mantine.dev/styles/css-variables/) should be added.
By default, variables are applied to `:root` and `:host`. `MantineProvider` generates CSS variables based
on given [theme override](https://mantine.dev/theming/theme-object/) and `cssVariablesResolver`, then these variables are
rendered into `<style />` tag next to your application.
You can learn more about Mantine CSS variables in the [CSS variables guide](https://mantine.dev/styles/css-variables/).

```tsx
import { MantineProvider } from '@mantine/core';

function Demo() {
  return (
    <MantineProvider cssVariablesSelector="html">
      {/* Your app here */}
    </MantineProvider>
  );
}
```