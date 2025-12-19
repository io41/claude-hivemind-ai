# Mantine: Font smoothing

Font smoothing variables control [-webkit-font-smoothing and moz-osx-font-smoothing](https://developer.mozilla.org/en-US/docs/Web/CSS/font-smooth)
CSS properties. These variables are used to make text look better on screens with high pixel density.

Font smoothing variables are controlled by `theme.fontSmoothing` [theme](https://mantine.dev/theming/theme-object) property, it is `true` by default. If `theme.fontSmoothing` is `false`, both variables will be set to `unset`.

<CssVariablesGroup
  data={[
    {
      variable: '--mantine-webkit-font-smoothing',
      description: 'Controls -webkit-font-smoothing CSS property',
      defaultValue: 'antialiased',
    },
    {
      variable: '--mantine-moz-font-smoothing',
      description: 'Controls -moz-osx-font-smoothing CSS property',
      defaultValue: 'grayscale',
    },
  ]}
/>

If you need to override font smoothing values, the best way is to disable `theme.fontSmoothing` and set [global styles](https://mantine.dev/styles/global-styles/#add-global-styles-in-your-application)
on the body element:

```tsx
import { createTheme } from '@mantine/core';

// Disable font smoothing in your theme
const theme = createTheme({
  fontSmoothing: false,
});
```

```scss
// Add global styles to your project with desired font smoothing values
body {
  -webkit-font-smoothing: subpixel-antialiased;
  -moz-osx-font-smoothing: auto;
}
```

## Colors variables

Colors variables are controlled by `theme.colors` and `theme.primaryColor`. Each color
defined in `theme.colors` object is required to have 10 shades. Theme color can be
referenced by its name and shade index, for example, `--mantine-color-red-6`.

You can define new colors on the theme object or override existing colors:

```tsx
import { createTheme } from '@mantine/core';

const theme = createTheme({
  colors: {
    demo: [
      '#FF0000',
      '#FF3333',
      '#FF6666',
      '#FF9999',
      '#FFCCCC',
      '#FFEEEE',
      '#FFFAFA',
      '#FFF5F5',
      '#FFF0F0',
      '#FFEBEB',
    ],
  },
});
```

The code above will define the following CSS variables:

<CssVariablesGroup
  data={[
    {
      variable: '--mantine-color-demo-0',
      defaultValue: '#FF0000',
    },
    {
      variable: '--mantine-color-demo-1',
      defaultValue: '#FF3333',
    },
    {
      variable: '--mantine-color-demo-2',
      defaultValue: '#FF6666',
    },
    {
      variable: '--mantine-color-demo-3',
      defaultValue: '#FF9999',
    },
    {
      variable: '--mantine-color-demo-4',
      defaultValue: '#FFCCCC',
    },
    {
      variable: '--mantine-color-demo-5',
      defaultValue: '#FFEEEE',
    },
    {
      variable: '--mantine-color-demo-6',
      defaultValue: '#FFFAFA',
    },
    {
      variable: '--mantine-color-demo-7',
      defaultValue: '#FFF5F5',
    },
    {
      variable: '--mantine-color-demo-8',
      defaultValue: '#FFF0F0',
    },
    {
      variable: '--mantine-color-demo-9',
      defaultValue: '#FFEBEB',
    },
  ]}
/>