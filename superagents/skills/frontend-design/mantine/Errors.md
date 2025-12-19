# Mantine: Errors

[Form errors guide](https://mantine.dev/form/errors/)

Validation errors occur when defined validation rules were violated, `initialErrors` were specified in useForm properties
or validation errors were set manually.

```tsx
// get current errors state
form.errors;

// Set all errors
form.setErrors({ path: 'Error message', path2: 'Another error' });

// Set error message at specified path
form.setFieldError('user.lastName', 'No special characters allowed');

// Clears all errors
form.clearErrors();

// Clears error of field at specified path
form.clearFieldError('path');
```