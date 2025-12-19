# Mantine: activeClassName

`theme.activeClassName` is a CSS class that is added to elements that have active styles, for example, [Button](https://mantine.dev/core/button) or [ActionIcon](https://mantine.dev/core/action-icon/).
It can be used to customize active styles of all interactive components.



To disable active styles for all components, set `theme.activeClassName` to an empty string:

#### Example: activeClassNameEmpty

```tsx
import { MantineProvider, Button } from '@mantine/core';

function Demo() {
  return (
    <MantineProvider theme={{ activeClassName: '' }}>
      <Button>No active styles</Button>
    </MantineProvider>
  );
}
```