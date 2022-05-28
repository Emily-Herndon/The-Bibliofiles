'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class savedBook extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  savedBook.init({
    userId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    subject: DataTypes.STRING,
    book_cover_url: DataTypes.STRING,
    read: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'savedBook',
  });
  return savedBook;
};