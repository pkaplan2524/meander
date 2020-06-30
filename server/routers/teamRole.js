//*****************************************************************************
//
//  routers/team
//
//  Copyright Peter Kaplan 2019. All rights reserved.
//*****************************************************************************
const express = require('express')
const ObjectId = require('mongoose').Types.ObjectId; 
//*****************************************************************************
const DatabaseTable = require('../models/teamRole');
const errors = require('../utils/errors');
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

        // Only allow records from the logged in user's org
        if (req.user && req.user.org) {
            filters['org'] = new ObjectId(req.user.org);
        }

        // This is a weird one
        if (req.query && !req.query.showInactive) {
            filters['active'] = true;
        }

        const records = await DatabaseTable.find(filters, fields).collation({ locale: "en" }).sort(sort)
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
        let record = await DatabaseTable.findById(_id);
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
        console.log("Hi 1");
        if (!req.body)
            throw errors.missingParam

        console.log("Hi 2");
        delete req.body._id;
        
        console.log("Hi 3");
        const record = new DatabaseTable(req.body)
        console.log("Hi 4");
        await record.save()
        console.log("Hi 5");

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
        const record = await DatabaseTable.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!record) {
            return res.status(404).send()
        }
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

        const record = await DatabaseTable.findByIdAndDelete(req.params.id)
        if (!record) {
            return res.status(404).send()
        }

       res.send(record)
    } catch (e) {
        res.status(500).send()
    }
})
//*****************************************************************************
module.exports = router