# Mantine: Font size

Font size variables are used in most Mantine components to control text size. The
variable that is chosen depends on the component and its `size` prop.

<CssVariablesGroup
  data={[
    {
      variable: '--mantine-font-size-xs',
      defaultValue: '0.75rem (12px)',
    },
    {
      variable: '--mantine-font-size-sm',
      defaultValue: '0.875rem (14px)',
    },
    {
      variable: '--mantine-font-size-md',
      defaultValue: '1rem (16px)',
    },
    {
      variable: '--mantine-font-size-lg',
      defaultValue: '1.125rem (18px)',
    },
    {
      variable: '--mantine-font-size-xl',
      defaultValue: '1.25rem (20px)',
    },
  ]}
/>

You can reference font size variables in CSS:

```scss
.demo {
  font-size: var(--mantine-font-size-md);
}
```

And in [fz style prop](https://mantine.dev/styles/style-props):

```tsx
import { Text } from '@mantine/core';

function Demo() {
  return (
    <Text fz="xl">
      This text uses --mantine-font-size-xl variable
    </Text>
  );
}
```

To define custom font sizes, can use `theme.fontSizes` property:

```tsx
import { createTheme } from '@mantine/core';

const theme = createTheme({
  fontSizes: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.5rem',
  },
});
```

Note that `theme.fontSizes` object is merged with the `DEFAULT_THEME.fontSizes` –
it is not required to define all values, only those that you want to change.

```tsx
import { createTheme } from '@mantine/core';

// Changes only xs font size,
// other values will be taken from the DEFAULT_THEME
const theme = createTheme({
  fontSizes: {
    xs: '0.5rem',
  },
});
```

You can add any number of additional font sizes to the `theme.fontSizes` object.
These values will be defined as CSS variables in `--mantine-font-size-{size}` format:

```tsx
import { createTheme } from '@mantine/core';

const theme = createTheme({
  fontSizes: {
    xxs: '0.125rem',
    xxl: '2rem',
  },
});
```

After defining `theme.fontSizes`, you can reference these variables in your CSS:

```scss
.demo {
  font-size: var(--mantine-font-size-xxs);
}
```

> **Case conversion**
>
> Case conversion (camelCase to kebab-case) is not automatically applied to custom font sizes.
> If you define `theme.fontSizes` with camelCase keys, you need to reference them in camelCase format.
> For example, if you define `{ customSize: '1rem' }`, you need to reference it as `--mantine-font-size-customSize`.