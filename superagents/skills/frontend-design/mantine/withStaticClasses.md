# Mantine: withStaticClasses

`withStaticClasses` determines whether components should have static classes, for example, `mantine-Button-root`.
By default, static classes are enabled, to disable them set `withStaticClasses` to `false`:

```tsx
import { MantineProvider } from '@mantine/core';

function Demo() {
  return (
    <MantineProvider withStaticClasses={false}>
      {/* Your app here */}
    </MantineProvider>
  );
}
```