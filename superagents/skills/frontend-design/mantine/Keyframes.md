# Mantine: Keyframes

#### Example: keyframes

```tsx
import { createStyles, keyframes } from '@mantine/emotion';

// Export animation to reuse it in other components
export const bounce = keyframes({
  'from, 20%, 53%, 80%, to': { transform: 'translate3d(0, 0, 0)' },
  '40%, 43%': { transform: 'translate3d(0, -30px, 0)' },
  '70%': { transform: 'translate3d(0, -15px, 0)' },
  '90%': { transform: 'translate3d(0, -4px, 0)' },
});

const useStyles = createStyles((theme) => ({
  container: {
    textAlign: 'center',
    padding: theme.spacing.xl,
    animation: `${bounce} 3s ease-in-out infinite`,
  },
}));

function Demo() {
  const { classes } = useStyles();
  return <div className={classes.container}>Keyframes demo</div>;
}
```


## Utilities

`sx`, `styles` and `createStyles` callback functions receive `u` object with utilities
to generate selectors. `u` object contains the following properties:

```tsx
const u = {
  light: '[data-mantine-color-scheme="light"] &',
  dark: '[data-mantine-color-scheme="dark"] &',
  rtl: '[dir="rtl"] &',
  ltr: '[dir="ltr"] &',
  notRtl: '[dir="ltr"] &',
  notLtr: '[dir="rtl"] &',
  ref: getStylesRef,
  smallerThan: (breakpoint: MantineBreakpoint | number) =>
    `@media (max-width: ${em(getBreakpointValue(theme, breakpoint) - 0.1)})`,
  largerThan: (breakpoint: MantineBreakpoint | number) =>
    `@media (min-width: ${em(getBreakpointValue(theme, breakpoint))})`,
};
```

All utilities except `ref` can be used as selectors in styles object:

```tsx
const styles = {
  root: {
    [u.dark]: { color: 'white' },
    [u.rtl]: { padding: 10 },
    [u.smallerThan('md')]: { lineHeight: 20 },
  },
};
```


--------------------------------------------------------------------------------