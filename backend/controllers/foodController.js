// Import food model
Food = require('../models/foodModel');
authUser = require('../middlewares/userAuth');

// Handle index actions
exports.index = [ authUser.authenticateToken, authUser.verifyRole, (req, res)  => {
    Food.get(function (err, foodList) {
        if (err) {
            res.status(404).json({
                status: "error",
                message: err,
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Food retrieved successfully",
            data: foodList
        });
    });
}]

// Handle create food actions
exports.new = function (req, res) {
    var food = new Food();
    food.foodname = req.body.foodname ? req.body.foodname : food.foodname;
    food.expirydate = req.body.expirydate;
    food.person = req.body.person;
    food.phone = req.body.phone;
    // save the food and check for errors
    food.save(function (err) {
        // Check for validation error
        if (err)
            res.status(404).json({
                status: "error",
                message: err,
            });
        else
            res.status(200).json({
                status: "success",
                message: 'New food created!',
                data: food
            });
    });
};

// Handle view food info
exports.view = function (req, res) {
    Food.findById(req.params.food_id, function (err, food) {
        // Check for validation error
        if (err)
            res.status(404).json({
                status: "error",
                message: "Invalid ID detected, unable to find food",
            });
        else
            res.status(200).json({
                status: "success",
                message: 'Food details loading',
                data: food
            });
    });
};

// Handle update food info
exports.update = function (req, res) {
    Food.findById(req.params.food_id, function (err, food) {
        if (err)
            res.status(404).json({
                status: "error",
                message: "Invalid ID detected, unable to update food",
            });
        food.foodname = req.body.foodname ? req.body.foodname : food.foodname;
        food.expirydate = req.body.expirydate;
        food.person = req.body.person;
        food.phone = req.body.phone;
        // save the food and check for errors
        food.save(function (err) {
            // Check for validation error
            if (err)
                res.status(404).json({
                    status: "error",
                    message: err,
                });
            else
                res.status(200).json({
                    message: 'Food details updated!',
                    data: food
                });
        });
    });
};

// Handle delete food
exports.delete = function (req, res) {
    Food.deleteOne({
        _id: req.params.food_id
    }, function (err, food) {
        // Check for validation error
        if (err)
            res.status(404).json({
                status: "error",
                message: "Unable to delete when data not found in database!",
            });
        else
            res.status(200).json({
                message: 'Food successfully deleted',
                status: "success"
            });
    });
};
