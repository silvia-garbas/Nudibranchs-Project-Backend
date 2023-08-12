
import { NextFunction, Request, Response } from 'express';
import { NudibranchRepo } from '../repository/nudibranch.mongo.repository';
import { UserRepo } from '../repository/user.mongo.repository';
import { NudibranchController } from './nudibranch.controller';

describe('Given the NudibranchController class', () => {
  describe('When it is instantiated', () => {
    const mockUserRepo = {
      queryById: jest.fn(),
      update: jest.fn(),
    } as unknown as UserRepo;
    const mockNudibranchRepo = {
      query: jest.fn().mockResolvedValue([]),
      queryById: jest.fn().mockResolvedValue({ films: [] }),
      search: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as NudibranchRepo;

    const req = {
      params: { id: '1' },
      body: { tokenPayload: {} },
    } as unknown as Request;
    const res = {
      send: jest.fn(),
      status: jest.fn(),
    } as unknown as Response;
    const next = jest.fn() as NextFunction;
    const controller = new NudibranchController(mockNudibranchRepo, mockUserRepo);

    test('Then the getAll method should be used', async () => {
      await controller.getAll(req, res, next);
      expect(res.send).toHaveBeenCalled();
      expect(mockNudibranchRepo.query).toHaveBeenCalled();
    });

    test('Then the getById method should be used', async () => {
      await controller.getById(req, res, next);
      expect(res.send).toHaveBeenCalled();
      expect(mockNudibranchRepo.queryById).toHaveBeenCalled();
    });

    test('Then the post method should be called', async () => {
      const mockUser = {
        id: '1',
        email: 'a',

      };
      (mockUserRepo.queryById as jest.Mock).mockResolvedValueOnce(mockUser);
      await controller.post(req, res, next);
      expect(res.send).toHaveBeenCalled();
      expect(mockNudibranchRepo.create).toHaveBeenCalled();
    });

    // A  test('Then the patch method should be used', async () => {
    //   await controller.patch(req, res, next);
    //   expect(res.status).toHaveBeenCalledWith(201);
    //   expect(mockNudibranchRepo.update).toHaveBeenCalled();
    // });

    test('Then the delete method should be used', async () => {
      await controller.deleteById(req, res, next);
      expect(res.send).toHaveBeenCalled();
      expect(mockNudibranchRepo.delete).toHaveBeenCalled();
    });
  });

  describe('When the methods are called with errors', () => {
    const error = new Error('error');
    const mockUserRepo = {} as unknown as UserRepo;
    const mockFilmRepo = {
      query: jest.fn().mockRejectedValue(error),
      queryById: jest.fn().mockRejectedValue(error),
      create: jest.fn().mockRejectedValue(error),
      update: jest.fn().mockRejectedValue(error),
      delete: jest.fn().mockRejectedValue(error),
    } as unknown as NudibranchRepo;

    const newReq = {
      params: { id: '1' },
      body: { tokenPayload: {} },
    } as unknown as Request;
    const newRes = {
      send: jest.fn(),
    } as unknown as Response;
    const next = jest.fn() as NextFunction;
    const newController = new NudibranchController(mockFilmRepo, mockUserRepo);

    test('Then the getAll method should handle errors', async () => {
      await newController.getAll(newReq, newRes, next);
      expect(next).toHaveBeenCalledWith(error);
    });

    test('Then the getById method should handle errors', async () => {
      await newController.getById(newReq, newRes, next);
      expect(next).toHaveBeenCalledWith(error);
    });

    test('Then the post method should handle errors', async () => {
      await newController.post(newReq, newRes, next);
      expect(next).toHaveBeenCalledWith(error);
    });

    test('Then the patch method should handle errors', async () => {
      await newController.patch(newReq, newRes, next);
      expect(next).toHaveBeenCalledWith(error);
    });

    test('Then the deleteById method should handle errors', async () => {
      await newController.deleteById(newReq, newRes, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
