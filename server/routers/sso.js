//*****************************************************************************
//
//  routers/sso
//
//  Copyright Peter Kaplan 2019. All rights reserved.
//*****************************************************************************
// This is a unique situation. This file will contain the express router for 
// login/logout for token authorization. 
//
// This way all the tricky bits are contained in this one file.
//
// The only other thing it needs is the user model. Becaue that is where the 
// users are stored and that file handles generating and validating jwt
//*****************************************************************************
const User       = require('../models/user')
const chalk      = require('chalk')
const express    = require('express')
const middleware = require('../middleware/userAuth');
//*****************************************************************************
// express router for single sign on
//*****************************************************************************
const router = new express.Router()

//*****************************************************************************
// login
//*****************************************************************************
router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.json({ user, token })
    } catch (e) {
        res.status(400).json({error:400, message:"Unable to login"})
    }
})

//*****************************************************************************
// logout
//*****************************************************************************
router.post('/logout', middleware, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.json( { status:"Success"})
    } catch (e) {
        res.status(500).json({ status:"Failure"})
    }
})
//*****************************************************************************
// logoutAll
//*****************************************************************************
router.post('/logoutAll', middleware, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.json( { status:"Success"})
    } catch (e) {
        res.status(500).json({ status:"Failure"})
    }
})
//*****************************************************************************
// checkAuth
//*****************************************************************************
router.get('/checkAuth', middleware, async (req, res) => {
    try {
        res.json({ user:req.user, token:req.token })
    } catch (e) {
        res.status(500).json({ status:"Failure"})
    }
})
//*****************************************************************************
module.exports = router;