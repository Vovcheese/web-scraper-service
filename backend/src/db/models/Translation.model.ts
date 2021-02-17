import {
  Scopes,
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  Default,
  ForeignKey,
  BelongsTo,
  Unique,
} from 'sequelize-typescript';

import SiteModel from '@models/Site.model';
import FileModel from '@models/File.model';

import { EStatus } from '@db/interfaces';

@Scopes(() => ({}))
@Table({
  timestamps: true,
  tableName: 'Translations',
})
class TranslationModel extends Model<TranslationModel> {
  @ForeignKey(() => SiteModel)
  @Unique('siteId_textId_lang')
  @Column(DataType.INTEGER)
  siteId: number;

  @ForeignKey(() => FileModel)
  @Column(DataType.INTEGER)
  fileId: number;

  @Unique('siteId_textId_lang')
  @AllowNull(false)
  @Column(DataType.STRING)
  textId: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  text: string;

  @Unique('siteId_textId_lang')
  @Column(DataType.STRING)
  lang: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  default: boolean;

  @Default(EStatus.PENDING)
  @Column(DataType.ENUM({ values: Object.values(EStatus) }))
  status: EStatus;

  @Column(DataType.TEXT)
  error: string;

  @BelongsTo(() => SiteModel, { foreignKey: 'siteId', onDelete: 'CASCADE' })
  site: SiteModel;
}

export default TranslationModel;
