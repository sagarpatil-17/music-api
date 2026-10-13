
import {
    BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';


@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  
async changePassword(
  userId: string,
  dto: ChangePasswordDto,
) {
  if (dto.currentPassword === dto.newPassword) {
    throw new BadRequestException(
      'New password must be different from the current password',
    );
  }

  const user = await this.prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      password: true,
      status: true,
    },
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  if (user.status !== 'ACTIVE') {
    throw new UnauthorizedException(
      'Your account is not active',
    );
  }

  const isPasswordValid = await bcrypt.compare(
    dto.currentPassword,
    user.password,
  );

  if (!isPasswordValid) {
    throw new UnauthorizedException(
      'Current password is incorrect',
    );
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(
    dto.newPassword,
    saltRounds,
  );

  await this.prisma.user.update({
    where: { id: userId },
    data: {
      password: hashedPassword,
    },
  });

  return {
    message: 'Password changed successfully',
  };
}

}
