const UserModel = require("../../models/userModel/user");
const tokenController = require("../tokenController/tokenController");

const createUser = async (params) => {
    const { email } = params;
    try {
        if (await UserModel.findOne({email}) != null) {
            return { "error": "User already exists." };
        }
        
        const user = await UserModel.create(params);

        user.password = undefined;
        
        return { user, token: tokenController.generateToken(user.id) };
    } catch (err) {
        return { "error": "Registration failed: " + err };
    }
}

module.exports = { createUser };