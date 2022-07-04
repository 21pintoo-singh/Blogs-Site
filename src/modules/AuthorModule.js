const mongoose = require('mongoose')


const authorSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: "First name must be required",
        trim: true
    },
    lname: {
        type: String,
        required: "Last name must be required",
        trim: true
    },
    title: {
        type: String,
        required: "Title must be required",
        enum: ['Mr', 'Mrs', 'Miss']
    },
    email: {
        type: String,
        required: true,
        unique: "The email address you entered is already exist",
        trim: true,
        match: [
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please add a valid email address.',
        ]
    },
    password: {
        type: String,
        required: "Password must be required",
        trim: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Author', authorSchema) //authors