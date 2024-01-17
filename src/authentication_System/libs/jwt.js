const secretkey = require('../../config.js')
const jwt = require('jsonwebtoken')

function createAccessToken(payload) {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            secretkey,
            { expiresIn: '1d' },
            (err, token) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(token)
                }
            }
        )
    })
}

module.exports = createAccessToken
