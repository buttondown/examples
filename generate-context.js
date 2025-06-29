#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script to generate bootstrap-data.json and context.ts based on UI framework examples
 */

// Configuration
const FRAMEWORKS_DIR = '.';
const OUTPUT_BOOTSTRAP_DATA = 'bootstrap-data.json';
const OUTPUT_CONTEXT_TS = 'context.ts';

// Framework directories to scan
const FRAMEWORK_DIRS = ['daisyui', 'mantine', 'shadcn', 'alpinejs'];

/**
 * Extract metadata from HTML file
 */
function extractHtmlMetadata(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extract title
    const titleMatch = content.match(/<title>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : path.basename(filePath, '.html');
    
    // Extract form action (Buttondown API endpoint)
    const actionMatch = content.match(/action=["'](.*?)["']/i);
    const buttondownAction = actionMatch ? actionMatch[1] : null;
    
    // Check if it uses React
    const usesReact = content.includes('react') || content.includes('React');
    
    // Extract CSS/framework dependencies
    const cssLinks = [...content.matchAll(/<link[^>]+href=["'](.*?)["'][^>]*>/gi)]
      .map(match => match[1])
      .filter(href => href.includes('css') || href.includes('style'));
    
    // Extract script dependencies
    const scriptSrcs = [...content.matchAll(/<script[^>]+src=["'](.*?)["'][^>]*>/gi)]
      .map(match => match[1]);
    
    // Detect form fields
    const inputs = [...content.matchAll(/<input[^>]+name=["'](.*?)["'][^>]*>/gi)]
      .map(match => match[1]);
    
    return {
      title,
      filename: path.basename(filePath),
      usesReact,
      buttondownAction,
      dependencies: {
        css: cssLinks,
        scripts: scriptSrcs
      },
      formFields: inputs,
      size: fs.statSync(filePath).size
    };
  } catch (error) {
    console.warn(`Error extracting metadata from ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Extract framework information from directory
 */
function extractFrameworkInfo(frameworkDir) {
  const frameworkPath = path.join(FRAMEWORKS_DIR, frameworkDir);
  
  if (!fs.existsSync(frameworkPath)) {
    return null;
  }
  
  const files = fs.readdirSync(frameworkPath);
  const htmlFiles = files.filter(file => file.endsWith('.html'));
  const readmeFile = files.find(file => file.toLowerCase() === 'readme.md');
  
  // Extract README content
  let description = '';
  let features = [];
  if (readmeFile) {
    try {
      const readmeContent = fs.readFileSync(path.join(frameworkPath, readmeFile), 'utf8');
      
      // Extract description (first paragraph after title)
      const descMatch = readmeContent.match(/^#[^\n]*\n\n([^\n]+)/m);
      description = descMatch ? descMatch[1] : '';
      
      // Extract features section
      const featuresMatch = readmeContent.match(/## Features\n\n((?:- .*\n?)+)/);
      if (featuresMatch) {
        features = featuresMatch[1]
          .split('\n')
          .filter(line => line.startsWith('- '))
          .map(line => line.substring(2).trim());
      }
    } catch (error) {
      console.warn(`Error reading README for ${frameworkDir}:`, error.message);
    }
  }
  
  // Extract HTML file metadata
  const examples = htmlFiles
    .map(file => extractHtmlMetadata(path.join(frameworkPath, file)))
    .filter(metadata => metadata !== null);
  
  return {
    name: frameworkDir,
    displayName: frameworkDir.charAt(0).toUpperCase() + frameworkDir.slice(1),
    description,
    features,
    examples,
    totalExamples: examples.length,
    hasReadme: !!readmeFile
  };
}

/**
 * Generate bootstrap data
 */
function generateBootstrapData() {
  const frameworks = FRAMEWORK_DIRS
    .map(dir => extractFrameworkInfo(dir))
    .filter(framework => framework !== null);
  
  const bootstrapData = {
    generated: new Date().toISOString(),
    version: '1.0.0',
    project: {
      name: 'Buttondown UI Framework Examples',
      description: 'Newsletter subscription form examples for different UI frameworks',
      type: 'ui-examples'
    },
    frameworks,
    summary: {
      totalFrameworks: frameworks.length,
      totalExamples: frameworks.reduce((sum, fw) => sum + fw.totalExamples, 0),
      supportedFrameworks: frameworks.map(fw => fw.name)
    }
  };
  
  return bootstrapData;
}

/**
 * Generate TypeScript context file
 */
function generateContextTs(bootstrapData) {
  return `// Auto-generated context file based on bootstrap-data
// Generated at: ${bootstrapData.generated}

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
`;
}

/**
 * Main execution
 */
function main() {
  console.log('🚀 Generating bootstrap data and context...');
  
  try {
    // Generate bootstrap data
    const bootstrapData = generateBootstrapData();
    
    // Write bootstrap-data.json
    fs.writeFileSync(OUTPUT_BOOTSTRAP_DATA, JSON.stringify(bootstrapData, null, 2));
    console.log(`✅ Generated ${OUTPUT_BOOTSTRAP_DATA}`);
    
    // Generate and write context.ts
    const contextContent = generateContextTs(bootstrapData);
    fs.writeFileSync(OUTPUT_CONTEXT_TS, contextContent);
    console.log(`✅ Generated ${OUTPUT_CONTEXT_TS}`);
    
    // Print summary
    console.log('\n📊 Summary:');
    console.log(`   Frameworks: ${bootstrapData.summary.totalFrameworks}`);
    console.log(`   Examples: ${bootstrapData.summary.totalExamples}`);
    console.log(`   Supported: ${bootstrapData.summary.supportedFrameworks.join(', ')}`);
    
  } catch (error) {
    console.error('❌ Error generating files:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { generateBootstrapData, generateContextTs };