import { NextFunction, Request, Response } from 'express';
import { AuthServices, PayloadToken } from '../services/auth';
import { AuthInterceptor } from './auth.interceptor';
import { NudibranchRepo } from '../repository/nudibranch.mongo.repository';
import { HttpError } from '../types/http.error';
import { NudibranchModel } from '../repository/nudibranch.mongo.model';
import { Nudibranch } from '../entities/nudibranch';
// A import { NudibranchModel } from '../repository/nudibranch.mongo.model';

jest.mock('../services/auth');

describe('Given the AuthInterceptor middleware', () => {
  const mockRepo = {} as unknown as NudibranchRepo;
  const mockPayload = {} as PayloadToken;
  const req = {
    body: { tokenPayload: mockPayload },
  } as unknown as Request;
  const res = {} as unknown as Response;
  const next = jest.fn() as NextFunction;
  const interceptor = new AuthInterceptor(mockRepo);
  describe('When it is instantiated', () => {
    test('Then the logged method should be used', () => {
      req.get = jest.fn().mockReturnValueOnce('Bearer test');
      (AuthServices.verifyJWTGettingPayload as jest.Mock).mockResolvedValueOnce(
        mockPayload
      );
      interceptor.logged(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    test('Then the logged method should throw an error when there is no authHeader', () => {
      const error = new HttpError(
        401,
        'Not Authorized',
        'Not Authorization header'
      );
      (AuthServices.verifyJWTGettingPayload as jest.Mock).mockResolvedValueOnce(
        mockPayload
      );
      interceptor.logged(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });

    test('Then the logged method should throw an error when authHeader does not start with Bearer', () => {
      const error = new HttpError(
        401,
        'Not Authorized',
        'Not Bearer in Authorization header'
      );
      req.get = jest.fn().mockReturnValueOnce('No Bearer');
      (AuthServices.verifyJWTGettingPayload as jest.Mock).mockResolvedValueOnce(
        mockPayload
      );

      interceptor.logged(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('When the', () => {
    test('Then ', async () => {
      req.body.tokenPayload = { id: '1212' };

      NudibranchModel.findById = jest.fn().mockReturnValue({
        id: '123',
        owner: { id: '1212' },
      } as unknown as Nudibranch);

      await interceptor.authorized(req, res, next);

      expect(next).toHaveBeenCalled();
    });
    test('Then ', async () => {
      const error = new HttpError(404, 'Not found', 'Not found');

      req.params = { id: '1212' };

      NudibranchModel.findById = jest.fn().mockReturnValue(null);

      await interceptor.authorized(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
    test('Then ', async () => {
      // RESOLVER  Const error = new HttpError(
      //   498,
      //   'Token not found',
      //   'Token not found in Authorized interceptor'
      // );

      req.params = { id: '1212' };
      req.body.tokenPayload = {};

      NudibranchModel.findById = jest.fn().mockReturnValue({
        id: '123',
        owner: { id: '1212' },
      } as unknown as Nudibranch);

      await interceptor.authorized(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
