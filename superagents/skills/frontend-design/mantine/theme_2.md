# Mantine: theme

.colorScheme

Color scheme value is managed by [MantineProvider](https://mantine.dev/theming/mantine-provider),
[theme object](https://mantine.dev/theming/theme-object) no longer includes `colorScheme` property.
Although it is still possible to access color scheme value in components with
[useMantineColorScheme](https://mantine.dev/theming/color-schemes#use-mantine-color-scheme-hook) hook,
it is not recommended to base your styles on its value. Instead, use `light`/`dark`
[mixins](https://mantine.dev/styles/postcss-preset) or `light-dark` CSS [function](https://mantine.dev/styles/postcss-preset#light-dark-function).

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

```scss
/* 7.0 */

/* With light-dark function */
.root {
  background-color: light-dark(
    var(--mantine-color-gray-0),
    var(--mantine-color-dark-6)
  );
  color: light-dark(
    var(--mantine-color-black),
    var(--mantine-color-white)
  );
}

/* With light/dark mixins */
.root {
  background-color: var(--mantine-color-gray-0);
  color: var(--mantine-color-black);

  @mixin dark {
    background-color: var(--mantine-color-dark-6);
    color: var(--mantine-color-white);
  }
}
```

Note that if your application has server-side rendering, you should not render any
elements based on its value ([more info](https://mantine.dev/theming/color-schemes#color-scheme-value-caveats)).
Instead, use `light`/`dark` mixins or `light-dark` function to hide/display elements based
on color scheme value.

Color scheme toggle example:

#### Example: colorSchemeControl

```tsx
import { ActionIcon, useMantineColorScheme, useComputedColorScheme } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';
import cx from 'clsx';
import classes from './Demo.module.css';

function Demo() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  return (
    <ActionIcon
      onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
      variant="default"
      size="xl"
      aria-label="Toggle color scheme"
    >
      <IconSun className={cx(classes.icon, classes.light)} stroke={1.5} />
      <IconMoon className={cx(classes.icon, classes.dark)} stroke={1.5} />
    </ActionIcon>
  );
}
```



--------------------------------------------------------------------------------