# Telegram Mini App Skill

## When to Use
- Building Telegram Mini Apps (TWA/TMA)
- Preact-based Telegram frontends
- Telegram-native UI patterns
- Platform integration (back button, main button, etc.)

## Technology Stack
- **@tma.js/sdk-react** - TMA SDK with React/Preact hooks
- **Preact** - Lightweight React alternative
- **@preact/signals** - State management

## Setup

```bash
pnpm add @tma.js/sdk-react preact @preact/signals
```

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

export default defineConfig({
  plugins: [preact()],
  resolve: {
    alias: {
      'react': 'preact/compat',
      'react-dom': 'preact/compat'
    }
  }
})
```

## Initialization

```tsx
import { init, backButton, mainButton, viewport, themeParams } from '@tma.js/sdk-react'

// Initialize SDK (call once at app start)
function initTMA() {
  try {
    init()

    // Mount components you'll use
    backButton.mount()
    mainButton.mount()
    viewport.mount()
    themeParams.mount()

    // Expand viewport
    viewport.expand()
  } catch (e) {
    console.error('TMA init failed:', e)
  }
}

// In your App
function App() {
  useEffect(() => {
    initTMA()
  }, [])

  return <MainContent />
}
```

## Launch Parameters

```tsx
import { useLaunchParams, useRawInitData } from '@tma.js/sdk-react'

function UserInfo() {
  // Get parsed launch params
  const params = useLaunchParams(true) // true = camelCase keys

  // Access user data
  const { initData } = params
  const user = initData?.user

  return (
    <div>
      <p>User: {user?.firstName} {user?.lastName}</p>
      <p>User ID: {user?.id}</p>
      <p>Language: {user?.languageCode}</p>
      <p>Premium: {user?.isPremium ? 'Yes' : 'No'}</p>
    </div>
  )
}
```

## Signal-Based Reactivity

```tsx
import { useSignal } from '@tma.js/sdk-react'
import { backButton, mainButton, themeParams } from '@tma.js/sdk-react'

function Component() {
  // Reactive to signal changes
  const isBackVisible = useSignal(backButton.isVisible)
  const mainButtonText = useSignal(mainButton.text)
  const bgColor = useSignal(themeParams.backgroundColor)

  return (
    <div style={{ background: bgColor }}>
      {isBackVisible && <span>Back button visible</span>}
      <p>Main button: {mainButtonText}</p>
    </div>
  )
}
```

## Back Button

```tsx
import { backButton } from '@tma.js/sdk-react'

function Page() {
  useEffect(() => {
    // Show back button
    backButton.show()

    // Handle click
    const off = backButton.onClick(() => {
      // Navigate back
      history.back()
    })

    return () => {
      off() // Remove listener
      backButton.hide()
    }
  }, [])

  return <Content />
}
```

## Main Button

```tsx
import { mainButton } from '@tma.js/sdk-react'

function CheckoutPage() {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Configure button
    mainButton.setText('Checkout $99')
    mainButton.setBackgroundColor('#007AFF')
    mainButton.show()

    const off = mainButton.onClick(async () => {
      mainButton.showProgress()
      setLoading(true)

      await processCheckout()

      mainButton.hideProgress()
      setLoading(false)
    })

    return () => {
      off()
      mainButton.hide()
    }
  }, [])

  return <CartItems />
}
```

## Theme Integration

```tsx
import { themeParams } from '@tma.js/sdk-react'
import { useSignal } from '@tma.js/sdk-react'

function ThemedApp() {
  const bgColor = useSignal(themeParams.backgroundColor)
  const textColor = useSignal(themeParams.textColor)
  const buttonColor = useSignal(themeParams.buttonColor)
  const buttonTextColor = useSignal(themeParams.buttonTextColor)
  const hintColor = useSignal(themeParams.hintColor)
  const linkColor = useSignal(themeParams.linkColor)
  const secondaryBg = useSignal(themeParams.secondaryBackgroundColor)

  return (
    <div style={{
      backgroundColor: bgColor,
      color: textColor,
      minHeight: '100vh'
    }}>
      <button style={{
        backgroundColor: buttonColor,
        color: buttonTextColor
      }}>
        Action
      </button>
      <span style={{ color: hintColor }}>Hint text</span>
    </div>
  )
}
```

## Viewport

```tsx
import { viewport } from '@tma.js/sdk-react'
import { useSignal } from '@tma.js/sdk-react'

