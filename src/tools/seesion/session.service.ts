// 不要使用默认导入
// import { PrismaClient } from '@prisma/client';

// 改为从自定义输出路径导入
import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { PrismaService } from '../db/prisma.service';
@Injectable()
export class SessionService {
  constructor(private prisma: PrismaService) {}

  async createSession(userId) {
    const roomId = v4(); // 生成新的roomId
    let tempId: string | null = null;
    // 若没有userId，创建临时用户标识
    if (!userId) {
      tempId = v4(); // 临时用户唯一标识
    }

    // 保存会话到数据库
    await this.prisma.chatSession.create({
      data: {
        roomId,
        userId: userId || null,
        tempUserId: tempId || null,
      },
    });

    return { roomId, tempId };
  }

  async findSeesion(roomId: string) {
    const result = this.prisma.chatSession.findFirst({
      where: {
        roomId: roomId,
      },
    });

    return result;
  }

  async isVaildSeesion() {}
}
