import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../modules/user.module.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const newUser = await User.create({
      name,
      email,
      password: hash,
    });
    res.status(200).json({ status: "User Created", user: newUser });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

export const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordCorrect)
      return res.status(404).json({ error: "Wrong password" });

    // Valid User
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT
    );

    res
      .cookie("access_token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .status(200)
      .json({ user: user, token: token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json({ status: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const { access_token } = req.cookies;
    const decodedToken = jwt.decode(access_token);
    if (decodedToken) {
      const loggedInuser = await User.findById({ _id: decodedToken.id });
      if (loggedInuser) {
        res.status(200).json(loggedInuser);
      }
    } else {
      return res.status(200).json({ error: "No User logged in" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};
