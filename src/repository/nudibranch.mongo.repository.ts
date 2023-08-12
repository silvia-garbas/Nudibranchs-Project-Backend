import { Nudibranch } from '../entities/nudibranch.js';
import { Repo } from './repo.js';
import { NudibranchModel } from './nudibranch.mongo.model.js';
import { HttpError } from '../types/http.error.js';
import createDebug from 'debug';

const debug = createDebug('NB:NudibranchRepo ');

export class NudibranchRepo implements Repo<Nudibranch> {
  constructor() {
    debug('Instantiated', NudibranchModel);
  }

  async query(): Promise<Nudibranch[]> {
    const allData = await NudibranchModel.find()
      .populate('owner', { nudibranchs: 0 })
      .exec();
    return allData;
  }

  async queryById(id: string): Promise<Nudibranch> {
    const result = await NudibranchModel.findById(id)
      .populate('owner', { nudibranchs: 0 })
      .exec();
    if (result === null)
      throw new HttpError(400, 'Not found', 'No user found with this id');
    return result;
  }

  async create(data: Omit<Nudibranch, 'id'>): Promise<Nudibranch> {
    const newNudibranch = await NudibranchModel.create(data);
    return newNudibranch;
  }

  async update(id: string, data: Partial<Nudibranch>): Promise<Nudibranch> {
    const newNudibranch = await NudibranchModel.findByIdAndUpdate(id, data, {
      new: true,
    }).exec();

    if (newNudibranch === null)
      throw new HttpError(404, 'Not found', 'Invalid id');
    return newNudibranch;
  }

  async search({
    key,
    value,
  }: {
    key: string;
    value: unknown;
  }): Promise<Nudibranch[]> {
    const result = await NudibranchModel.find({ [key]: value }).exec();
    return result;
  }

  async delete(id: string): Promise<void> {
    const result = await NudibranchModel.findByIdAndDelete(id).exec();
    if (result === null) throw new HttpError(404, 'Not found', 'Invalid id');
  }
}
