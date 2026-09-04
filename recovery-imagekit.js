/**
 * Recovery Script: Re-upload images from CDN cache to ImageKit
 * 
 * This script:
 * 1. Queries database for all ImageKit image references
 * 2. Downloads images from CDN cache (still accessible)
 * 3. Re-uploads to ImageKit
 * 4. Updates database with new fileId
 * 
 * Usage: node -e "process.env.NODE_PATH=require('path').join(process.cwd(),'node_modules');require('module').Module._initPaths();require('./recovery-imagekit.js')"
 */

const { Client } = require('pg');
const ImageKit = require('imagekit');
const https = require('https');
const http = require('http');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.development') });

const db = new Client({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const ik = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadImage(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

function extractFolderAndName(imageUrl) {
  // e.g. https://ik.imagekit.io/eo8dcxsjx8/vdcd/slides/1788489883338-d9636957ed0d.png
  const urlPath = new URL(imageUrl).pathname;
  // /eo8dcxsjx8/vdcd/slides/1788489883338-d9636957ed0d.png
  const parts = urlPath.split('/');
  // Remove the imagekit ID prefix
  const idx = parts.indexOf('vdcd');
  if (idx === -1) return { folder: '/vdcd', fileName: parts[parts.length - 1] };
  
  const fileName = parts[parts.length - 1];
  const folderParts = parts.slice(idx, parts.length - 1); // ['vdcd', 'slides']
  const folder = '/' + folderParts.join('/');
  
  return { folder, fileName };
}

async function main() {
  await db.connect();
  console.log('Connected to database\n');

  // Collect all ImageKit image references
  const imagesToRecover = [];

  // Slides
  const slides = await db.query(
    "SELECT id, image_file_id, image_url, title FROM slide WHERE image_url LIKE '%imagekit%'"
  );
  for (const row of slides.rows) {
    imagesToRecover.push({
      entity: 'slide',
      id: row.id,
      oldFileId: row.image_file_id,
      url: row.image_url,
      name: row.title,
      updateQuery: 'UPDATE slide SET image_file_id = $1 WHERE id = $2',
    });
  }

  // Slide detail blogs
  const blogs = await db.query(
    "SELECT id, hero_image_file_id, hero_image_url, title FROM slide_detail_blog WHERE hero_image_url LIKE '%imagekit%'"
  );
  for (const row of blogs.rows) {
    imagesToRecover.push({
      entity: 'slide_detail_blog',
      id: row.id,
      oldFileId: row.hero_image_file_id,
      url: row.hero_image_url,
      name: row.title,
      updateQuery: 'UPDATE slide_detail_blog SET hero_image_file_id = $1 WHERE id = $2',
    });
  }

  console.log(`Found ${imagesToRecover.length} images to recover\n`);

  let recovered = 0;
  let failed = 0;

  for (const img of imagesToRecover) {
    console.log(`\n--- ${img.entity}: ${img.name} ---`);
    console.log(`  URL: ${img.url}`);
    console.log(`  Old fileId: ${img.oldFileId}`);

    // Check if already exists on ImageKit
    try {
      await ik.getFileDetails(img.oldFileId);
      console.log(`  ✅ Already exists on ImageKit, skipping`);
      recovered++;
      continue;
    } catch (e) {
      console.log(`  ❌ Not found on ImageKit, recovering...`);
    }

    // Download from CDN cache
    try {
      const buffer = await downloadImage(img.url);
      console.log(`  📥 Downloaded ${(buffer.length / 1024).toFixed(1)}KB`);

      const { folder, fileName } = extractFolderAndName(img.url);
      console.log(`  📁 Re-uploading to ${folder}/${fileName}`);

      // Re-upload to ImageKit
      const response = await ik.upload({
        file: buffer,
        fileName: fileName,
        folder: folder,
        useUniqueFileName: false,
      });

      console.log(`  ✅ Re-uploaded! New fileId: ${response.fileId}`);
      console.log(`  🔗 New URL: ${response.url}`);

      // Update database with new fileId
      await db.query(img.updateQuery, [response.fileId, img.id]);
      console.log(`  💾 Database updated`);

      // Also update the URL if it changed
      if (response.url !== img.url) {
        if (img.entity === 'slide') {
          await db.query('UPDATE slide SET image_url = $1 WHERE id = $2', [response.url, img.id]);
        } else if (img.entity === 'slide_detail_blog') {
          await db.query('UPDATE slide_detail_blog SET hero_image_url = $1 WHERE id = $2', [response.url, img.id]);
        }
        console.log(`  🔗 URL also updated in DB`);
      }

      recovered++;
    } catch (e) {
      console.log(`  ❌ FAILED: ${e.message}`);
      failed++;
    }
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`Recovery complete!`);
  console.log(`  Recovered: ${recovered}`);
  console.log(`  Failed: ${failed}`);
  console.log(`  Total: ${imagesToRecover.length}`);

  // Verify all files now exist
  console.log(`\n--- Verification ---`);
  const allSlides = await db.query(
    "SELECT image_file_id, image_url, title FROM slide WHERE image_url LIKE '%imagekit%'"
  );
  for (const row of allSlides.rows) {
    try {
      await ik.getFileDetails(row.image_file_id);
      console.log(`  ✅ ${row.title}: EXISTS (${row.image_file_id})`);
    } catch (e) {
      console.log(`  ❌ ${row.title}: MISSING (${row.image_file_id})`);
    }
  }

  await db.end();
}

main().catch((e) => {
  console.error('Fatal error:', e);
  process.exit(1);
});
