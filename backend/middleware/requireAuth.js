const jwt = require('jsonwebtoken')

const requireAuth = (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization) {
        return res.status(401).json({ error: 'Authorization token required' })
    }

    const token = authorization.split(' ')[1];

    try {
        const { ID, rights } = jwt.verify(token, "AE>iCm.8gjT4fZIZNAmxP8RF7/2G^N$!b@£4Z@^O`'su:~55tX")
        req.ID = ID;
        req.userRights = rights;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: 'Request is not authorized' })
    }

}

module.exports = requireAuth