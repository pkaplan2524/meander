//*****************************************************************************
//
//  models/team.js
//
//  Copyright Peter Kaplan 2019. All rights reserved.
//*****************************************************************************
const mongoose      = require('mongoose')
//*****************************************************************************
const tableName     = "Team"
//*****************************************************************************
// schema
//*****************************************************************************
const thisSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default:""
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    private: {
        type: Boolean,
        required: true,
        default: true
    },
    meetingDay: {
        type:Number,
        default:1
    },
    scoresDay: {
        type:Number,
        default:1
    },
    leader: {
        type: mongoose.Schema.Types.ObjectId,
    },
    org: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
   }
}, {
    timestamps: true
})
//*****************************************************************************
// Connect the model to mongoose and export
//*****************************************************************************
module.exports = mongoose.model( tableName, thisSchema)