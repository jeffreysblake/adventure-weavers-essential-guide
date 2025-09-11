import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameStateService } from './game-state.service';
import { CommandProcessorService } from './command-processor.service';
import { EntityModule } from '../entity/entity.module';
import { RoomModule } from '../entity/room.module';
import { PlayerModule } from '../entity/player.module';
import { ObjectModule } from '../entity/object.module';

@Module({
  imports: [EntityModule, RoomModule, PlayerModule, ObjectModule],
  controllers: [GameController],
  providers: [GameService, GameStateService, CommandProcessorService],
  exports: [GameService, GameStateService]
})
export class GameModule {}