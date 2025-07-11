import { Module } from '@nestjs/common';
import { AtividadeService } from './atividade.service';
import { AtividadeController } from './atividade.controller';
import { ResponsavelModule } from '../responsavel/responsavel.module';

@Module({
  imports: [ResponsavelModule],
  controllers: [AtividadeController],
  providers: [AtividadeService],
  exports: [AtividadeService],
})
export class AtividadeModule {}