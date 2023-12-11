const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

dotenv.config();

const port = 6969;
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect("mongodb+srv://admin:admin123@cluster0.w1vziuo.mongodb.net/")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

// Routes
app.get("/", (req, res) => {
  res.json([
    { taskId: 221, status: "pending" },
    { taskId: 222, status: "wip" },
    { taskId: 223, status: "completed" },
    { taskId: 224, status: "wip" },
    { taskId: 225, status: "completed" },
    { taskId: 226, status: "pending" }
  ]);
});

app.get("/register", (req, res) => {
  res.send("Hello, register!");
});

app.get("/login", (req, res) => {
  res.send("Hello, login!");
});

// SignUp
app.post("/register", async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({
    username,
    email,
    password: hashedPassword
  });

  try {
    await newUser.save();
    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    console.log("Error in signup:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// LogIn
app.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return res.status(404).json({ error: "User not found!" });
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Wrong credentials!" });
    }

    res.status(201).json({ message: "Login successful!" });
  } catch (error) {
    console.log("Error in login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
