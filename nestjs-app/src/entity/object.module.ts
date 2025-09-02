import { Module } from '@nestjs/common';
import { ObjectService } from './object.service';
import { ObjectController } from './object.controller';
import { EntityModule } from './entity.module';

@Module({
  imports: [EntityModule],
  controllers: [ObjectController],
  providers: [ObjectService],
  exports: [ObjectService],
})
export class ObjectModule {}