# Mantine: Custom SVG loader

It is recommended to use CSS only loaders, as SVG based animations may have the following issues:

* High CPU usage – loader may look glitchy on low-end devices
* Loader animation may not start playing until js is loaded – user may see static loader

In your SVG loader, you need to use `--loader-size` and `--loader-color` variables the same
way as in CSS only custom loader in order for `size` and `color` props to work. Usually,
you would need to set `width` and `height` to `var(--loader-size)` and `fill`/`stroke` to
`var(--loader-color)`.

#### Example: customType

```tsx
import { MantineProvider, Loader } from '@mantine/core';
import { RingLoader } from './RingLoader';

const theme = createTheme({
  components: {
    Loader: Loader.extend({
      defaultProps: {
        loaders: { ...Loader.defaultLoaders, ring: RingLoader },
        type: 'ring',
      },
    }),
  },
});

function Demo() {
  return (
    <MantineThemeProvider theme={theme}>
      <Loader />
    </MantineThemeProvider>
  );
}
```


## children prop

`Loader` supports `children` prop. If you pass anything to `children`, it will be rendered
instead of the loader. This is useful when you want to control `Loader` representation
in components that use `loaderProps`, for example [Button](https://mantine.dev/core/button/), [LoadingOverlay](https://mantine.dev/core/loading-overlay/), [Dropzone](https://mantine.dev/x/dropzone/).

#### Example: customLoader

```tsx
import { useDisclosure } from '@mantine/hooks';
import { LoadingOverlay, Button, Group, Box } from '@mantine/core';

function Demo() {
  const [visible, { toggle }] = useDisclosure(false);

  return (
    <>
      <Box pos="relative">
        <LoadingOverlay visible={visible} loaderProps={{ children: 'Loading...' }} />
        {/* ...other content */}
      </Box>

      <Group justify="center">
        <Button onClick={toggle}>Toggle overlay</Button>
      </Group>
    </>
  );
}
```



#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | React.ReactNode | - | Overrides default loader with given content |
| color | MantineColor | - | Key of <code>theme.colors</code> or any valid CSS color |
| loaders | Partial<Record<(string & {}) | "bars" | "dots" | "oval", MantineLoaderComponent>> | - | Object of loaders components, can be customized via default props or inline. |
| size | number | MantineSize | (string & {}) | - | Controls <code>width</code> and <code>height</code> of the loader. <code>Loader</code> has predefined <code>xs</code>-<code>xl</code> values. Numbers are converted to rem. |
| type | (string & {}) | "bars" | "dots" | "oval" | - | Loader type, key of <code>loaders</code> prop |


#### Styles API

Loader component supports Styles API. With Styles API, you can customize styles of any inner element. Follow the documentation to learn how to use CSS modules, CSS variables and inline styles to get full control over component styles.

**Loader selectors**

| Selector | Static selector | Description |
|----------|----------------|-------------|
| root | .mantine-Loader-root | Root element |

**Loader CSS variables**

| Selector | Variable | Description |
|----------|----------|-------------|
| root | --loader-color | Control loader color |


--------------------------------------------------------------------------------