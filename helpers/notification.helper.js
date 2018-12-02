var User = require('../models/user');
var Notification = require('../models/notification');
var Acerto = require('../models/acerto');

const createNewKitNotification = user => {
    let notification = {
        type: 'NewKit',
        userName: user.nome,
        userId: user._id,
        userSupervisor: user.supervisor
    };
    return notification;
}

const getAutomaticNotifications = async user => {
    let { tipo, _id: id } = user;
    let notifications = await Notification.find({ status: 'Pending', to: id }).exec();
    switch (tipo) {
        case 'Consultor':
            notifications.concat(getConsultorAutomaticNotifications(user));
            break;
        case 'Supervisor':
            getSupervisorAutomaticNotifications(user);
            break;
        case 'Controladoria':
            getControladorAutomaticNotifications(user);
            break;
        case 'Estoque':
            notifications.concat(await getEstoqueAutomaticNotifications());
            break;
    }
    console.log(notifications);
    return notifications;
}

const getConsultorAutomaticNotifications = (user) => {
    return [];
}

const getSupervisorAutomaticNotifications = (user) => {
    return [];
}

const getControladorAutomaticNotifications = (user) => {
    return [];
}

const getEstoqueAutomaticNotifications = async (user) => {
    //montar kit para novos usuários
    console.log('Buscando notificações para o estoque');
    let approvedUsers = await User.find({status: "Aprovado"}).where('supervisor').exists().exec();
    var notifications = [];
    for(let i=0; i<approvedUsers.length; i++){
        //procurar por kits e nao por acertos !!!!
        let acertos = await Acerto.find({userId: approvedUsers[i]._id}).exec();
        if(acertos.length==0){
            let notification = createNewKitNotification(approvedUsers[i]);
            //console.log(notification);
            notifications.push(notification);
        }
    };
    console.log(notifications.length);
    return notifications;
}

module.exports = {
    getAutomaticNotifications,
    getEstoqueAutomaticNotifications
}