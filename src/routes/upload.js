const { Router } = require('express');
const upload = require('../middlewares/upload');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');


const router = Router();

// POST /api/upload
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' })
    }

    const uploadFromBuffer = () => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'blog', resource_type: 'image' },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        )
        streamifier.createReadStream(req.file.buffer).pipe(uploadStream)
      })
    }

    const result = await uploadFromBuffer()
    res.status(200).json({ url: result.secure_url, public_id: result.public_id })

  } catch (error) {
    console.error('Cloudinary upload error:', error)  // ← look at your terminal
    res.status(500).json({ error: 'Image upload failed' })
  }
})

module.exports = router;