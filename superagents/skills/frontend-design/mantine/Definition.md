# Mantine: Definition

```tsx
interface UseIdleOptions {
  events?: (keyof DocumentEventMap)[];
  initialState?: boolean;
}

function useIdle(timeout: number, options?: UseIdleOptions): boolean;
```

## Exported types

`UseIdleOptions` type is exported from `@mantine/hooks` package,
you can import it in your application:

```tsx
import type { UseIdleOptions } from '@mantine/hooks';
```


--------------------------------------------------------------------------------