'use strict';
const bcrypt = require('bcrypt');
const bcrypt_p = require('bcrypt-promise');
const jwt = require('jsonwebtoken');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('DeviceData', {
        logID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        sensor1: DataTypes.STRING,
        sensor2: DataTypes.STRING,
        sensor3: DataTypes.STRING,
        lat: DataTypes.STRING,
        long: DataTypes.STRING,
        batteryV: DataTypes.DOUBLE,
        solarV: DataTypes.DOUBLE
    });

    Model.associate = function (models) {
        models.DeviceData.belongsTo(models.Device, {
            foreignKey: 'serialNo'
        });
    };

    Model.prototype.toWeb = function (pw) {
        let json = this.toJSON();
        return json;
    };

    return Model;
};