# Mantine: focusClassName

`theme.focusClassName` is a CSS class that is added to elements that have focus styles, for example, [Button](https://mantine.dev/core/button) or [ActionIcon](https://mantine.dev/core/action-icon/).
It can be used to customize focus ring styles of all interactive components except inputs. Note that when `theme.focusClassName` is set, `theme.focusRing` is ignored.



> **:focus-visible selector**
>
> `:focus-visible` selector is supported by more than [91% of browsers](https://caniuse.com/css-focus-visible) (data from April 2023).
> Safari browsers added support for it in version 15.4 (released in March 2022). If you need to support Safari 15.3 and older, you can use [focus-visible polyfill](https://github.com/WICG/focus-visible)
> or provide a [fallback](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible#providing_a_focus_fallback) with `:focus` pseudo-class.