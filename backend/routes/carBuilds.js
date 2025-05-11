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
// router.get('/', ensureAuthenticated, async (req, res) => {
//   try {
//     const [rows] = await pool.execute(
//       'SELECT * FROM builds WHERE user_id = ?',
//       [req.userId]
//     );

//     return res.json({ success: true, builds: rows });
//   } catch (err) {
//     console.error('Error in GET /api/builds:', err);
//     return res.status(500).json({ success: false, message: 'Server error' });
//   }
// });
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.userId;

    // Current builds
    const [currentRows] = await pool.execute(
      `SELECT * 
         FROM builds 
        WHERE user_id = ? 
          AND ownership_status = 'current'`,
      [userId]
    );

    // Previous builds
    const [previousRows] = await pool.execute(
      `SELECT * 
         FROM builds 
        WHERE user_id = ? 
          AND ownership_status = 'previous'`,
      [userId]
    );

    return res.json({
      success: true,
      currentBuilds: currentRows,
      previousBuilds: previousRows
    });
  } catch (err) {
    console.error('Error in GET /api/builds:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});


/** IN PROGRESS
 /**
 * @route   GET /api/builds/:id
 * @desc    Fetch a single build (with covers, gallery & mods)
 * @access  Protected (requires valid JWT via ensureAuthenticated)
 */
router.get('/:id', ensureAuthenticated, async (req, res) => {
  const buildId = req.params.id;
  const userId  = req.userId;

  try {
    // 1) Fetch build row
    const [[row]] = await pool.execute(
      `SELECT
         id,
         user_id,
         ownership_status AS ownership,
         car_name,
         model,
         description,
         body_style       AS bodyStyle,
         cover_image,
         cover_image2
       FROM builds
       WHERE id = ? AND user_id = ?`,
      [buildId, userId]
    );

    if (!row) {
      return res
        .status(404)
        .json({ success: false, message: 'Build not found or access denied' });
    }

    // 2) Fetch gallery images
    const [galleryRows] = await pool.execute(
      `SELECT image_url
         FROM build_gallery
        WHERE build_id = ?`,
      [buildId]
    );
    const galleryImages = galleryRows.map(r => r.image_url);

    // 3) Fetch mods with original column names
    const [modRows] = await pool.execute(
      `SELECT
         id,
         category,
         sub_category,
         mod_name,
         image_url,
         mod_note
       FROM build_mods
       WHERE build_id = ?`,
      [buildId]
    );

    // 4) Assemble response
    const build = {
      id:           row.id,
      user_id:      row.user_id,
      ownership:    row.ownership,
      car_name:     row.car_name,
      model:        row.model,
      description:  row.description,
      bodyStyle:    row.bodyStyle,
      cover_image:  row.cover_image,
      cover_image2: row.cover_image2,
      // convenience array if you ever need it
      coverImages:  [row.cover_image, row.cover_image2].filter(Boolean),
      galleryImages
    };

    return res.json({
      success: true,
      build,
      mods: modRows
    });
  } catch (err) {
    console.error('Error in GET /api/builds/:id:', err);
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
/**
/**
 * @route   POST /api/builds
 * @desc    Create a new car build with cover, gallery, and mods
 * @access  Protected (requires valid JWT via ensureAuthenticated)
 * @form    multipart/form-data
 */
/**
 * @route   POST /api/builds
 * @desc    Create a new car build with cover, gallery, and mods
 * @access  Protected (requires valid JWT via ensureAuthenticated)
 * @form    multipart/form-data
 */
/**
 * @route   POST /api/builds
 * @desc    Create a new car build with cover, gallery, and mods
 * @access  Protected (requires valid JWT via ensureAuthenticated)
 * @form    multipart/form-data
 */
router.post(
  '/',
  ensureAuthenticated,
  upload.fields([
    { name: 'coverImages',   maxCount: 2  },
    { name: 'galleryImages', maxCount: 10 },
    { name: 'modImages',      maxCount: 50 }
  ]),
  async (req, res) => {
    try {
      // --- Log exactly what Multer parsed ---
      console.log('💾 [BUILD] all req.files keys:', Object.keys(req.files || {}));
      console.log('💾 [BUILD] req.files.coverImages:', req.files.coverImages);
      console.log('💾 [BUILD] req.files.galleryImages:', req.files.galleryImages);
      console.log('💾 [BUILD] req.files.modImages:', req.files.modImages);

      const userId = req.userId;
      const {
        ownership   = 'current',
        car_name,
        model,
        description = null,
        bodyStyle   = null,
        mods        = '[]'
      } = req.body;

      // --- Extract cover URLs ---
      const coverFiles = req.files.coverImages || [];
      const cover1 = coverFiles[0] ? `/uploads/${coverFiles[0].filename}` : null;
      const cover2 = coverFiles[1] ? `/uploads/${coverFiles[1].filename}` : null;
      console.log('💾 [BUILD] cover1, cover2 =', cover1, cover2);

      // --- Parse mods JSON ---
      let parsedModsArray = [];
      try {
        parsedModsArray = JSON.parse(mods);
      } catch (e) {
        console.error('❌ Bad mods JSON:', e);
        return res.status(400).json({ success:false, message:'Bad mods JSON' });
      }

      // --- Insert build row with covers ---
      const [buildResult] = await pool.execute(
        `INSERT INTO builds
           (user_id, ownership_status, car_name, model,
            description, body_style, cover_image, cover_image2)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [ userId, ownership, car_name, model,
          description, bodyStyle, cover1, cover2 ]
      );
      const buildId = buildResult.insertId;
      console.log('💾 [BUILD] buildId =', buildId);

      // --- Extract and insert gallery images ---
      const galleryFiles = req.files.galleryImages || [];
      const galleryUrls  = galleryFiles.map(f => `/uploads/${f.filename}`);
      console.log('💾 [BUILD] galleryUrls =', galleryUrls);

      for (const url of galleryUrls) {
        await pool.execute(
          `INSERT INTO build_gallery (build_id, image_url)
             VALUES (?, ?)`,
          [ buildId, url ]
        );
      }

      // --- Extract and insert mod images ---
      const modFiles = req.files.modImages || [];
      for (const [i, mod] of parsedModsArray.entries()) {
        const fileObj  = modFiles[i];
        const imageUrl = fileObj ? `/uploads/${fileObj.filename}` : null;
        await pool.execute(
          `INSERT INTO build_mods
             (build_id, category, sub_category, mod_name, image_url, mod_note)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            buildId,
            mod.main,
            mod.sub      || null,
            mod.name,
            imageUrl,
            mod.details  || null
          ]
        );
      }

      return res.status(201).json({ success:true, buildId });
    } catch (err) {
      console.error('🔥 [BUILD ERROR]:', err);
      return res.status(500).json({ success:false, message:'Server error' });
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
