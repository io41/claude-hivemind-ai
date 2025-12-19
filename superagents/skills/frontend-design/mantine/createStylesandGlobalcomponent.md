# Mantine: createStyles and Global component

`createStyles` function and `Global` component are no longer available in `@mantine/core` package. Change imports
to `@mantine/emotion`:

```tsx
// 6.x
import { createStyles, Global } from '@mantine/core';

// 7.x
import { createStyles, Global } from '@mantine/emotion';
```