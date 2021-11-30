import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import {
  Model,
  Document,
  FilterQuery,
  DocumentDefinition,
  _LeanDocument,
  UpdateQuery,
} from 'mongoose';

@Injectable()
export abstract class Repository<T extends Document> {
  _model: Model<T>;
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  getAllDocument(
    filter: FilterQuery<T>,
    selector,
    query?,
    perPage?: number,
    currentPage?: number,
  ) {
    let queryBuilder = query || { updated_at: 'desc' };
    let page = currentPage || 1;
    let per = perPage || 10;
    let skip = (page - 1) * per;
    return this._model
      .find({ ...filter, deleted_at: null })
      .sort(queryBuilder)
      .limit(per)
      .select(selector)
      .skip(skip)
      .lean();
  }

  getAllDocumentTrash(
    filter: FilterQuery<T>,
    selector,
    query?,
    perPage?: number,
    currentPage?: number,
  ) {
    let queryBuilder = query || { updated_at: 'desc' };
    let page = currentPage || 1;
    let per = perPage || 10;
    let skip = (page - 1) * perPage;
    return this._model
      .find({ ...filter, deleted_at: { $ne: null } })
      .sort(queryBuilder)
      .limit(per)
      .select(selector)
      .skip(skip)
      .lean();
  }

  create(data: T | DocumentDefinition<T>): Promise<T> {
    this.cacheManager.reset();
    return this._model.create(data);
  }

  createWithArray(data: Array<T | DocumentDefinition<T>>): Promise<Array<T>> {
    this.cacheManager.reset();
    return this._model.create(data);
  }

  updateDocument(
    query: FilterQuery<T>,
    dataUpdate: UpdateQuery<T>,
  ): Promise<any> {
    this.cacheManager.reset();
    return this._model.updateOne(query, dataUpdate).exec();
  }

  replaceDocument(
    query: FilterQuery<T>,
    dataUpdate: UpdateQuery<T>,
  ): Promise<any> {
    this.cacheManager.reset();
    return this._model.replaceOne(query, dataUpdate, { upsert: true }).exec();
  }

  updateAllDocument(
    query: FilterQuery<T>,
    dataUpdate: UpdateQuery<T>,
  ): Promise<any> {
    this.cacheManager.reset();
    return this._model.updateMany(query, dataUpdate).exec();
  }

  deleteDocument(query: FilterQuery<T>): Promise<any> {
    this.cacheManager.reset();
    const dataUpdate = { deleted_at: Date.now() } as any;
    return this._model.updateOne(query, dataUpdate).exec();
  }

  deleteAllDocument(query: FilterQuery<T>): Promise<any> {
    this.cacheManager.reset();
    const dataUpdate = { deleted_at: Date.now() } as any;
    return this._model.updateMany(query, dataUpdate).exec();
  }

  restoreDocument(query: FilterQuery<T>): Promise<any> {
    this.cacheManager.reset();
    const dataUpdate = { deleted_at: null } as any;
    return this._model.updateOne(query, dataUpdate).exec();
  }

  restoreAllDocument(query: FilterQuery<T>): Promise<any> {
    this.cacheManager.reset();
    const dataUpdate = { deleted_at: null } as any;
    return this._model.updateMany(query, dataUpdate).exec();
  }

  removeDocument(query: FilterQuery<T>): Promise<any> {
    this.cacheManager.reset();
    return this._model.deleteOne(query).exec();
  }

  removeAllDocument(query: FilterQuery<T>): Promise<any> {
    this.cacheManager.reset();
    return this._model.deleteMany(query).exec();
  }

  getOneDocument(query: FilterQuery<T>) {
    return this._model.findOne({ ...query, deleted_at: null }).lean();
  }

  getOneDoc(query: FilterQuery<T>) {
    return this._model.findOne({ ...query }).lean();
  }

  getOneDocumentTrash(query: FilterQuery<T>) {
    return this._model.findOne({ ...query, deleted_at: { $ne: null } }).lean();
  }

  countAllDocument(filter: FilterQuery<T>) {
    return this._model.countDocuments(filter).exec();
  }

  async getCountPage(filter: FilterQuery<T>, perPage?: number) {
    let per = perPage || 10;
    const dataCount = await this.countAllDocument({
      ...filter,
      deleted_at: null,
    });
    const page = dataCount / per;
    return Math.ceil(page);
  }

  async getCountPageTrash(filter: FilterQuery<T>, perPage?: number) {
    let per = perPage || 10;
    const dataCount = await this.countAllDocument({
      ...filter,
      deleted_at: { $ne: null },
    });
    const page = dataCount / per;
    return Math.ceil(page);
  }

  getAllResource(filter: FilterQuery<T>, selector) {
    return this._model
      .find({ ...filter, deleted_at: null })
      .select(selector)
      .lean();
  }

  async getPosition(filter: FilterQuery<T>) {
    console.time('find');
    let data = await this._model.find({ ...filter, deleted_at: null }).count();
    console.timeEnd('find');
    console.time('count');
    await this._model.countDocuments({ ...filter, deleted_at: null }).exec();
    console.timeEnd('count');
    return data;
  }

  getAllResourceData(filter: FilterQuery<T>, selector) {
    return this._model.find(filter).select(selector).lean();
  }

  getAllResourceTrash(filter: FilterQuery<T>, selector) {
    return this._model
      .find({ ...filter, deleted_at: { $ne: null } })
      .select(selector)
      .lean();
  }

  distinct(flied: string, filter: FilterQuery<T>) {
    return this._model.distinct(flied, { ...filter, deleted_at: null });
  }
}
