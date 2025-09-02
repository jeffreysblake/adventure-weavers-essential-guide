import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { EntityService } from './entity.service';
import { CreateEntityDto } from './entity.dto';
import { UpdateEntityDto } from './entity.dto';

@Controller('entities')
export class EntityController {
  constructor(private readonly entityService: EntityService) {}

  /**
   * Create a new entity
   * @param createEntityDto 
   * @returns Created entity
   */
  @Post()
  create(@Body() createEntityDto: CreateEntityDto) {
    return this.entityService.create(createEntityDto);
  }

  /**
   * Retrieve all entities
   * @returns Array of entities
   */
  @Get()
  findAll() {
    return this.entityService.findAll();
  }

  /**
   * Retrieve specific entity by ID
   * @param id 
   * @returns Entity with matching ID or undefined
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.entityService.findOne(id);
  }

  /**
   * Update existing entity
   * @param id 
   * @param updateEntityDto 
   * @returns Updated entity or undefined if not found
   */
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateEntityDto: UpdateEntityDto,
  ) {
    return this.entityService.update(id, updateEntityDto);
  }

  /**
   * Remove entity by ID
   * @param id 
   * @returns Boolean indicating success or failure
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.entityService.remove(id);
  }
}