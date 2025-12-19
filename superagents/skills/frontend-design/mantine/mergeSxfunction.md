# Mantine: mergeSx function

You can use the `mergeSx` function to merge multiple `sx` props into one. This
can be useful for merging `sx` prop provided to a custom component with its
own `sx`, like so:

```tsx
import { Box } from '@mantine/core'
import { EmotionSx, mergeSx } from '@mantine/emotion'

interface MyCustomBoxProps {
  sx?: EmotionSx
}

function MyCustomBox({ sx }: MyCustomBoxProps) {
  return (
    <Box sx={mergeSx(theme => ({ ... }), sx)}>...</Box>
  )
}

function App() {
  return (
    <MyCustomBox sx={(theme) => ({ ... })} />
  )
}
```

## styles prop

`styles` prop works similar to `sx` prop, but it allows adding styles to all
nested elements of the components that are specified in the Styles API table.
`styles` prop accepts either an object of styles objects or a function that
receives theme, component props, utilities and returns styles object:

```tsx
import { Button } from '@mantine/core';

function Demo() {
  return (
    <Button
      color="red"
      styles={(theme, { color }, u) => ({
        root: {
          padding: 10,
          backgroundColor: theme.colors[color || 'blue'][7],
          color: theme.white,

          '&:hover': {
            backgroundColor: theme.colors[color || 'blue'][8],
          },
        },

        label: {
          [u.light]: {
            border: `1px solid ${theme.black}`,
          },
          [u.dark]: {
            border: `1px solid ${theme.white}`,
          },
        },
      })}
    >
      Button with styles prop
    </Button>
  );
}
```

## styles in theme

You can add styles to Mantine components with [Styles API](https://mantine.dev/styles/styles-api/) using
Emotion with `styles` prop. Note that to avoid types collisions, you should not use
`Component.extend` method and just pass component configuration object directly.

```tsx
import { createTheme, MantineTheme, TextProps } from '@mantine/core';
import { EmotionHelpers } from '@mantine/emotion';

export const theme = createTheme({
  components: {
    Text: {
      styles: (
        theme: MantineTheme,
        _props: TextProps,
        u: EmotionHelpers
      ) => ({
        root: {
          [u.light]: {
            color: theme.colors.blue[7],
          },
        },
      }),
    },
  },
});
```

## createStyles

`createStyles` function accepts a function to generate styles with [Emotion](https://emotion.sh/).
The function receives 3 arguments that will be described more detailed in the following demos:

* `theme` – [Mantine theme object](https://mantine.dev/theming/theme-object)
* `params` – object with additional parameters that can be passed to the function in `useStyles` hook
* `u` - object with utilities to generate selectors

`createStyles` function returns `useStyles` hook that should be called in the component
that uses given styles:

#### Example: usage

```tsx
import { createStyles } from '@mantine/emotion';

const useStyles = createStyles((theme, _, u) => ({
  wrapper: {
    maxWidth: 400,
    width: '100%',
    height: 180,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: theme.radius.sm,

    // Use light and dark selectors to change styles based on color scheme
    [u.light]: {
      backgroundColor: theme.colors.gray[1],
    },

    [u.dark]: {
      backgroundColor: theme.colors.dark[5],
    },

    // Reference theme.breakpoints in smallerThan and largerThan functions
    [u.smallerThan('sm')]: {
      // Child reference in nested selectors via ref
      [`& .${u.ref('child')}`]: {
        fontSize: theme.fontSizes.xs,
      },
    },
  },

  child: {
    // Assign selector to a ref to reference it in other styles
    ref: u.ref('child'),
    padding: theme.spacing.md,
    borderRadius: theme.radius.sm,
    boxShadow: theme.shadows.md,

    [u.light]: {
      backgroundColor: theme.white,
      color: theme.black,
    },

    [u.dark]: {
      backgroundColor: theme.colors.dark[8],
      color: theme.white,
    },
  },
}));

function Demo() {
  const { classes } = useStyles();

  return (
    <div className={classes.wrapper}>
      <div className={classes.child}>createStyles demo</div>
    </div>
  );
}
```