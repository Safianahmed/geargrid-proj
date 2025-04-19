//for file uploads using multer
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  }
});
const upload = multer({ storage });

// Import the Express framework
const express = require('express');

// Returns a configured router for car builds
function createCarBuildRoutes(pool) {
  const router = express.Router();

  /**
   * @route   GET /api/builds
   * @desc    Fetch all car builds for a specific user
   * @query   userId (required)
   */
  router.get('/', async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'Missing userId' });
    }

    try {
      const [builds] = await pool.execute(
        'SELECT * FROM builds WHERE user_id = ?', 
        [userId]
      );
      res.json({ success: true, builds });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  /**
   * @route   GET /api/builds/:id
   * @desc    Fetch a single build by its ID
   */
  router.get('/:id', async (req, res) => {
    try {
      const [builds] = await pool.execute(
        'SELECT * FROM builds WHERE id = ?', 
        [req.params.id]
      );

      if (builds.length === 0) {
        return res.status(404).json({ success: false, message: 'Build not found' });
      }

      res.json({ success: true, build: builds[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  /**
 * @route   POST /api/builds
 * @desc    Create a new car build with file upload + mods
 * @form    multipart/form-data with fields:
 *          user_id, car_name, model, description, mods, customMods
 *          coverImage (file), galleryImages[] (files)
 */
router.post('/', upload.fields([
  { name: 'coverImage', maxCount: 1 },           // Single cover image
  { name: 'galleryImages', maxCount: 10 }        // Up to 10 gallery images
]), async (req, res) => {
  try {
    // Destructure text fields from the form body
    const {
      user_id,
      car_name,
      model,
      description,
      mods,         // JSON stringified object of mods
      customMods    // Optional custom mod notes
    } = req.body;

    // Validate required fields
    if (!user_id || !car_name) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Get uploaded file path for cover image (if exists)
    const coverImagePath = req.files['coverImage']?.[0]?.filename || null;

    // Step 1: Insert into builds table
    const [buildResult] = await pool.execute(
      'INSERT INTO builds (user_id, car_name, model, description, cover_image) VALUES (?, ?, ?, ?, ?)',
      [user_id, car_name, model, description, `/uploads/${coverImagePath}`]
    );

    const buildId = buildResult.insertId;

    // Step 2: Insert each selected mod into build_mods table
    const parsedMods = JSON.parse(mods);  

    for (const category in parsedMods) {
      for (const mod of parsedMods[category]) {
        await pool.execute(
          'INSERT INTO build_mods (build_id, category, mod_name, image_url, mod_note) VALUES (?, ?, ?, ?, ?)',
          [buildId, category, mod.mod_name, mod.image_url, mod.mod_note]
        );
      }
    }

    // gallery image upload later

    res.status(201).json({ success: true, buildId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error during build creation' });
  }
});

  /**
   * @route   PUT /api/builds/:id
   * @desc    Update an existing car build
   * @body    { car_name, model, description, cover_image }
   */
  router.put('/:id', async (req, res) => {
    const { car_name, model, description, cover_image } = req.body;

    try {
      const [result] = await pool.execute(
        'UPDATE builds SET car_name = ?, model = ?, description = ?, cover_image = ? WHERE id = ?', 
        [car_name, model, description, cover_image, req.params.id]
      );

      res.json({ success: true, message: 'Build updated successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Failed to update build' });
    }
  });

  /**
   * @route   DELETE /api/builds/:id
   * @desc    Delete a car build by its ID
   */
  router.delete('/:id', async (req, res) => {
    try {
      const [result] = await pool.execute(
        'DELETE FROM builds WHERE id = ?', 
        [req.params.id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Build not found' });
      }

      res.json({ success: true, message: 'Build deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Failed to delete build' });
    }
  });

  // Return the router to be used in server.js
  return router;
}

// Export the function that provides the router
module.exports = createCarBuildRoutes;
