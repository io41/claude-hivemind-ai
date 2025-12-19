# Mantine: defaultColorScheme

`defaultColorScheme` value is used when `colorSchemeManager` cannot retrieve the value from external
storage, for example during server side rendering or when the user hasn't selected a preferred color scheme.
Possible values are `light`, `dark` and `auto`. By default, color scheme value is `light`.
You can learn more about color scheme management in the [color schemes guide](https://mantine.dev/theming/color-schemes).

```tsx
import { MantineProvider } from '@mantine/core';

function Demo() {
  return (
    <MantineProvider defaultColorScheme="dark">
      {/* Your app here */}
    </MantineProvider>
  );
}
```