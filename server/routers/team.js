//*****************************************************************************
//
//  routers/team
//
//  Copyright Peter Kaplan 2019. All rights reserved.
//*****************************************************************************
const express = require('express')
const ObjectId = require('mongoose').Types.ObjectId; 
//*****************************************************************************
const Team = require('../models/team');
const errors = require('../utils/errors');
const sockets = require('../app-config/sockets');
//*****************************************************************************
const router = new express.Router()
//*****************************************************************************
//  get function for list of records
//*****************************************************************************
router.get('/', async (req, res) => {

    try {
        const fields = "name active";
        let filters = {};
        let sort = {};

        // Handle Sorting
        if (req.query && req.query.sort) {
            const sortFields = req.query.sort.split(',');
            sortFields.map((item)=> {
                const entry = item.split(':');
                if (entry.length===1) entry[1]=1;
                sort[entry[0]] = parseInt(entry[1]);
            })
        }

        // will there be any filters
        if (req.query && req.query.org) {
            filters['org'] = new ObjectId(req.query.org);
        }

        if (req.query && req.query.reportsTo) {
            filters['leader'] = new ObjectId(req.query.reportsTo);
        }

        // This is a weird one
        if (req.query && !req.query.showInactive) {
            filters['active'] = true;
        }

        const records = await Team.find(filters, fields).collation({ locale: "en" }).sort(sort)
        res.json(records)
    } catch (e) {
        res.status(500).send(e)
    }
})
//*****************************************************************************
// get function for specific record
//*****************************************************************************
router.get('/:id', async (req, res) => {
    const _id = req.params.id

    try {
        let record = await Team.findById(_id);
        if (!record) {
            return res.status(404).send()
        }

        res.json(record)
    } catch (e) {
        res.status(500).send(e)
    }
})
//*****************************************************************************
// post function adding a new record
//*****************************************************************************
router.post('/', async (req, res) => {
    try {
        if (!req.body)
            throw errors.missingParam

        delete req.body._id;
        
        const record = new Team(req.body)
        await record.save()

        sockets.team.to(req.body.org).emit('add', record);
        res.status(201).send(record)
    } catch (e) {
        res.status(400).send(e)
    }
})
//*****************************************************************************
// patch function editing an existing record
//*****************************************************************************
router.patch('/:id', async (req, res) => {
    try {
        const record = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!record) {
            return res.status(404).send()
        }
        sockets.team.to(req.body.org).emit('edit', record);
        res.send(record)
    } catch (e) {
        res.status(400).send(e)
    }
})
//*****************************************************************************
router.delete('/:id', async (req, res) => {
    try {
        // If we are actually going to delete
        // we should remove membership records as well

        const record = await Team.findByIdAndDelete(req.params.id)
        if (!record) {
            return res.status(404).send()
        }

        sockets.team.to(req.body.org).emit('delete', record);
       res.send(record)
    } catch (e) {
        res.status(500).send()
    }
})
//*****************************************************************************
module.exports = router