//*****************************************************************************
//
//  routers/team
//
//  Copyright Peter Kaplan 2019. All rights reserved.
//*****************************************************************************
const express = require('express')
const ObjectId = require('mongoose').Types.ObjectId; 
//*****************************************************************************
const TeamMember = require('../models/teamMember');
const errors = require('../utils/errors');
const sockets = require('../app-config/sockets');
//*****************************************************************************
const router = new express.Router()
//*****************************************************************************
//  get function for list of records
//*****************************************************************************
router.get('/', async (req, res) => {
    // nothing on /teammember/
    res.status(404).send("")
})
//*****************************************************************************
// get function for team records
//*****************************************************************************
router.get('/team/:id', async (req, res) => {
    try {
        let filters = {};
        if (req.params.id === 'new') {
            res.json([]);
            return;
        }
        filters['team'] = req.params.id;
        const records = await TeamMember.find(filters)
        res.json(records)
    } catch (e) {
        res.status(500).send(e)
    }
})
//*****************************************************************************
router.get('/user/:id', async (req, res) => {
    try {
        let filters = {};
        if (req.params.id === 'new') {
            res.json([]);
            return;
        }
        filters['user'] = req.params.id;
        const records = await TeamMember.find(filters)
        res.json(records)
    } catch (e) {
        res.status(500).send(e)
    }
})
//*****************************************************************************
// post function adding a new record
//*****************************************************************************
router.post('/team/:id', async (req, res) => {
    try {
        if (!req.body)
            throw errors.missingParam

        req.body.forEach( (user) => {
            sockets.teammember.to(user).emit('add', req.params.id);
            const record = new TeamMember({ 'user':user, 'team': req.params.id });
            record.save();
        });

        res.status(201).send("Success")
    } catch (e) {
        res.status(400).send(e)
    }
})

//*****************************************************************************
router.delete('/team/:id', async (req, res) => {
    try {
        if (!req.body)
            throw errors.missingParam

        req.body.forEach( async (user) => {
            sockets.teammember.to(user).emit('delete', req.params.id);
           await TeamMember.deleteOne({ 'user':user, 'team': req.params.id })
        });

        res.status(201).send("Success")
    } catch (e) {
        res.status(400).send(e)
    }
})

//*****************************************************************************
// patch function editing an existing record
//*****************************************************************************
router.patch('/:id', async (req, res) => {
    // try {
    //     const record = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    //     if (!record) {
    //         return res.status(404).send()
    //     }
    //     sockets.team.to(req.body.org).emit('edit', record);
    //     res.send(record)
    // } catch (e) {
    //     res.status(400).send(e)
    // }
})
//*****************************************************************************
router.delete('team/:id', async (req, res) => {
    // try {
    //     // If we are actually going to delete
    //     // we should remove membership records as well

    //     const record = await Team.findByIdAndDelete(req.params.id)
    //     if (!record) {
    //         return res.status(404).send()
    //     }

    //     sockets.team.to(req.body.org).emit('delete', record);
    //    res.send(record)
    // } catch (e) {
    //     res.status(500).send()
    // }
})
//*****************************************************************************
module.exports = router