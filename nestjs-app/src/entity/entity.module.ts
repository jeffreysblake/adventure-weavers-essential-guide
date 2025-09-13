import { Module } from '@nestjs/common';
import { EntityService } from './entity.service';
import { EntityController } from './entity.controller';
import { PhysicsService } from './physics.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [EntityController],
  providers: [EntityService, PhysicsService],
  exports: [EntityService, PhysicsService],
})
export class EntityModule {}