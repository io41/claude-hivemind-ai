# Mantine: use

-form
Package: @mantine/form
Import: import { use-form } from '@mantine/form';
Description: Manage form state

## Installation

`@mantine/form` package does not depend on any other libraries, you can use it with or without `@mantine/core` inputs:

```bash
yarn add @mantine/form
```

```bash
npm install @mantine/form
```

## Usage

#### Example: usage

```tsx
import { Button, Checkbox, Group, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

function Demo() {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      termsOfService: false,
    },

    validate: {
      email: (value) => (/^\\S+@\\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  return (
    <form onSubmit={form.onSubmit((values) => console.log(values))}>
      <TextInput
        withAsterisk
        label="Email"
        placeholder="your@email.com"
        key={form.key('email')}
        {...form.getInputProps('email')}
      />

      <Checkbox
        mt="md"
        label="I agree to sell my privacy"
        key={form.key('termsOfService')}
        {...form.getInputProps('termsOfService', { type: 'checkbox' })}
      />

      <Group justify="flex-end" mt="md">
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  );
}
```


## API overview

All examples below use the following example use-form hook.

```tsx
import { useForm } from '@mantine/form';

const form = useForm({
  mode: 'uncontrolled',
  initialValues: {
    path: '',
    path2: '',
    user: {
      firstName: 'John',
      lastName: 'Doe',
    },
    fruits: [
      { name: 'Banana', available: true },
      { name: 'Orange', available: false },
    ],
    accepted: false,
  },
});
```