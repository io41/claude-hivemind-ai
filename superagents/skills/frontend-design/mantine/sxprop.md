# Mantine: sx prop

`sx` and prop is no longer available in 7.0. Use `className` or [style prop](https://mantine.dev/styles/style) instead.

```tsx
// 6.x
import { Box } from '@mantine/core';

function Demo() {
  return (
    <Box sx={(theme) => ({ backgroundColor: theme.colors.red[5] })} />
  );
}
```

```tsx
// 7.0
import { Box } from '@mantine/core';

function Demo() {
  return (
    <Box style={{ backgroundColor: 'var(--mantine-color-red-5)' }} />
  );
}
```

Nested selectors are not supported in [style prop](https://mantine.dev/styles/style), use `className` instead:

```tsx
// 6.x
import { Box } from '@mantine/core';

function Demo() {
  return <Box sx={{ '&:hover': { background: 'red' } }} />;
}
```

```scss
.box {
  &:hover {
    background: red;
  }
}
```