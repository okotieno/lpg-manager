import { Column, ForeignKey, Model, Table, DataType } from 'sequelize-typescript';
import { FileUploadModel } from './file-upload.model';
import { CatalogueModel } from './catalogue.model';

@Table({
  tableName: 'catalogue_file_uploads',
  underscored: true,
  paranoid: false,
  timestamps: true,
  deletedAt: false,
})
export class CatalogueFileUploadModel extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  override id!: string;

  @ForeignKey(() => CatalogueModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  catalogueId!: string;

  @ForeignKey(() => FileUploadModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  fileUploadId!: string;
}
