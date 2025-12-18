import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return users from backend', async () => {
      const users = [{ id: 1, name: 'Test', email: 'test@example.com' }];
      mockedAxios.get.mockResolvedValueOnce({ data: users });

      const result = await appController.root();
      expect(result).toEqual({ users });
      expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('/api/users'));
    });

    it('should return empty array on failure', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

      const result = await appController.root();
      expect(result).toEqual({ users: [] });
    });
  });
});
