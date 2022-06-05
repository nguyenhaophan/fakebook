import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import * as bcrypt from 'bcrypt'

import { RoomDocument } from 'src/rooms/room.schema'
import { RegisterTenantDto } from './dto/register-tenant.dto'
import { TenantDocument } from './tenant.schema'

@Injectable()
export class TenantsService {
  constructor(
    @InjectModel('Tenant') private tenantModel: Model<TenantDocument>,
    @InjectModel('Room') private roomModel: Model<RoomDocument>,
  ) {}

  async getAll(): Promise<TenantDocument[]> {
    return await this.tenantModel.find()
  }

  async findOne(username: string): Promise<TenantDocument | undefined> {
    return await this.tenantModel.findOne({ username: username })
  }

  async registerTenant(
    registerTenantDto: RegisterTenantDto,
  ): Promise<TenantDocument> {
    const existedTenant = await this.tenantModel.findOne({
      username: registerTenantDto.username,
    })

    if (existedTenant) {
      throw new ConflictException('Username existed')
    }

    // Hasing password with bcrypt
    const salt = await bcrypt.genSalt(10)
    registerTenantDto.password = await bcrypt.hash(
      registerTenantDto.password,
      salt,
    )

    return await this.tenantModel.create(registerTenantDto)
  }

  async addFav(tenantId: string, roomId: string) {
    const foundTenant = await this.tenantModel.findById(tenantId)
    const foundRoom = await this.roomModel.findById(roomId)

    if (!foundTenant) {
      throw new NotFoundException('Tenant not found')
    }

    if (!foundRoom) {
      throw new NotFoundException('Room not found')
    }

    const existed = await this.tenantModel.exists({
      _id: tenantId,
      favLists: roomId,
    })

    if (existed) {
      throw new InternalServerErrorException('Room already added')
    }

    const updatedFavLists = await this.tenantModel.findByIdAndUpdate(
      tenantId,
      {
        $push: { favLists: roomId },
      },
      { new: true },
    )

    return updatedFavLists
  }

  async removeFav(tenantId: string, roomId: string) {
    const foundTenant = await this.tenantModel.findById(tenantId)
    const foundRoom = await this.roomModel.findById(roomId)

    if (!foundTenant) {
      throw new NotFoundException('Tenant not found')
    }

    if (!foundRoom) {
      throw new NotFoundException('Room not found')
    }

    const updatedFavLists = await this.tenantModel.findByIdAndUpdate(
      tenantId,
      {
        $pull: { favLists: roomId },
      },
      { new: true },
    )

    return updatedFavLists
  }

  async deleteTenant(tenantId: string) {
    const foundTenant = await this.tenantModel.findByIdAndDelete(tenantId)

    if (!foundTenant) {
      throw new NotFoundException('Tenant not found')
    }

    return 'Tenant deleted successfully'
  }
}
