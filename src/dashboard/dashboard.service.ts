import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class DashboardService {
    constructor(private prisma: PrismaService) { }

    async getAdminDashboard() {
        const [songs, albums] = await this.prisma.$transaction([
            this.prisma.song.count(),
            this.prisma.album.count(),
        ]);

        return {
            songs,
            albums,
        };
    }
}
