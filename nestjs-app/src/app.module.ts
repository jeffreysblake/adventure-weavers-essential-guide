import { Module } from '@nestjs/common';
import { EntityService } from './entity/entity.service';
import { PhysicsService } from './physics/physics.service';
import { EntityController } from './entity/entity.controller';
import { PhysicsController } from './physics/physics.controller';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [ConfigModule],
  controllers: [EntityController, PhysicsController],
  providers: [EntityService, PhysicsService],
  exports: [EntityService, PhysicsService],
})
export class AppModule {}