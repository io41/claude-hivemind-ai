# Mantine: env

`env` prop can be used in test environment to disable some features that
might impact tests and/or make it harder to test components:

* transitions that mount/unmount child component with delay
* portals that render child component in a different part of the DOM

To enable test environment, set `env` to `test`:

```tsx
import { MantineProvider } from '@mantine/core';

function Demo() {
  return (
    <MantineProvider env="test">
      {/* Your app here */}
    </MantineProvider>
  );
}
```

Note that `env="test"` is indented to be used in test environment only with [Jest](https://mantine.dev/guides/jest) or [Vitest](https://mantine.dev/guides/vitest), do not use it in
the development or production environments. It is also not recommended to be used with
end-to-end testing tools like [Cypress](https://mantine.dev/guides/cypress) or [Playwright](https://mantine.dev/guides/playwright).


--------------------------------------------------------------------------------