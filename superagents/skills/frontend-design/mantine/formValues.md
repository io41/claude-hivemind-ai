# Mantine: formValues

Package: @mantine/form
Import: import { FormValues } from '@mantine/form';

## Initial values

In most cases you should set `initialValues`:

```tsx
import { useForm } from '@mantine/form';

const form = useForm({
  mode: 'uncontrolled',
  initialValues: {
    name: '',
    email: '',
  },
});
```

## setValues handler

With `form.setValues` you can set all form values, for example you can set values after you have received a response from the backend API:

#### Example: setValues

```tsx
import { useForm } from '@mantine/form';
import { TextInput, Button, Group } from '@mantine/core';
import { randomId } from '@mantine/hooks';

function Demo() {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      email: '',
    },
  });

  return (
    <div>
      <TextInput
        label="Name"
        placeholder="Name"
        key={form.key('name')}
        {...form.getInputProps('name')}
      />
      <TextInput
        mt="md"
        label="Email"
        placeholder="Email"
        key={form.key('email')}
        {...form.getInputProps('email')}
      />

      <Group justify="center" mt="xl">
        <Button
          onClick={() =>
            form.setValues({
              name: randomId(),
              email: `${randomId()}@test.com`,
            })
          }
        >
          Set random values
        </Button>
      </Group>
    </div>
  );
}
```


## setValues partial

`form.setValues` can also be used to set multiple values at once, payload will be shallow merged with current values state:

```tsx
import { useForm } from '@mantine/form';

const form = useForm({
  mode: 'uncontrolled',
  initialValues: { name: '', email: '', age: 0 },
});

form.setValues({ name: 'John', age: 21 });
form.getValues(); // -> { name: 'John', email: '', age: 21 }
```

## Initialize form

When called `form.initialize` handler sets `initialValues` and `values` to the same value
and marks form as initialized. It can be used only once, next `form.initialize` calls
are ignored.

`form.initialize` is useful when you want to sync form values with backend API response:

#### Example: initialize

```tsx
import { Button, NumberInput, TextInput } from '@mantine/core';
import { isInRange, isNotEmpty, useForm } from '@mantine/form';

interface FormValues {
  name: string;
  age: number | string;
}

function apiRequest(): Promise<FormValues> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ name: 'John Doe', age: 25 });
    }, 1000);
  });
}

function Demo() {
  const form = useForm<FormValues>({
    mode: 'uncontrolled',
    initialValues: { name: '', age: 0 },
    validate: {
      name: isNotEmpty('Name is required'),
      age: isInRange({ min: 18 }, 'You must be at least 18 to register'),
    },
  });

  return (
    <>
      <TextInput
        {...form.getInputProps('name')}
        key={form.key('name')}
        label="Name"
        placeholder="Name"
      />
      <NumberInput
        {...form.getInputProps('age')}
        key={form.key('age')}
        label="Age"
        placeholder="Age"
        mt="md"
      />
      <Button onClick={() => apiRequest().then((values) => form.initialize(values))} mt="md">
        Initialize form
      </Button>
    </>
  );
}
```


