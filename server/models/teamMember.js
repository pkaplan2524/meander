//*****************************************************************************
//
//  models/teamMember.js
//
//  Copyright Peter Kaplan 2019. All rights reserved.
//*****************************************************************************
const mongoose      = require('mongoose')
//*****************************************************************************
const tableName     = "TeamMembers"
//*****************************************************************************
// schema
//*****************************************************************************
const thisSchema = new mongoose.Schema({
    team: {
        type: mongoose.Schema.Types.ObjectId,
         required: true
   },
    user: {
        type: mongoose.Schema.Types.ObjectId,
         required: true
   },
    role: {
        type: mongoose.Schema.Types.ObjectId,
   }
}, {
    timestamps: true
});

thisSchema.index({team:1, user:1})
//*****************************************************************************
// Connect the model to mongoose
//*****************************************************************************
const TeamMembers = mongoose.model( tableName, thisSchema)
//*****************************************************************************
module.exports = TeamMembers