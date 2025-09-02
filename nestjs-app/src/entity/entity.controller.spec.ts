import { Test, TestingModule } from '@nestjs/testing';
import { EntityController } from './entity.controller';
import { EntityService } from './entity.service';
import { CreateEntityDto } from './entity.dto';
import { UpdateEntityDto } from './entity.dto';

describe('EntityController', () => {
  let controller: EntityController;
  let service: EntityService;

  const mockEntityService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EntityController],
      providers: [
        {
          provide: EntityService,
          useValue: mockEntityService
        }
      ],
    }).compile();

    controller = module.get<EntityController>(EntityController);
    service = module.get<EntityService>(EntityService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an entity', async () => {
      const dto: CreateEntityDto = { name: 'Test Entity', position: [0, 0, 0], active: true };
      mockEntityService.create.mockReturnValue(dto);
      
      expect(await controller.create(dto)).toBe(dto);
      expect(mockEntityService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all entities', async () => {
      const result = [ { id: '1', name: 'Test Entity' }];
      mockEntityService.findAll.mockReturnValue(result);
      
      expect(await controller.findAll()).toBe(result);
      expect(mockEntityService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a entity by ID', async () => {
      const result = { id: '1', name: 'Test Entity' };
      mockEntityService.findOne.mockReturnValue(result);
      
      expect(await controller.findOne('1')).toBe(result);
      expect(mockEntityService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a entity by ID', async () => {
      const dto: UpdateEntityDto = { name: 'Updated Entity' };
      const result = { id: '1', ...dto };
      mockEntityService.update.mockReturnValue(result);
      
      expect(await controller.update('1', dto)).toBe(result);
      expect(mockEntityService.update).toHaveBeenCalledWith('1', dto);
    });
  });

  describe('remove', () => {
    it('should remove a entity by ID', async () => {
      const result = true;
      mockEntityService.remove.mockReturnValue(result);
      
      expect(await controller.remove('1')).toBe(result);
      expect(mockEntityService.remove).toHaveBeenCalledWith('1');
    });
  });
});