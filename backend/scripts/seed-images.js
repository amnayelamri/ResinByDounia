const fs = require('fs');
const path = require('path');

const seedDir = path.join(__dirname, '../public/seed-images/creations');
const uploadDir = '/app/uploads/creations';

// Create upload directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Created uploads directory');
}

// Check if seed directory exists
if (fs.existsSync(seedDir)) {
  // Copy seed images to volume
  fs.readdirSync(seedDir).forEach(file => {
    const src = path.join(seedDir, file);
    const dest = path.join(uploadDir, file);
    
    // Only copy if file doesn't exist in volume
    if (!fs.existsSync(dest)) {
      fs.copyFileSync(src, dest);
      console.log(`✅ Copied ${file} to uploads`);
    } else {
      console.log(`⏭️  ${file} already exists, skipping`);
    }
  });
  console.log('🎉 Seed images processed!');
} else {
  console.log('ℹ️  No seed images directory found, skipping');
}
