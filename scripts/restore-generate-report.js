#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const backupPath = path.join(__dirname, '../app/api/analyses/[id]/generate-report.backup/route.ts');
const targetPath = path.join(__dirname, '../app/api/analyses/[id]/generate-report/route.ts');

if (fs.existsSync(backupPath)) {
  const backupContent = fs.readFileSync(backupPath, 'utf8');
  fs.writeFileSync(targetPath, backupContent);
  console.log('✅ Generate report route restored from backup');
} else {
  console.log('❌ Backup file not found');
}