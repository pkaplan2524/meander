//*****************************************************************************
//
//  models/issue.js
//
//  Copyright Peter Kaplan 2019. All rights reserved.
//*****************************************************************************
const mongoose      = require('mongoose')
const Schema = mongoose.Schema;

//*****************************************************************************
const tableName     = "Issue"
//*****************************************************************************
// schema
//*****************************************************************************
const thisSchema = new mongoose.Schema({
    org: {
        type: mongoose.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    team: {
        type: mongoose.Types.ObjectId,
        ref: 'Team',
        required: false
    },
    category: {
        type: String,
        required: false,
        trim: true
    },
    urgency: {
        type: String,
        required: false,
        trim: true
    },
    creator: { 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    },
    owner: { 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    notes: {
        type: String,
        trim: true
    },
    vto: {
        type: Boolean,
        required: true,
        default: false
    },
    archived: {
        type: Boolean,
        required: true,
        default: false
    },
    dateClosed: {
        type: Date,
        default:null,
        required:false
    }

}, {
    timestamps: true
});

//*****************************************************************************
// Connect the model to mongoose and export
//*****************************************************************************
module.exports = mongoose.model( tableName, thisSchema)