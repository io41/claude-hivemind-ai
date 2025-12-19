# Mantine: NativeSelect

Package: @mantine/core
Import: import { NativeSelect } from '@mantine/core';
Description: Native select element based on Input

## Usage

<InputFeatures component="NativeSelect" element="select" />

NativeSelect component supports [Input](https://mantine.dev/core/input) and [Input.Wrapper](https://mantine.dev/core/input) components features and all select element props. NativeSelect documentation does not include all features supported by the component – see [Input](https://mantine.dev/core/input) documentation to learn about all available features.

#### Example: usage

```tsx
import { NativeSelect } from '@mantine/core';

function Demo() {
  return <NativeSelect data={['React', 'Angular', 'Vue']} />;
}
```


## Controlled

```tsx
import { useState } from 'react';
import { NativeSelect } from '@mantine/core';

function Demo() {
  const [value, setValue] = useState('');

  return (
    <NativeSelect
      value={value}
      onChange={(event) => setValue(event.currentTarget.value)}
      data={['React', 'Angular', 'Svelte', 'Vue']}
    />
  );
}
```

## Adding options

`NativeSelect` allows passing options in two ways:

* `data` prop array
* `children` prop with `option` components

Note that if `children` is used, `data` will be ignored.