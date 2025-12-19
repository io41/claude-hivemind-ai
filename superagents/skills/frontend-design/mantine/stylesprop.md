# Mantine: styles prop

`styles` prop no longer supports nested selectors. Use
`classNames` instead to apply styles to nested elements.

```tsx
// 6.x – nested selectors
import { TextInput } from '@mantine/core';

function Demo() {
  return (
    <TextInput
      styles={{
        input: {
          '&:focus': {
            color: 'red',
          },
        },
      }}
    />
  );
}
```

```scss
/* 7.0 */
.input {
  &:focus {
    color: red;
  }
}
```

Regular selectors are still supported:

```tsx
// Works both in 6.x and 7.x
import { TextInput } from '@mantine/core';

function Demo() {
  return (
    <TextInput
      styles={{
        input: {
          color: 'red',
        },
      }}
    />
  );
}
```