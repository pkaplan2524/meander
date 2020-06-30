//*****************************************************************************
//
//  models/address.js
//
//  Copyright Peter Kaplan 2019. All rights reserved.
//*****************************************************************************
const mongoose      = require('mongoose')
//const validator     = require('validator')
const tableName     = "Address"
//*****************************************************************************
//  schema
//*****************************************************************************
const thisSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true

    },
    street1: {
        type: String,
        trim: true
    },
    street2: {
        type: String,
        trim: true
    },   
    city: {
        type: String,
        trim: true
    },   
    state: {
        type: String,
        trim: true
    },   
    zipcode: {
        type: String,
        trim: true
    },   
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    active:{
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

// organizationSchema.virtual('tasks', {
//     ref: 'Task',
//     localField: '_id',
//     foreignField: 'owner'
// })

//*****************************************************************************
// organizationSchema.methods.toJSON = function () {
//     const user = this
//     const userObject = user.toObject()

//     delete userObject.password
//     delete userObject.tokens
//     delete userObject.__v
//     //delete userObject.avatar

//     return userObject
// }
//*****************************************************************************
// organizationSchema.statics.findByCredentials = async (email, password) => {
//     const user = await User.findOne({ email })
    
//     if (!user) {
//         throw new Error('Unable to login')
//     }

//     const isMatch = await bcrypt.compare(password, user.password)

//     if (!isMatch) {
//         throw new Error('Unable to login')
//     }

//     return user
// }

//*****************************************************************************
// Hash the plain text password before saving
//*****************************************************************************
// organizationSchema.pre('save', async function (next) {
//     const user = this

//     if (user.isModified('password')) {
//         user.password = await bcrypt.hash(user.password, encryptionPasses)
//     }

//     next()
// })


// // Delete user tasks when user is removed
// userSchema.pre('remove', async function (next) {
//     const user = this
//     await Task.deleteMany({ owner: user._id })
//     next()
// })


//*****************************************************************************
// Connect the model to mongoose and export
//*****************************************************************************
module.exports = mongoose.model( tableName, thisSchema)