import { Nudibranch } from '../entities/nudibranch.js';
import { User } from '../entities/user.js';
import { HttpError } from '../types/http.error.js';
import { NudibranchModel } from './nudibranch.mongo.model.js';
import { NudibranchRepo } from './nudibranch.mongo.repository.js';
import { Image } from '../types/image.js';



jest.mock('./nudibranch.mongo.model');

describe('Given the NudibranchRepo class', () => {
  const repo = new NudibranchRepo();
  describe('When it has been instantiated', () => {
    test('Then the query method should be used', async () => {
      const mockData = [{}];
      const exec = jest.fn().mockResolvedValueOnce(mockData);

      NudibranchModel.find = jest.fn().mockReturnValueOnce({
        populate: jest.fn().mockReturnValueOnce({
          exec,
        }),
      });

      const result = await repo.query();
      expect(NudibranchModel.find).toHaveBeenCalled();
      expect(exec).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });

    test('Then the queryById method should be used', async () => {
      const mockSample = { id: '1' };
      const exec = jest.fn().mockResolvedValue(mockSample);
      NudibranchModel.findById = jest.fn().mockReturnValueOnce({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });

      const result = await repo.queryById('1');
      expect(exec).toHaveBeenCalled();
      expect(result).toEqual(mockSample);
    });

    test('Then the create method should be used', async () => {
      const mockNudibranch = {
        title: 'test',
        year: 1234,
        region: 'Asia',
        description: 'qwertyuiop',
        image: {} as Image,
        owner: {} as User,
      } as unknown as Nudibranch;

NudibranchModel.create = jest.fn().mockReturnValueOnce(mockNudibranch);
      const result = await repo.create(mockNudibranch);
      expect(NudibranchModel.create).toHaveBeenCalled();
      expect(result).toEqual(mockNudibranch);
    });

    test('Then the update method should be used', async () => {
      const mockId = '1';
      const mockNudibranch = { id: '1', title: 'test' };
      const updatedNudibranch = { id: '1', title: 'test2' };
      const exec = jest.fn().mockResolvedValueOnce(updatedNudibranch);
      NudibranchModel.findByIdAndUpdate = jest.fn().mockReturnValueOnce({
        exec,
      });
      const result = await repo.update(mockId, mockNudibranch);
      expect(NudibranchModel.findByIdAndUpdate).toHaveBeenCalled();
      expect(result).toEqual(updatedNudibranch);
    });

    test('Then the search method should be used', async () => {
      const mockNudibranch = [{ id: '1', title: 'test' }];

      const exec = jest.fn().mockResolvedValueOnce(mockNudibranch);
      NudibranchModel.find = jest.fn().mockReturnValueOnce({
        exec,
      });
      const result = await repo.search({ key: 'title', value: 'test' });
      expect(NudibranchModel.find).toHaveBeenCalled();
      expect(result).toEqual(mockNudibranch);
    });

    test('Then the delete method should be used', async () => {
      const mockId = '1';
      const exec = jest.fn();
      NudibranchModel.findByIdAndDelete = jest.fn().mockReturnValueOnce({
        exec,
      });
      await repo.delete(mockId);
      expect(NudibranchModel.findByIdAndDelete).toHaveBeenCalled();
    });
  });

  describe('When it is instantiated and queryById method is called but the id is not found', () => {
    test('Then it should throw an error', async () => {
      const repo = new NudibranchRepo();
      const error = new HttpError(
        404,
        'Not found',
        'No user found with this id'
      );
      const mockId = '1';

      const exec = jest.fn().mockResolvedValue(null);

      NudibranchModel.findById = jest.fn().mockReturnValueOnce({
        populate: jest.fn().mockReturnValueOnce({
          exec,
        }),
      });

      await expect(repo.queryById(mockId)).rejects.toThrowError(error);
      expect(NudibranchModel.findById).toHaveBeenCalled();
    });
  });

  describe('When it is instantiated and update method is called but the new user equals to null', () => {
    test('Then it should throw an error', async () => {
      const repo = new NudibranchRepo();
      const error = new HttpError(404, 'Not found', 'Invalid id');
      const mockId = '1';
      const mockNudibranch = {} as Partial<Nudibranch>;

      const exec = jest.fn().mockResolvedValue(null);
      NudibranchModel.findByIdAndUpdate = jest.fn().mockReturnValueOnce({
        exec,
      });

      await expect(repo.update(mockId, mockNudibranch)).rejects.toThrowError(
        error
      );
      expect(NudibranchModel.findByIdAndUpdate).toHaveBeenCalled();
    });
  });

  describe('When it is instantiated and delete method is called but the id is not found', () => {
    test('Then it should throw an error', async () => {
      const repo = new NudibranchRepo();
      const error = new HttpError(404, 'Not found', 'Invalid id');
      const mockId = '1';
      const exec = jest.fn().mockResolvedValueOnce(null);
      NudibranchModel.findByIdAndDelete = jest.fn().mockReturnValueOnce({
        exec,
      });
      await expect(repo.delete(mockId)).rejects.toThrowError(error);
      expect(NudibranchModel.findByIdAndDelete).toHaveBeenCalled();
    });
  });
});
