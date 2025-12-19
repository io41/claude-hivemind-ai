# Mantine: deduplicateCssVariables

`deduplicateCssVariables` determines whether CSS variables should be deduplicated: if CSS variable has the same value as in default theme, it is not added in the runtime.
By default, it is set to `true`. If set to `false`, all Mantine CSS variables will be added in `<style />` tag
even if they have the same value as in the default theme.

```tsx
import { MantineProvider } from '@mantine/core';

function Demo() {
  return (
    <MantineProvider deduplicateCssVariables={false}>
      {/* Your app here */}
    </MantineProvider>
  );
}
```