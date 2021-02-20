import { Scopes, Table, Column, Model, DataType, AllowNull, Default, ForeignKey, BelongsTo } from 'sequelize-typescript';
import SiteModel from '@db/models/Site.model';
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

  @Default(0)
  @Column(DataType.INTEGER)
  time: number;

  @Column(DataType.TEXT)
  error: string;

  @BelongsTo(() => SiteModel, { foreignKey: 'siteId', onDelete: 'CASCADE' })
  site: SiteModel;
}

export default PipelineModel;
