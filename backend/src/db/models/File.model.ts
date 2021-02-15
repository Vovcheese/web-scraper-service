import { Scopes, Table, Column, Model, DataType, AllowNull, Default, ForeignKey, BelongsTo } from 'sequelize-typescript';
import SiteModel from '@models/Site.model';
import { EStatus } from '@db/interfaces';

@Scopes(() => ({}))
@Table({
  timestamps: true,
  tableName: 'Files',
})
class FileModel extends Model<FileModel> {
  @ForeignKey(() => SiteModel)
  @Column(DataType.INTEGER)
  siteId: number;

  @AllowNull(false)
  @Column(DataType.STRING(500))
  fileName: string;

  @Default(0)
  @Column(DataType.INTEGER)
  size: number;

  @Column(DataType.STRING)
  ext: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  isFolder: boolean;

  @Default(0)
  @Column(DataType.INTEGER)
  parent: number;

  @Default(EStatus.PENDING)
  @Column(DataType.ENUM({ values: Object.values(EStatus) }))
  status: EStatus;

  @Column(DataType.TEXT)
  error: string;

  @BelongsTo(() => SiteModel, 'siteId')
  site: SiteModel;
}

export default FileModel;
