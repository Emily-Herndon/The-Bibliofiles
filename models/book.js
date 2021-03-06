'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.book.belongsTo(models.user)
      models.book.belongsToMany(models.tag, {through: 'tagsBooks'})
    }
  }
  book.init({
    bookid: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    book_cover_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'book',
  });
  return book;
};