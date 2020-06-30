//*****************************************************************************
//
//  routers/jobTitle
//
//  Copyright Peter Kaplan 2019. All rights reserved.
//*****************************************************************************
const express   = require('express')
const router = new express.Router()

const Model = require('../models/jobTitle')

//*****************************************************************************
router.post('/', async (req, res) => {
    const record = new Model(req.body)

    if (!req.user.userType.includes("OrgAdmin")) {
        res.status(401).send("Unauthorized")
        return 
    }

    try {
        await record.save()
        res.status(201).send(record)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const record = await Model.findOne({ _id})
        if (!record) {
            return res.status(404).send()
        }

        res.json(record)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/', async (req, res) => {
    try {
        let filter = {};
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

        const record = await Model.find(filter).collation({ locale: "en" }).sort(sort)
        if (!record) {
            return res.status(404).send()
        }

        res.json(record)
    } catch (e) {
        res.status(500).send()
    }
})


router.delete('/:id', async (req, res) => {
    try {
        const record = await Model.findOneAndDelete({ _id: req.params.id })

        if (!record) {
            res.status(404).send()
        }

        res.send(record)
    } catch (e) {
        res.status(500).send()
    }
})

//*****************************************************************************
router.patch('/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = [ 'active', 'name', 'description', 'missionStatement' ];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!req.user.userType.includes("OrgAdmin")) {
        res.status(401).send("Unauthorized")
        return 
    }

    // if (!isValidOperation) {
    //     return res.status(400).send({ error: 'Invalid updates!' })
    // }

    try {
        const record = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        if (!record) {
            return res.status(404).send()
        }

        res.send(record)
    } catch (e) {
        res.status(400).send(e)
    }
})
module.exports = router