function ResponsiveLayout() {
  const height = useSignal(viewport.height)
  const width = useSignal(viewport.width)
  const isExpanded = useSignal(viewport.isExpanded)
  const stableHeight = useSignal(viewport.stableHeight)

  useEffect(() => {
    // Expand to full height
    viewport.expand()
  }, [])

  return (
    <div style={{ height: stableHeight }}>
      {/* Use stableHeight to avoid layout jumps */}
      <Content />
    </div>
  )
}
```

## Haptic Feedback

```tsx
import { hapticFeedback } from '@tma.js/sdk-react'

function InteractiveButton({ onClick }) {
  const handleClick = () => {
    // Trigger haptic feedback
    hapticFeedback.impactOccurred('medium') // light | medium | heavy | rigid | soft

    onClick()
  }

  return <button onClick={handleClick}>Tap me</button>
}

// Other feedback types
hapticFeedback.notificationOccurred('success') // success | error | warning
hapticFeedback.selectionChanged()
```

## Cloud Storage

```tsx
import { cloudStorage } from '@tma.js/sdk-react'

async function useCloudStorage() {
  // Set value
  await cloudStorage.setItem('key', 'value')

  // Get value
  const value = await cloudStorage.getItem('key')

  // Get multiple
  const values = await cloudStorage.getItems(['key1', 'key2'])

  // Delete
  await cloudStorage.removeItem('key')

  // Get all keys
  const keys = await cloudStorage.getKeys()
}
```

## QR Scanner

```tsx
import { qrScanner } from '@tma.js/sdk-react'

function ScanButton() {
  const handleScan = async () => {
    try {
      const result = await qrScanner.open('Scan QR code')
      console.log('Scanned:', result)
    } catch (e) {
      // User cancelled or error
    }
  }

  return <button onClick={handleScan}>Scan QR</button>
}
```

## Invoice/Payments

```tsx
import { invoice } from '@tma.js/sdk-react'

async function handlePayment(invoiceUrl: string) {
  try {
    const result = await invoice.open(invoiceUrl)
    // result: 'paid' | 'cancelled' | 'failed' | 'pending'

    if (result === 'paid') {
      // Payment successful
    }
  } catch (e) {
    console.error('Payment error:', e)
  }
}
```

## Mini App Lifecycle

```tsx
import { miniApp } from '@tma.js/sdk-react'

function App() {
  useEffect(() => {
    // Signal app is ready
    miniApp.ready()

    // Close app programmatically
    // miniApp.close()

    // Open external link
    // miniApp.openLink('https://example.com')

    // Open Telegram link
    // miniApp.openTelegramLink('https://t.me/username')
  }, [])
}
```

## Platform Detection

```tsx
import { useAndroidDeviceData, useLaunchParams } from '@tma.js/sdk-react'

function PlatformAware() {
  const params = useLaunchParams(true)
  const androidData = useAndroidDeviceData()

  const platform = params.platform // 'android' | 'ios' | 'tdesktop' | etc.
  const isAndroid = platform === 'android'
  const isIOS = platform === 'ios'
  const isDesktop = platform === 'tdesktop' || platform === 'web'

  return (
    <div>
      {isAndroid && androidData && (
        <p>Android {androidData.model}</p>
      )}
    </div>
  )
}
```

## Navigation Pattern

```tsx
import { backButton } from '@tma.js/sdk-react'
import { useLocation, useNavigate } from 'your-router'

function NavigationHandler() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    // Show back button if not on home
    if (location.pathname !== '/') {
      backButton.show()
    } else {
      backButton.hide()
    }

    const off = backButton.onClick(() => {
      navigate(-1)
    })

    return () => off()
  }, [location.pathname])

  return null
}
```

## Best Practices

1. **Always call init() first** - Before using any SDK features
2. **Mount components before use** - Call `.mount()` on components you need
3. **Clean up listeners** - Return cleanup functions from `onClick` handlers
4. **Use stableHeight** - Prevents layout jumps when keyboard appears
5. **Expand viewport** - Call `viewport.expand()` for full-screen apps
6. **Handle errors** - TMA may not be available in dev/browser contexts
7. **Use signals for reactivity** - `useSignal()` for automatic updates

## Development Outside Telegram

```tsx
function App() {
  const [isTMA, setIsTMA] = useState(false)

  useEffect(() => {
    try {
      init()
      setIsTMA(true)
    } catch {
      // Not in Telegram context - use fallbacks
      setIsTMA(false)
    }
  }, [])

  if (!isTMA) {
    return <BrowserFallback />
  }

  return <TelegramApp />
}
```

## Related Skills
- `frontend-react` - React patterns
- `telegram-bot` - Grammy bot backend
- `api/trpc` - API communication
