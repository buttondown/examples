// Auto-generated context file based on bootstrap-data
// Generated at: 2025-06-29T17:06:13.477Z

export interface FormField {
  name: string;
  type?: string;
  required?: boolean;
}

export interface Dependencies {
  css: string[];
  scripts: string[];
}

export interface ExampleMetadata {
  title: string;
  filename: string;
  usesReact: boolean;
  buttondownAction: string | null;
  dependencies: Dependencies;
  formFields: string[];
  size: number;
}

export interface Framework {
  name: string;
  displayName: string;
  description: string;
  features: string[];
  examples: ExampleMetadata[];
  totalExamples: number;
  hasReadme: boolean;
}

export interface ProjectSummary {
  totalFrameworks: number;
  totalExamples: number;
  supportedFrameworks: string[];
}

export interface ProjectInfo {
  name: string;
  description: string;
  type: string;
}

export interface BootstrapData {
  generated: string;
  version: string;
  project: ProjectInfo;
  frameworks: Framework[];
  summary: ProjectSummary;
}

// Bootstrap data import
export const bootstrapData: BootstrapData = require('./bootstrap-data.json');

// Helper functions
export function getFramework(name: string): Framework | undefined {
  return bootstrapData.frameworks.find(fw => fw.name === name);
}

export function getFrameworkByDisplayName(displayName: string): Framework | undefined {
  return bootstrapData.frameworks.find(fw => fw.displayName === displayName);
}

export function getAllExamples(): ExampleMetadata[] {
  return bootstrapData.frameworks.flatMap(fw => fw.examples);
}

export function getExamplesByFramework(frameworkName: string): ExampleMetadata[] {
  const framework = getFramework(frameworkName);
  return framework ? framework.examples : [];
}

export function getReactExamples(): ExampleMetadata[] {
  return getAllExamples().filter(example => example.usesReact);
}

export function getVanillaExamples(): ExampleMetadata[] {
  return getAllExamples().filter(example => !example.usesReact);
}

export function getFrameworkNames(): string[] {
  return bootstrapData.frameworks.map(fw => fw.name);
}

export function getFrameworkDisplayNames(): string[] {
  return bootstrapData.frameworks.map(fw => fw.displayName);
}

// Constants
export const FRAMEWORK_NAMES = getFrameworkNames();
export const FRAMEWORK_DISPLAY_NAMES = getFrameworkDisplayNames();
export const TOTAL_FRAMEWORKS = bootstrapData.summary.totalFrameworks;
export const TOTAL_EXAMPLES = bootstrapData.summary.totalExamples;

// Export default
export default bootstrapData;
