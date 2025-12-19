# Mantine: Headings

`theme.headings` controls font-size, line-height, font-weight and text-wrap CSS properties
of headings in [Title](https://mantine.dev/core/title) and [Typography](https://mantine.dev/core/typography) components.

<CssVariablesGroup
  data={[
    { group: 'General variables' },
    {
      variable: '--mantine-heading-font-weight',
      description:
        'Controls font-weight property of all headings if not overridden',
      defaultValue: '700',
    },
    {
      variable: '--mantine-heading-text-wrap',
      description: 'Controls text-wrap property of all headings',
      defaultValue: 'wrap',
    },
    { group: 'h1 heading' },
    {
      variable: '--mantine-h1-font-size',
      defaultValue: '2.125rem (34px)',
    },
    {
      variable: '--mantine-h1-line-height',
      defaultValue: '1.3',
    },
    {
      variable: '--mantine-h1-font-weight',
      defaultValue: '700',
    },
    { group: 'h2 heading' },
    {
      variable: '--mantine-h2-font-size',
      defaultValue: '1.625rem (26px)',
    },
    {
      variable: '--mantine-h2-line-height',
      defaultValue: '1.35',
    },
    {
      variable: '--mantine-h2-font-weight',
      defaultValue: '700',
    },
    { group: 'h3 heading' },
    {
      variable: '--mantine-h3-font-size',
      defaultValue: '1.375rem (22px)',
    },
    {
      variable: '--mantine-h3-line-height',
      defaultValue: '1.4',
    },
    {
      variable: '--mantine-h3-font-weight',
      defaultValue: '700',
    },
    { group: 'h4 heading' },
    {
      variable: '--mantine-h4-font-size',
      defaultValue: '1.125rem (18px)',
    },
    {
      variable: '--mantine-h4-line-height',
      defaultValue: '1.45',
    },
    {
      variable: '--mantine-h4-font-weight',
      defaultValue: '700',
    },
    { group: 'h5 heading' },
    {
      variable: '--mantine-h5-font-size',
      defaultValue: '1rem (16px)',
    },
    {
      variable: '--mantine-h5-line-height',
      defaultValue: '1.5',
    },
    {
      variable: '--mantine-h5-font-weight',
      defaultValue: '700',
    },
    { group: 'h6 heading' },
    {
      variable: '--mantine-h6-font-size',
      defaultValue: '0.875rem (14px)',
    },
    {
      variable: '--mantine-h6-line-height',
      defaultValue: '1.5',
    },
    {
      variable: '--mantine-h6-font-weight',
      defaultValue: '700',
    },
  ]}
/>

These variables are used in [Title](https://mantine.dev/core/title) component, `order` prop
controls which heading level to use. For example, `order={3}` Title will use:

* `--mantine-h3-font-size`
* `--mantine-h3-line-height`
* `--mantine-h3-font-weight`

#### Example: usage

```tsx
import { Title } from '@mantine/core';

function Demo() {
  return (
    <>
      <Title order={1}>This is h1 title</Title>
      <Title order={2}>This is h2 title</Title>
      <Title order={3}>This is h3 title</Title>
      <Title order={4}>This is h4 title</Title>
      <Title order={5}>This is h5 title</Title>
      <Title order={6}>This is h6 title</Title>
    </>
  );
}
```


You can reference heading variables in your CSS:

```scss
.h1 {
  font-size: var(--mantine-h1-font-size);
  line-height: var(--mantine-h1-line-height);
  font-weight: var(--mantine-h1-font-weight);
}
```

And in [fz and lh style props](https://mantine.dev/styles/style-props):

```tsx
import { Box } from '@mantine/core';

function Demo() {
  return (
    <Box fz="h1" lh="h1">
      This text uses --mantine-h1-* variables
    </Box>
  );
}
```

To change heading styles, can use `theme.headings` property:

```tsx
import { createTheme } from '@mantine/core';

const theme = createTheme({
  headings: {
    sizes: {
      h1: {
        fontSize: '2rem',
        lineHeight: '1.5',
        fontWeight: '500',
      },
      h2: {
        fontSize: '1.5rem',
        lineHeight: '1.6',
        fontWeight: '500',
      },
    },
    // ...
  },
});
```

`theme.headings` object is deeply merged with the `DEFAULT_THEME.headings` object –
it is not required to define all values, only those that you want to change.

```tsx
import { createTheme } from '@mantine/core';

// Changes only font-size of h1,
// other values will be taken from the DEFAULT_THEME
const theme = createTheme({
  headings: {
    sizes: {
      h1: {
        fontSize: '2rem',
      },
    },
  },
});
```