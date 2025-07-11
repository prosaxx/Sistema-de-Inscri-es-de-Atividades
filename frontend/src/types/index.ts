// Enums
export enum StatusInscricao {
  ATIVA = 'ativa',
  CANCELADA = 'cancelada',
  CONCLUIDA = 'concluida',
  PENDENTE = 'pendente',
}

export enum TipoAvaliacao {
  CRITICA = 'CRITICA',
  SUGESTAO = 'SUGESTAO',
  ELOGIO = 'ELOGIO',
}

// Interfaces das entidades
export interface Cliente {
  id: string;
  nomeCliente: string;
  dataNascimento: Date;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  complemento?: string;
  dataCriacao: Date;
  dataAtualizacao: Date;
}

export interface Responsavel {
  id: string;
  nomeResponsavel: string;
  matricula: string;
  dataCriacao: Date;
  dataAtualizacao: Date;
}

export interface Atividade {
  id: string;
  nomeAtividade: string;
  descricao: string;
  unidadeSesc: string;
  responsavelId: string;
  responsavel?: Responsavel;
  totalInscricoes?: number;
  dataCriacao: Date;
  dataAtualizacao: Date;
}

export interface Inscricao {
  id: string;
  clienteId: string;
  atividadeId: string;
  dataInicio: Date;
  dataFim?: Date;
  status: StatusInscricao;
  observacoes?: string;
  cliente?: Cliente;
  atividade?: Atividade;
  dataInscricao: Date;
  dataAtualizacao: Date;
}

export interface Avaliacao {
  id: string;
  clienteId: string;
  atividadeId?: string;
  tipo: TipoAvaliacao;
  titulo: string;
  descricao: string;
  nota?: number;
  unidadeSesc?: string;
  resposta?: string;
  dataResposta?: Date;
  respondidoPor?: string;
  cliente?: Cliente;
  atividade?: Atividade;
  dataCriacao: Date;
  dataAtualizacao: Date;
}

export interface Admin {
  id: string;
  nomeAdmin: string;
  email: string;
  matricula: string;
  cargo?: string;
  unidadeSesc?: string;
  dataCriacao: Date;
  dataAtualizacao: Date;
  ultimoLogin?: Date;
  ativo: boolean;
}

export interface EnderecoViaCep {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

// DTOs para criação
export interface CreateClienteDto {
  nomeCliente: string;
  dataNascimento: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  complemento?: string;
}

export interface CreateResponsavelDto {
  nomeResponsavel: string;
  matricula: string;
}

export interface CreateAtividadeDto {
  nomeAtividade: string;
  descricao: string;
  unidadeSesc: string;
  responsavelId: string;
}

export interface CreateInscricaoDto {
  clienteId: string;
  atividadeId: string;
  dataInicio: Date;
  dataFim?: Date;
  status?: StatusInscricao;
  observacoes?: string;
}

export interface CreateAvaliacaoDto {
  clienteId: string;
  atividadeId?: string;
  tipo: TipoAvaliacao;
  titulo: string;
  descricao: string;
  nota?: number;
  unidadeSesc?: string;
}

export interface CreateAdminDto {
  nomeAdmin: string;
  email: string;
  senha: string;
  matricula: string;
  cargo?: string;
  unidadeSesc?: string;
}

// DTOs para atualização (todos os campos opcionais)
export type UpdateClienteDto = Partial<CreateClienteDto>;
export type UpdateResponsavelDto = Partial<CreateResponsavelDto>;
export type UpdateAtividadeDto = Partial<CreateAtividadeDto>;
export type UpdateInscricaoDto = Partial<CreateInscricaoDto>;
export type UpdateAvaliacaoDto = Partial<CreateAvaliacaoDto>;
export type UpdateAdminDto = Partial<CreateAdminDto>;

// Interfaces para resposta de login
export interface LoginResponse {
  admin?: Admin;
  message?: string;
}

// Interface para estatísticas de avaliações
export interface EstatisticasAvaliacoes {
  total: number;
  porTipo: {
    criticas: number;
    sugestoes: number;
    elogios: number;
  };
  respondidas: number;
  pendentes: number;
  notaMedia: number;
}