import { UserModel } from './user.mongo.model';
import { UserRepo } from './user.mongo.repository';
import { HttpError } from '../types/http.error';

import { User } from '../entities/user.js';

jest.mock('./user.mongo.model');

describe('Given the UserRepo class', () => {
  const repo = new UserRepo();
  describe('When it has been instantiated', () => {
    test('Then the query method should be used', async () => {
      const mockData = [{}];

      const exec = jest.fn().mockResolvedValueOnce(mockData);
      UserModel.find = jest.fn().mockReturnValueOnce({ exec });

      const result = await repo.query();
      expect(UserModel.find).toHaveBeenCalled();
      expect(exec).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });

    test('Then the queryById method should be used', async () => {
      const mockId = '1';
      const mockUser = {
        id: '15',
        userName: 'silvia',
        email: 'silvia@gmail.com',
        password: '',
      };

      const exec = jest.fn().mockResolvedValueOnce(mockUser);
      UserModel.findById = jest.fn().mockReturnValueOnce({ exec });

      const result = await repo.queryById(mockId);
      expect(UserModel.findById).toHaveBeenCalledWith(mockId);
      expect(exec).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    test('Then the create method should be used', async () => {
      const mockUser = {} as User;
      // C const mockUser = {
      //   userName: 'Silvia',
      //   email: 'silvia@gmail.com',
      //   password: '',
      // avatar: 'image.jpg',
      // };

      UserModel.create = jest.fn().mockReturnValueOnce(mockUser);
      const result = await repo.create(mockUser);
      expect(UserModel.create).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    test('Then the update method should be used', async () => {
      const mockId = '10';
      const mockUser = { id: '10', userName: 'Silvia' };
      const updatedUser = { id: '10', userName: 'Lupe' };
      const exec = jest.fn().mockResolvedValueOnce(updatedUser);
      UserModel.findByIdAndUpdate = jest.fn().mockReturnValueOnce({
        exec,
      });
      const result = await repo.update(mockId, mockUser);
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalled();
      expect(result).toEqual(updatedUser);
    });

    test('Then the search method should be used', async () => {
      const mockUsers = [{ id: '11', userName: 'Silvia' }];

      const exec = jest.fn().mockResolvedValueOnce(mockUsers);
      UserModel.find = jest.fn().mockReturnValueOnce({
        exec,
      });
      const result = await repo.search({ key: 'userName', value: 'Silvia' });
      expect(UserModel.find).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });

    test('Then the delete method should be used', async () => {
      const mockId = '1';
      const exec = jest.fn();
      UserModel.findByIdAndDelete = jest.fn().mockReturnValueOnce({
        exec,
      });
      await repo.delete(mockId);
      expect(UserModel.findByIdAndDelete).toHaveBeenCalled();
    });
  });

  describe('When it is instantiated and queryById method is called but the id is not found', () => {
    test('Then it should throw an error', async () => {
      const repo = new UserRepo();
      const error = new HttpError(404, 'Not found', 'Bad id for the query');
      const mockId = '10';

      const exec = jest.fn().mockResolvedValue(null);
      UserModel.findById = jest.fn().mockReturnValueOnce({
        exec,
      });

      await expect(repo.queryById(mockId)).rejects.toThrowError(error);
      expect(UserModel.findById).toHaveBeenCalled();
    });
  });

  describe('When it is instantiated and update method is called but the new user equals to null', () => {
    test('Then it should throw an error', async () => {
      const repo = new UserRepo();
      const error = new HttpError(404, 'Not found', 'Bad id for the update');
      const mockId = '10';
      const mockUser = {} as Partial<User>;

      const exec = jest.fn().mockResolvedValue(null);
      UserModel.findByIdAndUpdate = jest.fn().mockReturnValueOnce({
        exec,
      });

      await expect(repo.update(mockId, mockUser)).rejects.toThrowError(error);
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalled();
    });
  });

  describe('When it is instantiated and delete method is called but the id is not found', () => {
    test('Then it should throw an error', async () => {
      const repo = new UserRepo();
      const error = new HttpError(404, 'Not found', 'Bad id for the delete');
      const mockId = '10';
      const exec = jest.fn().mockResolvedValueOnce(null);
      UserModel.findByIdAndDelete = jest.fn().mockReturnValueOnce({
        exec,
      });
      await expect(repo.delete(mockId)).rejects.toThrowError(error);
      expect(UserModel.findByIdAndDelete).toHaveBeenCalled();
    });
  });
});
