const userService = require("../services/usersServices");


exports.getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.status(200).json(users);
  } catch (error) {
      res.status(404)
        .json({ message: "Error fetching users", error: error.message });
  }
};

exports.addUser = async (req, res) => {
  try {
    const user = req.body;
    console.log(user);
    const userId = await userService.createUser(user);

    res.status(201).json({ newUserId: userId });  
  } catch (error) {
      res.status(500)
        .json({ message: "Error Adding users", error: error.message });
  }
}

exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userService.updateUser(userId, req.body);
    res.status(200).json({ user: user }); 
  } catch (error) {
    res.status(404)
        .json({ message: "Error updating users", error: error.message });
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await userService.deleteUser(userId)
    res.status(200).json({ message: `user deleted sucessfully` });
  } catch (error) {
      res.status(500)
        .json({ message: "Error deleting users", error: error.message });
  }
}