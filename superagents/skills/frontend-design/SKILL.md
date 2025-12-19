# Frontend Design Skill

## When to Use
- UI/UX design decisions
- Mantine v8 component usage
- Layout and spacing patterns
- Responsive design
- Color and theming

## Technology Stack
- **Mantine v8** - Component library
- **Tabler Icons** - Icon set
- **CSS Modules** - Scoped styles
- **PostCSS** - CSS preprocessing

For full Mantine documentation, see [mantine-reference.md](mantine-reference.md).

## Mantine v8 Setup

```tsx
// app/layout.tsx or main.tsx
import '@mantine/core/styles.css'
import { MantineProvider, createTheme } from '@mantine/core'

const theme = createTheme({
  primaryColor: 'blue',
  fontFamily: 'Inter, sans-serif',
  defaultRadius: 'md',
})

function App({ children }) {
  return (
    <MantineProvider theme={theme}>
      {children}
    </MantineProvider>
  )
}
```

## Core Components

### Layout Components

```tsx
import { Stack, Group, Flex, Grid, Container, Box } from '@mantine/core'

// Vertical stack
<Stack gap="md">
  <Item />
  <Item />
</Stack>

// Horizontal group
<Group gap="sm" justify="space-between">
  <Left />
  <Right />
</Group>

// Flexbox control
<Flex direction="column" align="center" justify="center">
  <Content />
</Flex>

// Grid layout
<Grid>
  <Grid.Col span={6}>Half</Grid.Col>
  <Grid.Col span={6}>Half</Grid.Col>
</Grid>

// Responsive grid
<Grid>
  <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>Responsive</Grid.Col>
</Grid>

// Container (max-width)
<Container size="md">
  <Content />
</Container>
```

### Form Components

```tsx
import { TextInput, Select, Button, Checkbox, NumberInput } from '@mantine/core'

<TextInput
  label="Email"
  placeholder="your@email.com"
  error="Invalid email"
  required
/>

<Select
  label="Country"
  data={['USA', 'Canada', 'Mexico']}
  searchable
  clearable
/>

<NumberInput
  label="Amount"
  min={0}
  max={100}
  step={5}
/>

<Button
  variant="filled"  // filled | outline | light | subtle | transparent
  color="blue"
  size="md"         // xs | sm | md | lg | xl
  loading={isLoading}
  disabled={!isValid}
>
  Submit
</Button>
```

### Feedback Components

```tsx
import { Alert, Notification, LoadingOverlay, Skeleton } from '@mantine/core'

<Alert color="red" title="Error">
  Something went wrong
</Alert>

<Notification title="Success" color="green" onClose={close}>
  Item created successfully
</Notification>

<Box pos="relative">
  <LoadingOverlay visible={isLoading} />
  <Content />
</Box>

<Skeleton height={50} visible={isLoading}>
  <Content />
</Skeleton>
```

### Navigation Components

```tsx
import { Tabs, NavLink, Breadcrumbs, Anchor } from '@mantine/core'

<Tabs defaultValue="tab1">
  <Tabs.List>
    <Tabs.Tab value="tab1">First</Tabs.Tab>
    <Tabs.Tab value="tab2">Second</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="tab1">Content 1</Tabs.Panel>
  <Tabs.Panel value="tab2">Content 2</Tabs.Panel>
</Tabs>

<Breadcrumbs>
  <Anchor href="/">Home</Anchor>
  <Anchor href="/products">Products</Anchor>
  <span>Current</span>
</Breadcrumbs>
```

### Overlay Components

```tsx
import { Modal, Drawer, Menu, Popover, Tooltip } from '@mantine/core'

<Modal opened={opened} onClose={close} title="Edit Item">
  <ModalContent />
</Modal>

<Drawer opened={opened} onClose={close} position="right">
  <DrawerContent />
</Drawer>

<Menu>
  <Menu.Target>
    <Button>Open Menu</Button>
  </Menu.Target>
  <Menu.Dropdown>
    <Menu.Item leftSection={<IconEdit />}>Edit</Menu.Item>
    <Menu.Divider />
    <Menu.Item color="red" leftSection={<IconTrash />}>Delete</Menu.Item>
  </Menu.Dropdown>
</Menu>

<Tooltip label="Helpful tip">
  <Button>Hover me</Button>
</Tooltip>
```

## Spacing System

Mantine uses a spacing scale based on `rem`:

| Size | Value | Use Case |
|------|-------|----------|
| xs | 0.625rem (10px) | Tight spacing |
| sm | 0.75rem (12px) | Compact layouts |
| md | 1rem (16px) | Default spacing |
| lg | 1.25rem (20px) | Generous spacing |
| xl | 2rem (32px) | Section spacing |

