import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ClienteModule } from './modules/cliente/cliente.module';
import { AtividadeModule } from './modules/atividade/atividade.module';
import { ResponsavelModule } from './modules/responsavel/responsavel.module';
import { InscricaoModule } from './modules/inscricao/inscricao.module';
import { AvaliacaoModule } from './modules/avaliacao/avaliacao.module';
import { CepModule } from './modules/cep/cep.module';
import { FirebaseModule } from './modules/firebase/firebase.module';
import { AdminModule } from './modules/admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    FirebaseModule,
    ClienteModule,
    AtividadeModule,
    ResponsavelModule,
    InscricaoModule,
    AvaliacaoModule,
    CepModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}