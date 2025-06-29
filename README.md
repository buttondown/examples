# Bootstrap Data Generator

A script to automatically generate `bootstrap-data.json` and `context.ts` files based on UI framework examples in this workspace.

## Overview

This script scans the workspace for UI framework examples and extracts metadata to create:

1. **`bootstrap-data.json`** - Structured data containing information about all frameworks and examples
2. **`context.ts`** - TypeScript context file with interfaces and helper functions

## Generated Files

### bootstrap-data.json

Contains structured metadata about:
- Framework information (name, description, features)
- Example metadata (dependencies, form fields, file size)
- Project summary statistics

### context.ts

Provides:
- TypeScript interfaces for type safety
- Helper functions for data access
- Constants and utilities
- Default export of bootstrap data

## Usage

### Quick Start

```bash
# Run the generator
npm run generate

# Or run directly
node generate-context.js

# Or make executable and run
chmod +x generate-context.js
./generate-context.js
```

### Using Generated Context

```typescript
import { 
  bootstrapData, 
  getFramework, 
  getAllExamples,
  getReactExamples 
} from './context';

// Get all frameworks
console.log(bootstrapData.frameworks);

// Get specific framework
const daisyui = getFramework('daisyui');

// Get React-based examples
const reactExamples = getReactExamples();

// Get framework statistics
console.log(`Total frameworks: ${bootstrapData.summary.totalFrameworks}`);
console.log(`Total examples: ${bootstrapData.summary.totalExamples}`);
```

## What It Scans

The script automatically detects and processes:

- **Framework directories**: `daisyui/`, `mantine/`, `shadcn/`, `alpinejs/`
- **HTML examples**: Extracts titles, dependencies, form fields
- **README files**: Parses descriptions and features
- **Dependencies**: CSS and JavaScript CDN links
- **Form metadata**: Input fields and Buttondown integration

## Features Extracted

For each framework example:
- ✅ Page title and filename
- ✅ React usage detection
- ✅ Buttondown API endpoints
- ✅ CSS and script dependencies
- ✅ Form field names
- ✅ File size information
- ✅ Framework features from README

## Project Structure

```
workspace/
├── daisyui/
│   ├── basic.html
│   ├── dropdown.html
│   └── README.md
├── mantine/
│   ├── basic.html
│   └── README.md
├── shadcn/
│   ├── basic.html
│   ├── dropdown.html
│   └── README.md
├── alpinejs/
│   ├── index.html
│   └── README.md
├── generate-context.js    # The generator script
├── bootstrap-data.json    # Generated data (output)
├── context.ts            # Generated context (output)
└── package.json          # Script configuration
```

## Generated Data Structure

```typescript
interface BootstrapData {
  generated: string;           // Timestamp
  version: string;            // Version number
  project: ProjectInfo;       // Project metadata
  frameworks: Framework[];    // All framework data
  summary: ProjectSummary;    // Statistics
}
```

## Helper Functions Available

| Function | Description |
|----------|-------------|
| `getFramework(name)` | Get framework by name |
| `getFrameworkByDisplayName(name)` | Get framework by display name |
| `getAllExamples()` | Get all examples across frameworks |
| `getExamplesByFramework(name)` | Get examples for specific framework |
| `getReactExamples()` | Get only React-based examples |
| `getVanillaExamples()` | Get only vanilla JS examples |
| `getFrameworkNames()` | Get array of framework names |
| `getFrameworkDisplayNames()` | Get array of display names |

## Constants Available

```typescript
export const FRAMEWORK_NAMES: string[];
export const FRAMEWORK_DISPLAY_NAMES: string[];
export const TOTAL_FRAMEWORKS: number;
export const TOTAL_EXAMPLES: number;
```

## Regenerating Data

The script can be run anytime to regenerate the files with updated information:

```bash
# After adding new examples or modifying READMEs
npm run generate
```

The generated files will include:
- Updated timestamps
- New examples detected
- Modified framework information
- Updated statistics

## Requirements

- Node.js 14.0.0 or higher
- Read access to framework directories
- Write access to workspace root

## Script Customization

To modify what gets extracted, edit `generate-context.js`:

- **Add new frameworks**: Update `FRAMEWORK_DIRS` array
- **Change output files**: Modify `OUTPUT_BOOTSTRAP_DATA` and `OUTPUT_CONTEXT_TS`
- **Add metadata extraction**: Extend `extractHtmlMetadata()` function
- **Modify TypeScript types**: Update `generateContextTs()` function

## Error Handling

The script includes error handling for:
- Missing directories or files
- Malformed HTML content
- README parsing issues
- File system permission errors

Warnings are logged for non-critical issues, while critical errors will stop execution.