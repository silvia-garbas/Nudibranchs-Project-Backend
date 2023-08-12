import createDebug from 'debug';
import { Router as createRouter } from 'express';
import { Repo } from '../repository/repo.js';
import { Nudibranch } from '../entities/nudibranch.js';
import { NudibranchRepo } from '../repository/nudibranch.mongo.repository.js';
import { NudibranchController } from '../controllers/nudibranch.controller.js';
import { User } from '../entities/user.js';
import { UserRepo } from '../repository/user.mongo.repository.js';
import { AuthInterceptor } from '../middleware/auth.interceptor.js';
import { FileMiddleware } from '../middleware/files.js';
const debug = createDebug('NB:NudibranchRouter');

debug('Executed');
const nudibranchRepo: Repo<Nudibranch> = new NudibranchRepo();
const userRepo: Repo<User> = new UserRepo();
const controller = new NudibranchController(nudibranchRepo, userRepo);
export const nudibranchRouter = createRouter();
const auth = new AuthInterceptor(nudibranchRepo);
const fileStore = new FileMiddleware();

nudibranchRouter.get('/', controller.getAll.bind(controller));
nudibranchRouter.get('/:id', controller.getById.bind(controller));
nudibranchRouter.post(
  '/',
  fileStore.singleFileStore('image').bind(fileStore),
  auth.logged.bind(auth),
  fileStore.optimization.bind(fileStore),
  fileStore.saveImage.bind(fileStore),
  controller.post.bind(controller)
);
nudibranchRouter.patch(
  '/:id',
  auth.logged.bind(auth),
  auth.authorized.bind(auth),
  controller.patch.bind(controller)
);
nudibranchRouter.delete(
  '/:id',
  auth.logged.bind(auth),
  auth.authorized.bind(auth),
  controller.deleteByid.bind(controller)
);
