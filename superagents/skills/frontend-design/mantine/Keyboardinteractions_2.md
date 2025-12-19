# Mantine: Keyboard interactions

Note that the following events will only trigger if focus is on date control.


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
| enableKeyboardNavigation | boolean | - | Enable enhanced keyboard navigation (Ctrl/Cmd + Arrow keys for year navigation, Ctrl/Cmd + Shift + Arrow keys for decade navigation, Y key to open year view) |
| excludeDate | (date: string) => boolean | - | Callback function to determine whether the day should be disabled |
| firstDayOfWeek | 0 | 1 | 2 | 3 | 4 | 5 | 6 | - | Number 0-6, where 0 – Sunday and 6 – Saturday. |
| getDayAriaLabel | (date: string) => string | - | Assigns <code>aria-label</code> to <code>Day</code> components based on date |
| getDayProps | (date: string) => Omit<Partial<DayProps>, "classNames" | "styles" | "vars"> & DataAttributes | - | Passes props down to <code>Day</code> components |
| getMonthControlProps | (date: string) => Partial<PickerControlProps> & DataAttributes | - | Passes props down month picker control |
| getYearControlProps | (date: string) => Partial<PickerControlProps> & DataAttributes | - | Passes props down to year picker control based on date |
| headerControlsOrder | ("next" | "previous" | "level")[] | - | Controls order |
| hideOutsideDates | boolean | - | Determines whether outside dates should be hidden |
| hideWeekdays | boolean | - | Determines whether weekdays row should be hidden |
| highlightToday | boolean | - | Determines whether today should be highlighted with a border |
| level | "month" | "year" | "decade" | - | Current displayed level (controlled) |
| locale | string | - | Dayjs locale, defaults to value defined in DatesProvider |
| maxDate | string | Date | - | Maximum possible date in <code>YYYY-MM-DD</code> format or Date object |
| maxLevel | "month" | "year" | "decade" | - | - |
| minDate | string | Date | - | Minimum possible date in <code>YYYY-MM-DD</code> format or Date object |
| monthLabelFormat | string | ((date: string) => string) | - | dayjs label format to display month label or a function that returns month label based on month value |
| monthsListFormat | string | - | <code>dayjs</code> format for months list |
| nextIcon | React.ReactNode | - | Change next icon |
| nextLabel | string | - | Next button <code>aria-label</code> |
| numberOfColumns | number | - | Number of columns displayed next to each other |
| onChange | (value: DatePickerValue<Type, string>) => void | - | Called when value changes |
| onDateChange | (date: string) => void | - | Called when date changes |
| onLevelChange | (level: CalendarLevel) => void | - | Called when level changes |
| onMonthMouseEnter | (event: MouseEvent<HTMLButtonElement, MouseEvent>, date: string) => void | - | Called when mouse enters month control |
| onMonthSelect | (date: string) => void | - | Called when user selects month |
| onNextDecade | (date: string) => void | - | Called when the next decade button is clicked |
| onNextMonth | (date: string) => void | - | Called when the next month button is clicked |
| onNextYear | (date: string) => void | - | Called when the next year button is clicked |
| onPreviousDecade | (date: string) => void | - | Called when the previous decade button is clicked |
| onPreviousMonth | (date: string) => void | - | Called when the previous month button is clicked |
| onPreviousYear | (date: string) => void | - | Called when the previous year button is clicked |
| onYearMouseEnter | (event: MouseEvent<HTMLButtonElement, MouseEvent>, date: string) => void | - | Called when mouse enters year control |
| onYearSelect | (date: string) => void | - | Called when user selects year |
| presets | DatePickerPreset<Type>[] | - | Predefined values to pick from |
| previousIcon | React.ReactNode | - | Change previous icon |
| previousLabel | string | - | Previous button <code>aria-label</code> |
| renderDay | (date: string) => React.ReactNode | - | Controls day value rendering |
| size | MantineSize | - | Component size |
| type | "range" | "multiple" | "default" | - | Picker type: range, multiple or default |
| value | DateValue | DatesRangeValue<DateValue> | DateValue[] | - | Value for controlled component |
| weekdayFormat | string | ((date: string) => string) | - | <code>dayjs</code> format for weekdays names |
| weekendDays | (0 | 1 | 2 | 3 | 4 | 5 | 6)[] | - | Indices of weekend days, 0-6, where 0 is Sunday and 6 is Saturday. The default value is defined by <code>DatesProvider</code>. |
| withCellSpacing | boolean | - | Determines whether controls should be separated |
| withWeekNumbers | boolean | - | Determines whether week numbers should be displayed |
| yearLabelFormat | string | ((date: string) => string) | - | dayjs label format to display year label or a function that returns year label based on year value |
| yearsListFormat | string | - | dayjs format for years list |


#### Styles API

