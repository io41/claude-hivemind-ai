# Mantine: Year

/month control aria-label

Use `getYearControlProps`/`getMonthControlProps`/`getDayProps` to customize `aria-label` attribute:

```tsx
import { DatePicker } from '@mantine/dates';

function Demo() {
  return (
    <DatePicker
      getDayProps={(date) => ({
        'aria-label': `Select date ${
          date.getMonth() + 1
        }/${date.getDate()}/${date.getFullYear()}`,
      })}
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