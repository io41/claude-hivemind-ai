# Mantine: Primary color variables

Primary color variables are defined by `theme.primaryColor` (which must be a key of `theme.colors`).
The following CSS variables are defined for the primary color:

<CssVariablesGroup
  data={[
    {
      variable: '--mantine-primary-color-{shade}',
      description:
        'Shade is 0-9 to reference specific primary color shade',
      defaultValue: 'var(--mantine-color-{primaryColor}-{shade})',
    },
    {
      variable: '--mantine-primary-color-filled',
      description: 'Background color of filled variant',
      defaultValue: 'var(--mantine-color-{primaryColor}-filled)',
    },
    {
      variable: '--mantine-primary-color-filled-hover',
      description: 'Background color of filled variant on hover',
      defaultValue:
        'var(--mantine-color-{primaryColor}-filled-hover)',
    },
    {
      variable: '--mantine-primary-color-light',
      description: 'Background color of light variant',
      defaultValue: 'var(--mantine-color-{primaryColor}-light)',
    },
    {
      variable: '--mantine-primary-color-light-hover',
      description: 'Background color of light variant on hover',
      defaultValue: 'var(--mantine-color-{primaryColor}-light-hover)',
    },
    {
      variable: '--mantine-primary-color-light-color',
      description: 'Text color of light variant',
      defaultValue: 'var(--mantine-color-{primaryColor}-light-color)',
    },
  ]}
/>

You can reference primary color variables in CSS:

```scss
.demo {
  color: var(--mantine-primary-color-0);
  background-color: var(--mantine-primary-color-filled);
}
```