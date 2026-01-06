import { UsersService } from './users.service';

const mockPrisma = {
    user: {
        findMany: jest.fn(),
        create: jest.fn(),
    },
} as any;

describe('UsersService', () => {
    let service: UsersService;

    beforeEach(() => {
        jest.clearAllMocks();
        service = new UsersService(mockPrisma);
    });

    it('should find all users', async () => {
        const users = [{ id: 1, name: 'Test', email: 'test' }];
        mockPrisma.user.findMany.mockResolvedValue(users);

        const result = await service.findAll();
        expect(result).toEqual(users);
    });

    it('should create user', async () => {
        const user = { id: 1, name: 'Test', email: 'test' };
        mockPrisma.user.create.mockResolvedValue(user);

        const result = await service.create('Test', 'test');
        expect(result).toEqual(user);
        expect(mockPrisma.user.create).toHaveBeenCalledWith({
            data: { name: 'Test', email: 'test' }
        });
    });
});
