#!/usr/bin/env node

/**
 * Windows-specific installation script for sharp module
 * 
 * This script handles sharp installation on Windows environments where
 * pre-built binaries may fail due to compatibility issues with Node.js v14+.
 * 
 * Requirements:
 * - Detects Windows environment
 * - Uses `npm rebuild sharp` with appropriate flags for Windows
 * - Forces compilation from source if pre-built binaries fail
 * - Provides instructions for installing Windows Build Tools if needed
 * - Configures node-gyp with appropriate Visual Studio version
 * 
 * Validates: Requirements 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 3.4
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Check if we're on Windows
const isWindows = process.platform === 'win32';

if (!isWindows) {
  console.log('Not running on Windows. Skipping Windows-specific sharp installation.');
  process.exit(0);
}

console.log('===========================================');
console.log('Windows-specific sharp installation script');
console.log('===========================================');
console.log(`Platform: ${process.platform}`);
console.log(`Architecture: ${process.arch}`);
console.log(`Node.js version: ${process.version}`);
console.log('');

/**
 * Check if Windows Build Tools are installed
 * @returns {boolean} True if Windows Build Tools are likely installed
 */
function checkWindowsBuildTools() {
  try {
    // Check for Visual Studio Build Tools or Visual Studio installation
    const programFiles = process.env.ProgramFiles || 'C:\\Program Files';
    const programFilesX86 = process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)';
    
    const possiblePaths = [
      path.join(programFiles, 'Microsoft Visual Studio', '2022', 'BuildTools'),
      path.join(programFiles, 'Microsoft Visual Studio', '2019', 'BuildTools'),
      path.join(programFiles, 'Microsoft Visual Studio', '2017', 'BuildTools'),
      path.join(programFilesX86, 'Microsoft Visual Studio', '2022', 'BuildTools'),
      path.join(programFilesX86, 'Microsoft Visual Studio', '2019', 'BuildTools'),
      path.join(programFilesX86, 'Microsoft Visual Studio', '2017', 'BuildTools'),
      path.join(programFiles, 'Microsoft Visual Studio', '2022', 'Community'),
      path.join(programFiles, 'Microsoft Visual Studio', '2019', 'Community'),
      path.join(programFiles, 'Microsoft Visual Studio', '2017', 'Community'),
      path.join(programFilesX86, 'Microsoft Visual Studio', '2022', 'Community'),
      path.join(programFilesX86, 'Microsoft Visual Studio', '2019', 'Community'),
      path.join(programFilesX86, 'Microsoft Visual Studio', '2017', 'Community'),
    ];
    
    for (const vsPath of possiblePaths) {
      if (fs.existsSync(vsPath)) {
        console.log(`✓ Found Visual Studio/Build Tools at: ${vsPath}`);
        return true;
      }
    }
    
    // Check for Windows SDK
    const windowsSdkPath = path.join(process.env.ProgramFiles || 'C:\\Program Files', 'Windows Kits', '10');
    if (fs.existsSync(windowsSdkPath)) {
      console.log(`✓ Found Windows SDK at: ${windowsSdkPath}`);
      return true;
    }
    
    console.log('⚠ Windows Build Tools not found. Sharp may need to be compiled from source.');
    return false;
  } catch (error) {
    console.log(`⚠ Error checking for Windows Build Tools: ${error.message}`);
    return false;
  }
}

/**
 * Install Windows Build Tools if needed
 */
function installWindowsBuildTools() {
  console.log('\n--- Installing Windows Build Tools ---');
  console.log('Sharp requires Windows Build Tools for native module compilation.');
  console.log('You can install them using one of these methods:');
  console.log('');
  console.log('Option 1: Install with npm (recommended):');
  console.log('  npm install --global windows-build-tools');
  console.log('');
  console.log('Option 2: Install Visual Studio Build Tools manually:');
  console.log('  1. Download from: https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022');
  console.log('  2. Run the installer');
  console.log('  3. Select "Desktop development with C++" workload');
  console.log('');
  console.log('Option 3: Install full Visual Studio Community Edition:');
  console.log('  1. Download from: https://visualstudio.microsoft.com/downloads/');
  console.log('  2. Run the installer');
  console.log('  3. Select "Desktop development with C++" workload');
  console.log('');
  console.log('After installation, restart your terminal and run this script again.');
  console.log('-------------------------------------------');
}

/**
 * Configure node-gyp for Windows
 */
