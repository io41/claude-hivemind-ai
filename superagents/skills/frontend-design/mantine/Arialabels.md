# Mantine: Aria labels

Set `ariaLabels` prop to specify `aria-label` attributes for next/previous controls:

```tsx
import { DatePicker } from '@mantine/dates';

function Demo() {
  return (
    <DatePicker
      ariaLabels={{
        nextDecade: 'Next decade',
        previousDecade: 'Previous decade',
        nextYear: 'Next year',
        previousYear: 'Previous year',
        nextMonth: 'Next month',
        previousMonth: 'Previous month',
        yearLevelControl: 'Change to decade view',
        monthLevelControl: 'Change to year view',
      }}
    />
  );
}
```