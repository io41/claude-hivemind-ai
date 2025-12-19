# Mantine: Touched and dirty

[Touched & dirty guide](https://mantine.dev/form/status/)

```tsx
// Returns true if user interacted with any field inside form in any way
form.isTouched();

// Returns true if user interacted with field at specified path
form.isTouched('path');

// Set all touched values
form.setTouched({ 'user.firstName': true, 'user.lastName': false });

// Clears touched status of all fields
form.resetTouched();

// Returns true if form values are not deep equal to initialValues
form.isDirty();

// Returns true if field value is not deep equal to initialValues
form.isDirty('path');

// Sets dirty status of all fields
form.setDirty({ 'user.firstName': true, 'user.lastName': false });

// Clears dirty status of all fields, saves form.values snapshot
// After form.resetDirty is called, form.isDirty will compare
// form.getValues() to snapshot instead of initialValues
form.resetDirty();
```

## UseFormReturnType

`UseFormReturnType` can be used when you want to pass `form` as a prop to another component:

```tsx
import { TextInput } from '@mantine/core';
import { useForm, UseFormReturnType } from '@mantine/form';

interface FormValues {
  name: string;
  occupation: string;
}

function NameInput({
  form,
}: {
  form: UseFormReturnType<FormValues>;
}) {
  return (
    <TextInput
      key={form.key('name')}
      {...form.getInputProps('name')}
    />
  );
}

function OccupationInput({
  form,
}: {
  form: UseFormReturnType<FormValues>;
}) {
  return (
    <TextInput
      key={form.key('occupation')}
      {...form.getInputProps('occupation')}
    />
  );
}

function Demo() {
  const form = useForm<FormValues>({
    mode: 'uncontrolled',
    initialValues: { name: '', occupation: '' },
  });
  return (
    <>
      <NameInput form={form} />
      <OccupationInput form={form} />
    </>
  );
}
```


--------------------------------------------------------------------------------