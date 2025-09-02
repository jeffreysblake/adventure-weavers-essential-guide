import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';
import { EntityModule } from './entity.module';
import { ObjectModule } from './object.module';
import { RoomModule } from './room.module';

@Module({
  imports: [EntityModule, ObjectModule, RoomModule],
  controllers: [PlayerController],
  providers: [PlayerService],
  exports: [PlayerService],
})
export class PlayerModule {}