# Mantine: MantineProvider

# MantineProvider

`MantineProvider` provides a [theme object](https://mantine.dev/theming/theme-object) context value, manages color scheme
changes and injects [CSS variables](https://mantine.dev/styles/css-variables/). It must be rendered at the root of your
application and should be used only once.

## Usage

```tsx
import { createTheme, MantineProvider } from '@mantine/core';

const theme = createTheme({
  /** Your theme override here */
});

function Demo() {
  return (
    <MantineProvider theme={theme}>
      {/* Your app here */}
    </MantineProvider>
  );
}
```

## MantineProvider props

`MantineProvider` supports the following props:

```tsx
interface MantineProviderProps {
  /** Theme override object */
  theme?: MantineThemeOverride;

  /** Used to retrieve/set color scheme value in external storage, by default uses `window.localStorage` */
  colorSchemeManager?: MantineColorSchemeManager;

  /** Default color scheme value used when `colorSchemeManager` cannot retrieve value from external storage, `light` by default */
  defaultColorScheme?: MantineColorScheme;

  /** Forces color scheme value, if set, MantineProvider ignores `colorSchemeManager` and `defaultColorScheme` */
  forceColorScheme?: 'light' | 'dark';

  /** CSS selector to which CSS variables should be added, by default variables are applied to `:root` and `:host` */
  cssVariablesSelector?: string;

  /** Determines whether theme CSS variables should be added to given `cssVariablesSelector`, `true` by default */
  withCssVariables?: boolean;

  /** Determines whether CSS variables should be deduplicated: if CSS variable has the same value as in default theme, it is not added in the runtime. `true` by default. */
  deduplicateCssVariables?: boolean;

  /** Function to resolve root element to set `data-mantine-color-scheme` attribute, must return undefined on server, `() => document.documentElement` by default */
  getRootElement?: () => HTMLElement | undefined;

  /** A prefix for components static classes (for example {selector}-Text-root), `mantine` by default */
  classNamesPrefix?: string;

  /** Function to generate nonce attribute added to all generated `<style />` tags */
  getStyleNonce?: () => string;

  /** Function to generate CSS variables based on theme object */
  cssVariablesResolver?: CSSVariablesResolver;

  /** Determines whether components should have static classes, for example, `mantine-Button-root`. `true` by default */
  withStaticClasses?: boolean;

  /** Determines whether global classes should be added with `<style />` tag. Global classes are required for `hiddenFrom`/`visibleFrom` and `lightHidden`/`darkHidden` props to work. `true` by default. */
  withGlobalClasses?: boolean;

  /** Environment at which the provider is used, `'test'` environment disables all transitions and portals */
  env?: 'default' | 'test';

  /** Your application */
  children?: React.ReactNode;
}
```