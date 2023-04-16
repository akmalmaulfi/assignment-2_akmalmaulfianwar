const jwt = require("jsonwebtoken")
const KEY = "secret"

function generateToken(payload) {
  const token = jwt.sign(payload, KEY)
  return token
}

function verify(token) {
  const decoded = jwt.verify(token, KEY)
  return decoded
}

module.exports = { generateToken, verify }
