//*****************************************************************************
//
//  models/organization.js
//
//  Copyright Peter Kaplan 2019. All rights reserved.
//*****************************************************************************
const mongoose      = require('mongoose')

const tableName     = "Organization"

//const validator     = require('validator')
const FREE_TIER = "Free"
const BASIC_TIER = "Basic"
const STANDARD_TIER = "Standard"
const ENTERPRISE_TIER = "Enterprise"
//*****************************************************************************
// schema
//*****************************************************************************
const thisSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    tagline: {
        type: String,
        trim: true,
        default:""
    },
    missionStatement: {
        type: String,
        trim: true,
        default:""
    },
    coreValues: {
        type: String,
        trim: true,
        default:""
    },
    marketingStrategy: {
        type: String,
        trim: true,
        default:""
    },
    goalsOneYear: {
        type: String,
        trim: true,
        default:""
    },
    goalsThreeYear: {
        type: String,
        trim: true,
        default:""
    },
    goalsTenYear: {
        type: String,
        trim: true,
        default:""
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    }, 
    plan: {
        type: String,
        required: true,
        default: FREE_TIER
    },
    primaryAddress: {
        type: mongoose.Schema.Types.ObjectId
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
    },
    admins: [{
            type: mongoose.Schema.Types.ObjectId,
            required: false
    }],
    logo: {
        type: String
    }  
}, {
    timestamps: true
})

thisSchema.virtual('addresses', {
    ref: 'Address',
    localField: '_id',
    foreignField: 'owner'
})

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