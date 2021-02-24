import PipelineModel from '@db/models/Pipeline.model';
import { Repository } from 'sequelize-typescript';
import BaseCRUD from '@services/domain/BaseCRUD';
import { EStatus, ETypePipeline } from '@db/interfaces';
// import socket from '@services/socket/index';
import { repos } from '@db/index';
export interface IPipelineService extends BaseCRUD<PipelineModel> {
  createPipeline(siteId: number): Promise<PipelineModel[]>;
  changeStatus(
    siteId: number,
    status: EStatus,
    type: ETypePipeline,
    error?: string,
  ): Promise<[number, PipelineModel[]]>;
}

export class PiplineService
  extends BaseCRUD<PipelineModel>
  implements IPipelineService {
  constructor(private pipelineRepositiory: Repository<PipelineModel>) {
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
    const obj: Partial<PipelineModel> = { status };

    if (error) {
      obj.error = error;
    }
    
    // socket.emit('UPDATE_STATUS_PIPELINE', { siteId, type, status, error })

    return this.update(obj, { where: { siteId, type } });
  }

  async reloadStatus(findModel: PipelineModel) {
    findModel.status = EStatus.PROGRESS;
    findModel.error = null;
    await findModel.save();
  }
}

export default new PiplineService(repos.pipelineRepositiory);
