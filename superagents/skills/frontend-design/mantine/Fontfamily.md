# Mantine: Font family

The following CSS variables are used to assign font families to all Mantine components:

<CssVariablesGroup
  data={[
    {
      variable: '--mantine-font-family',
      description:
        'Controls font-family property of most Mantine components',
      defaultValue: 'system sans-serif fonts',
    },
    {
      variable: '--mantine-font-family-monospace',
      description: 'Controls font-family property of code blocks',
      defaultValue: 'system monospace fonts',
    },
    {
      variable: '--mantine-font-family-headings',
      description: 'Controls font-family property of headings',
      defaultValue: 'system sans-serif fonts',
    },
  ]}
/>

You can control these variables in the [theme](https://mantine.dev/theming/theme-object). Note that if
`theme.headings.fontFamily` is not set, `--mantine-font-family-headings` value
will be the same as `--mantine-font-family`.

```tsx
import { createTheme } from '@mantine/core';

const theme = createTheme({
  // Controls --mantine-font-family
  fontFamily: 'Arial, sans-serif',

  // Controls --mantine-font-family-monospace
  fontFamilyMonospace: 'Courier New, monospace',

  headings: {
    // Controls --mantine-font-family-headings
    fontFamily: 'Georgia, serif',
  },
});
```

If you want to use system fonts as a fallback for custom fonts, you can reference `DEFAULT_THEME`
value instead of defining it manually:

```tsx
import { createTheme, DEFAULT_THEME } from '@mantine/core';

const theme = createTheme({
  fontFamily: `Roboto, ${DEFAULT_THEME.fontFamily}`,
});
```

You can reference font family variables in your CSS:

```scss
.text {
  font-family: var(--mantine-font-family);
}

.code {
  font-family: var(--mantine-font-family-monospace);
}

.heading {
  font-family: var(--mantine-font-family-headings);
}
```

And in [ff style prop](https://mantine.dev/styles/style-props):

* `ff="text"` will use `--mantine-font-family` variable
* `ff="monospace"` will use `--mantine-font-family-monospace` variable
* `ff="heading"` will use `--mantine-font-family-headings` variable

```tsx
import { Text } from '@mantine/core';

function Demo() {
  return (
    <Text ff="monospace">
      This text uses --mantine-font-family-monospace variable
    </Text>
  );
}
```