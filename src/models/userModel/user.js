const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rg: {
        type: String,
        required: true
    },
    cpf: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    state: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    birthdate: {
        type: Date,
        required: true
    },
    userType: {
        type: String,
        enum: ['principal', 'course_coordinator', 'department_coordinator', 'professor', 'student'],
        default: 'student'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

UserSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
});

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;