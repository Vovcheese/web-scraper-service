import {
  Scopes,
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  Default,
  Unique,
} from 'sequelize-typescript';

@Scopes(() => ({}))
@Table({
  timestamps: true,
  tableName: 'Users',
})
class UserModel extends Model<UserModel> {
  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  login: string;

  @AllowNull(false)
  @Column(DataType.STRING(64))
  password: string;

  @Default(0)
  @Column(DataType.STRING)
  name: string;
}

export default UserModel;
