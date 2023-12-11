const bcryptjs = require("bcryptjs");
const  User  = require("../model/user.model");



const home = (req, res) => {
    res.send("Hello, World!");
  };

  
const signup = async (req, res, next) => {
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
};


const login = async (req, res, next) => {
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
  };


module.exports = { home, login, signup };
