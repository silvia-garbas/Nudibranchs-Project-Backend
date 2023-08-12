import { NextFunction, Request, Response } from 'express';
import { NudibranchRepo } from '../repository/nudibranch.mongo.repository.js';
import { UserRepo } from '../repository/user.mongo.repository.js';
import { Controller } from './controller.js';
import createDebug from 'debug';
import { PayloadToken } from '../services/auth.js';
import { Nudibranch } from '../entities/nudibranch.js';
import { NudibranchModel } from '../repository/nudibranch.mongo.model.js';

const debug = createDebug('NB:NudibranchController');

export class NudibranchController extends Controller<Nudibranch> {
  // eslint-disable-next-line no-unused-vars
  constructor(public repo: NudibranchRepo, private userRepo: UserRepo) {
    super();
    debug('Instantiated');
  }

  async post(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('BODY', req.body);
      const { id: userId } = req.body.tokenPayload as PayloadToken;
      const user = await this.userRepo.queryById(userId);
      delete req.body.tokenPayload;
      req.body.owner = userId;
      const newNudibranch = await this.repo.create(req.body);
      console.log(newNudibranch);

      this.userRepo.update(user.id, user);
      res.status(201);
      res.send(newNudibranch);
    } catch (error) {
      next(error);
    }
  }

  async deleteByid(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('BODY', req.body);

      const { id: userId } = req.body.tokenPayload as PayloadToken;
      const nudi = await this.repo.queryById(req.params.id);

      if (userId === nudi.owner.id.toString()) {
        await NudibranchModel.findByIdAndDelete(req.params.id);
        res.status(201).send(nudi);
      } else {
        res.status(403).json({ message: 'Unauthorized' });
      }
    } catch (error) {
      next(error);
    }
  }

  async patch(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: userId } = req.body.tokenPayload as PayloadToken;
      const nudi = await NudibranchModel.findById(req.params.id);

      if (nudi && userId === nudi.owner.toString()) {
        Object.assign(nudi, req.body);
        const modifyNudi = await this.repo.update(req.params.id, req.body);

        res.status(201).send(modifyNudi);
      } else {
        res.status(403).json({ message: 'Unauthorized' });
      }
    } catch (error) {
      next(error);
    }
  }
}
 // A línea 28  user.nudibranchs.push(newNudibranch)<------AQUí
        // línea 63 A const modifyNudi = await nudi.save();
