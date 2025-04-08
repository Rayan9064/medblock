# Doctor Dashboard Components

## Overview

The Doctor Dashboard provides medical professionals with a secure interface to access and view authorized patient records, manage permissions, and verify medical record authenticity through NFTs.

## Core Components

### 1. Navigation Bar (`DoctorDashboard/Navbar.tsx`)

Custom navigation component for the doctor's interface.

#### Features
- Wallet connection status
- Profile information
- Quick access menu
- Notification center

#### Implementation
```typescript
interface NavbarProps {
  doctorName: string;
  notificationCount: number;
}
```

### 2. Patient Records List

Displays all accessible medical records from authorized patients.

#### Features
- Patient grouping
- Record categorization
- Access status indicators
- Quick filters

#### Implementation
```typescript
interface PatientRecordProps {
  records: Array<{
    patientName: string;
    recordType: string;
    date: string;
    status: 'new' | 'viewed' | 'shared';
    nftAddress: string;
  }>;
  onRecordSelect: (record: Record) => void;
}
```

### 3. Record Viewer

Specialized component for viewing medical records with professional tools.

#### Features
- High-quality PDF rendering
- Medical image viewer
- Annotation tools
- Report comparison

#### Props
```typescript
interface RecordViewerProps {
  record: {
    fileUrl: string;
    fileType: string;
    metadata: {
      patientName: string;
      date: string;
      type: string;
      notes: string;
    };
    nftInfo: {
      address: string;
      timestamp: string;
    };
  };
  onAnnotate: (annotation: Annotation) => void;
}
```

### 4. Access Request Manager

Handles patient record access requests and permissions.

#### Features
- Request submission
- Status tracking
- Permission duration
- Access history

#### Implementation
```typescript
interface AccessRequestProps {
  patientAddress: string;
  requestType: 'temporary' | 'permanent';
  duration?: number; // in days
  purpose: string;
}
```

### 5. Patient Search

Advanced search functionality for finding patient records.

#### Features
- Patient wallet lookup
- Record type filtering
- Date range selection
- Status filtering

```typescript
interface SearchConfig {
  searchTerm: string;
  filters: {
    dateRange?: DateRange;
    recordTypes?: string[];
    status?: RecordStatus[];
  };
  sorting?: {
    field: string;
    direction: 'asc' | 'desc';
  };
}
```

## State Management

### Access Control State
```typescript
// Record access states
const [accessibleRecords, setAccessibleRecords] = useState<Record[]>([]);
const [pendingRequests, setPendingRequests] = useState<Request[]>([]);

// Permission states
const [activePermissions, setActivePermissions] = useState<Permission[]>([]);
```

### View States
```typescript
// Record viewing states
const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
const [viewerMode, setViewerMode] = useState<'simple' | 'detailed'>('simple');
```

## Event Handlers

### Record Access
```typescript
const requestAccess = async (patientAddress: string) => {
  try {
    const request = await accessControlService.requestAccess({
      doctorAddress: wallet.publicKey.toString(),
      patientAddress,
      purpose: requestPurpose
    });
    
    setPendingRequests(prev => [...prev, request]);
    toast.success('Access request sent');
  } catch (error) {
    toast.error('Failed to send request');
  }
};
```

### Record Viewing
```typescript
const handleRecordView = async (record: Record) => {
  try {
    // Log access
    await logRecordAccess(record.nftAddress);
    
    // Update viewing state
    setSelectedRecord(record);
    setViewerMode('detailed');
    
    // Mark as viewed
    updateRecordStatus(record.id, 'viewed');
  } catch (error) {
    handleError(error);
  }
};
```

## User Interface States

### Loading States
```typescript
interface LoadingState {
  records: boolean;
  permissions: boolean;
  viewer: boolean;
}

const [loadingStates, setLoadingStates] = useState<LoadingState>({
  records: false,
  permissions: false,
  viewer: false
});
```

### Error States
```typescript
interface ErrorState {
  type: 'access' | 'network' | 'blockchain';
  message: string;
  retryAction?: () => void;
}

const [errors, setErrors] = useState<ErrorState[]>([]);
```

## Component Integration

### Record List with Viewer
```typescript
function RecordManagement() {
  return (
    <div className="flex h-full">
      <div className="w-1/3 border-r">
        <PatientRecordsList
          records={accessibleRecords}
          onSelect={handleRecordSelect}
        />
      </div>
      <div className="w-2/3">
        <RecordViewer
          record={selectedRecord}
          mode={viewerMode}
          onAnnotate={handleAnnotation}
        />
      </div>
    </div>
  );
}
```

### Access Request Flow
```typescript
function AccessRequestFlow() {
  return (
    <div>
      <AccessRequestForm
        onSubmit={handleAccessRequest}
        loading={loadingStates.permissions}
      />
      <PendingRequestsList
        requests={pendingRequests}
        onCancel={handleRequestCancel}
      />
      <ActivePermissionsList
        permissions={activePermissions}
        onRevoke={handlePermissionRevoke}
      />
    </div>
  );
}
```

## Styling Guidelines

### Professional Theme
```typescript
const doctorTheme = {
  colors: {
    primary: 'indigo',
    accent: 'teal',
    background: 'slate',
  },
  components: {
    viewer: {
      toolbar: 'bg-slate-800',
      content: 'bg-white shadow-lg',
    },
    records: {
      list: 'divide-y divide-gray-200',
      item: 'hover:bg-slate-50',
    }
  }
};
```

## Best Practices

### 1. Data Handling
- Secure patient data access
- Encryption in transit
- Proper error handling
- Data validation

### 2. Performance
- Efficient record loading
- Optimized viewer
- Cached permissions
- Background updates

### 3. User Experience
- Clear access status
- Intuitive navigation
- Quick actions
- Responsive design

## Security Considerations

### 1. Access Control
- Wallet verification
- Permission validation
- Access logging
- Timeout handling

### 2. Data Protection
- Secure viewing
- No local storage
- Session management
- Audit trail

### 3. Professional Standards
- HIPAA compliance
- Data privacy
- Ethical guidelines
- Professional conduct

## Error Recovery

### Network Issues
```typescript
const handleNetworkError = async (error: Error) => {
  // Log error
  console.error('Network error:', error);
  
  // Update UI
  setErrors(prev => [...prev, {
    type: 'network',
    message: 'Connection lost. Retrying...',
    retryAction: () => refreshData()
  }]);
  
  // Attempt recovery
  await retryOperation();
};
```

### Permission Errors
```typescript
const handlePermissionError = (error: Error) => {
  toast.error('Access denied. Please request permission.');
  
  // Clear invalid access
  clearInvalidAccess();
  
  // Redirect to request form
  router.push('/doctor/request-access');
};
```