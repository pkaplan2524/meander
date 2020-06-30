//*****************************************************************************
//
//  models/jobTitle.js
//
//  Copyright Peter Kaplan 2019. All rights reserved.
//*****************************************************************************
const mongoose      = require('mongoose')
//const validator     = require('validator')
//*****************************************************************************
const tableName     = "JobTitle"
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