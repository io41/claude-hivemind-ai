# Mantine: colorSchemeManager

`colorSchemeManager` is used to retrieve and set color scheme value in external storage. By default,
`MantineProvider` uses `window.localStorage` to store color scheme value, but you can pass your own
implementation to `colorSchemeManager` prop. You can learn more about color scheme management in the
[color schemes guide](https://mantine.dev/theming/color-schemes).

```tsx
import {
  localStorageColorSchemeManager,
  MantineProvider,
} from '@mantine/core';

const colorSchemeManager = localStorageColorSchemeManager({
  key: 'my-app-color-scheme',
});

function Demo() {
  return (
    <MantineProvider colorSchemeManager={colorSchemeManager}>
      {/* Your app here */}
    </MantineProvider>
  );
}
```