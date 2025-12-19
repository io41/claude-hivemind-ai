# Mantine: cursorType

`theme.cursorType` controls the default cursor type for interactive elements,
that do not have `cursor: pointer` styles by default. For example, [Checkbox](https://mantine.dev/core/checkbox) and [NativeSelect](https://mantine.dev/core/native-select).

#### Example: cursorType

```tsx
import { MantineProvider, createTheme, Checkbox } from '@mantine/core';

const theme = createTheme({
  cursorType: 'pointer',
});

function Demo() {
  return (
    <>
      <Checkbox label="Default cursor" />

      <MantineProvider theme={theme}>
        <Checkbox label="Pointer cursor" mt="md" />
      </MantineProvider>
    </>
  );
}
```