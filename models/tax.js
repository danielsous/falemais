'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Tax extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
    }
  };
  Tax.init({
    origin: DataTypes.STRING,
    destine: DataTypes.STRING,
    tax: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'tax',
    timestamps: null,
    freezeTableName: true
  })
  return Tax
}
