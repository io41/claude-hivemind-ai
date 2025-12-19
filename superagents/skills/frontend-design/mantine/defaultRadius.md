# Mantine: defaultRadius

`theme.defaultRadius` controls the default `border-radius` property in most components, for example, [Button](https://mantine.dev/core/button) or [TextInput](https://mantine.dev/core/text-input).
You can set to either one of the values from `theme.radius` or a number/string to use exact value. Note that numbers are treated as pixels, but
converted to rem. For example, `theme.defaultRadius: 4` will be converted to `0.25rem`.
You can learn more about rem conversion in the [rem units guide](https://mantine.dev/styles/rem).

#### Example: defaultRadiusConfigurator

```tsx
import { MantineProvider, TextInput, Button } from '@mantine/core';

function Demo() {
  return (
    <MantineProvider theme={{ defaultRadius: '' }}>
      <Button fullWidth>Button with defaultRadius</Button>
      <TextInput mt="sm" label="TextInput with defaultRadius" placeholder="TextInput with default radius" />
    </MantineProvider>
  );
}
```