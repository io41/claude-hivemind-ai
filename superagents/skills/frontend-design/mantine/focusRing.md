# Mantine: focusRing

`theme.focusRing` controls focus ring styles, it supports the following values:

* `auto` (default and recommended) – focus ring is visible only when the user navigates with keyboard, this is the default browser behavior for native interactive elements
* `always` – focus ring is visible when user navigates with keyboard and mouse, for example, the focus ring will be visible when user clicks on a button
* `never` – focus ring is always hidden, it is not recommended – users who navigate with keyboard will not have visual indication of the current focused element

#### Example: focusRing

```tsx
function Demo() {
  return (
    <>
      <Text>
        Focus ring: <Code>auto</Code>
      </Text>

      <Group mt="xs">
        <Button size="xs">Button 1</Button>
        <Button size="xs">Button 2</Button>
      </Group>

      <MantineThemeProvider inherit theme={{ focusRing: 'always' }}>
        <Text mt="lg">
          Focus ring: <Code>always</Code>
        </Text>

        <Group mt="xs">
          <Button size="xs">Button 1</Button>
          <Button size="xs">Button 2</Button>
        </Group>
      </MantineThemeProvider>

      <MantineThemeProvider inherit theme={{ focusRing: 'never' }}>
        <Text mt="lg">
          Focus ring: <Code>never</Code>
        </Text>

        <Group mt="xs">
          <Button size="xs">Button 1</Button>
          <Button size="xs">Button 2</Button>
        </Group>
      </MantineThemeProvider>
    </>
  );
}
```