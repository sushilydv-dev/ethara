const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { initDb } = require("./src/config/db");

const authRoutes = require("./src/routes/auth.routes");
const projectRoutes = require("./src/routes/project.routes");
const taskRoutes = require("./src/routes/task.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Ethara API is running" });
});

app.use(authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await initDb();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Server failed to start");
    console.error(err);
    process.exit(1);
  }
}

start();
