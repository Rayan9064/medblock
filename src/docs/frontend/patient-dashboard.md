# Patient Dashboard Components

## Overview

The Patient Dashboard provides a comprehensive interface for patients to manage their medical records, control access permissions, and view their NFT-based documents.

## Core Components

### 1. Upload Dialog (`UploadDialog.tsx`)

A modal component for uploading new medical records.

#### Props
```typescript
interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
```

#### Features
- File upload with drag-and-drop support
- Metadata input form
  - Report name
  - Doctor information
  - Report type
  - Date selection
- Progress indication
- Error handling
- Success confirmation

#### Usage
```typescript
<UploadDialog 
  open={dialogOpen} 
  onOpenChange={setDialogOpen} 
/>
```

### 2. View Report Dialog (`ViewReportDialog.tsx`)

Modal for displaying medical records and their associated NFT information.

#### Props
```typescript
interface ViewReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: {
    name: string;
    doctor: string;
    date: string;
    nftAddress: string;
    fileUrl: string;
  };
}
```

#### Features
- PDF viewer integration
- NFT metadata display
- Download option
- Blockchain verification
- Share functionality

### 3. Doctor Access Component (`DoctorAccess.tsx`)

Manages doctor access permissions for medical records.

#### Features
- Doctor wallet address input
- Permission granting/revocation
- Access history
- Current access list
- Permission verification

### 4. Report Card (`ReportCard.tsx`)

Displays individual medical record information in a card format.

#### Props
```typescript
interface ReportCardProps {
  report: {
    name: string;
    doctor: string;
    date: string;
    image: string;
    nftAddress: string;
  };
  onView: () => void;
  onShare: () => void;
}
```

#### Features
- Thumbnail display
- Basic report information
- Quick actions
  - View
  - Share
  - Download
- NFT status indication

### 5. Search Bar (`SearchBar.tsx`)

Enables filtering and searching through medical records.

#### Features
- Full-text search
- Filter by:
  - Date range
  - Doctor
  - Report type
- Sort options
- Recent searches

### 6. Profile Form (`ProfileForm.tsx`)

Handles patient profile information and settings.

#### Features
- Personal information management
- Notification preferences
- Default sharing settings
- Wallet connection status

## State Management

### Local States
```typescript
// Upload Dialog State
const [uploadProgress, setUploadProgress] = useState(0);
const [uploadStep, setUploadStep] = useState<
  'initial' | 'uploading' | 'minting' | 'complete'
>('initial');

// Report Viewing State
const [selectedReport, setSelectedReport] = useState<Report | null>(null);
const [viewerOpen, setViewerOpen] = useState(false);

// Access Control State
const [authorizedDoctors, setAuthorizedDoctors] = useState<string[]>([]);
```

## Event Handling

### File Upload
```typescript
const handleFileUpload = async (file: File) => {
  try {
    setUploadStep('uploading');
    const ipfsHash = await uploadToIPFS(file);
    
    setUploadStep('minting');
    const nft = await mintMedicalNFT({
      reportName: file.name,
      ipfsHash,
      // ... other metadata
    });
    
    setUploadStep('complete');
    onSuccess(nft);
  } catch (error) {
    handleError(error);
  }
};
```

### Access Management
```typescript
const grantAccess = async (doctorAddress: string) => {
  try {
    await accessControlService.grantAccess({
      reportId,
      doctorAddress,
      patientAddress: wallet.publicKey.toString()
    });
    updateAuthorizedDoctors();
  } catch (error) {
    handleError(error);
  }
};
```

## Styling

### Component Themes
```typescript
// Card styling
const cardStyles = {
  base: "rounded-lg border bg-card text-card-foreground shadow-sm",
  hover: "hover:shadow-md transition-shadow duration-200",
  selected: "ring-2 ring-primary",
};

// Dialog styling
const dialogStyles = {
  overlay: "bg-background/80 backdrop-blur-sm",
  content: "sm:max-w-[425px]",
};
```

## Error Handling

### Upload Errors
- File size validation
- Format verification
- Network issues
- Blockchain errors

### Access Control Errors
- Invalid wallet addresses
- Network failures
- Permission conflicts
- Transaction errors

## Best Practices

### 1. Performance
- Lazy loading of PDFs
- Image optimization
- Debounced search
- Pagination implementation

### 2. Security
- Client-side validation
- Secure file handling
- Permission verification
- Error sanitization

### 3. UX/UI
- Loading states
- Error messages
- Success feedback
- Progress indication

## Integration Examples

### 1. Implementing Upload Flow
```typescript
function UploadSection() {
  const handleUpload = async (file: File) => {
    try {
      // Show upload dialog
      setDialogOpen(true);
      
      // Handle file upload
      await handleFileUpload(file);
      
      // Update UI
      refreshReports();
      toast.success("Report uploaded successfully");
    } catch (error) {
      toast.error("Upload failed");
    }
  };
  
  return (
    <div>
      <FileInput onFileSelected={handleUpload} />
      <UploadDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
```

### 2. Managing Doctor Access
```typescript
function AccessControl() {
  const handleAccessChange = async (doctorAddress: string, grant: boolean) => {
    try {
      if (grant) {
        await grantAccess(doctorAddress);
        toast.success("Access granted");
      } else {
        await revokeAccess(doctorAddress);
        toast.success("Access revoked");
      }
    } catch (error) {
      toast.error("Failed to update access");
    }
  };
  
  return (
    <DoctorAccess
      authorizedDoctors={authorizedDoctors}
      onAccessChange={handleAccessChange}
    />
  );
}
```