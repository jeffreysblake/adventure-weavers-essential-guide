import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { PhysicsService } from './physics.service';
import { CreatePhysicsBodyDto } from './physics.dto';
import { UpdatePhysicsBodyDto } from './physics.dto';

@Controller('physics')
export class PhysicsController {
  constructor(private readonly physicsService: PhysicsService) {}

  /**
   * Create a new physics body
   * @param createPhysicsBodyDto 
   * @returns Created physics body
   */
  @Post()
  create(@Body() createPhysicsBodyDto: CreatePhysicsBodyDto) {
    return this.physicsService.create(createPhysicsBodyDto);
  }

  /**
   * Retrieve all physics bodies
   * @returns Array of physics bodies
   */
  @Get()
  findAll() {
    return this.physicsService.findAll();
  }

  /**
   * Retrieve specific physics body by ID
   * @param id 
   * @returns Physics body with matching ID or undefined
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.physicsService.findOne(id);
  }

  /**
   * Update existing physics body
   * @param id 
   * @param updatePhysicsBodyDto 
   * @returns Updated physics body or undefined if not found
   */
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatePhysicsBodyDto: UpdatePhysicsBodyDto,
  ) {
    return this.physicsService.update(id, updatePhysicsBodyDto);
  }

  /**
   * Remove physics body by ID
   * @param id 
   * @returns Boolean indicating success or failure
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.physicsService.remove(id);
  }
}