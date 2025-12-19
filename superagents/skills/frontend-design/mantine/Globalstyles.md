# Mantine: Global styles

`Global` component and global styles on theme are not available in 7.0. Instead,
create a global stylesheet (`.css` file) and import it in your application entry point.

```tsx
// 6.x
import { Global } from '@mantine/core';

function Demo() {
  return (
    <Global
      styles={(theme) => ({
        '*, *::before, *::after': {
          boxSizing: 'border-box',
        },

        body: {
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[7]
              : theme.white,
          color:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[0]
              : theme.black,
          lineHeight: theme.lineHeight,
        },

        '.your-class': {
          backgroundColor: 'red',
        },

        '#your-id > [data-active]': {
          backgroundColor: 'pink',
        },
      })}
    />
  );
}
```

```scss
/* 7.0 */
/* src/index.css */
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  background-color: light-dark(
    var(--mantine-color-white),
    var(--mantine-color-dark-7)
  );
  color: light-dark(
    var(--mantine-color-black),
    var(--mantine-color-white)
  );
  line-height: var(--mantine-line-height);
}

.your-class {
  background-color: red;
}

#your-id > [data-active] {
  background-color: pink;
}
```