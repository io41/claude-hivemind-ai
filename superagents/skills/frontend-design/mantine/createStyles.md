# Mantine: createStyles

`createStyles` function is no longer available in 7.0. Use [CSS Modules](https://mantine.dev/styles/css-modules) instead.

```tsx
// 6.x
import { createStyles } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  root: {
    backgroundColor: theme.colors.red[5],
  },
}));
```

```scss
/* 7.0 */
.root {
  background-color: var(--mantine-color-red-5);
}
```