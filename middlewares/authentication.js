const fs = require("fs")
const { verify } = require("../helpers/jwt")

function verification(req, res, next) {
  let getHeader = req.headers["auth"]
  if (typeof getHeader !== "undefined") {
    req.token = getHeader
    const token = req.token
    const userDecoded = verify(token)
    if (userDecoded) {
      const users = fs.readFileSync("./data/users.json", "utf-8")
      const usersParsing = JSON.parse(users)

      const matchUser = usersParsing.find(
        (user) => user.username === userDecoded.username
      )

      if (matchUser) {
        next()
      } else {
        return res.status(401).json({
          name: "Authentication Error",
          devMessage: `User with username "${userDecoded.username}" not found in database`,
        })
      }
    }
  } else {
    res.sendStatus(403)
  }
}

module.exports = { verification }
