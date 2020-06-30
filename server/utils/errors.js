//*****************************************************************************
//
//  utils/errors
//
//  Copyright Peter Kaplan 2019. All rights reserved.
//*****************************************************************************
const errors = {
    badParam: { error: 400, message: "Bad Parameter"},
    cantFindRecord: { error: 400, message: "Can't Find Record"},
    alreadyValidated: { error: 400, message: "Already Validated"},
    missingParam: { error: 400, message: "Parameter Missing"},
    passwordsDontMatch: { error: 400, message: "Passwords don't Match"}
}

module.exports = errors