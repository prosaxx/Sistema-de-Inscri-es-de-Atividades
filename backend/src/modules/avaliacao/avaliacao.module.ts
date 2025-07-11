import { Module } from '@nestjs/common';
import { AvaliacaoService } from './avaliacao.service';
import { AvaliacaoController } from './avaliacao.controller';
import { ClienteModule } from '../cliente/cliente.module';
import { AtividadeModule } from '../atividade/atividade.module';

@Module({
  imports: [ClienteModule, AtividadeModule],
  controllers: [AvaliacaoController],
  providers: [AvaliacaoService],
  exports: [AvaliacaoService],
})
export class AvaliacaoModule {}