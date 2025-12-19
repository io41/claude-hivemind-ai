# Mantine: classNamesPrefix

`classNamesPrefix` is a prefix for components static classes (for example `{selector}-Text-root`).
Default value is `mantine` – all components will have `mantine-` prefix in their **static classes**.

```tsx
import { MantineProvider, Text } from '@mantine/core';

function Demo() {
  return (
    <MantineProvider>
      <Text>Just some text</Text>
    </MantineProvider>
  );
}
```

In this case (default `classNamesPrefix`), [Text](https://mantine.dev/core/text) component will have the following classes:

* `mantine-focus-auto` – global utility class
* `m-3nrA4eL` – component class, usually a random string, with this class library styles are applied
* `mantine-Text-root` – component static class, part of [Styles API](https://mantine.dev/styles/styles-api)

With `classNamesPrefix` you can change only **static class**:

```tsx
import { MantineProvider, Text } from '@mantine/core';

function Demo() {
  return (
    <MantineProvider classNamesPrefix="app">
      <Text>Just some text</Text>
    </MantineProvider>
  );
}
```

Now [Text](https://mantine.dev/core/text) component will have the following classes:

* `mantine-focus-auto` – `classNamesPrefix` does not impact global utility classes – it is static and **cannot be changed**
* `m-3nrA4eL` – `classNamesPrefix` does not impact library class – it is static and **cannot be changed**
* `app-Text-root` – component static class has `classNamesPrefix` instead of `mantine`