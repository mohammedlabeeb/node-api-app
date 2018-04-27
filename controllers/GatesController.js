const Gates = require('../models').Gate;

const create = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    const body = req.body;
    console.log(body);
    if (!body.nickName) {
        return ReE(res, 'Please enter a Gate name to register.');
    } else if (!body.password) {
        return ReE(res, 'Please enter a password to register.');
    } else {
        let err, user;
        body.userID = req.user.userID;
        body.companyID = req.user.companyID;
        [err, user] = await to(Gates.create(body));
        if (err) return ReE(res, err, 422);
        return ReS(res, {
            message: 'Successfully created new gate.',
            gate: user.toWeb()
        }, 201);
    }
}

const get = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    let gate_id = req.params.gate_id;

    let [err, gate] = await to(Gates.findById(gate_id));
    if (err) return ReE(res, err, 422);
    return ReS(res, {
        message: 'success',
        gate: gate.toWeb(),
    }, 201);
}

const all = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    let err, gate;
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
            userID: user.userID
        }
    }
    [err, gate] = await to(Gates.findAll(findObj));
    if (err) return ReE(res, err, 422);
    return ReS(res, {
        message: 'success',
        gate: gate.toWeb(),
    }, 201);
}

const update = async function (req, res) {
    let err, user, data
    user = req.user;
    data = req.body;

    if (user.superAdmin || (user.companyAdmin && user.companyID === data.companyID) || (user.userID === data.userID)) {
        [err, user] = await to(Gate.save(data));
        if (err) {
            if (err.message == 'Validation error') err = 'Gate Id not Matching';
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
        [err, gate] = await to(Gate.destroy(data));
        if (err) return ReE(res, 'error occured trying to delete gate');

        return ReS(res, {
            message: 'Deleted gate'
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