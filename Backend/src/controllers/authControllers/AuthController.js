import GenToken from "../../libs/Token.js";
import { User } from "../../models/Authmodel/User.js";


//------------------------signup_user-------------------------------
export const SignupController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    // Generate the token BEFORE sending the response.
    // GenToken is synchronous, so `await` is not needed.
    GenToken(res, user._id);
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      avater: user.avater,
      bio: user.bio,
      score: user.score,
      isAdmin: user.isAdmin,
      message: "User registered successfully"
    });

    console.log("✅ User registered:", email);
  } catch (error) {
    console.error("❌ Error in SignupController:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
// ----------------------login_user--------------------------------
export const LoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const existuser = await User.findOne({ email }).select('+password');



    if (!existuser) {
      return res.status(400).json({ message: "User does not exist" });

    }
    const passwordMatch = await existuser.comparePassword(password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // Generate the token BEFORE sending the response.
    // GenToken is synchronous, so `await` is not needed.
    GenToken(res, existuser._id);

    res.status(200).json({
      id: existuser._id,
      name: existuser.name,
      email: existuser.email,
      isAdmin: existuser.isAdmin,
      message: "Login successful",
    });

  } catch (error) {
    console.error("❌ Error in LoginController:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// --------------------check_user_login------------------------------

export const CheckController = (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(req.user);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

//------------------------logout_user---------------------------

export const LogoutController = (req,res)=>{
  try {
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('jwt', '', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      expires: new Date(0),
    });
  return res.status(200).json({message: 'Logout successful'})
  } catch (error) {
     return res.status(500).json({message: 'Internal server error during logout', error: error.message})
  }
 
}


//  all users get in the User collection
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);  
  } catch (error) {
    console.error("❌ Error in getAllUsers:", error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};