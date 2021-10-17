// Initialize express router
let router = require('express').Router();

// Set default API response
router.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Welcome!',
    });
});

// Import food controller
var foodController = require('../controllers/foodController');

// Food routes
router.route('/food')
    .get(foodController.index)
    .post(foodController.new);

router.route('/food/:food_id')
    .get(foodController.view)
    .patch(foodController.update)
    .put(foodController.update)
    .delete(foodController.delete);


// Import user controller
var userController = require('../controllers/userController');

// User routes
router.route('/register')
    .post(userController.register);

// User routes
router.route('/login')
    .post(userController.login);

// Export API routes
module.exports = router;