import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../lib/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwt: JwtService;

  const mockPrisma = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  const mockJwt = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwt = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should hash password and create user', async () => {
      const data = { email: 'test@example.com', password: 'password123' };
      const hashedPass = 'hashedPassword';
      jest.spyOn(bcrypt, 'hash').mockImplementation(async () => hashedPass);
      
      mockPrisma.user.create.mockResolvedValue({ id: '1', ...data, password: hashedPass });

      const result = await service.register(data);

      expect(bcrypt.hash).toHaveBeenCalledWith(data.password, 10);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: { ...data, password: hashedPass }
      });
      expect(result.id).toBe('1');
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException for invalid email', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.login('invalid@example.com', 'pass')).rejects.toThrow();
    });

    it('should return tokens for valid credentials', async () => {
      const user = { 
        id: '1', 
        email: 'test@example.com', 
        password: 'hashed', 
        role: 'ADMIN', 
        companyId: 'c1' 
      };
      mockPrisma.user.findUnique.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);
      mockJwt.sign.mockReturnValue('token');

      const result = await service.login('test@example.com', 'pass');

      expect(result.accessToken).toBe('token');
      expect(result.user.email).toBe(user.email);
    });
  });
});
