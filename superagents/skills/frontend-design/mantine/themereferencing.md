# Mantine: theme referencing

All [theme](https://mantine.dev/theming/theme-object) properties are now available as [CSS variables](https://mantine.dev/styles/css-variables). It is recommended to use
[CSS variables](https://mantine.dev/styles/css-variables) instead of referencing theme object in styles.

```tsx
// 6.x
import { Box } from '@mantine/core';

function Demo() {
  return (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.colors.red[6],
        color: theme.white,
        padding: `calc(${theme.spacing.xl} * 2)`,
      })}
    />
  );
}
```

```scss
/* 7.0 */
.box {
  background-color: var(--mantine-color-red-6);
  color: var(--mantine-color-white);
  padding: calc(var(--mantine-spacing-xl) * 2);
}
```