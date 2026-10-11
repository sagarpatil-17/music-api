import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { DashboardService } from "./dashboard.service";

@ApiTags('DashboardController')
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
    constructor(private dashboard: DashboardService) { }

    @Get('admin')
    getAdminDashboard() {
        return this.dashboard.getAdminDashboard();
    }
}