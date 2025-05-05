const express = require('express');
//for file uploads using multer
const multer = require('multer');
const path = require('path');

// Middleware to handle file uploads
const uploadsDir = path.join(__dirname, '..', 'uploads'); 

// Configure multer to store files in the uploads directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename:    (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  }
});

const upload = multer({ storage });

// Returns a configured router for car builds
function createCarBuildRoutes(pool) {
  const router = express.Router();

// Middleware to ensure the user is authenticated via cookies
const ensureAuthenticated = require('../middleware/ensureAuthenticated');


/**
 * @route   GET /api/builds
 * @desc    Fetch all car builds for the currently logged-in user
 */
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    console.log('token cookie:', req.cookies.token);
    console.log('eq.userId:', req.userId);

    const [rows] = await pool.execute(
      'SELECT * FROM builds WHERE user_id = ?',
      [req.userId]
    );

    return res.json({ success: true, builds: rows });
  } catch (err) {
    console.error('Error in GET /api/builds:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});


/** IN PROGRESS
 * @route   GET /api/builds/:id
 * @desc    Fetch a single build (with covers, gallery & mods)
 */
router.get('/:id', ensureAuthenticated, async (req, res, next) => {
  const buildId = req.params.id;
  const userId  = req.userId;

  try {
    // Get the build row
    const [[build]] = await pool.execute(
      `SELECT * 
         FROM builds 
        WHERE id = ? AND user_id = ?`,
      [buildId, userId]
    );

    if (!build) {
      return res
        .status(404)
        .json({ success: false, message: 'Build not found or access denied' });
    }

    // Assemble cover & gallery 
    const coverImages   = [build.cover_image, build.cover_image2].filter(Boolean);
    const galleryImages = [
      build.gallery_image1,
      build.gallery_image2,
    ].filter(Boolean);

    // Fetch all the mods for this build
    const [modRows] = await pool.execute(
      `SELECT id, category, mod_name, image_url, mod_note
         FROM build_mods 
        WHERE build_id = ?`,
      [buildId]
    );

    // Group them by category
    const mods = modRows.reduce((acc, m) => {
      if (!acc[m.category]) acc[m.category] = [];
      acc[m.category].push(m);
      return acc;
    }, {});

    // Send back both the build and the grouped mods
    return res.json({
      success: true,
      build: {
        ...build,
        coverImages,
        galleryImages
      },
      mods   
    });

  } catch (err) {
    console.error('Error fetching build:', err);
    return res
      .status(500)
      .json({ success: false, message: 'Server error while fetching build' });
  }
});


/** IN PROGRESS - mods not showing up in mod table
 * @route   POST /api/builds
 * @desc    Create a new car build with optional file uploads and mods
 * @access  Protected (requires valid JWT via ensureAuthenticated)
 * @form    multipart/form-data
 */
router.post(
  '/',
  ensureAuthenticated, 
  upload.fields([
    { name: 'coverImages',    maxCount: 2  },   
    { name: 'galleryImages', maxCount: 10 },
    { name: 'modImages',     maxCount: 50 }    
  
  ]),
  async (req, res) => {
    try {
      const userId = req.userId;
      const {
        car_name,
        model,
        description = null,
        bodyStyle   = null,
        mods        = '{}',
        customMods  = '[]'
      } = req.body;

      // Validate required text fields
      if (!car_name?.trim() || !model?.trim()) {
        return res
          .status(400)
          .json({ success: false, message: 'Both car_name and model are required.' });
      }

      // Parse JSON-encoded mods
      let parsedMods, parsedCustomMods;
      try {
        parsedMods       = JSON.parse(mods);
        parsedCustomMods = JSON.parse(customMods);
      } catch (parseErr) {
        return res
          .status(400)
          .json({ success: false, message: 'Failed to parse mods data as JSON.' });
      }

      // Build file paths for up to 2 cover images
      const coverFiles = (req.files.coverImages || [])
      .map(f => `/uploads/${f.filename}`);

      const coverImage1 = coverFiles[0] || null;
      const coverImage2 = coverFiles[1] || null;

      // Insert the main build record
      const [buildResult] = await pool.execute(
        `INSERT INTO builds
           (user_id, car_name, model, description, body_style, cover_image, cover_image2)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, car_name, model, description, bodyStyle, coverImage1, coverImage2]
      );
      const buildId = buildResult.insertId;

      // Insert build_mods entries
      const modInserts = [];
      for (const category in parsedMods) {
        if (!Array.isArray(parsedMods[category])) continue;
        for (const mod of parsedMods[category]) {
          modInserts.push(
            pool.execute(
              `INSERT INTO build_mods
                 (build_id, category, mod_name, image_url, mod_note)
               VALUES (?, ?, ?, ?, ?)`,
              [
                buildId,
                category,
                mod.mod_name,
                mod.image_url || null,
                mod.mod_note  || null
              ]
            )
          );
        }
      }

      // Insert any custom mods
      if (Array.isArray(parsedCustomMods)) {
        for (const custom of parsedCustomMods) {
          modInserts.push(
            pool.execute(
              `INSERT INTO build_mods
                 (build_id, category, mod_name, image_url, mod_note)
               VALUES (?, ?, ?, ?, ?)`,
              [
                buildId,
                custom.category || 'custom',
                custom.mod_name,
                custom.image_url || null,
                custom.mod_note  || null
              ]
            )
          );
        }
      }

      await Promise.all(modInserts);

      return res
        .status(201)
        .json({ success: true, buildId });

    } catch (err) {
      console.error('Error creating build:', err);
      return res
        .status(500)
        .json({ success: false, message: 'Server error during build creation.' });
    }
  }
);


/** NEEDS TESTING & IMPLEMENTING 
 * @route   PUT /api/builds/:id
 * @desc    Update an existing car build
 * @body    { car_name, model, description, cover_image }
 * @auth    Only the logged-in user who owns the build can update it
 */
router.put('/:id', ensureAuthenticated, async (req, res) => {
  const userId = req.userId; 

  const { car_name, model, description, cover_image } = req.body;

  try {
    // Confirm the build exists and belongs to the current user
    const [existing] = await pool.execute(
      'SELECT * FROM builds WHERE id = ? AND user_id = ?', 
      [req.params.id, userId]
    );

    // If no build is found for this user, deny update access
    if (existing.length === 0) {
      return res.status(403).json({ success: false, message: 'Unauthorized to update this build' });
    }

    // Proceed to update the build with new data
    await pool.execute(
      'UPDATE builds SET car_name = ?, model = ?, description = ?, cover_image = ? WHERE id = ?', 
      [car_name, model, description, cover_image, req.params.id]
    );

    res.json({ success: true, message: 'Build updated successfully' });
  } catch (err) {
    console.error('Error updating build:', err);
    res.status(500).json({ success: false, message: 'Failed to update build' });
  }
});

/** NEEDS TESTING & IMPLEMENTING 
 * @route   DELETE /api/builds/:id
 * @desc    Delete a car build by its ID
 * @auth    Only the logged-in user who owns the build can delete it
 */
router.delete('/:id', ensureAuthenticated, async (req, res) => {
  const userId = req.userId; 

  try {
    // Verify that the build exists and belongs to the current user
    const [build] = await pool.execute(
      'SELECT * FROM builds WHERE id = ? AND user_id = ?', 
      [req.params.id, userId]
    );

    // If not found or not owned by the user, deny deletion
    if (build.length === 0) {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this build' });
    }

    // Proceed to delete the build
    const [result] = await pool.execute(
      'DELETE FROM builds WHERE id = ?', 
      [req.params.id]
    );

    res.json({ success: true, message: 'Build deleted successfully' });

  } catch (err) {
    console.error('Error deleting build:', err);
    res.status(500).json({ success: false, message: 'Failed to delete build' });
  }
});

  // Return the router to be used in server.js
  return router;
}

// Export the function that provides the router
module.exports = createCarBuildRoutes;
