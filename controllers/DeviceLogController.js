const DeviceData = require('../models').DeviceData;
const Device = require('../models').Device;

const create = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    let body = req.body;
    console.log(req.body, "Fataarara");
    if (Object.keys(body).length === 0 && body.constructor === Object) {
        body = req.query;
    }
    if (!body.token) {
        return ReE(res, 'No token available.');
    } else {
        let err, user;
        console.log("Before Tokken -------------");

        [err, device] = await to(Device.findOne({
            where: {
                token: body.token
            }
        }));
        if (err) return ReE(res, err, 422);
        if (device && device.serialNo) {
            body.serialNo = device.serialNo;

            [err, logData] = await to(DeviceData.create(body));
            if (err) return ReE(res, err, 422);
            return ReS(res, {
                message: 'Successfully added.',
                logData: logData.toWeb()
            }, 201);
        } else {
            return ReE(res, 'Invalid Token.');
        }
    }
}

const get = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    let DeviceData_id = req.params.DeviceData_id;

    let [err, DeviceData] = await to(DeviceData.findById(DeviceData_id));
    if (err) return ReE(res, err, 422);
    return ReS(res, {
        message: 'success',
        DeviceData: DeviceData.toWeb(),
    }, 201);
}

const all = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    let err, DeviceData;
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
    [err, DeviceData] = await to(DeviceData.findAll(findObj));
    if (err) return ReE(res, err, 422);
    return ReS(res, {
        message: 'success',
        DeviceData: DeviceData.toWeb(),
    }, 201);
}

const update = async function (req, res) {
    let err, user, data
    user = req.user;
    data = req.body;

    if (user.superAdmin || (user.companyAdmin && user.companyID === data.companyID) || (user.userID === data.userID)) {
        [err, user] = await to(DeviceData.save(data));
        if (err) {
            if (err.message == 'Validation error') err = 'DeviceData Id not Matching';
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
        [err, DeviceData] = await to(DeviceData.destroy(data));
        if (err) return ReE(res, 'error occured trying to delete DeviceData');

        return ReS(res, {
            message: 'Deleted DeviceData'
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