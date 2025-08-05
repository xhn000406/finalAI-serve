// 不要使用默认导入
// import { PrismaClient } from '@prisma/client';

// 改为从自定义输出路径导入
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../../generated/prisma'; // 注意路径需要根据实际项目结构调整
import { withAccelerate } from '@prisma/extension-accelerate';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      log: [
        {
          emit: 'stdout',
          level: 'query',
        },
      ],
    });
    this.$extends(withAccelerate());
  }

  async onModuleInit() {
    await this.$connect();
  }
}
