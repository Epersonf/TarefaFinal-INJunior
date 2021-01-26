//Auth
const userRoute = require("./authRoutes/user/user");

//Common
const loginRoute = require("./commonRoutes/login/login");

function useRoutes(app) {
    //Auth
    app.use('/auth', userRoute);
    
    //Common
    app.use('/', loginRoute);
}

module.exports = useRoutes;