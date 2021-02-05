module.exports = (sequelize, DataTypes) => {
  const attributes = {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: { type: DataTypes.STRING, unique: true },
    siteUrl: DataTypes.TEXT,
    statusParse: {type: DataTypes.STRING, defaultValue: 'PENDING'},
    errorParse: { type: DataTypes.TEXT },
  }
  
  const options = {}
  
  const SiteModel = sequelize.define('Site', attributes, options)

  SiteModel.associate = models => {
    SiteModel.hasMany(models.SiteText, { foreignKey: 'siteId' });
  };

  return SiteModel
}
