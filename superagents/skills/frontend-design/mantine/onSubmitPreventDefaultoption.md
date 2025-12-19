# Mantine: onSubmitPreventDefault option

By default, `event.preventDefault()` is called on the form `onSubmit` handler.
If you want to change this behavior, you can pass `onSubmitPreventDefault` option
to `useForm` hook. It can have the following values:

* `always` (default) - always call `event.preventDefault()`
* `never` - never call `event.preventDefault()`
* `validation-failed` - call `event.preventDefault()` only if validation failed

```tsx
import { useForm } from '@mantine/form';

const form = useForm({
  mode: 'uncontrolled',
  onSubmitPreventDefault: 'never',
});
```