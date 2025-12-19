# Mantine: Validation

[Form validation guide](https://mantine.dev/form/validation/)

```tsx
import { useForm } from '@mantine/form';

const form = useForm({
  mode: 'uncontrolled',
  initialValues: {
    email: '',
    user: {
      firstName: '',
      lastName: '',
    },
  },
  validate: {
    email: (value) => (value.length < 2 ? 'Invalid email' : null),
    user: {
      firstName: (value) =>
        value.length < 2
          ? 'First name must have at least 2 letters'
          : null,
    },
  },
});

// Validates all fields with specified `validate` function or schema, sets form.errors
form.validate();

// Validates single field at specified path, sets form.errors
form.validateField('user.firstName');

// Works the same way as form.validate but does not set form.errors
form.isValid();
form.isValid('user.firstName');
```