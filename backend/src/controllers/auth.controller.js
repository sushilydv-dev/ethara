const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User } = require("../models");

function makeToken(user) {
  const secret = process.env.JWT_SECRET || "secret";
  return jwt.sign(
    { id: user.id, email: user.email, username: user.username },
    secret,
    { expiresIn: "7d" },
  );
}

async function signup(req, res) {
  try {
    const { fullname, username, email, password } = req.body;

    if (!fullname || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({
      where: { email },
    });
    if (userExists) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const usernameExists = await User.findOne({
      where: { username },
    });
    if (usernameExists) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullname,
      username,
      email,
      password: hashed,
    });

    const token = makeToken(newUser);
    return res.status(201).json({
      message: "Signup successful",
      token,
      user: { id: newUser.id, fullname, username, email },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = makeToken(user);
    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = { signup, login };

