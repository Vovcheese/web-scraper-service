import { Scopes, Table, Column, Model, DataType, AllowNull, Default, ForeignKey, BelongsTo } from 'sequelize-typescript';
import SiteModel from '@models/Site.model';
import { ETypePipeline, EStatus } from '@db/interfaces';

@Scopes(() => ({}))
@Table({
  timestamps: true,
  tableName: 'Pipelines',
})
class PipelineModel extends Model<PipelineModel> {
  @ForeignKey(() => SiteModel)
  @Column(DataType.INTEGER)
  siteId: number;

  @AllowNull(false)
  @Column(DataType.ENUM({ values: Object.values(ETypePipeline) }))
  type: ETypePipeline;

  @Default(EStatus.PENDING)
  @Column(DataType.ENUM({ values: Object.values(EStatus) }))
  status: EStatus;

  @Column(DataType.TEXT)
  error: string;

  @BelongsTo(() => SiteModel, 'siteId')
  site: SiteModel;
}

export default PipelineModel;