```tsx
// Use named sizes
<Stack gap="md">

// Or numeric values (converted to rem)
<Box p={16}>  // 1rem padding

// Responsive spacing
<Box p={{ base: 'sm', md: 'lg' }}>
```

## Color System

### Theme Colors
```tsx
// Primary color usage
<Button color="blue">Default shade (6)</Button>
<Button color="blue.4">Lighter</Button>
<Button color="blue.9">Darker</Button>

// Semantic colors
<Alert color="red">Error</Alert>
<Alert color="yellow">Warning</Alert>
<Alert color="green">Success</Alert>
<Alert color="blue">Info</Alert>
```

### CSS Variables
```css
/* Available in CSS */
.custom {
  color: var(--mantine-color-blue-6);
  background: var(--mantine-color-gray-0);
  border: 1px solid var(--mantine-color-gray-3);
}

/* Dynamic colors (respects color scheme) */
.adaptive {
  color: var(--mantine-color-text);
  background: var(--mantine-color-body);
  border-color: var(--mantine-color-default-border);
}
```

## Typography

```tsx
import { Title, Text } from '@mantine/core'

<Title order={1}>H1 Title</Title>
<Title order={2}>H2 Title</Title>

<Text size="xl" fw={700}>Large bold text</Text>
<Text size="sm" c="dimmed">Small muted text</Text>
<Text truncate>Long text that will be truncated...</Text>
<Text lineClamp={2}>Multi-line text clamped to 2 lines...</Text>
```

## Responsive Design

### Breakpoints
```
xs: 576px
sm: 768px
md: 992px
lg: 1200px
xl: 1408px
```

### Responsive Props
```tsx
// All components support responsive objects
<Box
  w={{ base: '100%', sm: '50%', md: '33%' }}
  display={{ base: 'none', md: 'block' }}
  p={{ base: 'sm', lg: 'xl' }}
>
  Responsive box
</Box>

// Hide at certain breakpoints
<Box visibleFrom="md">Only on md and up</Box>
<Box hiddenFrom="md">Only below md</Box>
```

### useMediaQuery Hook
```tsx
import { useMediaQuery } from '@mantine/hooks'

function ResponsiveComponent() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  return isMobile ? <MobileView /> : <DesktopView />
}
```

## Styles API

### Component Styling
```tsx
// classNames prop
<Button
  classNames={{
    root: classes.button,
    label: classes.buttonLabel
  }}
>

// styles prop (inline)
<Button
  styles={{
    root: { backgroundColor: 'red' },
    label: { fontWeight: 700 }
  }}
>

// CSS Module
// Button.module.css
.button {
  &[data-loading] { opacity: 0.5; }
  &[data-disabled] { cursor: not-allowed; }
}
```

### Data Attributes
Components expose data attributes for state-based styling:
- `data-active`
- `data-disabled`
- `data-loading`
- `data-checked`
- `data-expanded`

## Common Patterns

### Page Layout
```tsx
function PageLayout({ children }) {
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm' }}
      padding="md"
    >
      <AppShell.Header>
        <Header />
      </AppShell.Header>
      <AppShell.Navbar>
        <Navigation />
      </AppShell.Navbar>
      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  )
}
```

### Form with Validation
```tsx
import { useForm } from '@mantine/form'

function CreateForm() {
  const form = useForm({
    initialValues: { name: '', email: '' },
    validate: {
      name: (v) => v.length < 2 ? 'Too short' : null,
      email: (v) => /^\S+@\S+$/.test(v) ? null : 'Invalid email'
    }
  })

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput {...form.getInputProps('name')} label="Name" />
      <TextInput {...form.getInputProps('email')} label="Email" />
      <Button type="submit">Submit</Button>
    </form>
  )
}
```

### Data Table
```tsx
import { Table, ActionIcon, Group } from '@mantine/core'

function DataTable({ items }) {
  return (
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Name</Table.Th>
          <Table.Th>Status</Table.Th>
          <Table.Th>Actions</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {items.map(item => (
          <Table.Tr key={item.id}>
            <Table.Td>{item.name}</Table.Td>
            <Table.Td><Badge color={item.active ? 'green' : 'gray'}>{item.status}</Badge></Table.Td>
            <Table.Td>
              <Group gap="xs">
                <ActionIcon variant="subtle"><IconEdit /></ActionIcon>
                <ActionIcon variant="subtle" color="red"><IconTrash /></ActionIcon>
              </Group>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  )
}
```

## Related Resources
- [mantine/INDEX.md](mantine/INDEX.md) - Full component index (lazy-loadable)
- `frontend-react` - React patterns and state management
- `pixi` - Canvas-based graphics
