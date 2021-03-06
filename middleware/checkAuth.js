const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authentication.split(" ")[1];
         jwt.verify(token, 'secret_longer');
        next();
    } catch (error) {
            res.status(401).json({
                message: 'Authentication failed !'
            });
    }
};