//*****************************************************************************
//
//  routers/public
//
//  Copyright Peter Kaplan 2019. All rights reserved.
//*****************************************************************************
//
//  This is the list of api functions that are publicly accessable. Meaning
//  that no authorization is needed to use them.
//
//*****************************************************************************
const mongoose  = require('mongoose')
const express   = require('express')
const router    = new express.Router()

const User      = require('../models/user')
const errors    = require('../utils/errors')
//*****************************************************************************
//*****************************************************************************
router.get('/orgs', async (req, res) => {
    try {
        res.json({})
    } catch (e) {
        res.status(500).send()
    }
})
//*****************************************************************************
router.get('/orgs/:name', async (req, res) => {
    try {
        res.json({})
    } catch (e) {
        res.status(500).send()
    }
})
//*****************************************************************************
router.post('/signup', async (req, res) => {

    const user = new User(req.body)
    try {
        await user.save()
        //         sendWelcomeEmail(user.email, user.name)
        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})
//*****************************************************************************
router.get('/validate/:id', async (req, res) => {
    try {
        // if((req.params.id.length != 12) && (req.params.id.length != 24))
        //     throw errors.badParam;
        const user = await User.findOne({ validator:  decodeURIComponent(req.params.id) })
        if (!user) 
            throw errors.cantFindRecord;

        if (user.validated === true) 
            throw errors.alreadyValidated;

        user.validated = true;
        await user.save()
        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})
//*****************************************************************************
router.get('/avatar/:id', async (req, res) => {
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
module.exports = router