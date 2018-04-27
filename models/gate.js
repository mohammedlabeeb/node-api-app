'use strict';
const bcrypt = require('bcrypt');
const bcrypt_p = require('bcrypt-promise');
const jwt = require('jsonwebtoken');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('Gate', {
        gateID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        nickName: DataTypes.STRING,
        info: DataTypes.STRING,
        thumb: DataTypes.STRING,
        password: DataTypes.STRING
    });

    Model.associate = function (models) {
        models.Gate.belongsTo(models.Company, {
            foreignKey: 'companyID'
        });
        models.Gate.belongsTo(models.User, {
            foreignKey: 'userID'
        });
    };

    Model.beforeSave(async (gate, options) => {
        let err;
        if (gate.changed('password')) {
            let salt, hash;
            [err, salt] = await to(bcrypt.genSalt(10));
            if (err) TE(err.message, true);
            [err, hash] = await to(bcrypt.hash(gate.password, salt));
            if (err) TE(err.message, true);

            gate.password = hash;
        }
    });

    Model.prototype.comparePassword = async function (pw) {
        let err, pass
        if (!this.password) TE('password not set');

        [err, pass] = await to(bcrypt_p.compare(pw, this.password));
        if (err) TE(err);

        if (!pass) TE('invalid password');

        return this;
    }

    Model.prototype.toWeb = function (pw) {
        let json = this.toJSON();
        return json;
    };

    return Model;
};