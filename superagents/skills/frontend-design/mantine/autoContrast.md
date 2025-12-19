# Mantine: autoContrast

`autoContrast` controls whether text color should be changed based on the given `color` prop
in the following components:

* [ActionIcon](https://mantine.dev/core/action-icon) with `variant="filled"` only
* [Alert](https://mantine.dev/core/alert) with `variant="filled"` only
* [Avatar](https://mantine.dev/core/avatar) with `variant="filled"` only
* [Badge](https://mantine.dev/core/badge) with `variant="filled"` only
* [Button](https://mantine.dev/core/button) with `variant="filled"` only
* [Chip](https://mantine.dev/core/chip) with `variant="filled"` only
* [NavLink](https://mantine.dev/core/nav-link) with `variant="filled"` only
* [ThemeIcon](https://mantine.dev/core/theme-icon) with `variant="filled"` only
* [Checkbox](https://mantine.dev/core/checkbox) with `variant="filled"` only
* [Radio](https://mantine.dev/core/radio) with `variant="filled"` only
* [Tabs](https://mantine.dev/core/tabs) with `variant="pills"` only
* [SegmentedControl](https://mantine.dev/core/segmented-control)
* [Stepper](https://mantine.dev/core/stepper)
* [Pagination](https://mantine.dev/core/pagination)
* [Progress](https://mantine.dev/core/progress)
* [Indicator](https://mantine.dev/core/indicator)
* [Timeline](https://mantine.dev/core/timeline)
* [Spotlight](https://mantine.dev/x/spotlight)
* All [@mantine/dates](https://mantine.dev/dates/getting-started) components that are based on [Calendar](https://mantine.dev/dates/calendar) component

`autoContrast` checks whether the given color luminosity is above or below the `luminanceThreshold` value
and changes text color to either `theme.white` or `theme.black` accordingly.

`autoContrast` can be set globally on the theme level or individually for each component via `autoContrast` prop,
except for [Spotlight](https://mantine.dev/x/spotlight) and [@mantine/dates](https://mantine.dev/dates/getting-started) components which only support global theme setting.

#### Example: autoContrast

```tsx
import { Button, Code, Group } from '@mantine/core';

function Demo() {
  return (
    <>
      <Code>autoContrast: true</Code>
      <Group mt="xs" mb="lg">
        <Button color="lime.4" autoContrast>
          Lime.4 button
        </Button>
        <Button color="blue.2" autoContrast>
          Blue.2 button
        </Button>
        <Button color="orange.3" autoContrast>
          Orange.3 button
        </Button>
      </Group>

      <Code>autoContrast: false</Code>
      <Group mt="xs">
        <Button color="lime.4">Lime.4 button</Button>
        <Button color="blue.2">Blue.2 button</Button>
        <Button color="orange.3">Orange.3 button</Button>
      </Group>
    </>
  );
}
```