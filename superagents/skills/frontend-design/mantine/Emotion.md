# Mantine: Emotion

# Usage with Emotion

Prior to version 7.0 Mantine used [Emotion](https://emotion.sh/) as a styling solution.
It was replaced with [CSS modules](https://mantine.dev/styles/css-modules/) in version 7.0, but you can still
use Emotion with Mantine if you prefer it over CSS modules.

Note that `createStyles` function, `sx` and `styles` prop work different from the same
features in [version 6.x](https://v6.mantine.dev/styles/create-styles/). If you are planning
to upgrade from version 6.x to 7.x, follow the [migration guide](https://mantine.dev/guides/6x-to-7x/).

`@mantine/emotion` package is compatible with `@mantine/core` 7.9.0 and higher. Before
installing, make sure that you are using the latest version of all `@mantine/*` packages.

## Caveats and support

[Emotion](https://emotion.sh/) is a runtime CSS-in-JS library – styles are generated
and injected into the DOM at runtime. This approach has some limitations:

* **Limited server-side rendering support** – modern frameworks like Next.js with app router
  do not fully support emotion or require additional configuration.
* **Runtime overhead** – styles are generated and injected at runtime, which can lead to
  performance issues on pages with a lot of components.
* **Additional bundle size** – your bundle will include `@emotion/react` (21.2kB minified),
  `@mantine/emotion` (~2kb minified) and all styles that you use in your components.

`@mantine/emotion` package can be used with the following frameworks:

* **Vite** and **CRA** with basic setup
* **Next.js with pages router** with additional setup for server side rendering provided by the package
* **Next.js with app router** with additional setup for server side rendering provided by Emotion
* Any other framework that does not require server-side rendering with basic setup

There is no official support (the package probably can be used but it's not tested and documentation is not provided) for:

* **React Router**
* **Gatsby**
* **Redwood**
* Any other framework that has server-side rendering

Note that Emotion is not recommended for new projects, if you are starting a new project with Mantine,
consider using [CSS modules](https://mantine.dev/styles/css-modules/) instead.

## Usage with Vite

[View example repository with full setup](https://github.com/mantinedev/vite-min-template/tree/emotion)

Install dependencies:

```bash
yarn add @mantine/emotion @emotion/react @emotion/cache @emotion/serialize @emotion/utils
```

```bash
npm install @mantine/emotion @emotion/react @emotion/cache @emotion/serialize @emotion/utils
```

Create `emotion.d.ts` file in `src` directory to add types support for `sx` and `styles` props:

```tsx
import '@mantine/core';

import type { EmotionStyles, EmotionSx } from '@mantine/emotion';

declare module '@mantine/core' {
  export interface BoxProps {
    sx?: EmotionSx;
    styles?: EmotionStyles;
  }
}
```

Wrap your application with `MantineEmotionProvider` and add `emotionTransform` to `MantineProvider`:

```tsx
import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';
import {
  emotionTransform,
  MantineEmotionProvider,
} from '@mantine/emotion';

export default function App() {
  return (
    <MantineProvider stylesTransform={emotionTransform}>
      <MantineEmotionProvider>App</MantineEmotionProvider>
    </MantineProvider>
  );
}
```

Done! You can now use `sx`, `styles` props and `createStyles` in your application:

```tsx
import { Box } from '@mantine/core';

function Demo() {
  return (
    <Box
      sx={(theme, u) => ({
        padding: 40,

        [u.light]: {
          backgroundColor: theme.colors.blue[0],
          color: theme.colors.blue[9],

          '&:hover': {
            backgroundColor: theme.colors.blue[1],
          },
        },
      })}
    >
      Box with emotion sx prop
    </Box>
  );
}
```

## Usage with Next.js pages router

[View example repository with full setup](https://github.com/mantinedev/next-pages-min-template/tree/emotion)

Install dependencies:

```bash
yarn add @mantine/emotion @emotion/react @emotion/cache @emotion/serialize @emotion/utils @emotion/server
```

```bash
npm install @mantine/emotion @emotion/react @emotion/cache @emotion/serialize @emotion/utils @emotion/server
```

Create `emotion` folder with `cache.ts` and `emotion.d.ts` files.

`cache.ts` file:

```tsx
import createCache from '@emotion/cache';

export const emotionCache = createCache({ key: 'css' });
```

`emotion.d.ts` file:

```tsx
import '@mantine/core';

import type { EmotionStyles, EmotionSx } from '@mantine/emotion';

declare module '@mantine/core' {
  export interface BoxProps {
    sx?: EmotionSx;
    styles?: EmotionStyles;
  }
}
```

Add the following content to `pages/_document.tsx` file:

```tsx
import NextDocument, {
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';
import createEmotionServer from '@emotion/server/create-instance';
import { ColorSchemeScript } from '@mantine/core';
import { createGetInitialProps } from '@mantine/emotion';
// Import cache created in the previous step
import { emotionCache } from '../emotion/cache';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <ColorSchemeScript />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

const stylesServer = createEmotionServer(emotionCache);

Document.getInitialProps = createGetInitialProps(
  NextDocument,
  stylesServer
);
```

Add `MantineEmotionProvider` and `emotionTransform` to `pages/_app.tsx` file:

```tsx
import '@mantine/core/styles.css';

import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import {
  emotionTransform,
  MantineEmotionProvider,
} from '@mantine/emotion';
import { emotionCache } from '../emotion/cache';

export default function App({ Component, pageProps }: any) {
  return (
    <MantineEmotionProvider cache={emotionCache}>
      <MantineProvider stylesTransform={emotionTransform}>
        <Head>
          <title>Mantine Template</title>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
          />
          <link rel="shortcut icon" href="/favicon.svg" />
        </Head>
        <Component {...pageProps} />
      </MantineProvider>
    </MantineEmotionProvider>
  );
}
```

Done! You can now use `sx`, `styles` props and `createStyles` in your application:

```tsx
import { Box } from '@mantine/core';

function Demo() {
  return (
    <Box
      sx={(theme, u) => ({
        padding: 40,

        [u.light]: {
          backgroundColor: theme.colors.blue[0],
          color: theme.colors.blue[9],

          '&:hover': {
            backgroundColor: theme.colors.blue[1],
          },
        },
      })}
    >
      Box with emotion sx prop
    </Box>
  );
}
```

## Usage with Next.js app router

[View example repository with full setup](https://github.com/mantinedev/next-app-min-template/tree/emotion)

Install dependencies:

```bash
yarn add @mantine/emotion @emotion/react @emotion/cache @emotion/serialize @emotion/utils @emotion/server
```

```bash
npm install @mantine/emotion @emotion/react @emotion/cache @emotion/serialize @emotion/utils @emotion/server
```

Create `app/emotion.d.ts` file with the following content:

```tsx
import '@mantine/core';

import type { EmotionStyles, EmotionSx } from '@mantine/emotion';

declare module '@mantine/core' {
  export interface BoxProps {
    sx?: EmotionSx;
    styles?: EmotionStyles;
  }
}
```

Create `app/EmotionRootStyleRegistry.tsx` file with the following content:

```tsx
'use client';

import { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';

export function RootStyleRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const [{ cache, flush }] = useState(() => {
    const cache = createCache({ key: 'my' });
    cache.compat = true;
    const prevInsert = cache.insert;
    let inserted: string[] = [];
    cache.insert = (...args) => {
      const serialized = args[1];
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      return prevInsert(...args);
    };
    const flush = () => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };
    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) return null;
    let styles = '';
    for (const name of names) {
      styles += cache.inserted[name];
    }
    return (
      <style
        data-emotion={`${cache.key} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{
          __html: styles,
        }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
```

Add `RootStyleRegistry`, `MantineEmotionProvider` and `emotionTransform` to `app/layout.tsx`.
It should look something like this:

```tsx
import '@mantine/core/styles.css';

import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import {
  emotionTransform,
  MantineEmotionProvider,
} from '@mantine/emotion';
import { RootStyleRegistry } from './EmotionRootStyleRegistry';

export const metadata = {
  title: 'Mantine Next.js template',
  description: 'I am using Mantine with Next.js!',
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <RootStyleRegistry>
          <MantineEmotionProvider>
            <MantineProvider stylesTransform={emotionTransform}>
              {children}
            </MantineProvider>
          </MantineEmotionProvider>
        </RootStyleRegistry>
      </body>
    </html>
  );
}
```

Done! You can now use `sx`, `styles` props and `createStyles` in your application.
Note that `'use client'` is required in most components that use `sx`, `styles` or `createStyles`:

```tsx
'use client';

import { Box } from '@mantine/core';

export default function HomePage() {
  return (
    <Box
      sx={(theme, u) => ({
        padding: 40,

        [u.light]: {
          backgroundColor: theme.colors.blue[0],
          color: theme.colors.blue[9],

          '&:hover': {
            backgroundColor: theme.colors.blue[1],
          },
        },
      })}
    >
      Box with emotion sx prop
    </Box>
  );
}
```

## sx prop

With the setup above you can use `sx` prop in all Mantine components.
`sx` prop allows adding styles to the root element of the component.
It accepts either a styles object or a function that receives theme, utilities and returns styles object:

```tsx
import { Box, Button } from '@mantine/core';

function Demo() {
  return (
    <>
      <Box
        sx={{
          padding: 40,
          '&:hover': { padding: 80 },
        }}
      >
        Box with object sx
      </Box>

      <Button
        sx={(theme, u) => ({
          padding: 10,

          [u.light]: {
            backgroundColor: theme.colors.blue[0],
            color: theme.colors.blue[9],
            '&:hover': {
              backgroundColor: theme.colors.blue[1],
            },
          },

          [u.dark]: {
            backgroundColor: theme.colors.blue[9],
            color: theme.colors.blue[0],
            '&:hover': {
              backgroundColor: theme.colors.blue[8],
            },
          },
        })}
      >
        Button with function sx
      </Button>
    </>
  );
}
```