# Mantine: SixToSeven

# 6.x → 7.x migration guide

This guide is intended to help you migrate your project styles from 6.x to 7.x.
It is not intended to be a comprehensive guide to all the changes in 7.x.
For that, please see the [7.0.0 changelog](https://mantine.dev/changelog/7-0-0).

## Migration to @mantine/emotion

`@mantine/emotion` package is available starting from version 7.9. If you do not want
to use CSS modules, have a lot of styles created with `createStyles`, `sx` and `styles`
props, or just prefer CSS-in-JS syntax, you can migrate to `@mantine/emotion`. To view
the full documentation for `@mantine/emotion` package, visit [this page](https://mantine.dev/styles/emotion).