import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from './schedule/schedule.module';

@Module({
  imports: [AuthModule, ScheduleModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
