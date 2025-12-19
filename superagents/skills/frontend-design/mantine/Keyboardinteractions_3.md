# Mantine: Keyboard interactions

Note that the following events will only trigger if focus is on month control.


#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| allowDeselect | boolean | - | Determines whether user can deselect the date by clicking on selected item, applicable only when type="default" |
| allowSingleDateInRange | boolean | - | Determines whether a single day can be selected as range, applicable only when type="range" |
| ariaLabels | CalendarAriaLabels | - | <code>aria-label</code> attributes for controls on different levels |
| columnsToScroll | number | - | Number of columns to scroll with next/prev buttons, same as <code>numberOfColumns</code> if not set explicitly |
| date | string | Date | - | Displayed date in controlled mode |
| decadeLabelFormat | string | ((startOfDecade: string, endOfDecade: string) => ReactNode) | - | <code>dayjs</code> format for decade label or a function that returns decade label based on the date value |
| defaultDate | string | Date | - | Initial displayed date in uncontrolled mode |
| defaultLevel | "month" | "year" | "decade" | - | Initial displayed level (uncontrolled) |
| defaultValue | DateValue | DatesRangeValue<DateValue> | DateValue[] | - | Default value for uncontrolled component |
| getMonthControlProps | (date: string) => Partial<PickerControlProps> & DataAttributes | - | Passes props down month picker control |
| getYearControlProps | (date: string) => Partial<PickerControlProps> & DataAttributes | - | Passes props down to year picker control based on date |
| level | "month" | "year" | "decade" | - | Current displayed level (controlled) |
| locale | string | - | Dayjs locale, defaults to value defined in DatesProvider |
| maxDate | string | Date | - | Maximum possible date in <code>YYYY-MM-DD</code> format or Date object |
| maxLevel | "month" | "year" | "decade" | - | Max level that user can go up to |
| minDate | string | Date | - | Minimum possible date in <code>YYYY-MM-DD</code> format or Date object |
| monthsListFormat | string | - | <code>dayjs</code> format for months list |
| nextLabel | string | - | Next button <code>aria-label</code> |
| numberOfColumns | number | - | Number of columns displayed next to each other |
| onChange | (value: DatePickerValue<Type, string>) => void | - | Called when value changes |
| onDateChange | (date: string) => void | - | Called when date changes |
| onLevelChange | (level: MonthPickerLevel) => void | - | Called when level changes |
| onMonthSelect | (date: string) => void | - | Called when month is selected |
| onNextDecade | (date: string) => void | - | Called when the next decade button is clicked |
| onNextYear | (date: string) => void | - | Called when the next year button is clicked |
| onPreviousDecade | (date: string) => void | - | Called when the previous decade button is clicked |
| onPreviousYear | (date: string) => void | - | Called when the previous year button is clicked |
| previousLabel | string | - | Previous button <code>aria-label</code> |
| size | MantineSize | - | Component size |
| type | "range" | "multiple" | "default" | - | Picker type: range, multiple or default |
| value | DateValue | DatesRangeValue<DateValue> | DateValue[] | - | Value for controlled component |
| withCellSpacing | boolean | - | Determines whether controls should be separated |
| yearLabelFormat | string | ((date: string) => string) | - | dayjs label format to display year label or a function that returns year label based on year value |
| yearsListFormat | string | - | dayjs format for years list |


#### Styles API

MonthPicker component supports Styles API. With Styles API, you can customize styles of any inner element. Follow the documentation to learn how to use CSS modules, CSS variables and inline styles to get full control over component styles.

**MonthPicker selectors**

| Selector | Static selector | Description |
|----------|----------------|-------------|
| calendarHeader | .mantine-MonthPicker-calendarHeader | Calendar header root element |
| calendarHeaderControl | .mantine-MonthPicker-calendarHeaderControl | Previous/next calendar header controls |
| calendarHeaderControlIcon | .mantine-MonthPicker-calendarHeaderControlIcon | Icon of previous/next calendar header controls |
| calendarHeaderLevel | .mantine-MonthPicker-calendarHeaderLevel | Level control (changes levels when clicked, month -> year -> decade) |
| levelsGroup | .mantine-MonthPicker-levelsGroup | Group of years levels |
| yearsList | .mantine-MonthPicker-yearsList | Years list table element |
| yearsListRow | .mantine-MonthPicker-yearsListRow | Years list row element |
| yearsListCell | .mantine-MonthPicker-yearsListCell | Years list cell element |
| yearsListControl | .mantine-MonthPicker-yearsListControl | Button used to pick months and years |
| monthsList | .mantine-MonthPicker-monthsList | Months list table element |
| monthsListRow | .mantine-MonthPicker-monthsListRow | Months list row element |
| monthsListCell | .mantine-MonthPicker-monthsListCell | Months list cell element |
| monthsListControl | .mantine-MonthPicker-monthsListControl | Button used to pick months and years |

**MonthPickerinput selectors**

| Selector | Static selector | Description |
|----------|----------------|-------------|
| calendarHeader | .mantine-MonthPickerinput-calendarHeader | Calendar header root element |
| calendarHeaderControl | .mantine-MonthPickerinput-calendarHeaderControl | Previous/next calendar header controls |
| calendarHeaderControlIcon | .mantine-MonthPickerinput-calendarHeaderControlIcon | Icon of previous/next calendar header controls |
| calendarHeaderLevel | .mantine-MonthPickerinput-calendarHeaderLevel | Level control (changes levels when clicked, month -> year -> decade) |
| levelsGroup | .mantine-MonthPickerinput-levelsGroup | Group of years levels |
| yearsList | .mantine-MonthPickerinput-yearsList | Years list table element |
| yearsListRow | .mantine-MonthPickerinput-yearsListRow | Years list row element |
| yearsListCell | .mantine-MonthPickerinput-yearsListCell | Years list cell element |
| yearsListControl | .mantine-MonthPickerinput-yearsListControl | Button used to pick months and years |
| monthsList | .mantine-MonthPickerinput-monthsList | Months list table element |
| monthsListRow | .mantine-MonthPickerinput-monthsListRow | Months list row element |
| monthsListCell | .mantine-MonthPickerinput-monthsListCell | Months list cell element |
| monthsListControl | .mantine-MonthPickerinput-monthsListControl | Button used to pick months and years |
| placeholder | .mantine-MonthPickerinput-placeholder | Placeholder element |


--------------------------------------------------------------------------------