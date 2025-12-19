# Mantine: withCssVariables

`withCssVariables` determines whether theme CSS variables should be added to given `cssVariablesSelector`.
By default, it is set to `true`, you should not change it unless you want to manage CSS variables
via `.css` file (Note that in this case you will need to generate all theme tokens
that are not a part of the default theme on your side).

```tsx
import { MantineProvider } from '@mantine/core';

function Demo() {
  return (
    <MantineProvider withCssVariables={false}>
      {/* Your app here */}
    </MantineProvider>
  );
}
```