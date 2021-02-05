module.exports = (sequelize, DataTypes) => {
  const attributes = {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    siteId: DataTypes.INTEGER,
    textId: DataTypes.INTEGER,
    lang: DataTypes.STRING,
    errorMessage: DataTypes.TEXT
  }
  
  const options = {}
  
  const TranslateError = sequelize.define('TranslateError', attributes, options)

  TranslateError.associate = models => {
    TranslateError.belongsTo(models.Site, { foreignKey: 'siteId' });
    TranslateError.belongsTo(models.SiteText, { foreignKey: 'textId' });
  };
  
  

  return TranslateError
}



