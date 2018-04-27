'use strict';
const bcrypt = require('bcrypt');
const bcrypt_p = require('bcrypt-promise');
const jwt = require('jsonwebtoken');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('User', {
        userID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
            validate: {
                isEmail: {
                    msg: "Phone number invalid."
                }
            }
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
            validate: {
                len: {
                    args: [7, 20],
                    msg: "Phone number invalid, too short."
                },
                isNumeric: {
                    msg: "not a valid phone number."
                }
            }
        },
        password: DataTypes.STRING,
        companyAdmin: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
        superAdmin: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
    });

    Model.associate = function (models) {
        this.Users = models.User.belongsTo(models.Company, {
            foreignKey: 'companyID'
        });
    };

    Model.beforeSave(async (user, options) => {
        let err;
        user.superAdmin = false;
        if (user.changed('password')) {
            let salt, hash;
            [err, salt] = await to(bcrypt.genSalt(10));
            if (err) TE(err.message, true);
            [err, hash] = await to(bcrypt.hash(user.password, salt));
            if (err) TE(err.message, true);

            user.password = hash;
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

    Model.prototype.getJWT = function () {
        let expiration_time = parseInt(CONFIG.jwt_expiration);
        return "Bearer " + jwt.sign({
            userID: this.userID,
            superAdmin: this.superAdmin,
            companyAdmin: this.companyAdmin,
            companyID: this.companyID
        }, CONFIG.jwt_encryption, {
            expiresIn: expiration_time
        });
    };

    Model.prototype.toWeb = function (pw) {
        let json = this.toJSON();
        if (json.hasOwnProperty('password')) {
            delete json.password;
        }
        return json;
    };

    return Model;
};