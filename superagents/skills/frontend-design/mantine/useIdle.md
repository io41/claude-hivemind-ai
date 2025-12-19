# Mantine: useIdle

Package: @mantine/hooks
Import: import { UseIdle } from '@mantine/hooks';

## Usage

`use-idle` detects if user does nothing for a given time in ms:



## Custom events

By default, the hook will listen to `keypress`, `mousemove`, `touchmove`, `wheel`, `click` and `scroll` events to set idle status.
To change that, provide a list of events in the `options` argument:



## Initial state

By default, the hook will return an idle state.
To change that, provide an initial state value in the `options` argument: