# Mantine: Composition and nested selectors

Since `createStyles` produces scoped class names you will need to create a reference to selector
in order to get static selector. Use `u.ref` function to assign static selectors:

#### Example: composition

```tsx
import { createStyles } from '@mantine/emotion';

const useStyles = createStyles((theme, _, u) => ({
  button: {
    // assign reference to selector
    ref: u.ref('button'),

    // and add any other properties
    backgroundColor: theme.colors.blue[6],
    color: theme.white,
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    borderRadius: theme.radius.md,
    cursor: 'pointer',
    border: 0,
  },

  container: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing.xl,

    [u.light]: {
      backgroundColor: theme.colors.gray[1],
    },

    [u.dark]: {
      backgroundColor: theme.colors.dark[8],
    },

    // reference button with nested selector
    [`&:hover .${u.ref('button')}`]: {
      backgroundColor: theme.colors.violet[6],
    },
  },
}));

function Demo() {
  const { classes } = useStyles();

  return (
    <div className={classes.container}>
      <button className={classes.button} type="button">
        Hover container to change button color
      </button>
    </div>
  );
}
```