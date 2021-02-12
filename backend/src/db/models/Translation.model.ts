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

export enum StatusTranslate {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

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

  @Default(StatusTranslate.PENDING)
  @Column(DataType.ENUM({ values: Object.values(StatusTranslate) }))
  status: string;

  @Column(DataType.TEXT)
  error: string;

  @BelongsTo(() => SiteModel, 'siteId')
  site: SiteModel;
}

export default TranslationModel;
