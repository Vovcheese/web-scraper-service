import { Scopes, Table, Column, Model, DataType, AllowNull, Default, HasMany } from 'sequelize-typescript';
import TranslationsModel from '@models/Translation.model';

export enum StatusParse {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

@Scopes(() => ({}))
@Table({
  timestamps: true,
  tableName: 'Sites',
})
class SiteModel extends Model<SiteModel> {
  @AllowNull(false)
  @Column(DataType.STRING)
  name: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  url: string;

  @Default(StatusParse.PENDING)
  @Column(DataType.ENUM({ values: Object.values(StatusParse) }))
  status: string;

  @Column(DataType.TEXT)
  error: string;

  @HasMany(() => TranslationsModel, { foreignKey: 'siteId', onDelete: 'CASCADE' })
  translations: TranslationsModel[];
}

export default SiteModel;
