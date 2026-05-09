const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({ message: "Token missing" });
    }

    const parts = header.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ message: "Token format invalid" });
    }

    const token = parts[1];
    const secret = process.env.JWT_SECRET || "secret";
    const decoded = jwt.verify(token, secret);

    req.user = decoded; // { id, email, username }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid" });
  }
}

module.exports = { auth };

