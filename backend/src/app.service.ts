import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'API do Sistema de Inscrições SESC está funcionando! 🚀';
  }
}