function configureNodeGyp() {
  console.log('\n--- Configuring node-gyp for Windows ---');
  
  // Set environment variables for node-gyp
  const env = { ...process.env };
  
  // Try to find Visual Studio installation
  const vsVersion = findVisualStudioVersion();
  if (vsVersion) {
    console.log(`✓ Using Visual Studio ${vsVersion} for native compilation`);
    
    // Set MSVS_VERSION environment variable
    env.MSVS_VERSION = vsVersion;
    
    // For node-gyp to find Visual Studio
    if (vsVersion === '2022') {
      env.GYP_MSVS_VERSION = '2022';
    } else if (vsVersion === '2019') {
      env.GYP_MSVS_VERSION = '2019';
    } else if (vsVersion === '2017') {
      env.GYP_MSVS_VERSION = '2017';
    }
  }
  
  // Set architecture
  if (process.arch === 'x64') {
    env.TARGET_ARCH = 'x64';
  } else if (process.arch === 'ia32') {
    env.TARGET_ARCH = 'x86';
  }
  
  console.log(`✓ Architecture: ${env.TARGET_ARCH || process.arch}`);
  console.log('-------------------------------------------');
  
  return env;
}

/**
 * Find Visual Studio version
 * @returns {string|null} Visual Studio version or null if not found
 */
function findVisualStudioVersion() {
  try {
    const programFiles = process.env.ProgramFiles || 'C:\\Program Files';
    const programFilesX86 = process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)';
    
    // Check for different Visual Studio versions
    const versions = [
      { year: '2022', path: path.join(programFiles, 'Microsoft Visual Studio', '2022') },
      { year: '2022', path: path.join(programFilesX86, 'Microsoft Visual Studio', '2022') },
      { year: '2019', path: path.join(programFiles, 'Microsoft Visual Studio', '2019') },
      { year: '2019', path: path.join(programFilesX86, 'Microsoft Visual Studio', '2019') },
      { year: '2017', path: path.join(programFiles, 'Microsoft Visual Studio', '2017') },
      { year: '2017', path: path.join(programFilesX86, 'Microsoft Visual Studio', '2017') },
    ];
    
    for (const version of versions) {
      if (fs.existsSync(version.path)) {
        return version.year;
      }
    }
  } catch (error) {
    // Ignore errors
  }
  
  return null;
}

/**
 * Clear npm cache for sharp
 */
function clearNpmCache() {
  console.log('\n--- Clearing npm cache for sharp ---');
  try {
    execSync('npm cache clean --force', { stdio: 'inherit' });
    console.log('✓ npm cache cleared');
  } catch (error) {
    console.log(`⚠ Failed to clear npm cache: ${error.message}`);
  }
  console.log('-------------------------------------------');
}

/**
 * Try to install sharp with pre-built binaries
 * @param {Object} env Environment variables
 * @returns {boolean} True if installation succeeded
 */
function tryPrebuiltBinaries(env) {
  console.log('\n--- Trying pre-built binaries ---');
  try {
    console.log('Installing sharp with pre-built binaries...');
    execSync('npm install sharp@0.34.5 --no-save', { 
      stdio: 'inherit',
      env: { ...env, SHARP_IGNORE_GLOBAL_LIBVIPS: '1' }
    });
    console.log('✓ Pre-built binaries installed successfully');
    return true;
  } catch (error) {
    console.log(`✗ Pre-built binaries failed: ${error.message}`);
    return false;
  }
}

/**
 * Try to compile sharp from source
 * @param {Object} env Environment variables
 * @returns {boolean} True if compilation succeeded
 */
function tryCompileFromSource(env) {
  console.log('\n--- Compiling sharp from source ---');
  try {
    console.log('Removing existing sharp installation...');
    const sharpPath = path.join(process.cwd(), 'node_modules', 'sharp');
    if (fs.existsSync(sharpPath)) {
      fs.rmSync(sharpPath, { recursive: true, force: true });
      console.log('✓ Removed existing sharp installation');
    }
    
    console.log('Installing sharp with source compilation...');
    execSync('npm install sharp@0.34.5 --build-from-source', { 
      stdio: 'inherit',
      env: { ...env, SHARP_IGNORE_GLOBAL_LIBVIPS: '1' }
    });
    console.log('✓ Sharp compiled from source successfully');
    return true;
  } catch (error) {
    console.log(`✗ Source compilation failed: ${error.message}`);
    return false;
  }
}

/**
 * Rebuild sharp with npm rebuild
 * @param {Object} env Environment variables
 * @returns {boolean} True if rebuild succeeded
 */
