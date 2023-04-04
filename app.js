const fs = require("fs")
const jwt = require("jsonwebtoken")
const express = require("express")
const app = express()

// Middleware
app.use(express.urlencoded({ extended: true }))

// Verifikasi JWT
const verification = (req, res, next) => {
  let getHeader = req.headers["auth"]
  if (typeof getHeader !== "undefined") {
    req.token = getHeader
    next()
  } else {
    res.sendStatus(403)
  }
}

// Routing Root
app.get("/", (req, res) => {
  // res.send("Welcome..")
  const file = fs.readFileSync("./data/readme.txt", "utf-8")
  res.send(file)
})

// Routing POST Login
app.post("/login", (req, res) => {
  const { username, password } = req.body

  const users = fs.readFileSync("./data/users.json", "utf-8")
  const usersParsing = JSON.parse(users)

  const matchUser = usersParsing.find((user) => user.username === username)
  if (matchUser && matchUser.password === password) {
    res.send("Keterangan: Berhasil Login.")
    const data = {
      username: matchUser.username,
      password: matchUser.password,
    }
    jwt.sign(
      {
        data: data,
      },
      "secret",
      (err, token) => {
        console.log("Keterangan: Berhasil Login")
        console.log(`Token Anda: ${token}`)
      }
    )
  } else if (matchUser && matchUser.password !== password) {
    res.send("Keterangan: Password Salah")
  } else {
    res.send("Keterangan: Data tidak valid!")
  }
})

// Routing GET all data teachers
app.get("/teachers", verification, (req, res) => {
  jwt.verify(req.token, "secret", (err, auth) => {
    if (err) {
      res.sendStatus(403)
    } else {
      const users = fs.readFileSync("./data/teachers.json", "utf-8")
      const usersParsing = JSON.parse(users)
      res.json(usersParsing)
    }
  })
})

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000")
})
