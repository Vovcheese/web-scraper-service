import {
  Scopes,
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
} from 'sequelize-typescript';

@Scopes(() => ({}))
@Table({
  timestamps: true,
  tableName: 'Migrations',
})
class MigrationModel extends Model<MigrationModel> {
  @AllowNull(false)
  @Column(DataType.STRING)
  type: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  name: string;
}

export default MigrationModel;
