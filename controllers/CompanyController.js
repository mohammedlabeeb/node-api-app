const Company = require('../models').Company;
const User = require('../models').User;

const sh = require("shorthash");

const create = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    let err, company;
    let user = req.user;
    let found = true;
    let unique = '';

    let company_info = req.body;
    while (found) {
        unique = sh.unique(`${company_info.name}-${new Date().getTime()}`);
        let [err, foundrow] = await to(Company.findAndCount({
            token: unique
        }));
        if (foundrow) {
            found = false;
        }
    }
    company_info.token = unique;

    [err, company] = await to(Company.create(company_info));
    if (err) return ReE(res, err, 422);

    /*company.addUser(user, true);

    [err, company] = await to(company.save());
    if(err) return ReE(res, err, 422);*/
    let company_json = company.toWeb();
    user = req.user;
    data = {
        companyAdmin: 1,
        companyID: company_json.companyID
    };
    user.set(data);

    [err, user] = await to(user.save());
    if (err) return ReE(res, err, 422);


    company_json.AdminUser = user;

    return ReS(res, {
        company: company_json
    }, 201);
}
module.exports.create = create;

const getAll = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    let user = req.user;
    let err, companies;

    [err, companies] = await to(user.getCompanies());

    let companies_json = []
    for (let i in companies) {
        let company = companies[i];
        let users = await company.getUsers()
        let company_info = company.toWeb();
        let users_info = []
        for (let i in users) {
            let user = users[i];
            // let user_info = user.toJSON();
            users_info.push({
                user: user.id
            });
        }
        company_info.users = users_info;
        companies_json.push(company_info);
    }

    console.log('c t', companies_json);
    return ReS(res, {
        companies: companies_json
    });
}
module.exports.getAll = getAll;

const get = function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    let company = req.company;

    return ReS(res, {
        company: company.toWeb()
    });
}
module.exports.get = get;

const update = async function (req, res) {
    let err, company, data;
    company = req.company;
    data = req.body;
    company.set(data);

    [err, company] = await to(company.save());
    if (err) {
        return ReE(res, err);
    }
    return ReS(res, {
        company: company.toWeb()
    });
}
module.exports.update = update;

const remove = async function (req, res) {
    let company, err;
    company = req.company;

    [err, company] = await to(company.destroy());
    if (err) return ReE(res, 'error occured trying to delete the company');

    return ReS(res, {
        message: 'Deleted Company'
    }, 204);
}
module.exports.remove = remove;