import PiplineModel from '@models/Pipeline.model';
import { Repository } from 'sequelize-typescript';
import repos from '@models/index';
import BaseCRUD from '@services/domain/BaseCRUD';
import { EStatus, ETypePipeline } from '@db/interfaces';
import socket from '@services/socket/index';

export interface IPipelineService extends BaseCRUD<PiplineModel> {
  createPipeline(siteId: number): Promise<PiplineModel[]>;
  changeStatus(
    siteId: number,
    status: EStatus,
    type: ETypePipeline,
    error?: string,
  ): Promise<[number, PiplineModel[]]>;
}

export class PiplineService
  extends BaseCRUD<PiplineModel>
  implements IPipelineService {
  constructor(private pipelineRepositiory: Repository<PiplineModel>) {
    super(pipelineRepositiory);
  }

  async createPipeline(siteId: number) {
    return this.bulkCreate([
      { siteId, type: ETypePipeline.DOWNLOAD },
      { siteId, type: ETypePipeline.FILESEARCHING },
      { siteId, type: ETypePipeline.GENERATEID },
      { siteId, type: ETypePipeline.TRANSLATING },
    ]);
  }

  async changeStatus(
    siteId: number,
    status: EStatus,
    type: ETypePipeline,
    error?: string,
  ) {
    const obj: Partial<PiplineModel> = { status };

    if (error) {
      obj.error = error;
    }
    
    socket.emit('UPDATE_STATUS_PIPELINE', { siteId, type, status, error })

    return this.update(obj, { where: { siteId, type } });
  }

  async reloadStatus(findModel: PiplineModel) {
    findModel.status = EStatus.PENDING;
    findModel.error = null;
    await findModel.save();
  }
}

export default new PiplineService(repos.pipelineRepository);
