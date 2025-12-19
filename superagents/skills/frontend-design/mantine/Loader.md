# Mantine: Loader

Package: @mantine/core
Import: import { Loader } from '@mantine/core';
Description: Indicate loading state

## Usage

`Loader` component supports 3 types of loaders: `oval`, `bars` and `dots` by default. All
loaders are animated with CSS for better performance.

#### Example: configurator

```tsx
import { Loader } from '@mantine/core';

function Demo() {
  return <Loader />;
}
```


## Size prop

You can pass any valid CSS values and numbers to `size` prop. Numbers are treated as px, but
converted to [rem](https://mantine.dev/styles/rem). For example, `size={32}` will produce
`--loader-size: 2rem` CSS variable.

#### Example: size

```tsx
import { Loader } from '@mantine/core';

function Demo() {
  return <Loader />;
}
```


## Adding custom loaders

`Loader` component is used in other components ([Button](https://mantine.dev/core/button), [ActionIcon](https://mantine.dev/core/action-icon), [LoadingOverlay](https://mantine.dev/core/loading-overlay), etc.).
You can change loader type with [default props](https://mantine.dev/theming/default-props) by setting `type`.
You can also add a custom CSS or SVG loader with `loaders` [default prop](https://mantine.dev/theming/default-props).