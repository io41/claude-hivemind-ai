# Mantine: Other color variables

The following colors are used in various Mantine components. Note that default values
are provided for the light color scheme, dark color scheme values are different.

<CssVariablesGroup
  data={[
    {
      variable: '--mantine-color-white',
      description: 'Value of theme.white',
      defaultValue: '#fff',
    },
    {
      variable: '--mantine-color-black',
      description: 'Value of theme.black',
      defaultValue: '#000',
    },
    {
      variable: '--mantine-color-text',
      description: 'Color used for text in the body element',
      defaultValue: 'var(--mantine-color-black)',
    },
    {
      variable: '--mantine-color-body',
      description: 'Body background color',
      defaultValue: 'var(--mantine-color-white)',
    },
    {
      variable: '--mantine-color-error',
      description: 'Color used for error messages and states',
      defaultValue: 'var(--mantine-color-red-6)',
    },
    {
      variable: '--mantine-color-placeholder',
      description: 'Color used for input placeholders',
      defaultValue: 'var(--mantine-color-gray-5)',
    },
    {
      variable: '--mantine-color-dimmed',
      description: 'Color used for dimmed text',
      defaultValue: 'var(--mantine-color-gray-6)',
    },
    {
      variable: '--mantine-color-bright',
      description: 'Color used for bright text',
      defaultValue: 'var(--mantine-color-black)',
    },
    {
      variable: '--mantine-color-anchor',
      description: 'Color used for links',
      defaultValue: 'var(--mantine-primary-color-6)',
    },
    {
      variable: '--mantine-color-default',
      description: 'Background color of default variant',
      defaultValue: 'var(--mantine-color-white)',
    },
    {
      variable: '--mantine-color-default-hover',
      description: 'Background color of default variant on hover',
      defaultValue: 'var(--mantine-color-gray-0)',
    },
    {
      variable: '--mantine-color-default-color',
      description: 'Text color of default variant',
      defaultValue: 'var(--mantine-color-black)',
    },
    {
      variable: '--mantine-color-default-border',
      description: 'Border color of default variant',
      defaultValue: 'var(--mantine-color-gray-4)',
    },
    {
      variable: '--mantine-color-disabled',
      description: 'Background color of disabled elements',
      defaultValue: 'var(--mantine-color-gray-2)',
    },
    {
      variable: '--mantine-color-disabled-color',
      description: 'Text color of disabled elements',
      defaultValue: 'var(--mantine-color-gray-5)',
    },
    {
      variable: '--mantine-color-disabled-border',
      description: 'Border color of disabled elements',
      defaultValue: 'var(--mantine-color-gray-3)',
    },
  ]}
/>

## Spacing variables

`theme.spacing` values are used in most Mantine components to control paddings, margins, and other
spacing-related properties. The following CSS variables are defined based on `theme.spacing`:

<CssVariablesGroup
  data={[
    {
      variable: '--mantine-spacing-xs',
      defaultValue: '0.625rem (10px)',
    },
    {
      variable: '--mantine-spacing-sm',
      defaultValue: '0.75rem (12px)',
    },
    {
      variable: '--mantine-spacing-md',
      defaultValue: '1rem (16px)',
    },
    {
      variable: '--mantine-spacing-lg',
      defaultValue: '1.25rem (20px)',
    },
    {
      variable: '--mantine-spacing-xl',
      defaultValue: '2rem (32px)',
    },
  ]}
/>

To define custom spacing values, use `theme.spacing` property:

```tsx
import { createTheme } from '@mantine/core';

const theme = createTheme({
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
});
```

## Border radius variables

Mantine components that support `radius` prop use border radius variables to control border radius.
The following CSS variables are defined based on `theme.radius`:

<CssVariablesGroup
  data={[
    {
      variable: '--mantine-radius-xs',
      defaultValue: '0.125rem (2px)',
    },
    {
      variable: '--mantine-radius-sm',
      defaultValue: '0.25rem (4px)',
    },
    {
      variable: '--mantine-radius-md',
      defaultValue: '0.5rem (8px)',
    },
    {
      variable: '--mantine-radius-lg',
      defaultValue: '1rem (16px)',
    },
    {
      variable: '--mantine-radius-xl',
      defaultValue: '2rem (32px)',
    },
  ]}
/>

Additionally, `--mantine-radius-default` variable is defined based on `theme.defaultRadius`
value. If `radius` prop on components is not set explicitly, `--mantine-radius-default` is used instead.

To define custom border radius values, use `theme.radius` and `theme.defaultRadius` properties:

