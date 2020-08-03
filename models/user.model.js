const { Schema, model } = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const { ObjectId } = Schema.Types;

const UserModelName = 'USER';

const Roles = ['consultant', 'supervisor', 'stockist', 'controller', 'admin'];

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      select: false,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true,
      index: true
    },
    active: {
      type: Boolean,
      default: true
    },
    fullName: {
      type: String,
      required: true
    },
    deactivatedAt: Date,
    lastLogin: Date,
    cpf: String,
    city: String,
    state: String,
    adress: String,
    cep: String,
    phoneNumber: String,
    notifications: [
      {
        type: ObjectId,
        ref: 'Notification'
      }
    ],
    roles: [
      {
        type: String,
        enum: Roles
      }
    ],
    currentRole: {
      type: String,
      enum: Roles
    }
  },
  {
    timestamps: true
  }
);

UserSchema.plugin(passportLocalMongoose);

const UserModel = model(UserModelName, UserSchema);

module.exports = {
  UserModel,
  UserModelName,
  Roles
};
