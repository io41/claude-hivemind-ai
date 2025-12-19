# Mantine: Aria labels

Set `ariaLabels` prop to specify `aria-label` attributes for next/previous controls:

```tsx
import { MonthPicker } from '@mantine/dates';

function Demo() {
  return (
    <MonthPicker
      ariaLabels={{
        nextDecade: 'Next decade',
        previousDecade: 'Previous decade',
        nextYear: 'Next year',
        previousYear: 'Previous year',
        yearLevelControl: 'Change to decade view',
      }}
    />
  );
}
```