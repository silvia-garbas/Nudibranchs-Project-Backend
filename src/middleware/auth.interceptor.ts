/* eslint-disable no-useless-constructor */
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../types/http.error.js';
// A import { UserRepo } from '../repository/user.mongo.repository.js';
import { AuthServices } from '../services/auth.js';
import { NudibranchModel } from '../repository/nudibranch.mongo.model.js';
import { NudibranchRepo } from '../repository/nudibranch.mongo.repository.js';

export class AuthInterceptor {
  // eslint-disable-next-line no-unused-vars
  constructor(protected nudibranchRepo: NudibranchRepo) {} // A UserRepo

  logged(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.get('Authorization');
      if (!authHeader) {
        throw new HttpError(401, 'Not Authorized', 'Not Authorization header');
      }

      if (!authHeader.startsWith('Bearer')) {
        throw new HttpError(
          401,
          'Not Authorized',
          'Not Bearer in Authorization header'
        );
      }

      const token = authHeader.slice(7);
      const payload = AuthServices.verifyJWTGettingPayload(token);

      req.body.tokenPayload = payload;
      next();
    } catch (error) {
      next(error);
    }
  }

  async authorized(req: Request, res: Response, next: NextFunction) {
    try {
      const nudi = await NudibranchModel.findById(req.params.id);

      if (!nudi) {
        throw new HttpError(404, 'Not found', 'Not found');
      }

      if (!req.body.tokenPayload) {
        throw new HttpError(
          498,
          'Token not found',
          'Token not found in Authorized interceptor'
        );
      }

      if (req.body.tokenPayload.id !== nudi.owner.toString()) {
        throw new HttpError(498, 'Token not found', 'Invalid Token');
      }

      next();
    } catch (error) {
      next(error);
    }
  }
}
