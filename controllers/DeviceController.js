const Device = require('../models').Device;

const sh = require("shorthash");

const create = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    const body = req.body;
    console.log(body);
    if (!body.serialNo) {
        return ReE(res, 'Please enter a Device serial No to register.');
    } else if (!body.password) {
        return ReE(res, 'Please enter a password to register.');
    } else {
        let err, device;
        body.userID = req.user.userID;
        body.companyID = req.user.companyID;

        let found = true;
        let unique = '';
        while (found) {
            unique = sh.unique(`${body.serialNo}-${new Date().getTime()}`);
            let [err, foundrow] = await to(Device.findAndCount({
                token: unique
            }));
            if (foundrow) {
                found = false;
            }
        }
        body.token = unique;
        [err, device] = await to(Device.create(body));
        if (err) return ReE(res, err, 422);
        return ReS(res, {
            message: 'Successfully created new device.',
            device: device.toWeb()
        }, 201);
    }
}

const get = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    let device_id = req.params.device_id;

    let [err, device] = await to(Device.findById(device_id));
    if (err) return ReE(res, err, 422);
    return ReS(res, {
        message: 'success',
        device: device.toWeb(),
    }, 201);
}

const all = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    let err, device;
    user = req.user;
    let findObj;
    if (user.superAdmin) {
        findObj = {};
    } else if (user.companyAdmin) {
        findObj = {
            companyID: user.companyID
        }
    } else {
        findObj = {
            gateID: user.gateID
        }
    }
    [err, device] = await to(Device.findAll(findObj));
    if (err) return ReE(res, err, 422);
    return ReS(res, {
        message: 'success',
        device: device.toWeb(),
    }, 201);
}

const update = async function (req, res) {
    let err, user, data
    user = req.user;
    data = req.body;

    if (user.superAdmin || (user.companyAdmin && user.companyID === data.companyID) || (user.userID === data.userID)) {
        [err, user] = await to(Device.save(data));
        if (err) {
            if (err.message == 'Validation error') err = 'Device Id not Matching';
            return ReE(res, err);
        }
        return ReS(res, {
            message: 'Updated User: ' + user.email
        });
    } else {
        return ReS(res, {
            message: 'Permission Error'
        });
    }


}

const remove = async function (req, res) {
    let user, err;
    user = req.user;
    data = req.body;
    if (user.superAdmin || (user.companyAdmin && user.companyID === data.companyID) || (user.userID === data.userID)) {
        [err, device] = await to(Device.destroy(data));
        if (err) return ReE(res, 'error occured trying to delete device');

        return ReS(res, {
            message: 'Deleted device'
        }, 204);
    } else {
        return ReS(res, {
            message: 'Permission Error'
        });
    }
}


module.exports = {
    create: create,
    get: get,
    update: update,
    remove: remove,
    all: all
}