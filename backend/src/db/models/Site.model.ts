import { Scopes, Table, Column, Model, DataType, AllowNull, Default, HasMany, Unique } from 'sequelize-typescript';
import TranslationsModel from '@models/Translation.model';
import PipelineModel from '@models/Pipeline.model';
import PageModel from '@models/File.model';

import { ETypePipeline } from '@db/interfaces';




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

  @Default(ETypePipeline.DOWNLOAD)
  @Column(DataType.ENUM({ values: Object.values(ETypePipeline) }))
  stage: ETypePipeline;

  @HasMany(() => TranslationsModel, { foreignKey: 'siteId', onDelete: 'CASCADE' })
  translations: TranslationsModel[];

  @HasMany(() => PipelineModel, { foreignKey: 'siteId', onDelete: 'CASCADE' })
  pipelines: PipelineModel[];

  @HasMany(() => PageModel, { foreignKey: 'siteId', onDelete: 'CASCADE' })
  files: PageModel[];
}

export default SiteModel;
