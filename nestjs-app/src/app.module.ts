import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EntityModule } from './entity/entity.module';
import { RoomModule } from './entity/room.module';
import { PlayerModule } from './entity/player.module';
import { ObjectModule } from './entity/object.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api*'],
    }),
    EntityModule,
    RoomModule,
    PlayerModule,
    ObjectModule,
    GameModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}