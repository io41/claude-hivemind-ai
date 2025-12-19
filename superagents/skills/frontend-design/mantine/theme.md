# Mantine: theme

.colorScheme

In v7 color scheme value is managed by [MantineProvider](https://mantine.dev/theming/mantine-provider),
[theme object](https://mantine.dev/theming/theme-object) no longer includes `colorScheme` property.
Although it is still possible to access color scheme value in components with
[useMantineColorScheme](https://mantine.dev/theming/color-schemes#use-mantine-color-scheme-hook) hook,
it is not recommended to base your styles on its value. Instead, use `light`/`dark`
[utilities](https://mantine.dev/styles/emotion#utilities).

Example of 6.x `createStyles` with `theme.colorScheme` migration to 7.0:

```tsx
// 6.x
import { createStyles } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  root: {
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
  },
}));
```

```tsx
// 7.x
import { createStyles } from '@mantine/emotion';

const useStyles = createStyles((theme, _, u) => ({
  root: {
    [u.dark] {
      backgroundColor: theme.colors.dark[6];
      color: theme.white;
    },

    [u.light]: {
      backgroundColor: theme.colors.gray[0];
      color: theme.black;
    },
  },
}));
```

## Migration to CSS modules

Before getting started, it is recommended to go through [styles](https://mantine.dev/styles/css-modules) documentation.
Most notable parts:

* [CSS Modules](https://mantine.dev/styles/css-modules)
* [Mantine PostCSS preset](https://mantine.dev/styles/postcss-preset)
* [CSS variables](https://mantine.dev/styles/css-variables)
* [data-\* attributes](https://mantine.dev/styles/data-attributes)
* [Styles API](https://mantine.dev/styles/styles-api)
* [Responsive styles](https://mantine.dev/styles/responsive)

Note that this guide assumes that you have [postcss-preset-mantine](https://mantine.dev/styles/postcss-preset) installed and configured
in your project.