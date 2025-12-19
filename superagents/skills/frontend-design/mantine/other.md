# Mantine: other

`theme.other` is an object that can be used to store any other properties that you want to access with the theme objects.

```tsx
import { createTheme, MantineProvider } from '@mantine/core';

const theme = createTheme({
  other: {
    charcoal: '#333333',
    primaryHeadingSize: 45,
    fontWeights: {
      bold: 700,
      extraBold: 900,
    },
  },
});

function Demo() {
  return (
    <MantineProvider theme={theme}>
      {/* Your app here */}
    </MantineProvider>
  );
}
```

## Store theme override object in a variable

To store theme override object in a variable, use `createTheme` function:

```tsx
import { createTheme, MantineProvider } from '@mantine/core';

const myTheme = createTheme({
  primaryColor: 'orange',
  defaultRadius: 0,
});

function Demo() {
  return (
    <MantineProvider theme={myTheme}>
      {/* Your app here */}
    </MantineProvider>
  );
}
```

## Merge multiple theme overrides

Use `mergeThemeOverrides` function to merge multiple themes into one theme override object:

```tsx
import {
  createTheme,
  MantineProvider,
  mergeThemeOverrides,
} from '@mantine/core';

const theme1 = createTheme({
  primaryColor: 'orange',
  defaultRadius: 0,
});

const theme2 = createTheme({
  cursorType: 'pointer',
});

// Note: It is better to to store theme override outside of component body
// to prevent unnecessary re-renders
const myTheme = mergeThemeOverrides(theme1, theme2);

function Demo() {
  return (
    <MantineProvider theme={myTheme}>
      {/* Your app here */}
    </MantineProvider>
  );
}
```

## use-mantine-theme hook

`useMantineTheme` hook returns theme object from [MantineProvider](https://mantine.dev/theming/mantine-provider) context:

```tsx
import { useMantineTheme } from '@mantine/core';

function Demo() {
  const theme = useMantineTheme();
  return <div style={{ background: theme.colors.blue[5] }} />;
}
```

## Default theme

You can import default theme object from `@mantine/core` package. It includes
all theme properties with default values. When you pass theme override to
[MantineProvider](https://mantine.dev/theming/mantine-provider), it will be deeply merged with
the default theme.

```tsx
import { DEFAULT_THEME } from '@mantine/core';
```

## Access theme outside of components

To access theme outside of components, you need to create a full theme object
(your theme override merged with the default theme).

```tsx
// theme.ts
import {
  createTheme,
  DEFAULT_THEME,
  mergeMantineTheme,
} from '@mantine/core';

const themeOverride = createTheme({
  primaryColor: 'orange',
  defaultRadius: 0,
});

export const theme = mergeMantineTheme(DEFAULT_THEME, themeOverride);
```

Then you will be able to import it anywhere in your application:

```tsx
import { theme } from './theme';
```


--------------------------------------------------------------------------------