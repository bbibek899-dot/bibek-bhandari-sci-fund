import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { sciPatientCampaign, initialDonations } from './src/data/defaultCampaign.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Enable large JSON body payloads for image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure data & public directories exist
const dataDir = path.resolve(__dirname, 'data');
const publicDir = path.resolve(__dirname, 'public');
const imagesDir = path.resolve(publicDir, 'images');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

const campaignFilePath = path.join(dataDir, 'publishedCampaign.json');
const donationsFilePath = path.join(dataDir, 'publishedDonations.json');

// Initialize with verified default patient data if not existing
if (!fs.existsSync(campaignFilePath)) {
  fs.writeFileSync(campaignFilePath, JSON.stringify(sciPatientCampaign, null, 2), 'utf8');
}
if (!fs.existsSync(donationsFilePath)) {
  fs.writeFileSync(donationsFilePath, JSON.stringify(initialDonations, null, 2), 'utf8');
}

// API: Get Published Campaign (Loaded by all visitors across iOS, Android, and Desktop)
app.get('/api/campaign', (req, res) => {
  try {
    if (fs.existsSync(campaignFilePath)) {
      const data = fs.readFileSync(campaignFilePath, 'utf8');
      return res.json(JSON.parse(data));
    }
    return res.json(null);
  } catch (err) {
    console.error('Error reading campaign data:', err);
    return res.status(500).json({ error: 'Failed to read campaign data' });
  }
});

// API: Save / Publish Campaign Data to Server
app.post('/api/campaign', (req, res) => {
  try {
    const campaignData = req.body;
    if (!campaignData) {
      return res.status(400).json({ error: 'Missing campaign data' });
    }

    fs.writeFileSync(campaignFilePath, JSON.stringify(campaignData, null, 2), 'utf8');
    console.log('[Server] Successfully published campaign data to disk!');
    return res.json({ success: true, message: 'Campaign published globally' });
  } catch (err) {
    console.error('Error saving campaign data:', err);
    return res.status(500).json({ error: 'Failed to save campaign data' });
  }
});

// API: Save Real Image File directly to public folder (avoids heavy base64 strings)
app.post('/api/upload-image', (req, res) => {
  try {
    const { base64Data, type } = req.body;
    if (!base64Data || !type) {
      return res.status(400).json({ error: 'Missing base64Data or type' });
    }

    // Extract base64 content
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    const buffer = matches ? Buffer.from(matches[2], 'base64') : Buffer.from(base64Data, 'base64');

    const fileName = `${type}_${Date.now()}.jpg`;
    const targetPath = path.join(imagesDir, fileName);
    fs.writeFileSync(targetPath, buffer);

    // Also update og_cover.jpg or og_photo.jpg if relevant
    if (type === 'banner' || type === 'hero') {
      fs.writeFileSync(path.join(publicDir, 'og_cover.jpg'), buffer);
    } else if (type === 'avatar' || type === 'portrait') {
      fs.writeFileSync(path.join(publicDir, 'og_photo.jpg'), buffer);
    } else if (type === 'esewa_qr') {
      fs.writeFileSync(path.join(publicDir, 'og_esewa_qr.jpg'), buffer);
    } else if (type === 'bank_qr') {
      fs.writeFileSync(path.join(publicDir, 'og_bank_qr.jpg'), buffer);
    }

    const publicUrl = `/images/${fileName}`;
    return res.json({ success: true, url: publicUrl });
  } catch (err) {
    console.error('Error writing image file:', err);
    return res.status(500).json({ error: 'Failed to save image file' });
  }
});

// API: Get Donations
app.get('/api/donations', (req, res) => {
  try {
    if (fs.existsSync(donationsFilePath)) {
      const data = fs.readFileSync(donationsFilePath, 'utf8');
      return res.json(JSON.parse(data));
    }
    return res.json([]);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to read donations' });
  }
});

// API: Save Donations
app.post('/api/donations', (req, res) => {
  try {
    const donationsData = req.body;
    fs.writeFileSync(donationsFilePath, JSON.stringify(donationsData, null, 2), 'utf8');
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to save donations' });
  }
});

// Serve static public assets
app.use(express.static(publicDir));

// In development, hook into Vite middlewares
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  // In production, serve dist folder
  const distDir = path.resolve(__dirname, 'dist');
  app.use(express.static(distDir));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(distDir, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Server] CreatorFund App listening on http://0.0.0.0:${PORT}`);
});
