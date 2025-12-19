# Mantine: Line height

Line height variables are used in [Text](https://mantine.dev/core/text) component. In other components,
line-height is either calculated based on font size or set to `--mantine-line-height`,
which is an alias for `--mantine-line-height-md`.

<CssVariablesGroup
  data={[
    {
      variable: '--mantine-line-height',
      defaultValue: '1.55',
    },
    {
      variable: '--mantine-line-height-xs',
      defaultValue: '1.4',
    },
    {
      variable: '--mantine-line-height-sm',
      defaultValue: '1.45',
    },
    {
      variable: '--mantine-line-height-md',
      defaultValue: '1.55',
    },
    {
      variable: '--mantine-line-height-lg',
      defaultValue: '1.6',
    },
    {
      variable: '--mantine-line-height-xl',
      defaultValue: '1.65',
    },
  ]}
/>

You can reference line height variables in your CSS:

```scss
.demo {
  line-height: var(--mantine-line-height-md);
}
```

And in [lh style prop](https://mantine.dev/styles/style-props):

```tsx
import { Text } from '@mantine/core';

function Demo() {
  return (
    <Text lh="xl">
      This text uses --mantine-line-height-xl variable
    </Text>
  );
}
```

To define custom line heights, you can use `theme.lineHeights` property:

```tsx
import { createTheme } from '@mantine/core';

const theme = createTheme({
  lineHeights: {
    xs: '1.2',
    sm: '1.3',
    md: '1.4',
    lg: '1.5',
    xl: '1.6',
  },
});
```