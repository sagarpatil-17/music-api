
import {
    Body,
    Controller,
    Get,
    Patch,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';


import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('Profile')
@ApiBearerAuth()
@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
    constructor(
        private readonly profileService: ProfileService,
    ) { }

    @Get()
    getProfile(
        @CurrentUser() user: { id: string },
    ) {
        return this.profileService.getProfile(user.id);
    }

    @Patch()
    updateProfile(
        @CurrentUser() user: { id: string },
        @Body() dto: UpdateProfileDto,
    ) {
        return this.profileService.updateProfile(
            user.id,
            dto,
        );
    }


    @Patch('password')
    changePassword(
        @CurrentUser() user: { id: string },
        @Body() dto: ChangePasswordDto,
    ) {
        return this.profileService.changePassword(
            user.id,
            dto,
        );
    }

}
