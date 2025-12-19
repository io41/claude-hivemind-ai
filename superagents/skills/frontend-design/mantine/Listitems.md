# Mantine: List items

[Nested fields guide](https://mantine.dev/form/nested/)

```tsx
// Inserts given list item at the specified path
form.insertListItem('fruits', { name: 'Apple', available: true });

// An optional index may be provided to specify the position in a nested field.
// If the index is provided, item will be inserted at the given position.
// If the index is larger than the current list, the element is inserted at the last position.
form.insertListItem('fruits', { name: 'Orange', available: true }, 1);

// Removes the list item at the specified path and index.
form.removeListItem('fruits', 1);

// Replaces the list item at the specified path and index with the given item.
form.replaceListItem('fruits', 1, { name: 'Apple', available: true });

// Swaps two items of the list at the specified path.
// You should make sure that there are elements at at the `from` and `to` index.
form.reorderListItem('fruits', { from: 1, to: 0 });
```