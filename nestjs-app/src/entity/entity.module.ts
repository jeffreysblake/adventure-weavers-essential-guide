import { Module } from '@nestjs/common';
import { EntityService } from './entity.service';
import { EntityController } from './entity.controller';
import { PhysicsService } from './physics.service';

@Module({
  controllers: [EntityController],
  providers: [EntityService, PhysicsService],
  exports: [EntityService, PhysicsService],
})
export class EntityModule {}