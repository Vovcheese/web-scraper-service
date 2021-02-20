import { Scopes, Table, Column, Model, DataType, AllowNull, Default, HasMany, Unique } from 'sequelize-typescript';
import TranslationsModel from '@models/Translation.model';
import PipelineModel from '@models/Pipeline.model';
import FileModel from '@db/models/File.model';

@Scopes(() => ({}))
@Table({
  timestamps: true,
  tableName: 'Sites',
})
class SiteModel extends Model<SiteModel> {
  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  name: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  url: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  domain: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  active: boolean;

  @HasMany(() => TranslationsModel, { foreignKey: 'siteId', onDelete: 'CASCADE' })
  translations: TranslationsModel[];

  @HasMany(() => PipelineModel, { foreignKey: 'siteId', onDelete: 'CASCADE' })
  pipelines: PipelineModel[];

  @HasMany(() => FileModel, { foreignKey: 'siteId', onDelete: 'CASCADE' })
  files: FileModel[];
}

export default SiteModel;