Example with [TanStack Query](https://tanstack.com/query/latest) (react-query):

```tsx
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from '@mantine/form';

function Demo() {
  const query = useQuery({
    queryKey: ['current-user'],
    queryFn: () => fetch('/api/users/me').then((res) => res.json()),
  });

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      email: '',
    },
  });

  useEffect(() => {
    if (query.data) {
      // Even if query.data changes, form will be initialized only once
      form.initialize(query.data);
    }
  }, [query.data]);
}
```

Note that `form.initialize` will erase all values that were set before it was called.
It is usually a good idea to set `readOnly` or `disabled` on all form fields before
`form.initialize` is called to prevent data loss. You can implement this with
[enhanceGetInputProps](https://mantine.dev/form/get-input-props/#enhancegetinputprops):

#### Example: enhanceGetInputPropsForm

```tsx
import { NumberInput, TextInput, Button } from '@mantine/core';
import { useForm } from '@mantine/form';

interface FormValues {
  name: string;
  age: number | string;
}

function Demo() {
  const form = useForm<FormValues>({
    mode: 'uncontrolled',
    initialValues: { name: '', age: '' },
    enhanceGetInputProps: (payload) => {
      if (!payload.form.initialized) {
        return { disabled: true };
      }

      return {};
    },
  });

  return (
    <>
      <TextInput
        {...form.getInputProps('name')}
        key={form.key('name')}
        label="Your name"
        placeholder="Your name"
      />
      <NumberInput
        {...form.getInputProps('age')}
        key={form.key('age')}
        label="Age"
        placeholder="Age"
        mt="md"
      />
      <Button onClick={() => form.initialize({ name: 'John', age: 20 })} mt="md">
        Initialize form
      </Button>
    </>
  );
}
```


## setFieldValue handler

`form.setFieldValue` handler allows to set value of the field at given path:

#### Example: setFieldValue

```tsx
import { useForm } from '@mantine/form';
import { TextInput, Button, Group } from '@mantine/core';
import { randomId } from '@mantine/hooks';

function Demo() {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      email: '',
    },
  });

  return (
    <div>
      <TextInput
        label="Name"
        placeholder="Name"
        key={form.key('name')}
        {...form.getInputProps('name')}
      />
      <TextInput
        mt="md"
        label="Email"
        placeholder="Email"
        key={form.key('email')}
        {...form.getInputProps('email')}
      />

      <Group justify="center" mt="xl">
        <Button onClick={() => form.setFieldValue('name', randomId())}>Random name</Button>
        <Button onClick={() => form.setFieldValue('email', `${randomId()}@test.com`)}>
          Random email
        </Button>
      </Group>
    </div>
  );
}
```


## reset handler

`form.reset` handler sets values to `initialValues` and clear all errors:

#### Example: reset

```tsx
import { useForm } from '@mantine/form';
import { TextInput, Button, Group } from '@mantine/core';

function Demo() {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      email: '',
    },
  });

  return (
    <div>
      <TextInput
        label="Name"
        placeholder="Name"
        key={form.key('name')}
        {...form.getInputProps('name')}
      />
      <TextInput
        mt="md"
        label="Email"
        placeholder="Email"
        key={form.key('email')}
        {...form.getInputProps('email')}
      />

      <Group justify="center" mt="xl">
        <Button onClick={() => form.reset()}>Reset to initial values</Button>
      </Group>
    </div>
  );
}
```


## setInitialValues handler

`form.setInitialValues` handler allows to update `initialValues` after form was initialized:

```tsx
import { useEffect } from 'react';
import { useForm } from '@mantine/form';

function Demo() {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      email: '',
    },
  });

  useEffect(() => {
    fetch('/api/user')
      .then((res) => res.json())
      .then((data) => {
        // Update initial values after form was initialized
        // These values will be used in form.reset
        // and to compare values to get dirty state
        form.setInitialValues(data);
        form.setValues(data);
      });
  }, []);
}
```

## transformValues

Use `transformValues` to transform values before they get submitted in `onSubmit` handler.
For example, it can be used to merge several fields into one or to convert types:

#### Example: transformValues

```tsx
import { useState } from 'react';
import { useForm } from '@mantine/form';
import { TextInput, Button, Code } from '@mantine/core';

function Demo() {
  const [submittedValues, setSubmittedValues] = useState('');

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      firstName: 'Jane',
      lastName: 'Doe',
      age: '33',
    },

    transformValues: (values) => ({
      fullName: `${values.firstName} ${values.lastName}`,
      age: Number(values.age) || 0,
    }),
  });

  return (
    <>
      <form
        onSubmit={form.onSubmit((values) => setSubmittedValues(JSON.stringify(values, null, 2)))}
      >
        <TextInput
          label="First name"
          placeholder="First name"
          key={form.key('firstName')}
          {...form.getInputProps('firstName')}
        />
        <TextInput
          label="Last name"
          placeholder="Last name"
          mt="md"
          key={form.key('lastName')}
          {...form.getInputProps('lastName')}
        />
        <TextInput
          type="number"
          label="Age"
          placeholder="Age"
          mt="md"
          key={form.key('age')}
          {...form.getInputProps('age')}
        />
        <Button type="submit" mt="md">
          Submit
        </Button>
      </form>

      {submittedValues && (
        <Code block mt="md">
          {submittedValues}
        </Code>
      )}
    </>
  );
}
```


## Get transformed values

You can get transformed values outside of `form.onSubmit` method by calling `form.getTransformedValues`.
It accepts `values` that need to be transformed as optional argument, if it is not provided, then
the result of `form.getValues()` transformation will be returned instead:

```tsx
import { useForm } from '@mantine/form';

function Demo() {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      firstName: 'John',
      lastName: 'Doe',
    },

    transformValues: (values) => ({
      fullName: `${values.firstName} ${values.lastName}`,
    }),
  });

  form.getTransformedValues(); // -> { fullName: 'John Doe' }
  form.getTransformedValues({
    firstName: 'Jane',
    lastName: 'Loe',
  }); // { fullName: 'Jane Loe' }
}
```

## onValuesChange

`onValuesChange` function is called every time form values change, use it
instead of `useEffect` to subscribe to form values changes:

#### Example: onValuesChange

```tsx
import { TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

function Demo() {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      email: '',
    },
    onValuesChange: (values) => {
      console.log(values);
    },
  });

  return (
    <div>
      <TextInput
        label="Name"
        placeholder="Name"
        key={form.key('name')}
        {...form.getInputProps('name')}
      />
      <TextInput
        mt="md"
        label="Email"
        placeholder="Email"
        key={form.key('email')}
        {...form.getInputProps('email')}
      />
    </div>
  );
}
```


## form.watch

`form.watch` is an effect function that allows subscribing to changes of a
specific form field. It accepts field path and a callback function that is
called with new value, previous value, touched and dirty field states:

#### Example: watch

```tsx
import { TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

function Demo() {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      email: '',
    },
  });

  form.watch('name', ({ previousValue, value, touched, dirty }) => {
    console.log({ previousValue, value, touched, dirty });
  });

  return (
    <div>
      <TextInput label="Name" placeholder="Name" {...form.getInputProps('name')} />
      <TextInput mt="md" label="Email" placeholder="Email" {...form.getInputProps('email')} />
    </div>
  );
}
```


Note that `form.watch` uses `useEffect` under the hood – all hooks rules apply.
For example, you cannot use `form.watch` conditionally or inside loops.

```tsx
function Demo() {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { name: '' },
  });

  // ❌ This will not work
  if (Math.random() > 0.5) {
    form.watch('name', ({ previousValue, value, touched, dirty }) => {
      console.log({ previousValue, value, touched, dirty });
    });
  }
}
```

## form.watch cascade

To loosely subscribe to changes, you can set `cascadeUpdates: true`.
This allows for parent objects to be written to directly, while still having
subscribers to nested keys updated. Additionally, writes to nested keys
will bubble up triggering parent key subscriptions as well.

#### Example: cascadeUpdates

```tsx
import { Button, Code, Stack, TextInput } from '@mantine/core';
import { createFormContext } from '@mantine/form';
import { useState } from 'react';

const [Provider, usePersonFormContext, usePersonForm] = createFormContext<{ person: { name: string } }>();

function Demo() {
  const form = usePersonForm({
    mode: 'uncontrolled',
    cascadeUpdates: true,
    initialValues: {
      person: { name: "" }
    }
  })

  return (
    <Provider form={form}>
      <Stack>
        <TextInput
          label="Name"
          placeholder="Name"
          key={form.key('person.name')}
          {...form.getInputProps('person.name')}
        />
        <Button onClick={() => form.setFieldValue("person", { name: "Jane Doe" })}>Set 'person' object to `{'{ name: "Jane Doe" }'}`</Button>
        <Watcher />
      </Stack>
    </Provider>
  );
}

function Watcher() {
  const form = usePersonFormContext();

  const [person, setPerson] = useState<{ name: string }>();
  const [name, setName] = useState<string>();

  form.watch('person', ({ value }) => setPerson(value));
  form.watch("person.name", ({ value }) => setName(value));

  return <Code block>{JSON.stringify({ person, name }, null, 2)}</Code>
}
```


## Get values type

```tsx
import { useForm } from '@mantine/form';

function Demo() {
  const form = useForm({ initialValues: { name: '', age: 0 } });

  // Get inferred form values type, will be `{ name: string; age: number }`
  type FormValues = typeof form.values;

  // Use values type in handleSubmit function or anywhere else
  const handleSubmit = (values: FormValues) => console.log(values);
}
```

## Get transformed values type

To get transformed values (output of [transformValues](#transformvalues)) use `TransformedValues` type.
It is useful when you want to create a custom submit function:

```tsx
import { TransformedValues, useForm } from '@mantine/form';

function Demo() {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      locationId: '2',
    },

    transformValues: (values) => ({
      ...values,
      locationId: Number(values.locationId),
    }),
  });

  type Transformed = TransformedValues<typeof form>;
  // -> { name: string, locationId: number }

  const handleSubmit = (values: TransformedValues<typeof form>) => {};

  return <form onSubmit={form.onSubmit(handleSubmit)} />;
}
```

## Set values type

By default, form values types will be inferred from `initialValues`.
To avoid that, you can pass type to `useForm` hook, this approach is useful when
types cannot be correctly inferred or when you want to provide more specific types:

```tsx
import { useForm } from '@mantine/form';

interface FormValues {
  name: string; // regular field, same as inferred type
  role: 'user' | 'admin'; // union, more specific than inferred string type

  // values that may be undefined or null
  // cannot be correctly inferred in strict mode
  age: number | undefined;
  registeredAt: Date | null;

  // Arrays that are empty cannot be inferred correctly
  jobs: string[];
}

function Demo() {
  const form = useForm<FormValues>({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      role: 'user',
      age: undefined,
      registeredAt: null,
      jobs: [],
    },
  });
}
```


--------------------------------------------------------------------------------

## FREQUENTLY ASKED QUESTIONS

# How to align input with a button in a flex container?
Learn how to align Mantine inputs with buttons using Group component

If you try to align one of Mantine inputs in a flex container with a button,
you will notice that input is not aligned with the button. This happens because
Mantine inputs have associated elements: label, description and error message.

#### Example: AlignInputButton

```tsx
import { Button, Group, TextInput } from '@mantine/core';

function Demo() {
  return (
    <Group align="flex-end">
      <TextInput label="Your email" error="Something went wrong" />
      <Button>Submit</Button>
    </Group>
  );
}
```


To align input with a button, you can either use `inputContainer` prop to wrap the button
next to the in a flex container:

#### Example: AlignInputButtonCorrect

```tsx
import { Button, Group, TextInput } from '@mantine/core';

function Demo() {
  return (
    <TextInput
      label="Your email"
      error="Something went wrong"
      inputContainer={(children) => (
        <Group align="flex-start">
          {children}
          <Button>Submit</Button>
        </Group>
      )}
    />
  );
}
```


Or change error/description position to absolute with [Styles API](https://mantine.dev/styles/styles-api/):

#### Example: AlignInputButtonStyles

```tsx
import { Button, Group, TextInput } from '@mantine/core';
import classes from './Demo.module.css';

function StylesDemo() {
  return (
    <Group align="flex-end" pb={18}>
      <TextInput label="Your email" error="Something went wrong" classNames={classes} />
      <Button>Submit</Button>
    </Group>
  );
}
```



----------------------------------------

# How can I apply styles to all Mantine components?
Learn how to use attribute selector to apply styles to all Mantine components

## Attribute selector

All Mantine components have static classes that start with `mantine-` prefix.
Use [attribute selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors)
in `.css` file to apply styles to all Mantine components:

```scss
[class^=mantine] {
  color: red;
}
```

Note that if you change `classNamesPrefix` on `MantineProvider`:

```tsx
import { MantineProvider, Text } from '@mantine/core';

function Demo() {
  return (
    <MantineProvider classNamesPrefix="app">
      <Text>Just some text</Text>
    </MantineProvider>
  );
}
```

You will need to update selector to match new prefix:

```scss
[class^=app] {
  color: red;
}
```


----------------------------------------

# Are Mantine components accessible?
Learn about Mantine components accessibility features

## Are Mantine components accessible?

Yes, Mantine components follow [WAI-ARIA](https://www.w3.org/WAI/standards-guidelines/aria/)
accessibility guidelines. All components have proper roles, aria-\* attributes and semantics,
provide full keyboard support, manage focus correctly and support screen readers.

## How Mantine components are tested for accessibility?

All components that have interactive elements are tested with [axe](https://www.deque.com/axe/)
([jest-axe](https://www.npmjs.com/package/jest-axe)) to ensure that they have all required
roles and aria-\* attributes. Additionally, all components are tested for keyboard support
and focus management with unit tests, you can view an example of these tests [here](https://github.com/mantinedev/mantine/blob/master/packages/%40mantine/core/src/components/Tabs/Tabs.test.tsx).
In Mantine codebase, there are more than 10,000 unit tests.

In addition to automated tests, Mantine components are manually tested with screen readers
(VoiceOver) to ensure that they are fully accessible for assistive technologies users.

## Is there anything I need to do on my side to make my app accessible?

Of course! While Mantine components provide a solid foundation for accessible applications,
there are still things that you need to do to ensure that your app is fully accessible.
If the component requires props to make it accessible, it will be mentioned in the component
documentation.

Things to look out for while building accessible applications:

* Use semantic HTML elements where possible: use `<button>` for buttons, `<a>` for links, etc.
* Provide proper labels for inputs
* Use `aria-label` attribute where necessary
* Ensure that your app is fully navigable with a keyboard
* Ensure that all elements in your app have proper color contrast
* And more

If you are interested in learning more about web accessibility, you can check out these
free courses:

* [Web Accessibility on Udacity](https://www.udacity.com/course/web-accessibility--ud891)
* [Develop Accessible Web Apps with React on Egghead](https://egghead.io/courses/develop-accessible-web-apps-with-react)


----------------------------------------

# Why can I not use value/label data structure with Autocomplete/TagsInput?
Learn the difference between Autocomplete and Select components

## Data structure

[Autocomplete](https://mantine.dev/core/autocomplete) and [TagsInput](https://mantine.dev/core/tags-input)
allow user entering any string value – the selection is not limited to predefined list of options.
If you decide to use these components, your application must handle free user input.

Example of Autocomplete usage with `data` prop:

```tsx
import { Autocomplete } from '@mantine/core';

function Demo() {
  return <Autocomplete data={['React', 'Vue']} />;
}
```

In this example, the user can select either `React` or `Vue` from the list of options
or enter any other string value, for example, `Angular`.

## Value/label data split

Unlike [Select](https://mantine.dev/core/select) and [MultiSelect](https://mantine.dev/core/multi-select)
components data in `{ value: string; label: string; }` is not supported in Autocomplete and TagsInput.
It is done on purpose to avoid confusion and make it clear that user can enter any string value.

Consider the following example:

```tsx
import { Autocomplete } from '@mantine/core';

const data = [
  { value: '18361', label: 'React' },
  { value: '09411', label: 'Vue' },
];

function Demo() {
  return (
    <Autocomplete data={data} onChange={(val) => console.log(val)} />
  );
}
```

If Autocomplete would support `{ value: string; label: string; }` data structure:

* When user selects `React` from the list, `18361` will be logged to the console
* When user selects `Vue` from the list, `09411` will be logged to the console
* When user enters `Angular` or any other value not present in the list, what should be logged to the console?
* When user enters `React`, should `18361` be logged to the console or should it be treated as free user input?

To avoid confusion and make it clear that user can enter any string value, Autocomplete and TagsInput
do not support `{ value: string; label: string; }` data structure.

## Difference between Autocomplete and Select

If you need to limit user input to predefined list of options,
consider using searchable [Select](https://mantine.dev/core/select) instead.
To learn more about the difference between Autocomplete and Select components,
check out [this guide](https://help.mantine.dev/q/select-autocomplete-difference).


----------------------------------------

# How can I change body background color?
Use CSS to change body background color

## Change body background with CSS

To change `body` background color you can use CSS. To do that, create `styles.css`
file in your project and import it at the root of your application:

```css
body {
  background-color: #f9f9f9;
}
```

## Change body background with CSS variable

`--mantine-color-body` CSS variable is used for body background and
as background color of some components ([Modal](https://mantine.dev/core/modal/), [Paper](https://mantine.dev/core/paper/), etc.).
To override this variable, create `styles.css` file in your project and import it at the root of your application:

```scss
:root {
  @mixin light-root {
    --mantine-color-body: #f9f9f9;
  }

  @mixin dark-root {
    --mantine-color-body: #333;
  }
}
```


----------------------------------------

# Browser zooms in when input is focused. What should I do?
Use meta tag to disable browser scaling or increase input size

Browser zooms in when some of Mantine inputs are focused because by default all
Mantine inputs have `size="sm"` with `14px` font-size. To prevent browser from zooming
in you can increase input size:

```tsx
import { TextInput } from '@mantine/core';

function Demo() {
  return <TextInput size="md" />;
}
```

You can use `user-scalable=no` meta tag in the `<head />` or your application
to disable browser scaling. Note that this will disable zooming for the entire
application and may cause accessibility issues.

```html
<meta
  name="viewport"
  content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
/>
```


----------------------------------------

# Can I use Mantine with Astro?
No, Astro does not support React context

## If you need Astro, you do not need a component library

[Astro](https://astro.build/) is designed to minimize
the amount of JavaScript required to build a website. All component
libraries require quite a bit of JavaScript to work, so if you are
planning to use Astro, the best option is to build your own components
that do not have large footprint.

## I need Mantine, what should I use instead?

In case you need Mantine and SSG application, you can use [Next.js](https://nextjs.org/)
or [Gatsby](https://www.gatsbyjs.com/). Both of them support all React features
that are required for Mantine to work.

## No! I need Astro and Mantine!

Not a chance, according to [Astro documentation](https://docs.astro.build/en/core-concepts/sharing-state/),
Astro does not support React context, which is required for Mantine to work.

> **From Astro documentation:**
>
> UI frameworks like React or Vue may encourage “context” providers for other components to consume.
> But when partially hydrating components within Astro or Markdown, you can’t use these context wrappers.


----------------------------------------

# Can I use Mantine with Create React App (CRA)?
Learn how to use Mantine without postcss-preset-mantine or how to eject CRA and customize webpack.config.js and use postcss-preset-mantine

## Deprecation notice

[Create React App](https://create-react-app.dev/) was deprecated in early 2023 ([comment from maintainers](https://github.com/reactjs/react.dev/pull/5487#issuecomment-1409720741)).
It is not recommended to use it for new projects. It is recommended to use [Vite](https://vitejs.dev/) or [Next.js](https://nextjs.org/) instead.
Starting from version 7.0 some of Mantine styling features are not officially supported in Create React App.

If you want to build a single page application, use Vite instead:

* [Getting started with Vite](https://mantine.dev/guides/vite/)
* [A fully featured Vite + Mantine template](https://github.com/mantinedev/vite-template)
* [Minimal Vite + Mantine template](https://github.com/mantinedev/vite-min-template)

## Usage without postcss-preset-mantine

To compile styles as shown in documentation, [postcss-preset-mantine](https://mantine.dev/styles/postcss-preset/)
is required. Create React App does not support custom PostCSS configuration by default.

The easiest way to use Mantine with Create React App is to write styles in plain CSS without [postcss-preset-mantine](https://mantine.dev/styles/postcss-preset/).

`rem`/`em` function and CSS nesting:

```scss
// ❌ Does not work with Create React App
.demo {
  font-size: rem(16px);

  @media (min-width: em(320px)) {
    font-size: rem(32px);
  }
}

// ✅ Works with Create React App
.demo {
  font-size: calc(1rem * var(--mantine-scale));
}

@media (min-width: 20em) {
  .demo {
    font-size: calc(2rem * var(--mantine-scale));
  }
}
```

Mixins:

```scss
// ❌ Does not work with Create React App
.demo {
  @mixin light {
    color: red;
  }

  @mixin dark {
    color: blue;
  }
}

// ✅ Works with Create React App
[data-mantine-color-scheme='light'] .demo {
  color: red;
}

[data-mantine-color-scheme='dark'] .demo {
  color: blue;
}
```

`light-dark` function:

```scss
// ❌ Does not work with Create React App
.demo {
  color: light-dark(red, blue);
}

// ✅ Works with Create React App
[data-mantine-color-scheme='light'] .demo {
  color: red;
}

[data-mantine-color-scheme='dark'] .demo {
  color: blue;
}
```

## Ejecting Create React App

If you still want to use [postcss-preset-mantine](https://mantine.dev/styles/postcss-preset/) with Create React App,
you can eject your application and add custom PostCSS configuration.

1. Eject your application – `npm run eject`
2. Install dependencies – `yarn add postcss postcss-preset-mantine @mantine/core @mantine/hooks`
3. Create `postcss.config.js` file in the root of your project with the following content:

```tsx
module.exports = {
  plugins: {
    'postcss-preset-mantine': {},
    'postcss-flexbugs-fixes': {},
    'postcss-preset-env': {},
    'postcss-normalize': {},
  },
};
```

4. Replace `postcss-loader` configuration in `config/webpack.config.js` with the following:

```tsx
{
  loader: require.resolve("postcss-loader"),
  options: {
    postcssOptions: {
      ident: "postcss",
    },
    sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
  },
}
```

5. After that follow [Vite getting started guide](https://mantine.dev/guides/vite/#installation) except for the first step
   (you already have `postcss.config.js` file)

## Ejected CRA example

You can find an example repository with ejected CRA application and full setup [here](https://github.com/rtivital/cra-mantine-7).


----------------------------------------

# Why my Carousel slides are in vertical orientation?
You forgot to import carousel styles

## Carousel component looks broken

If your [Carousel](https://mantine.dev/x/carousel/) component renders slides in vertical orientation
or has incorrect controls/indicators position, you forgot to import carousel styles.
Follow [@mantine/carousel](https://mantine.dev/x/carousel/#installation) installation
instructions to fix the issue. Import `@mantine/core` and `@mantine/carousel` styles at
the root of your application:

```tsx
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
```

## That's it! It works now!

Nice! 👍


----------------------------------------

# How can I change component color prop value depending on the color scheme?
Learn how to use CSS variables resolver to change color value depending on the color scheme

`color` prop in all components uses Mantine [CSS variables](https://mantine.dev/styles/css-variables)
to resolve color value depending on the color scheme. You can define these variables with `virtualColor` function:

#### Example: ColorSchemeColor

```tsx
import { virtualColor, createTheme, MantineProvider } from '@mantine/core';

const theme = createTheme({
  colors: {
    primary: virtualColor({ name: 'primary', light: 'blue', dark: 'red' }),
  },
});

function App() {
  return (
    <MantineProvider theme={theme}>
      <YourApp />
    </MantineProvider>
  );
}
```



----------------------------------------

# Why I see color scheme flickering on page load?
Color scheme flickering is caused by incorrect usage of ColorSchemeScript

## How Mantine applies color scheme

Mantine color scheme is defined by `data-mantine-color-scheme="{value}"`
attribute on the `:root` element (usually `html`). This attribute is used by
all components to assign color scheme specific styles.

Usually, you do not need to set `data-mantine-color-scheme` attribute manually,
it is added by `ColorSchemeScript` (before hydration) and `MantineProvider`
(after the app has been mounted) components automatically.

## Flash of inaccurate color scheme

Flash of inaccurate color scheme (FART) happens when the color scheme selected
by the user is different from the color scheme value with which the application
has been initialized. FART can occur only in applications with server-side
rendering (SSR) or static site generation (SSG).

In most case, FART is caused by incorrect usage of `ColorSchemeScript` component.
For example, a common issue is a mismatch of `defaultColorScheme` values defined
on `ColorSchemeScript` and `MantineProvider`:

```tsx
import { ColorSchemeScript, MantineProvider } from '@mantine/core';

// ❌ Incorrect usage – defaultColorScheme values do not match,
// this will cause color scheme flickering
function IncorrectDemo() {
  return (
    <>
      <ColorSchemeScript defaultColorScheme="light" />
      <MantineProvider defaultColorScheme="auto">
        {/* Your app here */}
      </MantineProvider>
    </>
  );
}

// ✅ Correct usage – defaultColorScheme values match, no FART
function CorrectDemo() {
  return (
    <>
      <ColorSchemeScript defaultColorScheme="light" />
      <MantineProvider defaultColorScheme="light">
        {/* Your app here */}
      </MantineProvider>
    </>
  );
}
```


----------------------------------------

# I get hydration warning about data-mantine-color-scheme attribute, what does it mean?
Learn how hydration works and how to fix warnings

## Example hydration warning

<ErrorMessage error="Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used. > -data-mantine-color-scheme='light'" />

Minimal Next.js code that has this warning (Next.js used as an example, the same logic can be applied to any other framework with server-side rendering):

```tsx
// app/layout.tsx
import { ColorSchemeScript, MantineProvider } from '@mantine/core';

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider>{children}</MantineProvider>
      </body>
    </html>
  );
}
```

## Why do I get hydration warning?

To fully understand this hydration warning, let's break it down how server-side rendering
works in React in general (Next.js, React Router, etc.):

1. User navigates to the page in the browser.
2. The server renders the page and sends html code to the client.
3. html code is parsed by the browser and rendered on the screen (at this point, JavaScript has not been executed yet, uses has only html code).
4. JavaScript code is loaded and executed on the client.
5. Hydration process starts: React compares server-rendered html with client-rendered html and tries to match them.
   If server-rendered html does not match client-rendered html, React will re-render the component on the client and
   show a warning in the console (like the one above).

Hydration mismatch error can happen in two cases:

1. Server-rendered html does not match client-rendered html
2. Some code is executed on the client before React hydration starts and changes the html generated by the server

In the example above, `ColorSchemeScript` component is used to change `data-mantine-color-scheme`
attribute on the `<html />` element before hydration, which causes the mismatch.
`ColorSchemeScript` component executes for following JavaScript code:

```tsx
try {
  var _colorScheme = window.localStorage.getItem("mantine-color-scheme-value");
  var colorScheme = _colorScheme === "light" || _colorScheme === "dark" || _colorScheme === "auto" ? _colorScheme : "light";
  var computedColorScheme = colorScheme !== "auto" ? colorScheme : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  document.documentElement.setAttribute("data-mantine-color-scheme", computedColorScheme);
} catch (e) {}
```

This code is executed on the client before React hydration starts, which changes the html generated by the server and causes the warning.

## How to fix hydration warning?

To fix the hydration warning, spread `mantineHtmlProps` on the `<html />` element:

```tsx
// app/layout.tsx
import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core';

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider>{children}</MantineProvider>
      </body>
    </html>
  );
}
```

## What is mantineHtmlProps?

`mantineHtmlProps` is an object with just two properties:

```tsx
export const mantineHtmlProps = {
  suppressHydrationWarning: true,
  'data-mantine-color-scheme': 'light',
};
```

* `suppressHydrationWarning` is used to disable hydration warning for the `<html />` element
* `data-mantine-color-scheme` is used to set default color scheme for the app when JavaScript is disabled, it is overridden by `ColorSchemeScript` component on the client before hydration

## Does hydration warning indicate a problem?

No, in this case, hydration warning is expected and does not indicate a problem with the app:
`data-mantine-color-scheme` attribute is change before hydration to prevent flash of inaccurate color scheme.

## How suppressHydrationWarning works?

`suppressHydrationWarning` is a special attribute that React uses to suppress hydration warning for the specific element.
It does not disable hydration warning for the whole app, only for the element with this attribute
(usually `<html />` element only).


----------------------------------------

# How can I test Select/MultiSelect components?
Learn how to use react-testing-library to test Select and MultiSelect components.

## Getting started

Before jumping into the testing part, make sure that you've configured
[Jest](https://mantine.dev/guides/jest) or [Vitest](https://mantine.dev/guides/vitest) in your project
as specified in the documentation. Assume that `render`, `screen` and `userEvent` variables
are imported from your project `test-utils` file.

This guide is applicable to:

* [Select](https://mantine.dev/core/select)
* [MultiSelect](https://mantine.dev/core/multi-select)
* [Autocomplete](https://mantine.dev/core/autocomplete)
* [TagsInput](https://mantine.dev/core/tags-input)
* Most custom components built with [Combobox](https://mantine.dev/core/combobox)

## Selecting one option (Select, Autocomplete)

To select one of the options in [Select](https://mantine.dev/core/select) or
[Autocomplete](https://mantine.dev/core/autocomplete) components, you need to:

1. Click the input to open the options list
2. Click the option you want to select

Note that:

* If you use an array of strings in the `data` prop, options will have the same value and label
* It is recommended to set `name` attribute on all form components that you are planning to test

```tsx
import { Select } from '@mantine/core';

function MyForm() {
  return (
    <Select
      name="age"
      label="Select your age"
      data={[
        { value: 'ok', label: 'I am 18 or older' },
        { value: 'not-ok', label: 'I am under 18' },
      ]}
    />
  );
}

it('selects option', () => {
  render(<MyForm />);

  // Click Select to open the options list
  // Note that the dropdown is closed when one of the options is selected
  // If you want to select several options one after another,
  // you need to click the input again to open the dropdown
  await userEvent.click(screen.getByRole('textbox', { name: 'Select your age' }));

  // Get option by its label and click it
  await userEvent.click(screen.getByRole('option', { name: 'I am 18 or older' }));

  // Verify that the option is selected
  // This is what user sees in the input
  expect(screen.getByRole('textbox')).toHaveValue('I am 18 or older');

  // This is what will be submitted with the form
  expect(document.querySelector('input[name="age"]')).toHaveValue('ok');
});
```

## Selecting multiple options (MultiSelect, TagsInput)

Selecting options in [MultiSelect](https://mantine.dev/core/multi-select) and
[TagsInput](https://mantine.dev/core/tags-input) components is similar to
`Select` and `Autocomplete`. The main difference is that the dropdown does not close
when one of the options is selected, so you can select several options one after another
without clicking the input again.

```tsx
import { MultiSelect } from '@mantine/core';

function MyForm() {
  return (
    <MultiSelect
      name="groceries"
      label="Select groceries"
      data={[
        { value: 'banana', label: 'Banana' },
        { value: 'apple', label: 'Apple' },
        { value: 'orange', label: 'Orange' },
      ]}
    />
  );
}

it('selects multiple options', () => {
  render(<MyForm />);

  // Click Select to open the options list
  // Note that unlike Select, MultiSelect does not close the dropdown when one of the options is selected
  // You can select several options one after another without clicking the input again
  await userEvent.click(screen.getByRole('textbox', { name: 'Select groceries' }));

  // Click several options to select them
  await userEvent.click(screen.getByRole('option', { name: 'Banana' }));
  await userEvent.click(screen.getByRole('option', { name: 'Apple' }));

  // The best way to verify that options are selected is to check the hidden input value
  expect(document.querySelector('input[name="groceries"]')).toHaveValue('banana,apple');
});
```

## Searching

You can verify that the component is searchable by typing search query and checking
that only relevant options are visible.

```tsx
import { MultiSelect } from '@mantine/core';

function MyForm() {
  return (
    <MultiSelect
      name="groceries"
      searchable
      label="Select groceries"
      data={[
        { value: 'banana', label: 'Banana' },
        { value: 'apple', label: 'Apple' },
        { value: 'orange', label: 'Orange' },
      ]}
    />
  );
}

it('searches for options', () => {
  render(<MyForm />);

  // Click Select to open the options list
  await userEvent.click(screen.getByRole('textbox', { name: 'Select groceries' }));

  // Type search query
  await userEvent.type(screen.getByRole('textbox', { name: 'Select groceries' }), 'banana');

  // Verify that only one option is visible
  expect(screen.getByRole('option', { name: 'Banana' })).toBeVisible();
  expect(screen.queryByRole('option', { name: 'Apple' })).toBeNull();
  expect(screen.queryByRole('option', { name: 'Orange' })).toBeNull();
});
```

## Dropdown opened state

To verify that the dropdown is opened, you can check that the listbox with the same name
as the input is visible.

```tsx
import { Select } from '@mantine/core';

function MyForm() {
  return (
    <Select
      name="age"
      label="Select your age"
      data={[
        { value: 'ok', label: 'I am 18 or older' },
        { value: 'not-ok', label: 'I am under 18' },
      ]}
    />
  );
}

it('verifies dropdown opened state', () => {
  render(<MyForm />);

  // Verify that dropdown is closed
  // Listbox has the same name as the textbox
  expect(screen.queryByRole('listbox', { name: 'Select your age' })).toBeNull();

  // Click Select to open the options list
  await userEvent.click(screen.getByRole('textbox', { name: 'Select your age' }));

  // Verify that dropdown is open
  expect(screen.getByRole('listbox', { name: 'Select your age' })).toBeVisible();
});
```


----------------------------------------

# How to integrate custom input with use-form hook?
Learn how to add use-form support for custom inputs

## How @mantine/form works

[use-form](https://mantine.dev/form/use-form) is used to store form values,
errors, touched, dirty and validation state. In order to support all `@mantine/form`
features (including `form.getInputProps()`) custom inputs must accept the following props:

* `value` – input value in controlled mode
* `defaultValue` – input value in uncontrolled mode
* `onChange` – input change handler used both for controlled and uncontrolled modes
* `error` – validation error message
* `onBlur` – used to set field as touched

## use-uncontrolled hook

In most cases, the easiest way to add support for both controlled and uncontrolled modes is to use
[use-uncontrolled](https://mantine.dev/hooks/use-uncontrolled) hook. It allows to use `value` and
`defaultValue` props together and automatically handles controlled/uncontrolled mode switching.

Example of a custom input that supports both controlled and uncontrolled modes:

```tsx
import { useUncontrolled } from '@mantine/hooks';

interface CustomInputProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

function CustomInput({
  value,
  defaultValue,
  onChange,
}: CustomInputProps) {
  const [_value, handleChange] = useUncontrolled({
    value,
    defaultValue,
    finalValue: 'Final',
    onChange,
  });

  return (
    <input
      type="text"
      value={_value}
      onChange={(event) => handleChange(event.currentTarget.value)}
    />
  );
}
```

## Full example

In the following example `CustomInput` component supports all `@mantine/form` features:

* `value`, `defaultValue` and `onChange` are used to control input value
* `error` is used to display validation error message
* `onBlur` (part of `...others` props) is used to set field as touched




----------------------------------------

# Is there DataGrid component that I can use with Mantine?
A list of community packages that provide DataGrid component that can be used with Mantine.

## Community packages

Mantine does not provide DataGrid component, but there are several community packages that you can use:

* [Mantine React Table](https://www.mantine-react-table.com/#)
* [Mantine Data Grid](https://kuechlin.github.io/mantine-data-grid/#/)
* [Mantine DataTable](https://icflorescu.github.io/mantine-datatable/)

If none of the packages above fits your needs, you can build a custom
DataGrid component with [TanStack Table](https://tanstack.com/table/)
and [Table](https://mantine.dev/core/table/) component from Mantine.

## Is it planned to add DataGrid component to Mantine?

The DataGrid component is complex and requires a lot of maintenance.
As of now (January 2024), it is not planned to add native DataGrid component
to Mantine in the near future.


----------------------------------------

# Why my dates components look broken?
Because you did not import styles

If your dates components look like this:

<Image src={image.src} maw={400} />

It means that you did not import styles for `@mantine/dates` package like
it is described in [installation](https://mantine.dev/dates/getting-started/#installation)
instructions.

Add styles import to your application:

```bash
import '@mantine/dates/styles.css';
```


----------------------------------------

# How can I disable all inputs/inputs group inside form?
Learn how to disable all inputs/inputs group inside form with unstyled Fieldset component

## Disable all inputs with fieldset

To disable all inputs/inputs group inside form, you can use the [Fieldset](https://mantine.dev/core/fieldset/) component.
If `disabled` prop is set, all inputs inside `Fieldset` are disabled. By default, `Fieldset` has border and padding styles.
If you want to use `Fieldset` only for `disabled` feature, set `variant="unstyled"`:

#### Example: FieldsetInputs

```tsx
import { Fieldset, TextInput, Button } from '@mantine/core';

function Demo() {
  return (
    <form>
      <Fieldset disabled variant="unstyled">
        <TextInput label="Your name" placeholder="Your name" />
        <TextInput label="Your email" placeholder="Your email" mt="md" />
        <Button type="submit" mt="md">
          Submit
        </Button>
      </Fieldset>
    </form>
  );
}
```


## Disable all inputs with enhanceGetInputProps

If you use [use-form](https://mantine.dev/form/get-input-props/#enhancegetinputprops) for
your form, you can disable all inputs with `enhanceGetInputProps`:

#### Example: EnhanceDisableInputs

```tsx
import { useState } from 'react';
import { Button, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

function Demo() {
  const [disabled, setDisabled] = useState(false);

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { name: '', email: '' },
    enhanceGetInputProps: () => ({ disabled }),
  });

  return (
    <form>
      <TextInput
        label="Your name"
        placeholder="Your name"
        {...form.getInputProps('name')}
        key={form.key('name')}
      />
      <TextInput
        label="Your email"
        placeholder="Your email"
        mt="md"
        {...form.getInputProps('email')}
        key={form.key('email')}
      />
      <Button mt="md" onClick={() => setDisabled((d) => !d)}>
        Toggle disabled
      </Button>
    </form>
  );
}
```



----------------------------------------

# My styles are broken with disabled JavaScript. What should I do?
Learn how to use Mantine without JavaScript enabled

## data-mantine-color-scheme attribute

Most of Mantine styles rely on `data-mantine-color-scheme`
attribute to be present on the root element of the application.
If it is not there, your application will look broken and it may
seem that styles are not applied at all. It is not the case, styles
are applied, but there is no `data-mantine-color-scheme` attribute
to match selectors.

By default, `data-mantine-color-scheme` attribute is added automatically
by `ColorSchemeScript` and `MantineProvider` components. Both of them
are JavaScript components and require JavaScript to work.

## Adding support for disabled JavaScript

If you are planning to support users with disabled JavaScript, you
need to defined `data-mantine-color-scheme` attribute manually on
the root element of your application (usually it is `html`).

```html
<html data-mantine-color-scheme="light">
<!-- ... rest of your application -->
```

Note that you can only used `light` or `dark` values for `data-mantine-color-scheme`
in this case. `auto` value is not supported without JavaScript.


----------------------------------------

# How can I upload files from Dropzone component?
Learn how to process files dropped into Dropzone component

## Example

Example below demonstrates how to upload files from Dropzone component to S3 bucket
with `axios`:

```tsx
import axios from 'axios';
import { useState } from 'react';
import { Dropzone } from '@mantine/dropzone';
import { notifications } from '@mantine/notifications';

function Demo() {
  const [loading, setLoading] = useState(false);

  const handleUpload = (files: File) => {
    setLoading(true);

    axios
      .put('https://your-bucket.s3.amazonaws.com', file)
      .then(() => {
        notifications.showNotification({
          title: 'File uploaded',
          message: 'File uploaded successfully',
          color: 'teal',
        });
      })
      .catch((error) => {
        notifications.showNotification({
          title: 'File upload failed',
          message: error.message,
          color: 'red',
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <Dropzone onDrop={(files) => handleUpload(files[0])} loading={loading}>
      {loading ? 'Uploading file...' : 'Drop file here'}
    </Dropzone>
  );
}
```


----------------------------------------

# How can I add dynamic CSS styles?
Use data attributes, CSS variables or inline styles

## data- attributes

If the value that controls dynamic styles is a boolean or a known small union of values,
use [data- attributes](https://mantine.dev/styles/data-attributes/).

First, define data- attributes on the component. In the example below:

* `data-disabled` represents boolean `disabled` attribute. `disabled || undefined` is required
  to not add `data-disabled="false"` attribute when `disabled` is `false` and allow styling with `&[data-disabled]` selector.
* `data-orientation` represents `orientation` prop which can be either `horizontal` or `vertical`.
  In styles you can reference it with `&[data-orientation="horizontal"]` selector.

```tsx
import { Box } from '@mantine/core';
import classes from './Demo.module.css';

interface DemoProps {
  disabled: boolean;
  orientation: 'horizontal' | 'vertical';
}

function Demo({ disabled, orientation }: DemoProps) {
  return (
    <Box
      data-disabled={disabled || undefined}
      data-orientation={orientation}
      className={classes.root}
    >
      My demo
    </Box>
  );
}
```

Then add styles in `.module.css` file:

```scss
.root {
  background: orange;
  display: flex;

  &[data-disabled] {
    background: silver;
  }

  &[data-orientation='horizontal'] {
    flex-direction: row;
  }

  &[data-orientation='vertical'] {
    flex-direction: column;
  }
}
```

## Inline styles

If the value that controls dynamic styles is not represented by a known union
of values (for example, value can be any valid CSS color), then you can use
inline styles or [style props](https://mantine.dev/styles/style-props/):

```tsx
import { Box } from '@mantine/core';

interface DemoProps {
  fontFamily: string;
  color: string;
}

function Demo({ fontFamily, color }: DemoProps) {
  return (
    <Box style={{ backgroundColor: color }} ff={fontFamily}>
      My demo
    </Box>
  );
}
```

If you need to customize a deeply nested element, use [styles](https://mantine.dev/styles/styles-api/#styles-prop)
prop instead:

```tsx
import { Button } from '@mantine/core';

interface DemoProps {
  color: string;
}

function Demo({ color }: DemoProps) {
  return (
    <Button styles={{ label: { backgroundColor: color } }}>
      My demo
    </Button>
  );
}
```

Note that, it is not possible use pseudo-classes (for example, `:hover`, `:first-of-type`)
and media queries inside the `styles` prop. For this purpose, use CSS variables
with [classNames](https://mantine.dev/styles/styles-api/#classnames-prop) prop.

## CSS variables

If none of the methods above works for you (for example, you want to customize, `:hover`
styles based on component prop), use CSS variables
with [classNames](https://mantine.dev/styles/styles-api/#classnames-prop) prop.

First, define CSS variables in `style` or `styles` prop:

```tsx
import { Box } from '@mantine/core';
import classes from './Demo.module.css';

interface DemoProps {
  color: string;
}

function Demo({ color }: DemoProps) {
  return (
    <Box style={{ '--demo-hover': color }} className={classes.root}>
      My demo
    </Box>
  );
}
```

Then reference them in `.module.css` file:

```scss
.root {
  background: orange;

  &:hover {
    background: var(--demo-hover);
  }
}
```


----------------------------------------

# Why FileButton does not work in Menu?
Learn how to use FileButton in Menu component

## Example of the issue

In the following example, the `onChange` callback will never be called
even though the `FileButton` is rendered inside the `Menu` component and
the file dialog is opened when the second `Menu.Item` is clicked.

#### Example: FileButtonMenuBroken

```tsx
import { Button, FileButton, Menu } from '@mantine/core';

function Demo() {
  return (
    <Menu>
      <Menu.Target>
        <Button>Toggle menu</Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item>Fist item</Menu.Item>
        <FileButton onChange={(file) => console.log(file)} accept="image/png,image/jpeg">
          {(props) => <Menu.Item {...props}>Upload Image</Menu.Item>}
        </FileButton>
      </Menu.Dropdown>
    </Menu>
  );
}
```


## Source of the issue

The `onChange` callback is not triggered in the example above because, by default,
`Menu` component is closed automatically when an item is clicked. When the `Menu` is
closed, the `FileButton` is unmounted from the DOM with the underlying `input[type="file"]`
element. When the file is selected, the `input[type="file"]` element is not in the DOM
and the `onChange` callback is not triggered.

## How to fix the issue

There are two solutions to this issue. The first one is to set `keepMounted` prop
on the `Menu` component. This way, the `FileButton` will not be unmounted when the
`Menu` is closed:

#### Example: FileButtonMenuFix

```tsx
import { Button, FileButton, Menu } from '@mantine/core';

function Demo() {
  return (
    <Menu keepMounted>
      <Menu.Target>
        <Button>Toggle menu</Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item>Fist item</Menu.Item>
        <FileButton onChange={(file) => console.log(file)} accept="image/png,image/jpeg">
          {(props) => <Menu.Item {...props}>Upload Image</Menu.Item>}
        </FileButton>
      </Menu.Dropdown>
    </Menu>
  );
}
```


The other solution is to prevent `Menu` from closing when `Menu.Item` that contains
`FileButton` is clicked. This can be done by setting `closeOnItemClick={false}` prop
on the `Menu.Item` component:

#### Example: FileButtonMenuFix2

```tsx
import { Button, FileButton, Menu } from '@mantine/core';

function Demo() {
  return (
    <Menu>
      <Menu.Target>
        <Button>Toggle menu</Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item>Fist item</Menu.Item>
        <FileButton onChange={(file) => console.log(file)} accept="image/png,image/jpeg">
          {(props) => (
            <Menu.Item {...props} closeMenuOnClick={false}>
              Upload Image
            </Menu.Item>
          )}
        </FileButton>
      </Menu.Dropdown>
    </Menu>
  );
}
```



----------------------------------------

# Is there a floating action button component?
No, but you can build it with Affix and ActionIcon components

Mantine does not include floating action button component,
but you can build it with [Affix](https://mantine.dev/core/affix) and
[ActionIcon](https://mantine.dev/core/action-icon) components:




----------------------------------------

# How can I focus the first input with error with use-form?
Learn how to handle focus with use-form hook

## Get input DOM node with use-form

You can use `form.getInputNode` function to get input DOM node at the given path.
For example:

```tsx
import { useForm } from '@mantine/form';

const form = useForm({
  mode: 'uncontrolled',
  initialValues: {
    order_id: null,
    user: { email: '' },
  },
});

// Returns input DOM node for order_id input
form.getInputNode('order_id');

// Returns input DOM node for user.email input
form.getInputNode('user.email');
```

## Focus first input with error on form submit

`form.onSubmit` handler accepts two functions: the first function is called
with valid form values when validation passes, the second function is called
with form errors when validation fails. You can use the second function and
`form.getInputNode` to focus the first input with error:

#### Example: FocusFirstInputWithError

```tsx
function Demo() {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      email: '',
    },

    validate: {
      name: isNotEmpty('Name is required'),
      email: isEmail('Invalid email'),
    },
  });

  return (
    <form
      onSubmit={form.onSubmit(
        () => {},
        (errors) => {
          const firstErrorPath = Object.keys(errors)[0];
          form.getInputNode(firstErrorPath)?.focus();
        }
      )}
    >
      <TextInput
        withAsterisk
        label="Your name"
        placeholder="Your name"
        key={form.key('name')}
        {...form.getInputProps('name')}
      />

      <TextInput
        withAsterisk
        label="Your email"
        placeholder="your@email.com"
        mt="md"
        key={form.key('email')}
        {...form.getInputProps('email')}
      />

      <Group justify="flex-end" mt="md">
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  );
}
```



----------------------------------------

# How can I contribute to the library?
There are multiple ways to contribute even without writing code

## Ways to contribute

* Share your feedback in [GitHub Discussions](https://github.com/mantinedev/mantine/discussions/categories/feedback) –
  we are always happy to hear your thoughts on how to make Mantine better. Most of the new features and components
  are based on the feedback we receive from the community.
* Help others on [Discord](https://discord.gg/wbH82zuWMN) and/or [GitHub Discussions](https://github.com/mantinedev/mantine/discussions). There are usually 10-20 new questions every day,
  you can help people with their issues and questions. While helping others, you will learn yourself and become
  more proficient with React and Mantine.
* Give us a code review. You are welcome to explore `@mantine/*` packages [source code](https://github.com/mantinedev/mantine)
  and provide your feedback on how we can improve it. We are always open to new ideas and suggestions.
* Send us some [kind words](https://github.com/mantinedev/mantine/discussions/categories/kind-words). We usually receive only
  bug reports and feature requests, it is always nice to hear that people enjoy working with Mantine.
* Star the project on [GitHub](https://github.com/mantinedev/mantine). It is a small thing that helps us grow and get more
  people interested in the project.
* [Contribute](/contribute) to the Mantine codebase. We welcome all kinds of contributions: if you do not have much
  experience with React/TypeScript, you can help us improve the documentation to make it more clear and understandable
  for new developers. If you are an experienced React developer, you can help us with open [issues](https://github.com/mantinedev/mantine/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22).

## How to contribute to the codebase

* Decide on what you want to contribute.
* If you would like to implement a new feature, discuss it with the maintainer ([GitHub Discussions](https://github.com/mantinedev/mantine/discussions/new) or [Discord](https://discord.gg/wbH82zuWMN)) before jumping into coding.
* After finalizing issue details, as you begin working on the code.
* Run tests with `npm test` and submit a PR once all tests have passed.
* Get a code review and fix all issues noticed by the maintainer.
* If you cannot finish your task or if you change your mind – that's totally fine! Just let us know in the GitHub issue that you created during the first step of this process. The Mantine community is friendly – we won't judge or ask any questions if you decide to cancel your submission.
* Your PR is merged. You are awesome ❤️!

## How to get started with Mantine locally

* Install the [editorconfig](https://editorconfig.org/) extension for your editor.
* Fork the [repository](https://github.com/mantinedev/mantine), then clone or download your fork.
* Run `nvm use` to switch to the Node version specified in `.nvmrc` file ([install nvm](https://github.com/nvm-sh/nvm)).
* Install dependencies with yarn – `yarn`
* Setup project – `npm run setup`
* Build local version of all packages – `npm run build all`
* To start storybook – `npm run storybook`
* To start docs – `npm run docs`
* To rebuild props descriptions – `npm run docs:docgen`


----------------------------------------

# How that thing is done on mantine.dev website?
Learn how various elements are implemented on mantine.dev website

## mantine.dev website

[Mantine documentation](https://mantine.dev) website is built with Next.js and Mantine.
You can find the source code of the website in the [repository](https://github.com/mantinedev/mantine).
If you are interested how specific part of the website is implemented, you can browse the source code and learn from it.

## How can I build the same footer?

* Give footer fixed position with `position: fixed` and `bottom: 0` properties.
* Create a div element that will contain all content except footer.
* Set `min-height: 100vh` on the content container to make sure that footer is always under by the content.
* Make sure that your content container has background color.
* Done! You have a footer at the bottom of the page.


----------------------------------------

# How can I add hover styles to an element?
Learn how to add hover classes to an element with CSS modules, &:hover or @mixin hover

## &:hover

The simplest way of adding `:hover` styles to an element is to use the `&` selector:

```scss
// Element.module.css
.element {
  &:hover {
    background-color: red;
  }
}
```

Then import the styles into your component:

```tsx
import { Box } from '@mantine/core';
import styles from './Element.module.css';

export const Element = () => {
  return <Box className={styles.element}>Element</Box>;
};
```

## @mixin hover

If you have [postcss-preset-mantine](https://mantine.dev/styles/postcss-preset/) in your
project, you can use `@mixin hover` to add hover styles. Unlike `&:hover`,
`@mixin hover` will also add styles for touch devices.

```scss
// Import the css file in your component the same way as in &:hover example
.demo {
  @mixin hover {
    color: orange;
  }
}
```

The code above will be transformed into:

```scss
@media (hover: hover) {
  .demo:hover {
    color: orange;
  }
}

@media (hover: none) {
  .demo:active {
    color: orange;
  }
}
```

## Is there a way to add hover styles inline in jsx?

Mantine does not provide a way to add hover styles inline in jsx as a library feature.
However, in your project you can use any third-party styling library that supports
inline styles, for example [styled-components](https://styled-components.com/)
or [emotion](https://emotion.sh/).


----------------------------------------

# How to call a function when Modal/Drawer closes and animation completes?
How to use transitionProps in Modal/Drawer components

[Modal](https://mantine.dev/core/modal/) and [Drawer](https://mantine.dev/core/drawer/) components
use [Transition](https://mantine.dev/core/transition/) component under the hood to animate
presence. You can use `transitionProps` property to pass props to `Transition` component:

```tsx
import { Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

function Demo() {
  const [opened, handlers] = useDisclosure();

  return (
    <Modal
      title="Modal title"
      opened={opened}
      onClose={handlers.close}
      transitionProps={{
        onEntered: () => console.log('Modal opened, animation done'),
        onExited: () => console.log('Modal closed, animation done'),
      }}
    >
      Modal content
    </Modal>
  );
}
```


----------------------------------------

# How can I get current color scheme value in JavaScript?
How to use useMantineColorScheme and useComputedColorScheme hooks to get current color scheme value in JavaScript

## Get color scheme value in component

To get color scheme value in component use `useMantineColorScheme` hook:

```tsx
import { useMantineColorScheme } from '@mantine/core';

function Demo() {
  // colorScheme is `'dark' | 'light' | 'auto'`
  const { colorScheme } = useMantineColorScheme();
}
```

If you want to get computed color scheme, use `useComputedColorScheme` hook instead.
It will resolve `auto` value to `dark` or `light` based on user preferences:

```tsx
import { useComputedColorScheme } from '@mantine/core';

function Demo() {
  // colorScheme is `'dark' | 'light'`
  const colorScheme = useComputedColorScheme();
}
```

Note that both hooks are using `localStorage` to store color scheme value.
It is not possible to get color scheme value on the server side – the value
will always fallback to `light` during SSR.

## Get color scheme value outside of component

To get color scheme value outside of component, create an utility function
that will parse color scheme value from `data-mantine-color-scheme` attribute:

```tsx
import { MantineColorScheme } from '@mantine/core';

export function getColorScheme() {
  return document.documentElement.getAttribute(
    'data-mantine-color-scheme'
  ) as MantineColorScheme;
}
```

Then use it in any place of your application:

```tsx
import { getColorScheme } from './getColorScheme';

const colorScheme = getColorScheme();
```

Note that this approach will not work on the server side.

## I want to hide/show some elements based on color scheme value

Using the approaches described above to get color scheme value is not compatible with SSR.
For example, if you want to conditionally render some elements based on color scheme value,
you will get hydration mismatch or other error:

```tsx
import { useComputedColorScheme } from '@mantine/core';
import { getColorScheme } from './getColorScheme';

// ❌ Not compatible with SSR
function Demo() {
  const colorScheme = useComputedColorScheme();

  return (
    <div>
      {colorScheme === 'dark' && <div>Dark mode</div>}
      {getColorScheme() === 'light' && <div>Light mode</div>}
    </div>
  );
}
```

Instead of relying on JavaScript code to hide/show elements,
render both elements and hide them with styles based on color scheme value
using `data-mantine-color-scheme` attribute. All Mantine components have
`lightHidden` and `darkHidden` props that hide element based on color scheme value.
You can also use [light/dark mixins](https://mantine.dev/theming/color-schemes/#color-scheme-value-caveats)
or `light-dark` function from [postcss-preset-mantine](https://mantine.dev/styles/postcss-preset/)
to hide elements based on color scheme value.

#### Example: HideShowColorScheme

```tsx
import { Button } from '@mantine/core';

function Demo() {
  return (
    <>
      <Button color="cyan" lightHidden>
        Visible in dark color scheme only
      </Button>

      <Button color="pink" darkHidden>
        Visible in light color scheme only
      </Button>
    </>
  );
}
```



----------------------------------------

# How can I lock scroll in my application?
Use react-remove-scroll library to lock scroll in your application

Mantine components use [react-remove-scroll](https://github.com/theKashey/react-remove-scroll)
library to lock scroll. You can use it in your application to lock scroll. For your
convenience, `@mantine/core` package exports `RemoveScroll` component:

```tsx
import { RemoveScroll } from '@mantine/core';

function App() {
  return (
    <RemoveScroll>
      <div>Content</div>
    </RemoveScroll>
  );
}
```

The component supports all props that are supported by `react-remove-scroll` library,
you can find the full list of props in the [official documentation](https://github.com/theKashey/react-remove-scroll).


----------------------------------------

# How to prevent Modal from closing?
Learn how to prevent Modal from closing when user clicks outside of it or presses Escape key

[Modal](https://mantine.dev/core/modal/) and [Drawer](https://mantine.dev/core/drawer/) components
opened state is controlled by `opened` prop. You can use it to prevent modal from closing by setting
it to `true`. For example, it can be useful if you have an async operation inside the modal and want to
prevent user from closing it before the operation is finished:

#### Example: ModalDoNotClose

```tsx
import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Button, Modal } from '@mantine/core';

function operation() {
  return new Promise((resolve) => {
    setTimeout(resolve, 5000);
  });
}

function Demo() {
  const [opened, { open, close }] = useDisclosure();
  const [loading, setLoading] = useState(false);

  const performOperation = () => {
    setLoading(true);
    operation().then(() => setLoading(false));
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={loading ? () => {} : close}
        withCloseButton={!loading}
        title="Modal with async operation"
      >
        <Button loading={loading} onClick={performOperation} fullWidth>
          Perform heavy operation
        </Button>
      </Modal>
      <Button onClick={open}>Open modal</Button>
    </>
  );
}
```



----------------------------------------

# How can I lint CSS files?
Learn how to setup Stylelint for Mantine postcss syntax

## Installation

[Stylelint](https://stylelint.io/) is a tool to lint CSS and CSS like files.
To get started install `stylelint` and `stylelint-config-standard-scss` packages:

<InstallScript packages="stylelint stylelint-config-standard-scss" />

## Configuration

Create `.stylelintrc.json` file at your project root with the following content:

```json
{
  "extends": ["stylelint-config-standard-scss"],
  "rules": {
    "scss/no-duplicate-mixins": null,
    "scss/at-mixin-pattern": null,
    "scss/at-rule-no-unknown": null,
    "selector-pseudo-class-no-unknown": [
      true,
      {
        "ignorePseudoClasses": ["global"]
      }
    ]
  }
}
```

The rules above are required to make Stylelint work with Mantine components.

## Mantine Stylelint config

If you want to have the same Stylelint configuration as Mantine, change `.stylelintrc.json` content to the following:

```json
{
  "extends": ["stylelint-config-standard-scss"],
  "rules": {
    "custom-property-pattern": null,
    "selector-class-pattern": null,
    "scss/no-duplicate-mixins": null,
    "declaration-empty-line-before": null,
    "declaration-block-no-redundant-longhand-properties": null,
    "alpha-value-notation": null,
    "custom-property-empty-line-before": null,
    "property-no-vendor-prefix": null,
    "color-function-notation": null,
    "length-zero-no-unit": null,
    "selector-not-notation": null,
    "no-descending-specificity": null,
    "comment-empty-line-before": null,
    "scss/at-mixin-pattern": null,
    "scss/at-rule-no-unknown": null,
    "value-keyword-case": null,
    "media-feature-range-notation": null,
    "selector-pseudo-class-no-unknown": [
      true,
      {
        "ignorePseudoClasses": ["global"]
      }
    ]
  }
}
```

## Additional tools

Add npm script to your `package.json` to lint all css files in your project:

```json
{
  "scripts": {
    "stylelint": "stylelint '**/*.css' --cache"
  }
}
```

To enable linting in your editor, install [stylelint VSCode extension](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint).


----------------------------------------

# How to update Mantine dependencies?
Learn how to update @mantine/*, @mantinex/* and postcss-preset-mantine dependencies manually or with ncu script

## Update dependencies with npm-check-updates

Run the following script to update `package.json` file:

```sh
npx npm-check-updates @mantine/* @mantinex/* postcss-preset-mantine -u
```

Then install new dependencies with your package manager. For example, if
you use [yarn](https://yarnpkg.com/), run

```sh
yarn
```

All done! Your dependencies are up to date.

## ncu script

You can install [npm-check-updates](https://www.npmjs.com/package/npm-check-updates)
globally and run it without `npx`:

```sh
npm install -g npm-check-updates
```

After the package is installed, run the following command to update `@mantine/*`
dependencies:

```sh
ncu @mantine/* @mantinex/* postcss-preset-mantine -u
```

## Update dependencies manually

If the method above does not work for you or you want to update `@mantine/*` dependencies
to a specific version, you can do it manually. Open `package.json` file, it may look
something like this:

```json
{
  "name": "your-project",
  "version": "1.0.0",
  "scripts": {},
  "dependencies": {
    "@mantine/core": "^7.2.2",
    "@mantine/hooks": "^7.2.2",
    "next": "14.0.2",
    "react": "18.2.0",
    "react-dom": "18.2.0"
  },
  "devDependencies": {
    "postcss": "^8.4.31",
    "postcss-preset-mantine": "^1.10.0",
    "prettier": "^3.1.0",
    "typescript": "5.2.2"
  }
}
```

Update dependencies version in `package.json` file to the desired version.
Note that all `@mantine/*` packages must have the same version.
For example, if you want to update `@mantine/*` dependencies to `7.3.0` and
`postcss-preset-mantine` to `1.11.0`, you `package.json` file should be
updated like this:

```json
{
  "name": "your-project",
  "version": "1.0.0",
  "scripts": {},
  "dependencies": {
    "@mantine/core": "^7.3.0",
    "@mantine/hooks": "^7.3.0",
    "next": "14.0.2",
    "react": "18.2.0",
    "react-dom": "18.2.0"
  },
  "devDependencies": {
    "postcss": "^8.4.31",
    "postcss-preset-mantine": "^1.11.0",
    "prettier": "^3.1.0",
    "typescript": "5.2.2"
  }
}
```

Then install new dependencies with your package manager. For example, if
you use [yarn](https://yarnpkg.com/), run

```sh
yarn
```

All done! Your dependencies are up to date.

## How do I know which version is the latest?

All `@mantine/*` packages have the same version, so you can check the latest
version of [@mantine/hooks package on npm](https://www.npmjs.com/package/@mantine/hooks). It
is also displayed near the Mantine logo on the [documentation home page](https://mantine.dev).

To check the latest version of `postcss-preset-mantine` package, visit
[postcss-preset-mantine package on npm](https://www.npmjs.com/package/postcss-preset-mantine).


----------------------------------------

# How to use Dropzone with @mantine/form?
Learn how to use Dropzone with @mantine/form to handle file selection state

[@mantine/dropzone](https://mantine.dev/others/dropzone/) package provides `Dropzone`
component which allows to drag and drop files from your computer or select them using
the file picker. Its purpose is to handle file selection, it does not store files state,
does not display selected files and does not upload them to the server.

[use-form](https://mantine.dev/form/use-form/) hook handles form state, validation,
error messages and form submission. You can integrate any input or React component
with `use-form` hook using the following form object properties:

* `form.getValues().x` – value of the input
* `form.errors.x` – error message for the input
* `form.setFieldValue('x', value)` – function to set input value
* `form.setFieldError('x', 'error-message')` – function to set input error message

Using these properties you can integrate `Dropzone` with `use-form` hook:

#### Example: DropzoneForm

```tsx
import { useForm } from '@mantine/form';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import { Center, Text, CloseButton } from '@mantine/core';

interface FormValues {
  files: File[];
}

function Demo() {
  const form = useForm<FormValues>({
    mode: 'uncontrolled',
    initialValues: { files: [] },
  });

  const selectedFiles = form.getValues().files.map((file, index) => (
    <Text key={file.name}>
      <b>{file.name}</b> ({(file.size / 1024).toFixed(2)} kb)
      <CloseButton
        size="xs"
        onClick={() =>
          form.setFieldValue(
            'files',
            form.values.files.filter((_, i) => i !== index)
          )
        }
      />
    </Text>
  ));

  return (
    <>
      <Dropzone
        h={120}
        p={0}
        multiple
        accept={[MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.svg]}
        onDrop={(files) => form.setFieldValue('files', files)}
        onReject={() => form.setFieldError('files', 'Select images only')}
      >
        <Center h={120}>
          <Dropzone.Idle>Drop files here</Dropzone.Idle>
          <Dropzone.Accept>Drop files here</Dropzone.Accept>
          <Dropzone.Reject>Files are invalid</Dropzone.Reject>
        </Center>
      </Dropzone>

      {form.errors.files && (
        <Text c="red" mt={5}>
          {form.errors.files}
        </Text>
      )}

      {selectedFiles.length > 0 && (
        <>
          <Text mb={5} mt="md">
            Selected files:
          </Text>
          {selectedFiles}
        </>
      )}
    </>
  );
}
```



----------------------------------------

# How can I change inputs focus styles?
Learn how to use Styles API with Mantine inputs

## Change focus styles of a single input

To change focus styles of a single input, use [Styles API](https://mantine.dev/styles/styles-api).
Note that in order for this to work correctly with all inputs, you need to use
`:focus-within` pseudo-class instead of `:focus`:

#### Example: InputFocusStyles

```tsx
import { TextInput } from '@mantine/core';

function Demo() {
  return (
    <TextInput
      classNames={classes}
      label="TextInput with custom focus styles"
      placeholder="TextInput with custom focus styles"
    />
  );
}
```


## Change focus styles of all inputs

To change focus styles of all inputs, use [Styles API](https://mantine.dev/styles/styles-api) with `Input` component
in the [theme object](https://mantine.dev/theming/theme-object):

#### Example: InputThemeFocusStyles

```tsx
import { TextInput, NativeSelect, MantineProvider, createTheme, Input } from '@mantine/core';
import classes from './Demo.module.css';

const theme = createTheme({
  components: {
    Input: Input.extend({ classNames: classes }),
  },
});

function Demo() {
  return (
    <MantineProvider theme={theme}>
      <TextInput label="Text input" placeholder="Text input" />
      <NativeSelect mt="md" label="Native select" data={['React', 'Angular', 'Vue', 'Svelte']} />
    </MantineProvider>
  );
}
```



----------------------------------------

# Is there a way to add mask to Mantine input?
Learn how to integrate mask libraries with Mantine inputs

Mantine does not provide built-in mask functionality, but you can easily integrate any mask library with Mantine inputs.
The recommended library is [react-imask](https://www.npmjs.com/package/react-imask):

<InstallScript packages="react-imask" />

You can use it with [InputBase](https://mantine.dev/core/input/#inputbase-component) component
to create custom input with mask:

#### Example: InputMask

```tsx
import { IMaskInput } from 'react-imask';
import { InputBase } from '@mantine/core';

function Demo() {
  return (
    <InputBase
      label="Your phone"
      component={IMaskInput}
      mask="+7 (000) 000-0000"
      placeholder="Your phone"
    />
  );
}
```



----------------------------------------

# How to change inputs placeholder color?
Learn how to change placeholder color with Styles API

All Mantine inputs can be divided in two groups:

* Inputs that are based on `<input />` HTML element (for example, [TextInput](https://mantine.dev/core/text-input)). For these inputs use `&:placeholder` selector to change placeholder color.
* Inputs that are based on `<button />` HTML element (for example, [DatePickerInput](https://mantine.dev/dates/date-picker-input)). For these inputs use [Styles API](https://mantine.dev/styles/styles-api) to change placeholder color.




----------------------------------------

# How can I display different elements in light and dark color schemes?
Learn how to hide/show elements based on color scheme

## How Mantine color scheme works

Mantine color scheme is defined by `data-mantine-color-scheme="value"` attribute on the `html` element.
It can be either `light` or `dark`. `data-mantine-color-scheme` attribute is set
by `ColorSchemeScript` component before the application is initialized in server-side
rendering frameworks like Next.js, React Router, etc. and by `MantineProvider` component during the first render in
client-side frameworks like Vite.

## Can I get color scheme value in JavaScript?

If your application does not have server-side rendering, you can get color scheme value
with `useMantineColorScheme` hook:

```tsx
import { useMantineColorScheme } from '@mantine/core';

function MyComponent() {
  const { colorScheme } = useMantineColorScheme();

  // ✅ Works in Vite and other client-side bundlers/frameworks
  // ❌ Hydration mismatch in Next.js, React Router, and other server-side rendering frameworks
  return <div>Color scheme is {colorScheme}</div>;
}
```

If you have server-side rendering in your application (Next.js, React Router, etc.), you should
not rely on JavaScript to get color scheme value – conditional rendering based on color
scheme value will produce hydration mismatch. In this case, the only option is to use
styles to hide/show elements based on the color scheme value.

## lightHidden and darkHidden props

All Mantine components support `lightHidden` and `darkHidden` props that allow you to hide
components based on the color scheme value. These props are the most reliable way to render
different elements based on the color scheme value.



## Changing component styles based on color scheme

For custom components that do not have access to `lightHidden` and `darkHidden` props, you can
use `light` and `dark` mixins from [postcss-presets-mantine](https://mantine.dev/styles/postcss-preset):

```scss
.lightHidden {
  @mixin light {
    display: none;
  }
}

.darkHidden {
  @mixin dark {
    display: none;
  }
}
```


----------------------------------------

# Can I have color schemes other than light and dark?
Learn about the difference between color scheme and theme

## What is color scheme?

In context of Mantine, the color scheme is a value that impacts colors of the UI.
Mantine color scheme supports only values that are defined by browsers.
The color scheme value can either be `light`, `dark` or `auto` (same as in the user OS settings).

## I want to add a custom color scheme. Can I do that?

No, Mantine does not support custom color schemes. If you attempt to do that,
most of the components will have broken styles. Instead of applying a custom
color scheme, customize colors with [theme](https://mantine.dev/theming/theme-object/).

## How can I customize colors with theme?

You can define custom colors in the [theme object](https://mantine.dev/theming/theme-object).

```tsx
import { createTheme, MantineProvider } from '@mantine/core';

const theme = createTheme({
  colors: {
    sepia: [
      '#F4ECD8',
      '#EAD8B7',
      '#DFC29A',
      '#D4AC7E',
      '#C99862',
      '#BD8447',
      '#B2702D',
      '#A55C15',
      '#924908',
      '#7A3704',
    ],
  },
});

function Demo() {
  return (
    <MantineProvider theme={theme}>
      <App />
    </MantineProvider>
  );
}
```

Then you can reference these values in components and `.css` files:

```scss
body {
  background-color: var(--mantine-color-sepia-0);
  color: var(--mantine-color-sepia-9);
}
```


----------------------------------------

# Can I use an array of strings as a list in use-form?
Learn about use-form lists limitations

## What is use-form list?

[use-form](https://mantine.dev/form/use-form) supports nested values in array format.
There are handlers available to add, remove, and reorder items in the list:

* `form.removeListItem` – removes list item at given index
* `form.insertListItem` – inserts list item at given index (appends item to the end of the list if index is not specified)
* `form.reorderListItem` – reorders list item with given position at specified field

Example of using form lists:

```tsx
import { IconTrash } from '@tabler/icons-react';
import {
  ActionIcon,
  Box,
  Button,
  Group,
  Switch,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { randomId } from '@mantine/hooks';

function Demo() {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      employees: [{ name: '', active: false, key: randomId() }],
    },
  });

  const fields = form.getValues().employees.map((item, index) => (
    <Group key={item.key} mt="xs">
      <TextInput
        placeholder="John Doe"
        withAsterisk
        style={{ flex: 1 }}
        key={form.key(`employees.${index}.name`)}
        {...form.getInputProps(`employees.${index}.name`)}
      />
      <Switch
        label="Active"
        key={form.key(`employees.${index}.active`)}
        {...form.getInputProps(`employees.${index}.active`, {
          type: 'checkbox',
        })}
      />
      <ActionIcon
        color="red"
        onClick={() => form.removeListItem('employees', index)}
      >
        <IconTrash size="1rem" />
      </ActionIcon>
    </Group>
  ));

  return (
    <Box maw={500} mx="auto">
      {fields.length > 0 ? (
        <Group mb="xs">
          <Text fw={500} size="sm" style={{ flex: 1 }}>
            Name
          </Text>
          <Text fw={500} size="sm" pr={90}>
            Status
          </Text>
        </Group>
      ) : (
        <Text c="dimmed" ta="center">
          No one here...
        </Text>
      )}

      {fields}

      <Group justify="center" mt="md">
        <Button
          onClick={() =>
            form.insertListItem('employees', {
              name: '',
              active: false,
              key: randomId(),
            })
          }
        >
          Add employee
        </Button>
      </Group>
    </Box>
  );
}
```

## Form lists limitation

`use-form` lists are designed to work with objects, any other values are not supported.
This limitation is implemented on purpose to avoid confusing form lists with arrays of
other types of values.


----------------------------------------

# use-local-storage hook returns real value only after mounting, is it a bug?
Learn how Mantine retrieves local storage value

## How use-local-storage hook works

By default, [use-local-storage](https://mantine.dev/hooks/use-local-storage) hook
retrieves value from local storage in `useEffect` only after component is mounted.
It is implemented this way to avoid hydration mismatches if the value is used in
output markup of the component.

Example:

* `value` during server-side rendering: `dark` (default value)
* `value` at initial render: `dark` (default value)
* `value` after mounting: `light` or `dark` depending on value in local storage (value from local storage)

```tsx
import { useLocalStorage } from '@mantine/hooks';

function Demo() {
  const [value, setValue] = useLocalStorage<'light' | 'dark'>({
    key: 'color-scheme',
    defaultValue: 'dark',
  });

  return <div>{value}</div>;
}
```

## Reading value in first render

If your application does not have server-side rendering or you do not use
`value` in output markup of the component, you can read value from local storage
in the first render. Do do that, set `getInitialValueInEffect: false` option:

Example:

* `value` during server-side rendering: `dark` (default value)
* `value` at initial render: `light` or `dark` depending on value in local storage (value from local storage)
* `value` at subsequent renders: `light` or `dark` depending on value in local storage (value from local storage)

```tsx
import { useLocalStorage } from '@mantine/hooks';

function Demo() {
  const [value, setValue] = useLocalStorage<'light' | 'dark'>({
    key: 'color-scheme',
    defaultValue: 'dark',
    getInitialValueInEffect: false,
  });

  return <div>{value}</div>;
}
```


----------------------------------------

# MantineProvider was not found in component tree. What should I do?
Learn how to resolve MantineProvider issues

<ErrorMessage error="@mantine/core: MantineProvider was not found in component tree, make sure you have it in your app." />

The error above occurs in the following cases:

* You do not have `MantineProvider` in your app at all
* You are rendering Mantine components outside of `MantineProvider` context
* You have different versions of `@mantine/*` packages in your application.
  For example, you have `@mantine/core@7.0.0` and `@mantine/dates@7.1.0` installed.
* There was an issue during packages installation. Usually this happens with pnpm.
* Your app has multiple instances of `@mantine/core` package in the bundle. This may
  happen if your project is a monorepo and you have multiple node\_modules folders.

Steps to resolve the issue:

* Make sure that you have `MantineProvider` in your app and it wraps all Mantine components.
* Make sure that you have only one version of `@mantine/core` in your app. If you are using
  monorepo, make sure all packages depend on the same version of `@mantine/core`.
* Reinstall dependencies by removing `node_modules` folder and running `npm install` or
  `yarn install` again.
* If you still have issues, you can use [one of the official templates](https://mantine.dev/getting-started/#get-started-with-a-template) as reference.


----------------------------------------

# Can I remove MultiSelect placeholder when the component has selected values?
Learn why MultiSelect placeholder is not removed when values are selected and how to remove it with CSS

## Why MultiSelect placeholder is not removed when values are selected?

[MultiSelect](https://mantine.dev/core/multi-select) component uses placeholder to indicate that
there are values available for selection. It is different from [Select](https://mantine.dev/core/select)
component where placeholder is removed when value is selected – user can select only one value.

## How to remove MultiSelect placeholder when values are selected?

Apply the following styles to the MultiSelect component to remove placeholder when values are selected:




----------------------------------------

# Native browser validation does not work in some components, what should I do?
Learn why native browser validation does not work in some components

## Native browser validation

Native browser validation works with most of Mantine inputs,
for example, it can be used with [TextInput](https://mantine.dev/core/text-input),
[Textarea](https://mantine.dev/core/textarea), [NativeSelect](https://mantine.dev/core/native-select) and
other components.

However, some components like [Select](https://mantine.dev/core/select),
[MultiSelect](https://mantine.dev/core/multi-select), [Slider](https://mantine.dev/core/slider)
or [DatePicker](https://mantine.dev/dates/date-picker) do not support native
browser validation. These components provide custom UI
elements for data input and browsers do not treat them as
native inputs.

## Is there a workaround to use native browser validation?

No, there is no workaround to use native browser validation
for components with custom UI elements.

## What should I do instead?

If you are building a form that requires usage of Mantine inputs
with custom UI, you should validate form data after it has been
submitted. You can use [@mantine/form](https://mantine.dev/form/use-form) package
to perform form validation on submit.


----------------------------------------

# Can I use nested inline styles with Mantine components?
Nested styles are supported only in CSS files

## What are nested inline styles?

Nested inline styles are commonly used in CSS-in-JS libraries like [emotion](https://emotion.sh/).
Nested inline styles syntax looks something like this (example from [emotion documentation](https://emotion.sh/docs/css-prop#object-styles)):

```tsx
render(
  <div
    css={{
      backgroundColor: 'hotpink',
      '&:hover': {
        color: 'lightgreen',
      },
    }}
  >
    This has a hotpink background.
  </div>
);
```

## Styles in Mantine components

Mantine components do not support nested inline styles out of the box. The following
example will not work:

```tsx
import { Button } from '@mantine/core';

function Demo() {
  return (
    <Button
      style={{
        // ✅ This works
        backgroundColor: 'hotpink',

        // ❌ This does not work
        '&:hover': { color: 'lightgreen' },
      }}
      styles={{
        root: {
          // ✅ This works
          backgroundColor: 'hotpink',

          // ❌ This does not work
          '&[data-disabled]': { color: 'lightgreen' },
          '&:hover': { color: 'lightgreen' },
          '&:focus': { color: 'lightgreen' },
          '& span': { color: 'lightgreen' },
        },
      }}
    >
      This has a hotpink background.
    </Button>
  );
}
```

## Why nested inline styles are not supported?

Mantine does not use CSS-in-JS library for styling – all styles are either in CSS files
or inline in the `style` attribute which does not support nested styles. Mantine does not
use CSS-in-JS to keep bundle size small, provide support for server-side rendering and
improve performance. You can learn more about performance [in the styles performance guide](https://mantine.dev/styles/styles-performance/).

## What is the alternative?

You can use nested selectors in [CSS files](https://mantine.dev/styles/css-modules/):

```scss
.button {
  background-color: hotpink;

  &:hover {
    color: lightgreen;
  }
}
```

To learn more about styles in Mantine, follow [CSS modules](https://mantine.dev/styles/css-modules/),
[PostCSS preset](https://mantine.dev/styles/postcss-preset/) and [Styles API](https://mantine.dev/styles/styles-api/) guides.

## I still want to use nested inline styles

Mantine has support for emotion. To set it up, follow [emotion installation guide](https://mantine.dev/styles/emotion/).
Note that this will increase bundle size and will affect performance.


----------------------------------------

# My Popover dropdown closes when I click on the dropdown of nested Popover
Popover dropdown is closed when it detects click outside events

## Nested popovers

By default, all popovers and dropdowns are rendered within [Portal](https://mantine.dev/core/portal/)
component which is attached to the `document.body`.
This allows popovers to be rendered on top of all other elements and to be positioned correctly even if parent element has `overflow: hidden`.

[Popover](https://mantine.dev/core/popover/) component uses [use-click-outside](https://mantine.dev/hooks/use-click-outside/) hook to detect clicks outside of the popover.
When you click on the nested popover, it detects that click as outside click and closes the parent popover.
This happens with every component that uses [Popover](https://mantine.dev/core/popover/) under the hood, including [DatePicker](https://mantine.dev/dates/date-picker/), [Select](https://mantine.dev/core/select/),
[Menu](https://mantine.dev/menu/menu/), and others.

Example of the issue:

#### Example: NestedPopovers

```tsx
import { Button, Popover, Select } from '@mantine/core';
import { InputBase } from '@mantine/core';

function Demo() {
  return (
    <Popover width={200} position="bottom" withArrow shadow="md">
      <Popover.Target>
        <Button>Toggle popover</Button>
      </Popover.Target>
      <Popover.Dropdown>
        <Select
          placeholder="Choose your framework"
          data={[
            { value: 'react', label: 'React' },
            { value: 'vue', label: 'Vue' },
            { value: 'angular', label: 'Angular' },
          ]}
        />
      </Popover.Dropdown>
    </Popover>
  );
}
```


## How to fix

To fix the issue, set `withinPortal={false}` prop on the nested popover. Note that
this option might be a part of the other prop (for example `comboboxProps` in [Select](https://mantine.dev/core/select/)).
To learn which prop to use, check the documentation of the component you are using.

Example of the fixed issue:

#### Example: NestedPopoversWorking

```tsx
import { Button, Popover, Select } from '@mantine/core';
import { InputBase } from '@mantine/core';

function Demo() {
  return (
    <Popover width={200} position="bottom" withArrow shadow="md">
      <Popover.Target>
        <Button>Toggle popover</Button>
      </Popover.Target>
      <Popover.Dropdown>
        <Select
          comboboxProps={{ withinPortal: false }}
          placeholder="Choose your framework"
          data={[
            { value: 'react', label: 'React' },
            { value: 'vue', label: 'Vue' },
            { value: 'angular', label: 'Angular' },
          ]}
        />
      </Popover.Dropdown>
    </Popover>
  );
}
```



----------------------------------------

# How can I load fonts in Next.js?
A guide to load custom fonts in Next.js with CSS and next/font package

## Loading fonts with next/font package

To load fonts with the [next/font](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts)
package, create the following folder structure (the example with Roboto custom font):

```plaintext
Roboto/
├─ Roboto-Bold.woff2
├─ Roboto-Heavy.woff2
├─ Roboto.ts
```

In `Roboto.ts` file, add the following code:

```tsx
import localFont from 'next/font/local';

export const roboto = localFont({
  src: [
    {
      path: './Roboto-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './Roboto-Heavy.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
});
```

Then add the font to your [theme](https://mantine.dev/theming/theme-object/):

```tsx
import '@mantine/core/styles.css';

import {
  createTheme,
  DEFAULT_THEME,
  MantineProvider,
} from '@mantine/core';
import { roboto } from './Roboto';

const theme = createTheme({
  fontFamily: roboto.style.fontFamily,
  fontFamilyMonospace: 'Monaco, Courier, monospace',
  headings: {
    // Use default theme if you want to provide default Mantine fonts as a fallback
    fontFamily: `${roboto.style.fontFamily}, ${DEFAULT_THEME.fontFamily}`,
  },
});

function Demo() {
  return (
    <MantineProvider theme={theme}>Your app here</MantineProvider>
  );
}
```

## Loading fonts without next/font package

Create the following folder structure (the example with Roboto custom font):

```plaintext
Roboto/
├─ Roboto-Bold.woff2
├─ Roboto-Heavy.woff2
├─ Roboto.css
```

In `Roboto.css` file, add the following code:

```css
@font-face {
  font-family: 'Roboto';
  src: url('./Roboto-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
}

@font-face {
  font-family: 'Roboto';
  src: url('./Roboto-Heavy.woff2') format('woff2');
  font-weight: 900;
  font-style: normal;
}
```

Then import `Roboto.css` file at the root of your application and
add the font to your [theme](https://mantine.dev/theming/theme-object/):

```tsx
import {
  createTheme,
  DEFAULT_THEME,
  MantineProvider,
} from '@mantine/core';

import '@mantine/core/styles.css';
import './Roboto/Roboto.css';

const theme = createTheme({
  fontFamily: 'Roboto, sans-serif',
  fontFamilyMonospace: 'Monaco, Courier, monospace',
  headings: {
    // Use default theme if you want to provide default Mantine fonts as a fallback
    fontFamily: `Roboto, ${DEFAULT_THEME.fontFamily}`,
  },
});

function Demo() {
  return (
    <MantineProvider theme={theme}>Your app here</MantineProvider>
  );
}
```

## Load fonts from Google Fonts

Selects fonts you want to use at [Google Fonts](https://fonts.google.com/) and copy
HTML code snippet. For example, to load [Roboto](https://fonts.google.com/specimen/Roboto)
font, the code you receive from Google Fonts will look something like this:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
  rel="stylesheet"
/>
```

Add the code to the [head](https://nextjs.org/docs/pages/api-reference/components/head)
of your application and add the font to your [theme](https://mantine.dev/theming/theme-object/):

```tsx
import '@mantine/core/styles.css';

import {
  createTheme,
  DEFAULT_THEME,
  MantineProvider,
} from '@mantine/core';

const theme = createTheme({
  fontFamily: 'Roboto, sans-serif',
  fontFamilyMonospace: 'Monaco, Courier, monospace',
  headings: {
    // Use default theme if you want to provide default Mantine fonts as a fallback
    fontFamily: `Roboto, ${DEFAULT_THEME.fontFamily}`,
  },
});

function Demo() {
  return (
    <MantineProvider theme={theme}>Your app here</MantineProvider>
  );
}
```

Alternatively, you can download fonts from Google Fonts and load them with
[next/font](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts)
package to have Next.js fonts optimization feature.


----------------------------------------

# Why my screen is completely empty after I
You have used Notifications component incorrectly

## Notifications component

A common error of using [@mantine/notifications](https://mantine.dev/x/notifications/) package
is to wrap your application with `Notifications` component:

```tsx
// ❌ This is incorrect
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

function Demo() {
  return (
    <MantineProvider>
      <Notifications>
        <App />
      </Notifications>
    </MantineProvider>
  );
}
```

## How to fix

`Notifications` component does not support `children` prop, if you put your application
inside it, it will not be rendered. Instead, you should render `Notifications` component
as a sibling to your application:

```tsx
// ✅ This is correct
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

function Demo() {
  return (
    <MantineProvider>
      <Notifications />
      <App />
    </MantineProvider>
  );
}
```


----------------------------------------

# Why my notifications are displayed at a wrong position?
Because you did not import styles

If your notifications have incorrect position on the screen and look like this:

<Image src={image.src} maw={800} />

It means that you did not import styles for `@mantine/notifications` package like
it is described in [installation](https://mantine.dev/x/notifications/#installation)
instructions.

Add styles import to your application:

```bash
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
```


----------------------------------------

# Is there a comparison with other libraries?
Comparison with other libraries is not provided, you are trusted to make your own decision based on documentation examples

## Do you have a comparison with other libraries?

No, we don't provide a comparison with other libraries, because:

* Mantine changes rapidly – new features and improvements are added constantly
* Other libraries change over time as well, so any comparison will be outdated soon
* Maintaining a fair comparison is hard, it requires deep knowledge of all libraries and their features

## How should I decide which library to use?

Go through the documentation and examples of each library, try to build something with them,
and decide which one fits your needs better.
Mantine, as well as other libraries, provides a lot of examples and documentation,
so you can make an informed decision based on that.


----------------------------------------

# It is not possible to pinch to zoom when Modal is opened. What should I do?
Use removeScrollProps to configure react-remove-scroll options

[Modal](https://mantine.dev/core/modal) and [Drawer](https://mantine.dev/core/drawer) components use [react-remove-scroll](https://github.com/theKashey/react-remove-scroll)
to lock scroll when they are opened. By default, `react-remove-scroll` will lock scroll and prevent pinch to zoom on mobile devices.
To change various scroll lock options, you can use `removeScrollProps` prop:

```tsx
import { Modal } from '@mantine/core';

function Demo() {
  return (
    <Modal
      removeScrollProps={{
        allowPinchZoom: true, // Allow pinch to zoom on mobile devices
      }}
    >
      {/* Modal content */}
    </Modal>
  );
}
```


----------------------------------------

# Why I cannot use one polymorphic component in component prop of another polymorphic component?
Learn how polymorphic components types work

## What is polymorphic component?

A polymorphic component is a component which root element can be changed with component prop.
All polymorphic components have a default element which is used when component prop is not provided.
For example, the `Button` component default element is `button` and it can be changed to
`a` or any other element or component:

```tsx
import { Button } from '@mantine/core';

function Demo() {
  return (
    <Button component="a" href="https://mantine.dev/" target="_blank">
      Mantine website
    </Button>
  );
}
```

## Polymorphic components types

Polymorphic components types are defined by the type of the root element
which is not known until the component is used.

Example:

```tsx
import { Box } from '@mantine/core';

// MyBox component props types are now known
// Types will be assigned only when MyBox is used
const MyBox = Box;

function Demo() {
  // MyBox props type can be determined based on
  // `component` prop or its absence
  // In this case MyBox props type contain
  // React.ComponentProps<'div'>
  return <MyBox>Hello</MyBox>;
}

function Demo2() {
  // In this case MyBox props type contain
  // React.ComponentProps<'a'>
  return <MyBox component="a" href="https://mantine.dev/" />;
}
```

## Why I cannot use one polymorphic component in component prop of another polymorphic component?

When you use one polymorphic component in `component` prop of another polymorphic component,
types cannot be inferred correctly because the type of the root element is not known until the component is used.

```tsx
import { Box, Button } from '@mantine/core';

function Demo() {
  // Types cannot be inferred correctly
  return <Box component={Button} />;
}
```


----------------------------------------

# How can I test Modal/Drawer/Popover components?
Learn how to use react-testing-library to test components that use portals and transitions.

## Getting started

Before jumping into the testing part, make sure that you've configured
[Jest](https://mantine.dev/guides/jest) or [Vitest](https://mantine.dev/guides/vitest) in your project
as specified in the documentation. Assume that `render`, `screen` and `userEvent` variables
are imported from your project `test-utils` file.

This guide is applicable to:

* [Modal](https://mantine.dev/core/modal)
* [Drawer](https://mantine.dev/core/drawer)
* [Popover](https://mantine.dev/core/popover)
* [Menu](https://mantine.dev/core/menu)
* [Combobox](https://mantine.dev/core/combobox)
* Most other component that uses [portals](https://mantine.dev/core/portal) and [transitions](https://mantine.dev/core/transition)

## Testing example

In all following examples we will use `AuthModal` component, it contains
a button and a modal with a simple authentication form:

```tsx
import { Button, Modal, PasswordInput, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

export function AuthModal() {
  const [opened, { open, close }] = useDisclosure();

  return (
    <>
      <Modal title="Authenticate" opened={opened} onClose={close}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            close();
          }}
        >
          <TextInput data-autofocus label="Username" placeholder="Enter your username" />
          <PasswordInput label="Password" placeholder="Enter your password" />
          <Button type="submit">Log in</Button>
        </form>
      </Modal>

      <Button onClick={open}>Open authentication modal</Button>
    </>
  );
}
```

## Failing tests

If try to write tests for `AuthModal` without any additional configuration,
you will notice that they fail because, by default, modals use [Transition](https://mantine.dev/core/transition)
component to animate opening and closing. Transition component uses `setTimeout` to delay
animation start and `@testing-library/react` does not wait for `setTimeout` to finish.

Example of failing tests:

```tsx
import { render, screen, userEvent } from '@/test-utils';
import { AuthModal } from './AuthModal';

describe('AuthModal', () => {
  it('opens modal when button is clicked', async () => {
    render(<AuthModal />);
    await userEvent.click(screen.getByRole('button', { name: 'Open authentication modal' }));
    // ⛔ Test fails, modal heading is not in the document yet
    // Error message: TestingLibraryElementError: Unable to find an accessible element
    // with the role "heading" and name "Authenticate"
    expect(screen.getByRole('heading', { name: 'Authenticate' })).toBeInTheDocument();
  });
});
```

## Fixing failing tests

The easiest way to fix this issue is to disable transitions in your tests.
This can be done by creating a separate [theme](https://mantine.dev/theming/theme-object)
for tests. In this theme, you need to disable transitions for all
components that you plan to test.

To create a custom theme for tests, replace your `render` function
in `test-utils` folder with the following code:

```tsx
import { render as testingLibraryRender } from '@testing-library/react';
import { createTheme, MantineProvider, mergeThemeOverrides, Modal } from '@mantine/core';
// Your project theme
import { theme } from '../theme';

// Merge your project theme with tests specific overrides
const testTheme = mergeThemeOverrides(
  theme,
  createTheme({
    components: {
      Modal: Modal.extend({
        defaultProps: {
          transitionProps: { duration: 0 },
        },
      }),
    },
  })
);

export function render(ui: React.ReactNode) {
  return testingLibraryRender(<>{ui}</>, {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <MantineProvider theme={testTheme}>{children}</MantineProvider>
    ),
  });
}
```

✅ Now the test from the previous example should pass is passing!

## How to test that the modal is opened/closed?

To verify that the modal is opened, you can check that the modal heading is in the document
and an interactive element with `data-autofocus` attribute has focus:

```tsx
describe('AuthModal', () => {
  it('opens modal when button is clicked', async () => {
    render(<AuthModal />);
    await userEvent.click(screen.getByRole('button', { name: 'Open authentication modal' }));
    expect(screen.getByRole('heading', { name: 'Authenticate' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Username' })).toHaveFocus();
  });
});
```

To verify that the modal has been closed, check that the modal heading is not in the document:

```tsx
describe('AuthModal', () => {
  it('closes modal after the form has been submitted', async () => {
    render(<AuthModal />);
    await userEvent.click(screen.getByRole('button', { name: 'Open authentication modal' }));
    await userEvent.type(screen.getByRole('textbox', { name: 'Username' }), 'john.doe');
    await userEvent.type(screen.getByLabelText('Password'), 'password');
    await userEvent.click(screen.getByRole('button', { name: 'Log in' }));
    expect(screen.queryByRole('heading', { name: 'Authenticate' })).not.toBeInTheDocument();
  });
});
```


----------------------------------------

# Can I use PostCSS function in inline styles?
Learn where PostCSS functions can be used in Mantine

## What are PostCSS functions?

[postcss-preset-mantine](https://mantine.dev/styles/postcss-preset/) provides functions,
mixins and other helpers to simplify working with Mantine styles. Example of using
`light-dark` function in styles:

```scss
// What you write
.demo {
  background: light-dark(white, black);
}

// What you get after PostCSS processing
[data-mantine-color-scheme='light'] .demo {
  background: white;
}

[data-mantine-color-scheme='dark'] .demo {
  background: black;
}
```

## Can I use PostCSS functions in inline styles?

No, PostCSS functions are not supported in inline styles. **You can use PostCSS functions only in `.css` files**.
The following example will not work:

```tsx
import { Button } from '@mantine/core';

function Demo() {
  return (
    <Button
      style={{
        // ❌ This does not get processed by PostCSS
        backgroundColor: 'light-dark(white, black)',
      }}
    >
      Button
    </Button>
  );
}
```


----------------------------------------

# Can I have different primary color for light and dark color schemes?
Learn how to use virtual color with primary color in theme object

## Virtual colors

To have different primary color for light and dark color schemes you can use [virtual color](https://mantine.dev/theming/colors/#virtual-colors).
Virtual color is a color that changes its value based on current color scheme.

```tsx
import {
  createTheme,
  MantineProvider,
  virtualColor,
} from '@mantine/core';

const theme = createTheme({
  primaryColor: 'primary',

  colors: {
    primary: virtualColor({
      name: 'primary',
      dark: 'pink',
      light: 'cyan',
    }),
  },
});

function App() {
  return (
    <MantineProvider theme={theme}>
      <Box bg="primary" c="white" p="md" fw={700}>
        This box has virtual background color, it is pink in dark mode
        and cyan in light mode
      </Box>
    </MantineProvider>
  );
}
```


----------------------------------------

# Can I use private CSS variables to style components?
No, it is not safe and will not work with future versions of Mantine.

## What are private CSS variables?

Private CSS variables start with `--_`, for example `--_input-bd-focus`.
These variables are a part of internal Mantine API and are not intended to
be used by end users. In most cases private CSS variables are used to
reduce specificity of styles and make them easier to override.

## Should I use private CSS variables to apply styles?

Absolutely not. Private CSS variables can be changed or removed in minor
and patch releases without any notice. In this case, if you use private
variables to style components, styles of your application will **silently**
(no errors will be reported by any tools) break after update. Private
CSS variables were implemented to reduce specificity of styles when
[:where](https://developer.mozilla.org/en-US/docs/Web/CSS/:where) selector
was not widely available. Now when `:where` is supported by all major browsers
private CSS variables will be removed over time in most components.

## But what should I do instead?

Use regular styles instead. For example, to change input border color on focus:

```scss
.input {
  // ❌ do not use private CSS variables
  --_input-bd-focus: red;
  --_input-placeholder-color: red;
}

.input {
  // ✅ use regular styles
  &:focus,
  &:focus-within {
    border-color: red;
  }

  &::placeholder {
    color: red;
  }
}
```


----------------------------------------

# How can I load fonts in React Router?
A guide to load custom fonts in React Router

## Loading local fonts

Create the following folder structure (the example with Roboto custom font):

```plaintext
Roboto/
├─ Roboto-Bold.woff2
├─ Roboto-Heavy.woff2
├─ Roboto.css
```

In `Roboto.css` file, add the following code:

```css
@font-face {
  font-family: 'Roboto';
  src: url('./Roboto-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
}

@font-face {
  font-family: 'Roboto';
  src: url('./Roboto-Heavy.woff2') format('woff2');
  font-weight: 900;
  font-style: normal;
}
```

Then import `Roboto.css` file at the root of your application and
add the font to your [theme](https://mantine.dev/theming/theme-object/):

```tsx
import '@mantine/core/styles.css';
import './Roboto/styles.css';

import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router';
import {
  ColorSchemeScript,
  createTheme,
  DEFAULT_THEME,
  MantineProvider,
  mantineHtmlProps,
} from '@mantine/core';

const theme = createTheme({
  fontFamily: 'Roboto, sans-serif',
  fontFamilyMonospace: 'Monaco, Courier, monospace',
  headings: {
    // Use default theme if you want to provide default Mantine fonts as a fallback
    fontFamily: `Roboto, ${DEFAULT_THEME.fontFamily}`,
  },
});

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <Meta />
        <Links />
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={theme}>{children}</MantineProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
```

## Load fonts from Google Fonts

Selects fonts you want to use at [Google Fonts](https://fonts.google.com/) and copy
HTML code snippet. For example, to load [Roboto](https://fonts.google.com/specimen/Roboto)
font, the code you receive from Google Fonts will look something like this:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link
  rel="preconnect"
  href="https://fonts.gstatic.com"
  crossorigin=""
/>
<link
  href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
  rel="stylesheet"
/>
```

Add the code to the `<head />` of your application `root.tsx` file.
The code will look something like this:

```tsx
import '@mantine/core/styles.css';
import './Roboto/styles.css';

import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router';
import {
  ColorSchemeScript,
  createTheme,
  DEFAULT_THEME,
  MantineProvider,
} from '@mantine/core';

const theme = createTheme({
  fontFamily: 'Roboto, sans-serif',
  fontFamilyMonospace: 'Monaco, Courier, monospace',
  headings: {
    // Use default theme if you want to provide default Mantine fonts as a fallback
    fontFamily: `Roboto, ${DEFAULT_THEME.fontFamily}`,
  },
});

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <Meta />
        <Links />
        <ColorSchemeScript />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <MantineProvider theme={theme}>{children}</MantineProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
```


----------------------------------------

# Where can I find the roadmap?
The roadmap is private and only available to the team.

## Roadmap. Where is it?

Mantine roadmap is private and only available to the team.
The roadmap is kept private to help you manage your expectations and to avoid any potential disappointment
when it is not possible to deliver features precisely as planned.
We are constantly working on improving Mantine and adding new features, but we do not want to make any promises that we cannot keep.

## How can I know what is coming next?

New features are usually announced in the [Discord server](https://discord.gg/wbH82zuWMN) and on [X](https://x.com/mantinedev)
when they are released. Upcoming features are usually discussed with the community on [Discord](https://discord.gg/wbH82zuWMN).

## When will the next version be released?

* Patches are usually released every 1-3 weeks
* Minor releases are usually released every 1-2 months
* Major releases are planned when it is required to introduce breaking changes or significant new features, there is no strict schedule for major releases

## Will Mantine be maintained in the future?

Yes, Mantine is actively maintained and developed. It is not planned to be abandoned in the future.


----------------------------------------

# How to scroll to the top of the form if the form is submitted with errors?
Learn how to call a function when the form is submitted with errors

## use-form submit handlers

`form.onSubmit` function accepts two functions: the first function is called with valid form values when validation passes,
the second function is called with form errors when validation fails.

## Scroll to the top of the form on submit

Using the second callback of `form.onSubmit` you can scroll to the top of the form.
If your application includes a fixed header (like Mantine Help Center website), use
[scroll-margin](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-margin) CSS property
to ensure that the form is not hidden behind the header. Note that `scroll-margin` does not
work if the form has `overflow: hidden;` styles or is inside other element that has
`overflow: hidden;` styles.

#### Example: ScrollToTopOfForm

```tsx
function Demo() {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      email: '',
    },

    validate: {
      name: isNotEmpty('Name is required'),
      email: isEmail('Invalid email'),
    },
  });

  return (
    <form
      id="my-form"
      style={{ scrollMargin: '100px' }}
      onSubmit={form.onSubmit(
        () => {},
        () => {
          document
            .getElementById('my-form')
            ?.scrollIntoView({ block: 'start', behavior: 'smooth' });
        }
      )}
    >
      <TextInput
        withAsterisk
        label="Your name"
        placeholder="Your name"
        key={form.key('name')}
        {...form.getInputProps('name')}
      />

      <TextInput
        withAsterisk
        label="Your email"
        placeholder="your@email.com"
        mt="md"
        key={form.key('email')}
        {...form.getInputProps('email')}
      />

      <Group justify="flex-end" mt="md">
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  );
}
```



----------------------------------------

# Can I use SegmentedControl with empty value?
SegmentedControl cannot be used without a value

## Can I use SegmentedControl with initial empty value?

[SegmentedControl](https://mantine.dev/core/segmented-control/) cannot be used without a value.
It is based on [FloatingIndicator](https://mantine.dev/core/floating-indicator/) and requires a value to work properly.
If neither `value` nor `defaultValue` is provided, `SegmentedControl` will automatically set first item as active.

## Can I deselect value in SegmentedControl?

No, `SegmentedControl` is designed to always have a value.
This constraint is required for the component animations and floating indicator to work properly.

## What should I use instead if I need deselect functionality?

If you need to have a control that can be deselected, consider using [Radio](https://mantine.dev/core/radio/) or [Checkbox](https://mantine.dev/core/checkbox/) components.
Both `Radio` and `Checkbox` can be deselected by setting `checked={false}` prop.

## I want a component that looks like SegmentedControl but can be deselected

You can build a custom component that works similar to `SegmentedControl`
with [FloatingIndicator](https://mantine.dev/core/floating-indicator/).


----------------------------------------

# What is the difference between searchable Select and Autocomplete?
Searchable Select and Autocomplete are similar components, but they serve different purposes.

## Searchable select

Use [Select](https://mantine.dev/core/select/) component in the following cases:

* You want to restrict user to a list of predefined options
* You want to display all available options to the user and allow searching through them
* You want to discard user input on blur if option was not selected from the dropdown
* `value` and `label` of the option are not the same, for example, `{ value: 'US', label: 'United States' }`

For example, you can use [Select](https://mantine.dev/core/select/) to select country from the list of all countries:

#### Example: SelectCountry

```tsx
import { Select } from '@mantine/core';

function Demo() {
  return (
    <Select
      label="Your country"
      placeholder="Select country"
      searchable
      data={[
        { value: 'ca', label: 'Canada' },
        { value: 'br', label: 'Brazil' },
        { value: 'in', label: 'India' },
        { value: 'mx', label: 'Mexico' },
        { value: 'au', label: 'Australia' },
        { value: 'kr', label: 'South Korea' },
        { value: 'id', label: 'Indonesia' },
        { value: 'tr', label: 'Turkey' },
        { value: 'nl', label: 'Netherlands' },
        { value: 'ch', label: 'Switzerland' },
        { value: 'sa', label: 'Saudi Arabia' },
        { value: 'se', label: 'Sweden' },
        { value: 'pl', label: 'Poland' },
        { value: 'ar', label: 'Argentina' },
        { value: 'be', label: 'Belgium' },
        { value: 'th', label: 'Thailand' },
        { value: 'at', label: 'Austria' },
        { value: 'ae', label: 'United Arab Emirates' },
        { value: 'hk', label: 'Hong Kong' },
        { value: 'dk', label: 'Denmark' },
        { value: 'sg', label: 'Singapore' },
        { value: 'my', label: 'Malaysia' },
        { value: 'no', label: 'Norway' },
        { value: 'ng', label: 'Nigeria' },
        { value: 'cz', label: 'Czech Republic' },
        { value: 'za', label: 'South Africa' },
        { value: 'ro', label: 'Romania' },
      ]}
    />
  );
}
```


In the example above, the user can select country from the list of all countries, but cannot enter any other value.

## Autocomplete

Use [Autocomplete](https://mantine.dev/core/autocomplete/) component in the following cases:

* You want to allow user to enter any value
* You want to display suggestions to the user based on the input value
* You want to preserve user input on blur if option was not selected from the dropdown
* `value` and `label` of the option are the same, for example, `'United States'`

For example, you can use [Autocomplete](https://mantine.dev/core/autocomplete/) to ask user to enter city:

#### Example: AutocompleteCity

```tsx
import { Autocomplete } from '@mantine/core';

function Demo() {
  return (
    <Autocomplete
      label="Your city"
      placeholder="Your city"
      data={[
        'New York',
        'Los Angeles',
        'Chicago',
        'Houston',
        'Phoenix',
        'Philadelphia',
        'San Antonio',
        'San Diego',
        'Dallas',
        'San Jose',
      ]}
    />
  );
}
```


In the example above, suggestions are based on the input value,
but the user can enter any value and it will be preserved on blur.


----------------------------------------

# How can I add fuzzy search to Select component?
Learn how to integrate third-party fuzzy search libraries with Mantine Select component

## Options filtering

[Select](https://mantine.dev/core/select) and other components based on
[Combobox](https://mantine.dev/core/combobox) component support custom
options filtering with `filter` prop. You can use it to integrate
third-party fuzzy search libraries like [fuse.js](https://fusejs.io/)
or customize filtering logic to better suit your needs.

Example of a custom filter function that matches options by words instead of letters sequence:

```tsx
import { Select, ComboboxItem, OptionsFilter } from '@mantine/core';

const optionsFilter: OptionsFilter = ({ options, search }) => {
  const splittedSearch = search.toLowerCase().trim().split(' ');
  return (options as ComboboxItem[]).filter((option) => {
    const words = option.label.toLowerCase().trim().split(' ');
    return splittedSearch.every((searchWord) => words.some((word) => word.includes(searchWord)));
  });
};

function Demo() {
  return (
    <Select
      label="Your country"
      placeholder="Pick value"
      data={['Great Britain', 'Russian Federation', 'United States']}
      filter={optionsFilter}
      searchable
    />
  );
}
```

## Example with fuse.js

Example of adding fuzzy search with [fuse.js](https://fusejs.io/) to Select component:

#### Example: SelectFuzzy

```tsx
import Fuse from 'fuse.js';
import { Select } from '@mantine/core';
import { data } from './data.json';

function Demo() {
  return (
    <Select
      label="Your country"
      placeholder="Select country"
      searchable
      data={data}
      filter={({ options, search }) => {
        const fuse = new Fuse(options, { keys: ['label', 'value'] });
        return search ? fuse.search(search).map((item) => item.item) : options;
      }}
    />
  );
}
```



----------------------------------------

# Can I use Mantine components as server components?
Learn about use client directive and server components usage

## Difference between server and client components

Server components are rendered **only on the server**, their code is not included in the client bundle.
In server components you cannot use hooks (`useState`, `useEffect`, `useRef`, custom hooks, for example [useDisclosure](https://mantine.dev/hooks/use-disclosure/)),
compound components (`<Tabs.Tab />`, `<Popover.Dropdown />`, etc.), callback functions
as children ([CopyButton example](https://mantine.dev/core/copy-button/#usage)),
reference `window` object or add any other client-side logic.

Client components are rendered **both on the server and on the client**. They are included in the client bundle and
can use all the features, including hooks, compound components, callback functions as children, etc.

## Can I use Mantine components as server components?

No, all Mantine components are client components and cannot be used as server components.
It means that components render **both on the server and on the client, not only on client.**

## Should I add 'use client' directive to all files?

No, all Mantine components already include `'use client';` directive. You need to add it
only to the files where you use hooks, compound components, callback functions as children or any other client-side logic.

## Does 'use client' directive affect SEO?

No, `'use client';` directive does not affect SEO. Client components are rendered on the server the
same way as server components, the only difference is that client components are also included in the client bundle.

## Error: hook is not a function

<ErrorMessage error="Error: (0 , _barrel_optimize_names_useDisclosure_mantine_hooks__WEBPACK_IMPORTED_MODULE_1__.useDisclosure) is not a function or its return value is not iterable" />

This error happens when you try to use hooks in server components. In the example above you are trying to use
`useDisclosure` hook without `'use client';` directive. To fix it, add `'use client';` directive to the top of the file.

Example of code that will throw this error:

```tsx
// ❌ This will throw an error
import { useDisclosure } from '@mantine/hooks';

function Demo() {
  const { opened, toggle } = useDisclosure();
  return (
    <button onClick={toggle}>{opened ? 'Opened' : 'Closed'}</button>
  );
}
```

Example of code that will work:

```tsx
// ✅ No error
'use client';

import { useDisclosure } from '@mantine/hooks';

function Demo() {
  const { opened, toggle } = useDisclosure();
  return (
    <button onClick={toggle}>{opened ? 'Opened' : 'Closed'}</button>
  );
}
```

## Error: function cannot be passed as children

<ErrorMessage error="Error: Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with 'use server'." />

This error happens when you try to pass callback function as children to server component.
If you need to pass callback function as children, you need to add `'use client';` to the top of the file.

Example of code that will throw this error:

```tsx
// ❌ This will throw an error
import { CopyButton } from '@mantine/core';

function Demo() {
  return (
    <CopyButton value="https://mantine.dev">
      {({ copied, copy }) => (
        <button color={copied ? 'teal' : 'blue'} onClick={copy}>
          {copied ? 'Copied url' : 'Copy url'}
        </button>
      )}
    </CopyButton>
  );
}
```

Example of code that will work:

```tsx
// ✅ No error
'use client';

import { CopyButton } from '@mantine/core';

function Demo() {
  return (
    <CopyButton value="https://mantine.dev">
      {({ copied, copy }) => (
        <button color={copied ? 'teal' : 'blue'} onClick={copy}>
          {copied ? 'Copied url' : 'Copy url'}
        </button>
      )}
    </CopyButton>
  );
}
```

## Error: hook usage in server component

<ErrorMessage error="You're importing a component that needs useRef. It only works in a Client Component but none of its parents are marked with 'use client', so they're Server Components by default." />

The error above occurs when you try to use hook (`useState`, `useRef`, `useReducer`, `useEffect`, any other hook) in server component.
To fix it, add `'use client';` directive to the top of the file.

Example of code that will throw this error:

```tsx
// ❌ This will throw an error
import { useRef } from 'react';

function Demo() {
  const ref = useRef();
}
```

Example of code that will work:

```tsx
// ✅ No error
'use client';

import { useRef } from 'react';

function Demo() {
  const ref = useRef();
}
```

## Error: compound components in server component

<ErrorMessage error="Could not find the module 'x/node_modules/@mantine/core/esm/components/Popover/Popover.mjs#Popover#Target' in the React Client Manifest. This is probably a bug in the React Server Components bundler." />

The error above occurs when you try to use compound component (`<Tabs.Tab />`, `<Popover.Dropdown />`, etc.) in server component.
To fix it, add `'use client';` directive to the top of the file or replace compound components with regular components (`TabsTab`, `PopoverDropdown`, etc.).

Example of code that will throw this error:

```tsx
// ❌ This will throw an error
import { Popover } from '@mantine/core';

function Demo() {
  return (
    <Popover>
      <Popover.Target>
        <button>Toggle popover</button>
      </Popover.Target>
    </Popover>
  );
}
```

Solution 1: add `'use client';` directive to the top of the file:

```tsx
// ✅ No error
'use client';

import { Popover } from '@mantine/core';

function Demo() {
  return (
    <Popover>
      <Popover.Target>
        <button>Toggle popover</button>
      </Popover.Target>
    </Popover>
  );
}
```

Solution 2: replace compound components with regular components:

```tsx
// ✅ No error, 'use client' directive is not required
import { Popover, PopoverTarget } from '@mantine/core';

function Demo() {
  return (
    <Popover>
      <PopoverTarget>
        <button>Toggle popover</button>
      </PopoverTarget>
    </Popover>
  );
}
```

## Error: Attempted to call extend() from the server

<ErrorMessage error="Error: Attempted to call extend() from the server but extend is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component." />

The error above occurs when you try to call `Component.extend` function without `'use client';` directive.
To fix it, add `'use client';` directive to the top of the file.

Example of code that will throw this error:

```tsx
// ❌ This will throw an error
import { Button, createTheme } from '@mantine/core';

export const theme = createTheme({
  components: {
    Button: Button.extend({}),
  },
});
```

Example of code that will work:

```tsx
// ✅ No error
'use client';

import { Button, createTheme } from '@mantine/core';

export const theme = createTheme({
  components: {
    Button: Button.extend({}),
  },
});
```


----------------------------------------

# My styles are overridden by Mantine components styles, what should I do?
Learn how to use CSS layers to control styles order and prevent Mantine components from overriding your styles

## How Mantine styles work

All `@mantine/*` packages that include styles export `@mantine/*/styles.css`
file which includes all the styles for the package.
These files are handled by your framework/build tool (Next.js, Vite, React Router, etc.)
and included in the final bundle.

Most of Mantine styles (99%+) have low specificity (class selectors) to allow
easy customization and overrides.

## Styles overriding conflicts

In some cases, you might experience conflicts when Mantine styles override your
styles. It happens when your styles have the same or lower specificity than
Mantine styles and Mantine styles are imported after your styles. Usually, this
issue can be resolved by changing the import order:

```tsx
// ❌ Wrong order – Mantine styles override your styles
import './styles.css';
import '@mantine/core/styles.css';
```

```tsx
// ✅ Correct order – your styles override Mantine styles
import '@mantine/core/styles.css';
import './styles.css';
```

## CSS layers

Some frameworks/build tools might not allow you to fully control styles order.
This usually happens when the framework has a bug/limitation or when you use
specific features that mess up styles order (for example dynamic components imports).

In this case the only solution is to use [CSS layers](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer).
The `@layer` CSS at-rule is used to declare a cascade layer and can also be used to define the order of precedence in case of multiple cascade layers.
When styles are wrapped with `@layer` at-rule, their specificity is automatically reduced
compared to regular styles.

In addition to regular styles, `@mantine/*` packages also provide `@mantine/*/styles.layer.css`
in which all selectors are wrapped with `@layer mantine {}`. To use CSS layers in your application,
simply replace `@mantine/*/styles.css` imports with `@mantine/*/styles.layer.css`:

```tsx
import '@mantine/core/styles.layer.css';
```


----------------------------------------

# How can I submit a template to Mantine documentation?
Learn how to create and submit a template to Mantine documentation

# Submit a template

You are welcome to create and share a template with the community. Templates that you submit
are listed on the [getting started](https://mantine.dev/getting-started/) page.

## What is a template

Template is a GitHub repository that has the following properties:

* It depends on `@mantine/hooks` and `@mantine/core` packages version 7.0.0 or higher
* It has a "Use this template" button
* It has MIT license

Official Mantine templates provide minimal setup for different use cases.
Community templates, on the other hand, can provide more complex setups or
implement specific features that are not available in official templates.
For example, there are no official templates for Mantine + runtime CSS-in-JS libraries,
but there are community templates available to get you started.

Template examples:

* Next.js pages router + MDX + Mantine blog template
* Next.js app router + Mantine + styled-components template
* Vite + Mantine + Emotion template

## How to submit a template

* Make sure that features you want to implement are not available in official templates or other community templates
* Create a repository on GitHub
* Add your template code to the repository
* Go to repository settings and enable the "Template repository" option
* Make sure that your template has all the properties listed above
* Submit your template by creating [an issue on Github](https://github.com/mantinedev/mantine/issues/new/choose)
* After your template is reviewed, it will be added to the [getting started](https://mantine.dev/getting-started/) page


----------------------------------------

# How can I change Tabs border color?
Learn how to use Styles API with Tabs component

[Tabs](https://mantine.dev/core/tabs) border is added with `::before` on the `list`
element. You can use [Styles API](https://mantine.dev/styles/styles-api) to change
styles of inner elements:

#### Example: TabsBorderColor

```tsx
import { Tabs } from '@mantine/core';
import classes from './Demo.module.css';

function Demo() {
  return (
    <Tabs defaultValue="gallery" classNames={classes}>
      <Tabs.List>
        <Tabs.Tab value="gallery">Gallery</Tabs.Tab>
        <Tabs.Tab value="messages">Messages</Tabs.Tab>
        <Tabs.Tab value="settings">Settings</Tabs.Tab>
      </Tabs.List>
    </Tabs>
  );
}
```



----------------------------------------

# How to use Mantine template on GitHub?
Learn how to create a new repository based on Mantine template

# Templates

Mantine provides a set of templates for most common use cases.
A template is a set of configuration files that are required to
get started with Mantine and a React framework of your choice.
You can find a list of all available templates on the [getting started page](/getting-started).

## Prerequisites

In order to use any of the templates, install the following software:

* [Node.js](https://nodejs.org/en/) version 22 or higher
* [Yarn](https://yarnpkg.com/) version 4 or higher

## Getting started with a template

To get started with one of the templates:

* Open it on GitHub
* Click "Use this template" button
* Click "Create a new repository" in the dropdown
* Enter repository name and click "Create repository from template"
* Clone your new repository
* Install dependencies by running `yarn`
* Start development server by running `yarn dev`/`yarn start` (exact command depends on the framework of the template)

## Without GitHub account

If you do not have a GitHub account, you can download a template as a zip archive:

* Open template on GitHub
* Click "Code" button (it is next to the "Use this template" button)
* Click "Download ZIP"
* Extract downloaded archive
* Install dependencies by running `yarn`
* Start development server by running `yarn dev`/`yarn start` (exact command depends on the framework of the template)


----------------------------------------

# Why is it required to have 10 shades per color?
Learn how Mantine uses theme colors

## How Mantine colors are defined and used

New colors are added to the `theme.colors` object. Each color must have 10 shades from lightest to darkest.
Colors specified in `theme.colors` are available in all components that support
`color` prop.

`theme.primaryColor` determines which color from `theme.colors` is used as default color
in most components that support `color` prop.

`theme.primaryShade` determines which shade from `theme.colors[color]` is used
as default color in components with filled variant.

```tsx
import { createTheme } from '@mantine/core';

const theme = createTheme({
  colors: {
    oceanBlue: [
      '#7AD1DD', // lightest
      '#5FCCDB',
      '#44CADC',
      '#2AC9DE',
      '#1AC2D9',
      '#11B7CD',
      '#09ADC3', // primaryShade light
      '#0E99AC',
      '#128797', // primaryShade dark
      '#147885', // darkest
    ],
  },

  // theme.primaryColor must be key of theme.colors object,
  // hex/rgb/other values are not supported
  primaryColor: 'oceanBlue',

  // primaryShade is the index of main color in theme.colors[color] arrays
  // theme.colors[color][primaryShade] is used in components with filled variant
  primaryShade: { light: 6, dark: 8 },
});
```

## Why is it required to have 10 shades per color?

Mantine components have different variants and support light and dark color
schemes. Having 10 shades per color allows maintaining consistent colors with
proper contrast and brightness levels across all variants and color schemes.

For example, [Button](https://mantine.dev/core/button) component has `filled`
and `light` variants which use different shades of `theme.colors` depending on
color scheme:

<Group>
  <Button size="lg" radius="md">Filled Button</Button>
  <Button size="lg" radius="md" variant="light">Filled Button</Button>
</Group>

In the above example:

* Filled button:
  * background in light color scheme: `blue[6]`
  * hover background in light color scheme: `blue[7]`
  * background in dark color scheme: `blue[8]`
  * hover background in dark color scheme: `blue[9]`
* Light button:
  * background in light color scheme: `blue[0]`
  * hover background in light color scheme: `blue[1]`
  * text color in light color scheme: `blue[6]`
  * background in dark color scheme: `color-mix(in srgb, blue[6], transparent 12%)`
  * hover background in dark color scheme: `color-mix(in srgb, blue[6], transparent 15%)`
  * text color in dark color scheme: `blue[4]`

## Can I have just one shade per color?

If you do not plan to use light variant, support different colors for
light/dark color schemes, and you do not rely on color changes for hover
effects, you can define just one shade per color with `colorsTuple` function:

```tsx
import { colorsTuple, createTheme } from '@mantine/core';

const theme = createTheme({
  colors: {
    custom: colorsTuple('#FFC0CB'),
  },
});
```

## Can I have more that 10 shades per color?

Yes, it is possible to define more than 10 shades per color, but
Mantine components will use only the first 10 of them. Other colors
values will be available in `theme.colors` object and as CSS variables,
for example `var(--mantine-color-blue-11)`.


----------------------------------------

# Can I use Mantine with Emotion/styled-components/tailwindcss?
Learn about limitations of third-party styles

## I prefer a third-party styles solution, can I use Mantine with it?

All Mantine components are fully compatible with any third-party styling solution and native CSS.
There are two main strategies to apply styles with a third-party library:

* `className`, `classNames`, `style` and `styles` props
* with static selectors, for example `.mantine-Text-root`

Example of applying styles with a utility CSS library:

```tsx
import { TextInput } from '@mantine/core';

function Demo() {
  return (
    <TextInput
      classNames={{
        root: 'mt-4',
        input: 'bg-red-500 text-white',
      }}
    />
  );
}
```

Example of applying styles with global CSS:

```css
/* styles.css */

/* Note that these styles are not scoped and
   will be applied to all TextInput components */
.mantine-TextInput-root {
  margin-top: 0.8rem;
}

.mantine-TextInput-input {
  background-color: var(--mantine-color-red-filled);
  color: var(--mantine-color-white);
}
```

You can combine both approaches to achieve desired results, for example,
`@emotion/styled` and `styled-components` packages will pass `className` prop to
a given component, and you can use static selectors to style inner elements:

```tsx
import styled from '@emotion/styled';
import { Slider } from '@mantine/core';

const StyledSlider = styled(Slider)`
  & .mantine-Slider-bar {
    background-color: var(--mantine-color-pink-5);
  }

  & .mantine-Slider-thumb {
    border-color: var(--mantine-color-pink-5);
    background-color: white;
    width: 1.5rem;
    height: 1.5rem;
  }
`;

function Demo() {
  return <StyledSlider defaultValue={40} />;
}
```

## Is there any specific setup for Tailwind CSS?

Usually it is enough to [disable preflight](https://tailwindcss.com/docs/preflight#disabling-preflight)
to prevent global styles from affecting Mantine components.
If preflight is required in your project, follow one of the guides in the [GitHub discussion](https://github.com/orgs/mantinedev/discussions/1672).


----------------------------------------

# My buttons are transparent and the background is visible only on hover, what is wrong?
You have installed a third-party library that overrides Mantine styles

## Why my buttons are transparent?

If your buttons are transparent and the background is visible only on hover, you have installed a third-party library that overrides Mantine styles.
Tailwind CSS is the most common library that causes this issue.

## How to fix it?

To fix the issue follow one of the [guides from the community](https://github.com/orgs/mantinedev/discussions/1672)
that suits your project setup the best.

## I do not use Tailwind, what else can cause this issue?

This issue can be caused by any third-party library that overrides Mantine styles.
Explore element in dev tools to find out which styles are applied to the button and which library is responsible for it.


----------------------------------------

# How can I load fonts in Vite?
A guide to load custom fonts in Vite

## Loading local fonts

Create the following folder structure (the example with Roboto custom font):

```plaintext
Roboto/
├─ Roboto-Bold.woff2
├─ Roboto-Heavy.woff2
├─ Roboto.css
```

In `Roboto.css` file, add the following code:

```css
@font-face {
  font-family: 'Roboto';
  src: url('./Roboto-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
}

@font-face {
  font-family: 'Roboto';
  src: url('./Roboto-Heavy.woff2') format('woff2');
  font-weight: 900;
  font-style: normal;
}
```

Then import `Roboto.css` file at the root of your application and
add the font to your [theme](https://mantine.dev/theming/theme-object/):

```tsx
import {
  createTheme,
  DEFAULT_THEME,
  MantineProvider,
} from '@mantine/core';

import '@mantine/core/styles.css';
import './Roboto/Roboto.css';

const theme = createTheme({
  fontFamily: 'Roboto, sans-serif',
  fontFamilyMonospace: 'Monaco, Courier, monospace',
  headings: {
    // Use default theme if you want to provide default Mantine fonts as a fallback
    fontFamily: `Roboto, ${DEFAULT_THEME.fontFamily}`,
  },
});

function Demo() {
  return (
    <MantineProvider theme={theme}>Your app here</MantineProvider>
  );
}
```

## Load fonts from Google Fonts

Selects fonts you want to use at [Google Fonts](https://fonts.google.com/) and copy
HTML code snippet. For example, to load [Roboto](https://fonts.google.com/specimen/Roboto)
font, the code you receive from Google Fonts will look something like this:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
  rel="stylesheet"
/>
```

Add the code to the `<head />` of your application `index.html` file
of your application. The code will look something like this:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/src/favicon.svg" />
    <meta
      name="viewport"
      content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
    />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link
      rel="preconnect"
      href="https://fonts.gstatic.com"
      crossorigin
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
      rel="stylesheet"
    />
    <title>Vite + Mantine App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Then add the font to your [theme](https://mantine.dev/theming/theme-object/):

```tsx
import {
  createTheme,
  DEFAULT_THEME,
  MantineProvider,
} from '@mantine/core';

import '@mantine/core/styles.css';

const theme = createTheme({
  fontFamily: 'Roboto, sans-serif',
  fontFamilyMonospace: 'Monaco, Courier, monospace',
  headings: {
    // Use default theme if you want to provide default Mantine fonts as a fallback
    fontFamily: `Roboto, ${DEFAULT_THEME.fontFamily}`,
  },
});

function Demo() {
  return (
    <MantineProvider theme={theme}>Your app here</MantineProvider>
  );
}
```


----------------------------------------

# Can I use Mantine with Vue/Svelte/Angular/etc.?
No, Mantine is a React library and does not support other frameworks/libraries

## Can I use Mantine with Vue/Svelte/Angular?

No, Mantine is a React library and does not support other frameworks/libraries.
Maintaining a library is a lot of work, Mantine is focused on providing the
best possible experience for React developers and does not plan to support
other frameworks in the future.

## What about Preact?

Mantine does not officially support Preact. However, several community members
reported that they were able to use Mantine with Preact without any issues.


----------------------------------------

# Why VSCode cannot autoimport Text component?
It is confused by the native Text constructor

## Why Text component is not automatically imported?

VSCode cannot automatically import [Text](https://mantine.dev/core/text) component
because it confuses it with the native [Text](https://developer.mozilla.org/en-US/docs/Web/API/Text/Text) constructor
which always appears as a first type reference in the editor.

<Image src={textConstructorImage.src} maw={800} />

## How can I import Text component with VSCode?

To import Mantine `Text` component, you need to manually select it from the list of suggestions
(usually, it appears as the second option):

<Image src={textComponentImage.src} maw={800} />

To learn more about VSCode IntelliSense and autoimport, visit the [official documentation](https://code.visualstudio.com/docs/editor/intellisense).


----------------------------------------