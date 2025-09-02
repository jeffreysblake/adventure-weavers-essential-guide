import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EntityModule } from './entity/entity.module';
import { RoomModule } from './entity/room.module';
import { PlayerModule } from './entity/player.module';
import { ObjectModule } from './entity/object.module';

@Module({
  imports: [
    EntityModule,
    RoomModule,
    PlayerModule,
    ObjectModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}