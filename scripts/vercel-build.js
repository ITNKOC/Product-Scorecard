#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Vercel build process...');

// Step 1: Generate Prisma Client
console.log('📦 Generating Prisma Client...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma Client generated successfully');
} catch (error) {
  console.error('❌ Failed to generate Prisma Client:', error.message);
  process.exit(1);
}

// Step 2: Set build environment
process.env.SKIP_PRISMA_VALIDATION = 'true';
process.env.NODE_ENV = 'production';

// Step 3: Build Next.js
console.log('🏗️  Building Next.js application...');
try {
  execSync('npx next build', { stdio: 'inherit' });
  console.log('✅ Next.js build completed successfully');
} catch (error) {
  console.error('❌ Next.js build failed:', error.message);
  process.exit(1);
}

console.log('🎉 Vercel build completed successfully!');