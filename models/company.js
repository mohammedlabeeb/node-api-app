'use strict';
const bcrypt = require('bcrypt');
const bcrypt_p = require('bcrypt-promise');

module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('Company', {
    companyID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    password: DataTypes.STRING,
    token: DataTypes.STRING
  });

  Model.beforeSave(async (company, options) => {
    let err;
    if (company.changed('password')) {
      let salt, hash;
      [err, salt] = await to(bcrypt.genSalt(10));
      if (err) TE(err.message, true);
      [err, hash] = await to(bcrypt.hash(company.password, salt));
      if (err) TE(err.message, true);

      company.password = hash;
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
    if (json.hasOwnProperty('password')) {
      delete json.password;
    }
    return json;
  };

  return Model;
};