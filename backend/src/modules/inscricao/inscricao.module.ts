import { Module } from '@nestjs/common';
import { InscricaoService } from './inscricao.service';
import { InscricaoController } from './inscricao.controller';
import { ClienteModule } from '../cliente/cliente.module';
import { AtividadeModule } from '../atividade/atividade.module';

@Module({
  imports: [ClienteModule, AtividadeModule],
  controllers: [InscricaoController],
  providers: [InscricaoService],
  exports: [InscricaoService],
})
export class InscricaoModule {}