DatePicker component supports Styles API. With Styles API, you can customize styles of any inner element. Follow the documentation to learn how to use CSS modules, CSS variables and inline styles to get full control over component styles.

**DatePicker selectors**

| Selector | Static selector | Description |
|----------|----------------|-------------|
| calendarHeader | .mantine-DatePicker-calendarHeader | Calendar header root element |
| calendarHeaderControl | .mantine-DatePicker-calendarHeaderControl | Previous/next calendar header controls |
| calendarHeaderControlIcon | .mantine-DatePicker-calendarHeaderControlIcon | Icon of previous/next calendar header controls |
| calendarHeaderLevel | .mantine-DatePicker-calendarHeaderLevel | Level control (changes levels when clicked, month -> year -> decade) |
| levelsGroup | .mantine-DatePicker-levelsGroup | Group of months levels |
| yearsList | .mantine-DatePicker-yearsList | Years list table element |
| yearsListRow | .mantine-DatePicker-yearsListRow | Years list row element |
| yearsListCell | .mantine-DatePicker-yearsListCell | Years list cell element |
| yearsListControl | .mantine-DatePicker-yearsListControl | Button used to pick months and years |
| monthsList | .mantine-DatePicker-monthsList | Months list table element |
| monthsListRow | .mantine-DatePicker-monthsListRow | Months list row element |
| monthsListCell | .mantine-DatePicker-monthsListCell | Months list cell element |
| monthsListControl | .mantine-DatePicker-monthsListControl | Button used to pick months and years |
| monthThead | .mantine-DatePicker-monthThead | thead element of month table |
| monthRow | .mantine-DatePicker-monthRow | tr element of month table |
| monthTbody | .mantine-DatePicker-monthTbody | tbody element of month table |
| monthCell | .mantine-DatePicker-monthCell | td element of month table |
| month | .mantine-DatePicker-month | Month table element |
| weekdaysRow | .mantine-DatePicker-weekdaysRow | Weekdays tr element |
| weekday | .mantine-DatePicker-weekday | Weekday th element |
| day | .mantine-DatePicker-day | Month day control |
| weekNumber | .mantine-DatePicker-weekNumber | Week number td element |
| datePickerRoot | .mantine-DatePicker-datePickerRoot | Date picker root element, contains calendar and presets |
| presetsList | .mantine-DatePicker-presetsList | Presets wrapper element |
| presetButton | .mantine-DatePicker-presetButton | Preset button |

**DatePickerinput selectors**

| Selector | Static selector | Description |
|----------|----------------|-------------|
| calendarHeader | .mantine-DatePickerinput-calendarHeader | Calendar header root element |
| calendarHeaderControl | .mantine-DatePickerinput-calendarHeaderControl | Previous/next calendar header controls |
| calendarHeaderControlIcon | .mantine-DatePickerinput-calendarHeaderControlIcon | Icon of previous/next calendar header controls |
| calendarHeaderLevel | .mantine-DatePickerinput-calendarHeaderLevel | Level control (changes levels when clicked, month -> year -> decade) |
| levelsGroup | .mantine-DatePickerinput-levelsGroup | Group of months levels |
| yearsList | .mantine-DatePickerinput-yearsList | Years list table element |
| yearsListRow | .mantine-DatePickerinput-yearsListRow | Years list row element |
| yearsListCell | .mantine-DatePickerinput-yearsListCell | Years list cell element |
| yearsListControl | .mantine-DatePickerinput-yearsListControl | Button used to pick months and years |
| monthsList | .mantine-DatePickerinput-monthsList | Months list table element |
| monthsListRow | .mantine-DatePickerinput-monthsListRow | Months list row element |
| monthsListCell | .mantine-DatePickerinput-monthsListCell | Months list cell element |
| monthsListControl | .mantine-DatePickerinput-monthsListControl | Button used to pick months and years |
| monthThead | .mantine-DatePickerinput-monthThead | thead element of month table |
| monthRow | .mantine-DatePickerinput-monthRow | tr element of month table |
| monthTbody | .mantine-DatePickerinput-monthTbody | tbody element of month table |
| monthCell | .mantine-DatePickerinput-monthCell | td element of month table |
| month | .mantine-DatePickerinput-month | Month table element |
| weekdaysRow | .mantine-DatePickerinput-weekdaysRow | Weekdays tr element |
| weekday | .mantine-DatePickerinput-weekday | Weekday th element |
| day | .mantine-DatePickerinput-day | Month day control |
| weekNumber | .mantine-DatePickerinput-weekNumber | Week number td element |
| datePickerRoot | .mantine-DatePickerinput-datePickerRoot | Date picker root element, contains calendar and presets |
| presetsList | .mantine-DatePickerinput-presetsList | Presets wrapper element |
| presetButton | .mantine-DatePickerinput-presetButton | Preset button |
| placeholder | .mantine-DatePickerinput-placeholder | Placeholder element |


--------------------------------------------------------------------------------