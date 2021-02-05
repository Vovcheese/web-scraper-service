module.exports = (sequelize, DataTypes) => {
  const attributes = {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    key: { type: DataTypes.STRING, unique: 'key_lang_siteId' },
    siteId: { type: DataTypes.INTEGER, unique: 'key_lang_siteId' },
    value: DataTypes.STRING,
    default: DataTypes.BOOLEAN,
    lang: { type: DataTypes.STRING, unique: 'key_lang_siteId' },
    status: {type: DataTypes.STRING, defaultValue: 'PENDING'},
  }
  
  
  
  const options = {}
  
  const SiteTextModel = sequelize.define('SiteText', attributes, options)

  SiteTextModel.associate = models => {
    SiteTextModel.belongsTo(models.Site, { foreignKey: 'siteId' });
  };
  
  

  return SiteTextModel
}



