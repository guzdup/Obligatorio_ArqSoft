const mongoose = require('mongoose')
const { usersDbConnection} = require('../../bdMongo');

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    }, 
    documentID:{
        type: Number,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        minLength: 8,
    },
    dateOfBirth:{
        type: Date,
        required: true,
        validate: {
            validator: function (date) {
              return date < new Date();
            },
            message: 'La fecha de nacimiento debe ser anterior a la fecha actual.',
          },
    }, 
    address:{
        type: String,
        required: true
    },
    telephone: {
        type: Number,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    picture:{
        type: Buffer,
        required: true
    },
    role:{
        type: String,
        enum: ['admin', 'u', 'p', 'a'], //admin -> administrador ; u -> usuario ; p -> profesional ; a -> administrativo
        required: true
    },
    verified:{
        type: Boolean,
        default: false
    },
})

const User = usersDbConnection.model('User', userSchema);

module.exports = User;