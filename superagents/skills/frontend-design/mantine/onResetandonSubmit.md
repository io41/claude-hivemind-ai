# Mantine: onReset and onSubmit

Wrapper function for form `onSubmit` and `onReset` event handler. `onSubmit` handler accepts as second argument a function
that will be called with errors object when validation fails.

```tsx
import { useForm } from '@mantine/form';

function Demo() {
  const form = useForm({ mode: 'uncontrolled' });

  const handleSubmit = (values: typeof form.values) => {
    console.log(values);
  };

  return (
    <>
      {/* Supply handle submit as a single argument to receive validated values */}
      <form onSubmit={form.onSubmit(handleSubmit)} />

      {/* Supply second argument to handle errors */}
      <form
        onSubmit={form.onSubmit(
          (values, event) => {
            console.log(
              values, // <- form.getValues() at the moment of submit
              event // <- form element submit event
            );
          },
          (validationErrors, values, event) => {
            console.log(
              validationErrors, // <- form.errors at the moment of submit
              values, // <- form.getValues() at the moment of submit
              event // <- form element submit event
            );
          }
        )}
      />

      {/* form.onReset calls form.reset */}
      <form onReset={form.onReset}></form>
    </>
  );
}
```