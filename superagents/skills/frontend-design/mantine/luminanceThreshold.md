# Mantine: luminanceThreshold

`luminanceThreshold` controls which luminance value is used to determine if text color should be light or dark.
It is used only if `theme.autoContrast` is set to `true`. Default value is `0.3`.

#### Example: luminanceThreshold

```tsx
import { Button, createTheme, MantineProvider, Stack } from '@mantine/core';

const theme = createTheme({
  autoContrast: true,
  luminanceThreshold: ,
});

function Wrapper(props: any) {
  const buttons = Array(10)
    .fill(0)
    .map((_, index) => (
      <Button
        key={index}
        color=${
          parseThemeColor({ theme: DEFAULT_THEME, color: props.color }).isThemeColor
            ?
```