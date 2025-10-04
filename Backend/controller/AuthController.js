import { User } from "../model/model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export async function login(req, res) {
  const { Email, Password } = req.body;
  try {
    if (!Email || !Password) {
      return res.status(400).json("Please Fill All fields");
    }
    //Including the password to compare
    const ExistingUser = await User.findOne({ Email }).select("+Password");

    if (!ExistingUser) {
      return res.status(400).json("User Not Found");
    }
    const matchPassword = await bcrypt.compare(Password, ExistingUser.Password);
    if (!matchPassword) {
      return res.status(400).json("Password Not matched");
    }
    //Here iam deleteing the password (I don't want to send with the token)
    const userData = ExistingUser.toObject();
    delete userData.Password;
    const token = jwt.sign(
      { Userid: ExistingUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    return res.status(200).json({ token, userData });
  } catch (error) {
    return res.status(400).json("Error in login function: ", error);
  }
}

export async function register(req, res) {
  const { Name, Email, Password } = req.body;
  try {
    if (!Name || !Email || !Password) {
      return res.status(400).json({ Failed: "Please Fill All Fields" });
    }
    const ExistingEmail = await User.findOne({ Email });
    if (ExistingEmail) {
      return res.status(400).json("User Already Exist");
    }
    const hashedPassword = await bcrypt.hash(Password, 10);
    const NewUser = new User({
      Name,
      Email,
      Password: hashedPassword,
    });
    NewUser.save();
    return res.status(201).json("User successfully Registered");
  } catch (error) {
    return res.status(400).json(error);
  }
}

export async function AuthorizeUser(req, res) {
  return res.json({ authenticated: true, user: req.user });
}
