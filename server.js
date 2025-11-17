const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(cors());

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY || 'change-me-in-production';

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'remotion-video-api',
    timestamp: new Date().toISOString(),
  });
});

// Render video endpoint
app.post('/render', async (req, res) => {
  // Verify API key
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== API_KEY) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid API key',
    });
  }

  const { images, audioUrl, title, secondsPerImage, style } = req.body;

  // Validation
  if (!images || !Array.isArray(images) || images.length === 0) {
    return res.status(400).json({
      error: 'images array is required and must not be empty',
    });
  }

  if (!audioUrl || typeof audioUrl !== 'string') {
    return res.status(400).json({
      error: 'audioUrl is required',
    });
  }

  if (!title || typeof title !== 'string') {
    return res.status(400).json({
      error: 'title is required',
    });
  }

  try {
    console.log(new Date().toISOString(), 'Starting video render...');
    console.log('- Images:', images.length);
    console.log('- Title:', title);
    console.log('- Seconds per image:', secondsPerImage || 15);
    console.log('- Style:', style || 'simple');

    // Calculate estimated duration
    const totalSeconds = 3 + images.length * (secondsPerImage || 15);
    const estimatedMinutes = Math.ceil(totalSeconds / 60);

    // Send immediate response
    res.json({
      status: 'processing',
      message: 'Video rendering started',
      jobId: `job-${Date.now()}`,
      estimatedDuration: `${estimatedMinutes} minutes`,
      totalFrames: totalSeconds * 30, // 30 FPS
      metadata: {
        imagesCount: images.length,
        title: title,
        style: style || 'simple',
      },
    });

    console.log(new Date().toISOString(), 'Render job queued successfully');
  } catch (error) {
    console.error('Render error:', error);
    return res.status(500).json({
      error: 'Render failed',
      message: error.message,
    });
  }
});

// Catch-all 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Remotion API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
