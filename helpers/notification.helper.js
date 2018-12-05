var User = require('../models/user');
var Notification = require('../models/notification');
var Acerto = require('../models/acerto');
var io = require('socket.io')();
var connection = require('../connection');

var io = connection.io;

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
    return notifications;
}

const notifyUser = async (req, res, next) => {
    let notification = req.notification;

    if(!notification){
        next();
    }

    console.log('notification sent to ', notification.to);
    io.sockets.to(notification.to).emit('notification', notification);
    try{
      await User.updateOne({'_id': notification.to}, {$set: {notificacoes: notification._id}});
    }
    catch(e){
      console.log(e);
    }
    
    res.status(200).json(notification);
  }

module.exports = {
    getAutomaticNotifications,
    getEstoqueAutomaticNotifications,
    notifyUser
}