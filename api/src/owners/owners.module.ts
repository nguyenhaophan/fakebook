import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { OwnersService } from './owners.service'
import { OwnersController } from './owners.controller'
import { OwnerSchema } from './owner.schema'
import { RoomSchema } from 'src/rooms/room.schema'
import { TenantSchema } from 'src/tenants/tenant.schema'
import { AuthModule } from 'src/auth/auth.module'

@Module({
  imports: [
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([{ name: 'Owner', schema: OwnerSchema }]),
    MongooseModule.forFeature([{ name: 'Room', schema: RoomSchema }]),
    MongooseModule.forFeature([{ name: 'Tenant', schema: TenantSchema }]),
  ],
  controllers: [OwnersController],
  providers: [OwnersService],
  exports: [OwnersService],
})
export class OwnersModule {}