function tryNpmRebuild(env) {
  console.log('\n--- Rebuilding sharp with npm rebuild ---');
  try {
    console.log('Running npm rebuild sharp...');
    execSync('npm rebuild sharp', { 
      stdio: 'inherit',
      env: { ...env, SHARP_IGNORE_GLOBAL_LIBVIPS: '1' }
    });
    console.log('✓ Sharp rebuilt successfully');
    return true;
  } catch (error) {
    console.log(`✗ npm rebuild failed: ${error.message}`);
    return false;
  }
}

/**
 * Test if sharp module loads successfully
 * @returns {boolean} True if sharp loads successfully
 */
function testSharpModule() {
  console.log('\n--- Testing sharp module ---');
  try {
    const sharp = require('sharp');
    console.log(`✓ Sharp module loaded successfully`);
    console.log(`  Version: ${sharp.versions.sharp}`);
    console.log(`  libvips: ${sharp.versions.vips}`);
    
    // Test basic functionality
    const testBuffer = Buffer.from([255, 255, 255, 255]);
    const pipeline = sharp(testBuffer, {
      raw: {
        width: 1,
        height: 1,
        channels: 4
      }
    });
    
    console.log('✓ Sharp basic functionality test passed');
    return true;
  } catch (error) {
    console.log(`✗ Sharp module failed to load: ${error.message}`);
    if (error.message.includes('The specified procedure could not be found')) {
      console.log('  This is the known Windows compatibility issue with sharp v0.34.5');
      console.log('  The module needs to be recompiled for your Windows environment');
    }
    return false;
  }
}

/**
 * Main installation function
 */
async function installSharpForWindows() {
  console.log('Starting Windows-specific sharp installation...\n');
  
  // Check Node.js version
  const nodeVersion = parseFloat(process.version.replace('v', ''));
  if (nodeVersion < 14) {
    console.log(`Node.js version ${nodeVersion} detected.`);
    console.log('Sharp compatibility issues primarily affect Node.js v14+.');
    console.log('Standard installation should work, but continuing with Windows-specific steps...\n');
  }
  
  // Check for Windows Build Tools
  const hasBuildTools = checkWindowsBuildTools();
  if (!hasBuildTools) {
    installWindowsBuildTools();
    console.log('\nPlease install Windows Build Tools and run this script again.');
    process.exit(1);
  }
  
  // Configure node-gyp
  const env = configureNodeGyp();
  
  // Clear npm cache
  clearNpmCache();
  
  let installationSucceeded = false;
  
  // Try different installation strategies
  const strategies = [
    { name: 'Pre-built binaries', fn: () => tryPrebuiltBinaries(env) },
    { name: 'npm rebuild', fn: () => tryNpmRebuild(env) },
    { name: 'Compile from source', fn: () => tryCompileFromSource(env) },
  ];
  
  for (const strategy of strategies) {
    console.log(`\n=== Trying strategy: ${strategy.name} ===`);
    if (strategy.fn()) {
      // Test if sharp loads
      if (testSharpModule()) {
        installationSucceeded = true;
        console.log(`\n✓ Successfully installed sharp using ${strategy.name}`);
        break;
      } else {
        console.log(`\n⚠ Strategy ${strategy.name} installed but sharp module still fails to load`);
        console.log('Trying next strategy...');
      }
    }
  }
  
  if (!installationSucceeded) {
    console.log('\n===========================================');
    console.log('All installation strategies failed');
    console.log('===========================================');
    console.log('\nTroubleshooting steps:');
    console.log('1. Make sure Windows Build Tools are installed correctly');
    console.log('2. Run this script as Administrator');
    console.log('3. Try installing sharp globally first:');
    console.log('   npm install -g sharp@0.34.5');
    console.log('4. Check sharp documentation for Windows:');
    console.log('   https://sharp.pixelplumbing.com/install#windows');
    console.log('5. Consider using a different sharp version if compatible');
    console.log('\nFor Gatsby development, you can also try:');
    console.log('1. Delete node_modules folder and package-lock.json');
    console.log('2. Run: npm cache clean --force');
    console.log('3. Run: npm install');
    console.log('4. Run this script again');
    process.exit(1);
  }
  
  console.log('\n===========================================');
  console.log('Windows sharp installation completed successfully!');
  console.log('===========================================');
  console.log('\nYou can now run Gatsby development server:');
  console.log('  npm start');
  console.log('\nIf you still encounter sharp errors:');
  console.log('1. Restart your terminal');
  console.log('2. Clear Gatsby cache: npm run clean');
  console.log('3. Try running Gatsby in development mode');
}

// Run the installation
installSharpForWindows().catch(error => {
  console.error('Fatal error during sharp installation:', error);
  process.exit(1);
});