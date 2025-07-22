const User = require("../models/User");
const bcrypt = require("bcryptjs");
const createToken = require("../helpers/createToken");

const UserController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "User not found" });
      }

      const isCorrect = await bcrypt.compare(password, user.password);
      if (!isCorrect) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = createToken(user._id);

      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
      });

      return res.status(200).json({ user, token });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: "Login failed" });
    }
  },
  register: async (req, res) => {
    try {
      const { email, password, name } = req.body;
      const role = req.body.role || "applicant";
      const userExists = await User.findOne({ email });
      if (userExists) {
        throw new Error("User already exists");
      }
      let salt = await bcrypt.genSalt();
      let hashValue = await bcrypt.hash(password, salt);
      let user = await User.create({
        email,
        name,
        password: hashValue,
        role,
      });

      let token = createToken(user._id);
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 3 * 24 * 60 * 60 * 1000,
      });
      return res.json({ user, token });
    } catch (e) {
      return res.status(400).json({
        error: e.message,
      });
    }
  },

  getMe: async (req, res) => {
    try {
      const user = await User.findById(req.userId).select("-password");
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.json({ user });
    } catch (e) {
      return res.status(500).json({ error: "Server error" });
    }
  },
};

module.exports = UserController;
