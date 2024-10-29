const { generateToken } = require("../../us-chat-backend/src/config/generateToken");
const authService = require("../services/authService");
const asyncHandler = require("express-async-handler");

// .getUsers = async (req, res) => {
//   try {
//     const users = await userService.getUsers();
//     res.status(200).json(users);
//   } catch (error) {
//       res.status(404)
//         .json({ message: "Error fetching users", error: error.message });
//   }
// };

exports.registerUser = asyncHandler(async (req, res) => {
  try {
    const userData = req.body;
    const userId = await authService.registerUser(userData);

    if (!userId) throw new Error("User registration failed, please retry...!");

    res.status(201).json({ newUserId: userId, accessTokem: generateToken(userId) });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error Adding users", error: error.message });
  }
});

exports.loginUser = asyncHandler( async(req, res) => {
  try {
      const userData = req.body;
      const userDetails = await authService.userLogin(userData);
      res.status(200).json(userDetails);
      
  }
  catch (error) {
    res.status(500)
        .json({ message: "Error Adding users", error: error.message });
  }
});

// exports.updateUser = async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const user = await userService.updateUser(userId, req.body);
//     res.status(200).json({ user: user }); 
//   } catch (error) {
//     res.status(404)
//         .json({ message: "Error updating users", error: error.message });
//   }
// }

// exports.deleteUser = async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const deletedUser = await userService.deleteUser(userId)
//     res.status(200).json({ message: `user deleted sucessfully` });
//   } catch (error) {
//       res.status(500)
//         .json({ message: "Error deleting users", error: error.message });
//   }
// }