import { Schema, model } from 'mongoose';
import { Nudibranch } from '../entities/nudibranch';
// A import { truncate } from 'fs/promises';

const nudibranchSchema = new Schema<Nudibranch>({
  specie: {
    type: String,
    required: true,
    trim: true
  },
  marinezone: {
    type: String,
    required: true,
    trim: true

  },
  season: {
    type: String,
    required: true,
    trim: true
  },
  depth: {
    type: String,
    required: true,
    trim: true
  },
   image: {
    type: {
    urlOriginal: String,
    url: String,
    mimetype: String,
    size: Number,
    },
    required : true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

nudibranchSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject._id;
    delete returnedObject.password;
  },
});

export const NudibranchModel = model('Nudibranch', nudibranchSchema, 'nudibranchs');
