User = require('../models/userModel');
userAuth = require('../middlewares/userAuth');

exports.register = function (req, res) {
    var hashedPassword = userAuth.hashPassword(req.body.password);

    var user = new User();
    user.username = req.body.username;
    user.password = hashedPassword;
    user.role = req.body.role;

    // save the user and check for errors
    user.save(function (err) {
        const token = userAuth.createToken(user);
        return res.json({
            authenticated: true,
            token: token,
            message: 'New User created!'
        });
    });
};

exports.login = function (req, res) {
    User.findOne({username: req.body.username}, function (err, user) {
        if (!user) {
            return res.status(404).send({ 
                authenticated: false, 
                token: null, 
                message: "Invalid User!"});
        }

        var isValidPassword = userAuth.comparePassword(req.body.password, user.password);

        if (!isValidPassword) {
            return res.status(401).send({ 
                authenticated: false, 
                token: null, 
                message: "Invalid Password!" 
            });
        }
            
        // Creates a JWT token for a day access
        const token = userAuth.createToken(user);
        return res.status(200).send({
            authenticated: true,
            token: token,
            message: "User login successfully!"
        });
    });
}
