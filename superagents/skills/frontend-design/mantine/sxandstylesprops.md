# Mantine: sx and styles props

`sx` and styles props available in 7.x the same way as in 6.x after [setup](https://mantine.dev/styles/emotion):

```tsx
// 6.x and 7.x, no changes
import { Box, Button } from '@mantine/core';

function Demo() {
  return (
    <>
      <Box
        sx={(theme) => ({ backgroundColor: theme.colors.red[5] })}
      />
      <Button styles={{ root: { height: 50 } }} />
    </>
  );
}
```