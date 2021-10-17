const User = require('../models/userModel');
const userAuth = require('../middlewares/userAuth');
const { ROLE } = require("../const/userRole");

const register = (req, res) => {
    let hashedPassword = userAuth.hashPassword(req.body.password);

    let user = new User();
    user.username = req.body.username;
    user.password = hashedPassword;
    let noRoleInput = req.body.role === undefined || req.body.role === "";
    user.role =  noRoleInput ? ROLE.USER : req.body.role;

    // save the user and check for errors
    user.save(function (err) {
        const token = userAuth.createToken(user);
        return res.json({
            userRole: user.role,
            token: token,
            message: "New User created!"
        });
    });
};

const login =  (req, res) => {
    User.findOne({username: req.body.username}, function (err, user) {
        if (!user) {
            return res.status(404).send({ 
                authenticated: false, 
                token: null, 
                message: "Invalid User!"});
        }

        let isValidPassword = userAuth.comparePassword(req.body.password, user.password);

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


module.exports = { login, register };
