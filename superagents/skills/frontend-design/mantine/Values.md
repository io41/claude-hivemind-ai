# Mantine: Values

[Form values guide](https://mantine.dev/form/values/)

```tsx
// get current form values
form.getValues();

// Set all form values
form.setValues(values);

// Set all form values using the previous state
form.setValues((prev) => ({ ...prev, ...values }));

// Set value of single field
form.setFieldValue('path', value);

// Set value of nested field
form.setFieldValue('user.firstName', 'Jane');

// Resets form values to `initialValues`,
// clears all validation errors,
// resets touched and dirty state
form.reset();

// Reset field at `path` to its initial value
form.resetField('path');

// Sets initial values, used when form is reset
form.setInitialValues({ values: 'object' });
```