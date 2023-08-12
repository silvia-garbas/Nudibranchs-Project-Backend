/* eslint-disable max-nested-callbacks */


import { AuthServices, PayloadToken } from './auth.js';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';

jest.mock('jsonwebtoken');
jest.mock('bcrypt');
describe('Given the AuthServices class', () => {
  describe('When I use createJWT method', () => {
    test('Then the JWT sign method should be called', () => {
      const payload = {} as PayloadToken;
      AuthServices.createJWT(payload);
      expect(jwt.sign).toHaveBeenCalled();
    });
    describe('When I use verifyJWTGettingPayload', () => {
      test('Then the JWT verify method should be called', () => {
        const token = 'hola';
        (jwt.verify as jest.Mock).mockReturnValue(token);

        expect(() => AuthServices.verifyJWTGettingPayload(token)).toThrow();
      });
      test('then ......', () => {
        const mockPayload = {} as JwtPayload;
        (jwt.verify as jest.Mock).mockReturnValue(mockPayload);
        const result = AuthServices.verifyJWTGettingPayload('tarde');
        expect(result).toEqual(mockPayload);
      });
    });
    describe('When I use hash method', () => {
      test('Then the hash method should be called', () => {
        AuthServices.hash('Hola');
        expect(bcrypt.hash).toHaveBeenCalled();
      });
    });
  });
  describe('When I use compare method', () => {
    AuthServices.compare('hola', 'adios');
    expect(bcrypt.compare).toHaveBeenCalled();
  });
});
