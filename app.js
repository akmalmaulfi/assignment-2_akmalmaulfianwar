const fs = require("fs")
const { verification } = require("./middlewares/authentication")
const express = require("express")
const { generateToken, verify } = require("./helpers/jwt")
const app = express()

// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

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
    const data = {
      username: matchUser.username,
      password: matchUser.password,
    }

    const token = generateToken(data)
    res.status(200).json({
      devMessage: "Berhasil Login",
      token: token,
    })
  } else if (matchUser && matchUser.password !== password) {
    res.status(401)
    res.send("Keterangan: Password Salah")
  } else {
    res.status(400)
    res.send("Keterangan: Data tidak valid!")
  }
})

app.use(verification)
// Routing GET all data teachers
app.get("/teachers", (req, res) => {
  const users = fs.readFileSync("./data/teachers.json", "utf-8")
  const usersParsing = JSON.parse(users)
  res.json(usersParsing)
})

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000")
})
