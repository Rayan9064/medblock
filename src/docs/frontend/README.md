# MedBlock Frontend Documentation

## Overview

MedBlock's frontend is built with Next.js 14, TypeScript, and Tailwind CSS. It implements a responsive, modern UI with blockchain wallet integration and theme customization.

## Core Technologies

- **Next.js 14**: React framework with server-side rendering
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: UI component library
- **Solana Wallet Adapter**: Blockchain wallet integration

## Project Structure

```
src/app/
├── components/         # Reusable components
│   ├── ui/            # UI components (shadcn/ui)
│   ├── DoctorDashboard/
│   └── PatientDashboard/
├── hooks/             # Custom React hooks
├── lib/              # Utility functions
└── services/         # Backend service integrations
```

## Core Providers

### 1. AppWalletProvider

The `AppWalletProvider` manages Solana wallet connections and interactions.

```typescript
// Key Features:
- Solana devnet connection
- Multiple wallet support (Phantom, Solflare)
- Automatic wallet connection
- Wallet modal integration
```

### 2. ThemeProvider

Handles dark/light theme switching using next-themes.

```typescript
// Features:
- System theme detection
- Theme persistence
- Hydration handling
- CSS class-based theming
```

## Page Structure

### 1. Landing Page (`/`)
- Hero section
- Features
- Use cases
- FAQ
- Testimonials

### 2. Patient Dashboard (`/patient`)
- Medical record management
- Report uploading
- Doctor access control
- NFT viewing

### 3. Doctor Dashboard (`/doctor`)
- Patient records access
- Report viewing
- Medical record verification

## Components

### Common UI Components
- Buttons (standard, colorful, neon)
- Forms
- Cards
- Dialogs
- Navigation menus
- Tables
- Theme toggle

### Dashboard Components

#### Patient Dashboard
1. **UploadDialog**
   - File upload interface
   - Metadata input
   - NFT minting progress

2. **ViewReportDialog**
   - Medical record display
   - PDF viewer
   - NFT information

3. **DoctorAccess**
   - Permission management
   - Doctor authorization
   - Access revocation

#### Doctor Dashboard
1. **PatientRecords**
   - Record listing
   - Search functionality
   - Access requests

## Styling

### Theme Configuration
```typescript
// Customization options:
- Light/dark mode
- System theme preference
- Custom color schemes
- Font families (Geist Sans, Geist Mono)
```

### Tailwind Configuration
- Custom color palette
- Responsive breakpoints
- Component variants
- Animation utilities

## State Management

### Wallet State
- Connection status
- Wallet address
- Transaction handling
- Network status

### Theme State
- Current theme
- Theme preferences
- Color scheme
- System preferences

## Hooks

### 1. use-mobile
```typescript
// Features:
- Responsive design detection
- Mobile-specific functionality
- Device-based optimizations
```

### 2. use-toast
```typescript
// Features:
- Notification system
- Success/error messages
- Transaction confirmations
```

## Error Handling

### Client-Side Errors
1. Wallet Connection
   - Connection failures
   - Network issues
   - Transaction errors

2. File Operations
   - Upload failures
   - Format validation
   - Size limitations

3. UI State
   - Loading states
   - Error boundaries
   - Fallback UI

## Security Considerations

1. **Wallet Integration**
   - Secure connection handling
   - Transaction signing
   - Address validation

2. **File Handling**
   - Client-side validation
   - Secure upload process
   - Format restrictions

3. **Access Control**
   - Role-based access
   - Permission validation
   - Session management

## Performance Optimizations

1. **Image Optimization**
   - Next.js Image component
   - Lazy loading
   - Proper sizing

2. **Code Splitting**
   - Dynamic imports
   - Route-based splitting
   - Component lazy loading

3. **State Management**
   - Efficient updates
   - Memoization
   - Render optimization

## Best Practices

1. **Component Design**
   - Single responsibility
   - Proper prop typing
   - Error boundary usage
   - Accessibility compliance

2. **State Management**
   - Controlled components
   - State colocation
   - Context optimization
   - Props drilling avoidance

3. **Performance**
   - Bundle optimization
   - Asset optimization
   - Render optimization
   - Cache utilization

## Development Guidelines

1. **TypeScript**
   - Strict type checking
   - Interface definitions
   - Type exports
   - Generic components

2. **Component Structure**
   - Logical grouping
   - Clear naming
   - Proper documentation
   - Test coverage

3. **Styling**
   - Tailwind classes
   - Component variants
   - Theme consistency
   - Responsive design

## Usage Examples

### Wallet Integration
```typescript
// Inside a component
const { wallet, connected } = useWallet();
const connect = async () => {
  try {
    await wallet.connect();
  } catch (error) {
    toast.error("Failed to connect wallet");
  }
};
```

### Theme Toggle
```typescript
// Using theme hooks
const { theme, setTheme } = useTheme();
const toggleTheme = () => {
  setTheme(theme === 'dark' ? 'light' : 'dark');
};
```

### File Upload
```typescript
// Upload dialog usage
<UploadDialog
  onUpload={async (file) => {
    try {
      await uploadMedicalRecord(file);
      toast.success("File uploaded successfully");
    } catch (error) {
      toast.error("Upload failed");
    }
  }}
/>
```