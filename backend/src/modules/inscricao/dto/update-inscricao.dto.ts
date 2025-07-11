import { PartialType } from '@nestjs/swagger';
import { CreateInscricaoDto } from './create-inscricao.dto';

export class UpdateInscricaoDto extends PartialType(CreateInscricaoDto) {}