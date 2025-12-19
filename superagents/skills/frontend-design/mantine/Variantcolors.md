# Mantine: Variant colors

Some Mantine components like [Button](https://mantine.dev/core/button) or [Badge](https://mantine.dev/core/badge) have `variant` prop
that in combination with `color` prop controls the component text, background and border colors.
For each variant and color, Mantine defines a set of CSS variables that control these colors.
For example, for the default `blue` color the following CSS variables are defined:

<CssVariablesGroup
  data={[
    { group: 'Filled variant' },
    {
      variable: '--mantine-color-blue-filled',
      description: 'Background color of filled variant',
      defaultValue: 'var(--mantine-color-blue-6)',
    },
    {
      variable: '--mantine-color-blue-filled-hover',
      description: 'Background color of filled variant on hover',
      defaultValue: 'var(--mantine-color-blue-7)',
    },
    { group: 'Light variant' },
    {
      variable: '--mantine-color-blue-light',
      description: 'Background color of light variant',
      defaultValue: 'rgba(34, 139, 230, 0.1)',
    },
    {
      variable: '--mantine-color-blue-light-hover',
      description: 'Background color of light variant on hover',
      defaultValue: 'rgba(34, 139, 230, 0.12)',
    },
    {
      variable: '--mantine-color-blue-light-color',
      description: 'Text color of light variant',
      defaultValue: 'var(--mantine-color-blue-6)',
    },
    { group: 'Outline variant' },
    {
      variable: '--mantine-color-blue-outline',
      description: 'Border color of outline variant',
      defaultValue: 'var(--mantine-color-blue-6)',
    },
    {
      variable: '--mantine-color-blue-outline-hover',
      description: 'Border color of outline variant',
      defaultValue: 'rgba(34, 139, 230, 0.05)',
    },
  ]}
/>

For example, if you use [Button](https://mantine.dev/core/button) component the following way:

```tsx
import { Button } from '@mantine/core';

function Demo() {
  return (
    <Button color="pink" variant="filled">
      Filled pink button
    </Button>
  );
}
```

The component will have the following styles:

* Background color will be `var(--mantine-color-pink-filled)`
* Background color on hover will be `var(--mantine-color-pink-filled-hover)`
* Text color will be `var(--mantine-color-white)`
* Border color will be `transparent`

Note that the variables above are not static, they are generated based on the values of
`theme.colors` and `theme.primaryShade`. Additionally, their values are different for
dark and light color schemes.

Variant colors variables are used in all components that support `color` prop, for example,
[Button](https://mantine.dev/core/button), [Badge](https://mantine.dev/core/badge), [Avatar](https://mantine.dev/core/avatar) and [Pagination](https://mantine.dev/core/pagination).
Colors values that are used by these components are determined by `cssVariablesResolver` described below
and [variantColorResolver](https://mantine.dev/styles/variants-sizes/#variantcolorresolver).