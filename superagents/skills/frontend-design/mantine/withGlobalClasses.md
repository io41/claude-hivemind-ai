# Mantine: withGlobalClasses

`withGlobalClasses` determines whether global classes should be added with `<style />` tag.
Global classes are required for `hiddenFrom`/`visibleFrom` and `lightHidden`/`darkHidden` props to work.
By default, global classes are enabled, to disable them set `withGlobalClasses` to `false`. Note that
disabling global classes may break styles of some components.

```tsx
import { MantineProvider } from '@mantine/core';

function Demo() {
  return (
    <MantineProvider withGlobalClasses={false}>
      {/* Your app here */}
    </MantineProvider>
  );
}
```