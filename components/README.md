# ElectroPhobia UI Components

## Toast Notifications

Beautiful animated toast notifications with electric theme matching your site's design.

### Features
- ✨ Smooth animations with spring physics
- ⚡ Electric shimmer effect
- 🎨 Multiple types: success, error, info, warning
- ⏱️ Auto-dismiss with progress bar
- 🎯 Customizable duration
- 📱 Fully responsive

### Usage

```tsx
import Toast from '@/components/Toast'
import { useToast } from '@/lib/useToast'

function MyComponent() {
  const { toast, showToast, hideToast } = useToast()

  const handleAction = () => {
    // Show success toast
    showToast('Project updated successfully!', 'success')
    
    // Show error toast
    showToast('Failed to save changes', 'error')
  }

  return (
    <>
      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={hideToast}
      />
      {/* Your component content */}
    </>
  )
}
```

### Props

- `message` (string): The message to display
- `type` ('success' | 'error' | 'info' | 'warning'): Toast type
- `duration` (number): Auto-dismiss duration in ms (default: 3000)
- `isVisible` (boolean): Controls visibility
- `onClose` (function): Callback when toast closes

---

## Loading Spinner

Electric-themed loading spinner with animated bolt and particles.

### Features
- ⚡ Electric bolt animation
- ✨ Pulsing rings and glow effects
- 💫 Floating particles
- 📏 Multiple sizes: sm, md, lg
- 🎨 Matches your primary color (#22C0B3)
- 📝 Customizable loading text

### Usage

```tsx
import LoadingSpinner from '@/components/LoadingSpinner'

// Basic usage
<LoadingSpinner />

// With custom message
<LoadingSpinner message="Loading experiences" />

// Different sizes
<LoadingSpinner message="Loading project" size="lg" />
```

### Props

- `message` (string): Loading message (default: "Loading...")
- `size` ('sm' | 'md' | 'lg'): Spinner size (default: 'md')

### Size Reference

- **sm**: 12x12 spinner, good for inline loading
- **md**: 20x20 spinner, good for sections
- **lg**: 32x32 spinner, good for full-page loading

---

## Implementation Examples

### Full Page Loading

```tsx
if (loading) {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <LoadingSpinner message="Loading dashboard" size="lg" />
    </div>
  )
}
```

### Section Loading

```tsx
if (loading) {
  return (
    <div className="flex justify-center py-8">
      <LoadingSpinner message="Loading projects" size="md" />
    </div>
  )
}
```

### Form Submission with Toast

```tsx
const handleSubmit = async (e) => {
  e.preventDefault()
  setSaving(true)

  try {
    await api.update(data)
    showToast('Changes saved successfully!', 'success')
    setTimeout(() => router.push('/dashboard'), 1500)
  } catch (error) {
    showToast('Failed to save changes', 'error')
  } finally {
    setSaving(false)
  }
}
```

---

## Design Philosophy

These components are designed to match the ElectroPhobia brand:

- **Color**: Primary teal (#22C0B3) for electric feel
- **Motion**: Spring-based animations for natural movement
- **Theme**: Electric/tech aesthetic with bolts and particles
- **Accessibility**: Keyboard navigable and screen-reader friendly
- **Performance**: Optimized animations with GPU acceleration

---

## Migration from Alerts

### Before
```tsx
alert('Project updated successfully!')
```

### After
```tsx
showToast('Project updated successfully!', 'success')
```

### Benefits
- Non-blocking UI
- Better user experience
- Consistent design
- More professional appearance
- Accessible and responsive
