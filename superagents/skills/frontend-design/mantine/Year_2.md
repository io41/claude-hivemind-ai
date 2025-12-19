# Mantine: Year

/month control aria-label

Use `getYearControlProps`/`getMonthControlProps` to customize `aria-label` attribute:

```tsx
import { MonthPicker } from '@mantine/dates';

function Demo() {
  return (
    <MonthPicker
      getYearControlProps={(date) => ({
        'aria-label': `Select year ${date.getFullYear()}`,
      })}
      getMonthControlProps={(date) => ({
        'aria-label': `Select month ${date.getFullYear()}/${date.getMonth()}`,
      })}
    />
  );
}
```