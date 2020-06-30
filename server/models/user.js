//*****************************************************************************
//
//  models/user.js
//
//  Copyright Peter Kaplan 2019. All rights reserved.
//*****************************************************************************
const mongoose      = require('mongoose')
const validator     = require('validator')
const bcrypt        = require('bcryptjs')
const jwt           = require('jsonwebtoken')
const Address       = require('./address')
//*****************************************************************************
//*****************************************************************************
const encryptionPasses = 8
const tableName     = "User"
//*****************************************************************************
// schema
//*****************************************************************************
const thisSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },   
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    dateHired: {
        type: Date,
        required:false
    },
    jobTitle: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },  
    password: {
        type: String,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    }, 
    validated: {
        type: Boolean,
        required: true,
        default:false
    },
    validator: {
        type: String,
        default:""
    },
    userType: {
        type: String,
        required: true,
        trim: true,
        default: "User"
        // User, Admin, System, SU
    }, 
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    org: {
        type: mongoose.Schema.Types.ObjectId
    },
    workLocation: {
        type: mongoose.Schema.Types.ObjectId
    },
    reportsTo: {
        type: mongoose.Schema.Types.ObjectId
    },
    avatar: {
        type: Buffer
    },  
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true },
    timestamps: true
})

thisSchema.virtual('address', {
    ref: 'Address',
    localField: '_id',
    foreignField: 'owner',
    justOne:true
})

//*****************************************************************************
// Schema methods
//*****************************************************************************

thisSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}
//*****************************************************************************
thisSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.__v
    //delete userObject.avatar

    return userObject
}
//*****************************************************************************
thisSchema.statics.verifyAuthToken = async (token) => {
return  jwt.verify(token, process.env.JWT_SECRET)
}
//*****************************************************************************
thisSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    
    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

//*****************************************************************************
// Hash the plain text password before saving
//*****************************************************************************
thisSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, encryptionPasses)
    }

    if (user.isModified('email')) {
        user.validator = await bcrypt.hash(user.email, encryptionPasses)
    }

    next()
})


// // Delete user tasks when user is removed
// thisSchema.pre('remove', async function (next) {
//     const user = this
//     await Task.deleteMany({ owner: user._id })
//     next()
// })


//*****************************************************************************
// Connect the model to mongoose and export
//*****************************************************************************
module.exports = User = mongoose.model( tableName, thisSchema)