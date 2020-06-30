//*****************************************************************************
//
//  routers/organization
//
//  Copyright Peter Kaplan 2019. All rights reserved.
//*****************************************************************************
const express   = require('express')
const router = new express.Router()
const mongoose  = require('mongoose')

const Org = require('../models/organization')
const User = require('../models/user')

//*****************************************************************************
router.post('/', async (req, res) => {
    const org = new Org(req.body)

    if (!req.user.userType.includes("OrgAdmin")) {
        res.status(401).send("Unauthorized")
        return 
    }

    try {
        await org.save()
        res.status(201).send(org)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const record = await Org.findOne({ _id})
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

        const record = await Org.find(filter).collation({ locale: "en" }).sort(sort)
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
        const record = await Org.findOneAndDelete({ _id: req.params.id })

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
        const record = await Org.findById(req.params.id);
        if (!record) {
            return res.status(404).send()
        }

        // The tricky bit here is updating the admins list
        // so we are only going to do that if the updated
        // record 1) has admins defined and it is different
        // that the one we already have
        if  (req.body.admins) {

            let equal = true;

            // if it is different lengths we know a 
            // change happened
            if(req.body.admins.length !== record.admins.lenth)
                equal = false;

            // But if it is the same length ut could
            // still have changed...so look at each one.
            if (equal) {
                const arrayOld = record.admins.sort();
                const arraynew = req.body.admins.sort();
                for (let i = 0; i < arrayOld.length; i++) {
                    if (arrayOld[i] !== arraynew[i])
                        equal = false;
                }
            }

            // If they are not equal. We need to remove the 
            // userType from anyone who has been removed and add
            // the OrgAdmin userType to anyone who has been added
            if (!equal) {
                let oldAdmins = record.admins.filter((userId) => {
                    return req.body.admins.findIndex((adminId) => {
                        return userId == adminId }) < 0;
                });

                let newAdmins = req.body.admins.filter((userId) => {
                    return record.admins.findIndex((adminId) => {
                        return userId == adminId }) < 0;
                });

                oldAdmins = await User.find({_id: { $in: 
                                        oldAdmins.map((rec)=> mongoose.Types.ObjectId(rec))}})
                newAdmins = await User.find({_id: { $in: 
                                        newAdmins.map((rec)=> mongoose.Types.ObjectId(rec))}})

                oldAdmins.forEach((value, index)=> {
                    value.userType = value.userType.split(',').filter((e) => e !=='OrgAdmin').join(",");
                    value.save();
               })
                newAdmins.forEach((value, index)=> {
                    value.userType = value.userType.split(',').concat(['OrgAdmin']).join(",");
                    value.save();
                })
            }
        }

        // If it was defined in the body, update it
        Object.keys(req.body).forEach(key => {
            record[key] = req.body[key];
        });

        await record.save();
        res.send(record)
    } catch (e) {
        res.status(400).send(e)
    }
})
module.exports = router