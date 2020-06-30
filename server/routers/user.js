//*****************************************************************************
//
//  routers/user
//
//  Copyright Peter Kaplan 2019. All rights reserved.
//*****************************************************************************
const express = require('express')
const ObjectId = require('mongoose').Types.ObjectId; 
const multer = require('multer');
const sharp = require('sharp')
const bcrypt = require('bcryptjs')
//*****************************************************************************
const User = require('../models/user')
const Address = require('../models/address')
const errors = require('./../utils/errors')
const emailer = require('./../utils/emailer')
//*****************************************************************************
const router = new express.Router()
//*****************************************************************************
//  get function for list of records
//*****************************************************************************
router.get('/', async (req, res) => {
    try {
        const fields = "firstName lastName active";
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

        // will there be any filters
        if (req.user && req.user.org) {
            filters['org'] = new ObjectId(req.user.org);
        }

        if (req.query && req.query.reportsTo) {
            filters['reportsTo'] = new ObjectId(req.query.reportsTo);
        }

        if (req.query && req.query.workLocation) {
            filters['workLocation'] = new ObjectId(req.query.workLocation);
        }
       
        // This is a weird one
        if (req.query && !req.query.showInactive) {
            filters['active'] = true;
        }

        const records = await User.find(filters, fields).collation({ locale: "en" }).sort(sort)
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
        let record = await User.findById(_id).populate('address').exec();
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

        // This is a little dance for
        // handling items that should
        // not be changed on this call
        delete req.body.avatar;
        delete req.body.password;

        // This is a little dance for 
        // handling items that the web ui
        // and the database want to handle
        // differently. (should be done in UI?)
        if (req.body.jobTitle === "")
            req.body.jobTitle = null;
        if (req.body.workLocation === "")
            req.body.workLocation = null;
        
        const record = new User(req.body)
        await record.save()

        // Handle saving anything that is implemented
        // via virtual feilds.
        if (req.body.address) {
            req.body.address.name = req.body.firstName + " " + req.body.lastName + " Home"
            req.body.address.owner = record._id;
            const address = new Address(req.body.address);
            await address.save();
            record.address = address;
        }
        emailer.createNewUserEmail( record.firstName + " " + record.lastName, record.email, record.validator);

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
        // This is a little dance for
        // handling items that should
        // not be changed on this call
        delete req.body.avatar;
        delete req.body.password;

        // This is a little dance for 
        // handling items that the web ui
        // and the database want to handle
        // differently. (should be done in UI?)
        if (req.body.jobTitle === "")
            req.body.jobTitle = null;
        if (req.body.officeLocation === "")
            req.body.officeLocation = null;

        // save virtuals first, otherwise they will not be properly returned
        if(req.body.address)
            await Address.findByIdAndUpdate(req.body.address._id, req.body.address);
        const record = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('address').exec()
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
        // Users can only have one address
        Address.deleteOne({ owner: req.params.id })
        const record = await User.findByIdAndDelete(req.params.id)
        if (!record) {
            return res.status(404).send()
        }

        res.send(record)
    } catch (e) {
        res.status(500).send()
    }
})
//*****************************************************************************
//  The remainder are specialty functions for this particular tyep of record
//*****************************************************************************
router.get('/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})
//*****************************************************************************
const pictureUpload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)
    }
})

//*****************************************************************************
// me functions perform actions on the id of the currently logged in user
//*****************************************************************************
router.post('/me/avatar', pictureUpload.single('avatar'), async (req, res) => {

    try {
        const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
        req.user.avatar = buffer
        await req.user.save()
        res.send(req.user.avatar)
    }
    catch(e) {
        res.status(e).send(e)
    }
});
//*****************************************************************************
router.post('/me/password', async (req, res) => {
    try {
        // body should contain newPassword, oldPassword
        if (!req.body.oldPassword || !req.body.newPassword) 
            throw errors.missingParam

        // make sure old password is valid
        if (await bcrypt.compare(req.body.oldPassword, req.user.password)) {
            req.user.password = req.body.newPassword;
            await req.user.save()
            res.send("Success")
        }
        else         
            throw errors.passwordsDontMatch
    }
    catch(e) {
        res.status(e.error).json(e)
    }
});
//*****************************************************************************
module.exports = router