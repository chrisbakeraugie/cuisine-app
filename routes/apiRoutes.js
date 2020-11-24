const router = require('express').Router();
const coursesController = require("../controllers/coursesController");

router.get("/courses", coursesController.index, coursesController.respondJSON);
router.use(coursesController.errorJSON);
router.get("/courses/:id/join", coursesController.join, coursesController.respondJSON);

module.exports = router;