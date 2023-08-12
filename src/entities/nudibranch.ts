import { Image } from '../types/image';
import { User } from './user';

export type Nudibranch = {
  id: string;
  specie: string;
  marinezone: 'Mediterranean Sea' | 'Cantabrian Sea' | 'Atlantic Ocean';
  season: string;
  depth: string;
  image: Image;
  owner: User;
};