```tsx
import { createTheme } from '@mantine/core';

const theme = createTheme({
  defaultRadius: 'sm',
  radius: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '2rem',
    xl: '3rem',
  },
});
```

## Shadow variables

Shadow variables are used in all Mantine components that support `shadow` prop. The following CSS
variables are defined based on `theme.shadows`:

<CssVariablesGroup
  data={[
    {
      variable: '--mantine-shadow-xs',
      defaultValue:
        '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
    },
    {
      variable: '--mantine-shadow-sm',
      defaultValue:
        '0 1px 3px rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0 10px 15px -5px, rgba(0, 0, 0, 0.04) 0 7px 7px -5px',
    },
    {
      variable: '--mantine-shadow-md',
      defaultValue:
        '0 1px 3px rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0 20px 25px -5px, rgba(0, 0, 0, 0.04) 0 10px 10px -5px',
    },
    {
      variable: '--mantine-shadow-lg',
      defaultValue:
        '0 1px 3px rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0 28px 23px -7px, rgba(0, 0, 0, 0.04) 0 12px 12px -7px',
    },
    {
      variable: '--mantine-shadow-xl',
      defaultValue:
        '0 1px 3px rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0 36px 28px -7px, rgba(0, 0, 0, 0.04) 0 17px 17px -7px',
    },
  ]}
/>

To define custom shadow values, use `theme.shadows` property:

```tsx
import { createTheme } from '@mantine/core';

const theme = createTheme({
  shadows: {
    xs: '0 1px 2px rgba(0, 0, 0, 0.1)',
    sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
    md: '0 2px 4px rgba(0, 0, 0, 0.1)',
    lg: '0 4px 8px rgba(0, 0, 0, 0.1)',
    xl: '0 8px 16px rgba(0, 0, 0, 0.1)',
  },
});
```

## z-index variables

z-index variables are defined in `@mantine/core/styles.css`. Unlike other variables,
z-index variables are not controlled by the theme and are not exposed in the theme object.

<CssVariablesGroup
  data={[
    {
      variable: '--mantine-z-index-app',
      defaultValue: '100',
    },
    {
      variable: '--mantine-z-index-modal',
      defaultValue: '200',
    },
    {
      variable: '--mantine-z-index-popover',
      defaultValue: '300',
    },
    {
      variable: '--mantine-z-index-overlay',
      defaultValue: '400',
    },
    {
      variable: '--mantine-z-index-max',
      defaultValue: '9999',
    },
  ]}
/>

You can reference z-index variables in CSS:

```css
/* Display content above the modal */
.my-content {
  z-index: calc(var(--mantine-z-index-modal) + 1);
}
```

And in components by referencing CSS variable:

```tsx
import { Modal } from '@mantine/core';

function Demo() {
  return (
    <Modal
      zIndex="var(--mantine-z-index-max)"
      opened
      onClose={() => {}}
    >
      Modal content
    </Modal>
  );
}
```

## CSS variables resolver

`cssVariablesResolver` prop on [MantineProvider](https://mantine.dev/theming/mantine-provider) allows you to
modify values of Mantine CSS variables or even add your own variables.
`cssVariablesResolver` is a function that accepts [theme](https://mantine.dev/theming/theme-object) as a single
argument and returns an object with CSS variables divided into three groups:

* `variables` – variables that do not depend on color scheme
* `light` – variables for light color scheme only
* `dark` – variables for dark color scheme only

Example of adding new CSS variables based on `theme.other`:

```tsx
import {
  createTheme,
  CSSVariablesResolver,
  MantineProvider,
} from '@mantine/core';

const themeOverride = createTheme({
  other: {
    deepOrangeLight: '#E17900',
    deepOrangeDark: '#FC8C0C',
    heroHeight: 400,
  },
});

const resolver: CSSVariablesResolver = (theme) => ({
  variables: {
    '--mantine-hero-height': theme.other.heroHeight,
  },
  light: {
    '--mantine-color-deep-orange': theme.other.deepOrangeLight,
  },
  dark: {
    '--mantine-color-deep-orange': theme.other.deepOrangeDark,
  },
});

function Demo() {
  return (
    <MantineProvider
      theme={themeOverride}
      cssVariablesResolver={resolver}
    >
      {/* Your app here */}
    </MantineProvider>
  );
}
```

Then you will be able to use `--mantine-hero-height` and `--mantine-color-deep-orange` variables
in any part of your application:

```css
.hero {
  height: var(--mantine-hero-height);

  /* background color will automatically change based on color scheme */
  background-color: var(--mantine-color-deep-orange);
}
```


--------------------------------------------------------------------------------