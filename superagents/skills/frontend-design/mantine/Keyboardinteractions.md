# Mantine: Keyboard interactions

If you also need to support `Tab` and `Shift + Tab` then set `menuItemTabIndex={0}`.


#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| arrowOffset | number | - | Arrow offset in px |
| arrowPosition | ArrowPosition | - | Arrow position |
| arrowRadius | number | - | Arrow <code>border-radius</code> in px |
| arrowSize | number | - | Arrow size in px |
| children | React.ReactNode | - | Menu children |
| clickOutsideEvents | string[] | - | Events that trigger outside clicks |
| closeDelay | number | - | Close delay in ms, applicable only to <code>trigger="hover"</code> variant |
| closeOnClickOutside | boolean | - | If set, the dropdown is closed on outside clicks |
| closeOnEscape | boolean | - | If set, the dropdown is closed when the <code>Escape</code> key is pressed |
| closeOnItemClick | boolean | - | If set, the Menu is closed when one of the items is clicked |
| defaultOpened | boolean | - | Uncontrolled menu initial opened state |
| disabled | boolean | - | If set, popover dropdown will not be rendered |
| floatingStrategy | FloatingStrategy | - | Changes floating ui [position strategy](https://floating-ui.com/docs/usefloating#strategy) |
| hideDetached | boolean | - | If set, the dropdown is hidden when the element is hidden with styles or not visible on the screen |
| id | string | - | Id base to create accessibility connections |
| keepMounted | boolean | - | If set, the dropdown is not unmounted from the DOM when hidden. <code>display: none</code> styles are added instead. |
| loop | boolean | - | If set, arrow key presses loop though items (first to last and last to first) |
| menuItemTabIndex | 0 | -1 | - | Set the <code>tabindex</code> on all menu items |
| middlewares | PopoverMiddlewares | - | Floating ui middlewares to configure position handling |
| offset | number | FloatingAxesOffsets | - | Offset of the dropdown element |
| onChange | (opened: boolean) => void | - | Called when menu opened state changes |
| onClose | () => void | - | Called when Menu is closed |
| onDismiss | () => void | - | Called when the popover is dismissed by clicking outside or by pressing escape |
| onEnterTransitionEnd | () => void | - | Called when enter transition ends |
| onExitTransitionEnd | () => void | - | Called when exit transition ends |
| onOpen | () => void | - | Called when Menu is opened |
| onPositionChange | (position: FloatingPosition) => void | - | Called when dropdown position changes |
| openDelay | number | - | Open delay in ms, applicable only to <code>trigger="hover"</code> variant |
| opened | boolean | - | Controlled menu opened state |
| overlayProps | OverlayProps & ElementProps<"div"> | - | Props passed down to <code>Overlay</code> component |
| portalProps | BasePortalProps | - | Props to pass down to the <code>Portal</code> when <code>withinPortal</code> is true |
| position | FloatingPosition | - | Dropdown position relative to the target element |
| positionDependencies | any[] | - | @deprecated : Do not use, will be removed in 9.0 |
| preventPositionChangeWhenVisible | boolean | - | Prevents popover from flipping/shifting when it the dropdown is visible |
| radius | MantineRadius | number | - | Key of <code>theme.radius</code> or any valid CSS value to set border-radius |
| returnFocus | boolean | - | Determines whether focus should be automatically returned to control when dropdown closes |
| shadow | MantineShadow | - | Key of <code>theme.shadows</code> or any other valid CSS <code>box-shadow</code> value |
| transitionProps | TransitionProps | - | Props passed down to the <code>Transition</code> component. Use to configure duration and animation type. |
| trapFocus | boolean | - | If set, focus is trapped within the menu dropdown when it is opened |
| trigger | "hover" | "click" | "click-hover" | - | Event trigger to open menu |
| width | PopoverWidth | - | Dropdown width, or <code>'target'</code> to make dropdown width the same as target element |
| withArrow | boolean | - | Determines whether component should have an arrow |
| withInitialFocusPlaceholder | boolean | - | If set, focus placeholder element is added before items |
| withOverlay | boolean | - | Determines whether the overlay should be displayed when the dropdown is opened |
| withinPortal | boolean | - | Determines whether dropdown should be rendered within the <code>Portal</code> |
| zIndex | string | number | - | Dropdown <code>z-index</code> |


#### Styles API

Menu component supports Styles API. With Styles API, you can customize styles of any inner element. Follow the documentation to learn how to use CSS modules, CSS variables and inline styles to get full control over component styles.

**Menu selectors**

| Selector | Static selector | Description |
|----------|----------------|-------------|
| dropdown | .mantine-Menu-dropdown | Dropdown element |
| arrow | .mantine-Menu-arrow | Dropdown arrow |
| overlay | .mantine-Menu-overlay | Overlay element |
| divider | .mantine-Menu-divider | `Menu.Divider` root element |
| label | .mantine-Menu-label | `Menu.Label` root element |
| item | .mantine-Menu-item | `Menu.Item` root element |
| itemLabel | .mantine-Menu-itemLabel | Label of `Menu.Item` |
| itemSection | .mantine-Menu-itemSection | Left and right sections of `Menu.Item` |
| chevron | .mantine-Menu-chevron | Sub menu chevron |

**Menu data attributes**

| Selector | Attribute | Condition | Value |
|----------|-----------|-----------|-------|
| item | data-disabled | - | - |


--------------------------------------------------------------------------------