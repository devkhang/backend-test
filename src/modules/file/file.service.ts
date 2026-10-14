import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/commons';
import Response, { ResponseData } from 'src/commons/response';
import { EntityManager, getManager, Repository } from 'typeorm';
import { CurrentUser } from '../auth/auth.model';
import { MediaService } from '../media/media.service';
import { File } from './file.entity';
import { createFile } from './file.model';

@Injectable()
export class FileService extends BaseService<File> {
  manager: EntityManager;
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    private readonly mediaService: MediaService,
  ) {
    super(fileRepository, (data) => new File(data));
    this.manager = getManager();
  }

  async createFile(currentUser: CurrentUser, body: createFile) {
    try {
      const item = new File({
        ...body,
        createdBy: currentUser.id,
        createdAt: new Date(),
      });
      const result = await this.fileRepository.save(item);
      return Response.get(result);
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  async getFilePublic(id: number): Promise<ResponseData<File[]>> {
    try {
      const files = await this.fileRepository.findOne(id);
      let publicFiles = [];
      for (const [key, value] of Object.entries(files)) {
        if (value instanceof Array) {
          const files = await Promise.all(
            value.map(async (x) => {
              const getUrl = await this.mediaService.generateUrl(x.name);
              return {
                id: x.id,
                name: x.name,
                path: x.path,
                url: getUrl.url,
              };
            }),
          );
          publicFiles.push({ [key]: files });
        }
      }
      return Response.get(publicFiles);
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }


}
