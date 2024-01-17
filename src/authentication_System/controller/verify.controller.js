const User = require('../modules/user.model.js')
const secretKey = require('../../config.js');
const jwt = require('jsonwebtoken');

const verify = async (req, res) => {
    try {
        const token = req.query.token;
        const decoded = jwt.verify(token, secretKey);
        const userId = decoded.document; 

        const updatedUser = await User.findOneAndUpdate(
            { documentID: userId },
            { verified: true },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.send('Cuenta verificada correctamente');
    } catch (error) {
        res.status(403).json({ error: 'Token inválido' });
    }
};

module.exports = verify;
  