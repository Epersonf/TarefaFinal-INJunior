const UserModel = require("../../models/userModel/user");
const { createUser } = require("../registerController/registerController");

const defaultUserInfo = {
    'name': 'Principal James',
    'rg': '29.769.710-9',
    'cpf': '609.917.540-77',
    'email': 'principal.james@injunior.com.br',
    'state': 'RJ',
    'password': 'injunior2021iduff',
    'birthdate': '1962-06-06T18:00:00.000Z',
    'userType': 'principal'
};

const initialize = async () => {
    const principal = await UserModel.findOne({userType: 'principal'});
    if (principal != null) {
        return;
    }
    console.log("No principal found, creating one.");
    const resp = await createUser(defaultUserInfo);
    if (resp.error)
        console.log("Fail creating principal: " + resp.error);
    else
        console.log("Principal created.");
}

module.exports = { initialize };