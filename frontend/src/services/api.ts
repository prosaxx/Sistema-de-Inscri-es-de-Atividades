import axios from 'axios';
import {
  Cliente,
  Responsavel,
  Atividade,
  Inscricao,
  Avaliacao,
  Admin,
  EnderecoViaCep,
  CreateClienteDto,
  CreateResponsavelDto,
  CreateAtividadeDto,
  CreateInscricaoDto,
  CreateAvaliacaoDto,
  CreateAdminDto,
  UpdateClienteDto,
  UpdateResponsavelDto,
  UpdateAtividadeDto,
  UpdateInscricaoDto,
  UpdateAvaliacaoDto,
  UpdateAdminDto,
  LoginResponse,
  EstatisticasAvaliacoes,
} from '../types';

// Configuração base do axios
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  timeout: parseInt(process.env.REACT_APP_API_TIMEOUT || '10000'),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação se necessário
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentAdmin');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Serviços para Clientes
export const clienteService = {
  getAll: (nome?: string): Promise<Cliente[]> => {
    const params = nome ? { nome } : {};
    return api.get('/clientes', { params }).then(res => res.data);
  },

  getById: (id: string): Promise<Cliente> => {
    return api.get(`/clientes/${id}`).then(res => res.data);
  },

  create: (data: CreateClienteDto): Promise<Cliente> => {
    return api.post('/clientes', data).then(res => res.data);
  },

  update: (id: string, data: UpdateClienteDto): Promise<Cliente> => {
    return api.patch(`/clientes/${id}`, data).then(res => res.data);
  },

  delete: (id: string): Promise<void> => {
    return api.delete(`/clientes/${id}`).then(res => res.data);
  },
};

// Serviços para Responsáveis
export const responsavelService = {
  getAll: (nome?: string, matricula?: string): Promise<Responsavel[]> => {
    const params: any = {};
    if (nome) params.nome = nome;
    if (matricula) params.matricula = matricula;
    return api.get('/responsaveis', { params }).then(res => res.data);
  },

  getById: (id: string): Promise<Responsavel> => {
    return api.get(`/responsaveis/${id}`).then(res => res.data);
  },

  create: (data: CreateResponsavelDto): Promise<Responsavel> => {
    return api.post('/responsaveis', data).then(res => res.data);
  },

  update: (id: string, data: UpdateResponsavelDto): Promise<Responsavel> => {
    return api.patch(`/responsaveis/${id}`, data).then(res => res.data);
  },

  delete: (id: string): Promise<void> => {
    return api.delete(`/responsaveis/${id}`).then(res => res.data);
  },
};

// Serviços para Atividades
export const atividadeService = {
  getAll: (
    unidade?: string,
    responsavelId?: string,
    nome?: string,
    includeResponsavel?: boolean
  ): Promise<Atividade[]> => {
    const params: any = {};
    if (unidade) params.unidade = unidade;
    if (responsavelId) params.responsavelId = responsavelId;
    if (nome) params.nome = nome;
    if (includeResponsavel) params.includeResponsavel = includeResponsavel;
    return api.get('/atividades', { params }).then(res => res.data);
  },

  getById: (id: string, includeResponsavel?: boolean): Promise<Atividade> => {
    const params = includeResponsavel ? { includeResponsavel } : {};
    return api.get(`/atividades/${id}`, { params }).then(res => res.data);
  },

  create: (data: CreateAtividadeDto): Promise<Atividade> => {
    return api.post('/atividades', data).then(res => res.data);
  },

  update: (id: string, data: UpdateAtividadeDto): Promise<Atividade> => {
    return api.patch(`/atividades/${id}`, data).then(res => res.data);
  },

  delete: (id: string): Promise<void> => {
    return api.delete(`/atividades/${id}`).then(res => res.data);
  },
};

// Serviços para Inscrições
export const inscricaoService = {
  getAll: (
    clienteId?: string,
    atividadeId?: string,
    status?: string,
    includeRelations?: boolean
  ): Promise<Inscricao[]> => {
    const params: any = {};
    if (clienteId) params.clienteId = clienteId;
    if (atividadeId) params.atividadeId = atividadeId;
    if (status) params.status = status;
    if (includeRelations) params.includeRelations = includeRelations;
    return api.get('/inscricoes', { params }).then(res => res.data);
  },

  getById: (id: string, includeRelations?: boolean): Promise<Inscricao> => {
    const params = includeRelations ? { includeRelations } : {};
    return api.get(`/inscricoes/${id}`, { params }).then(res => res.data);
  },

  create: (data: CreateInscricaoDto): Promise<Inscricao> => {
    return api.post('/inscricoes', data).then(res => res.data);
  },

  update: (id: string, data: UpdateInscricaoDto): Promise<Inscricao> => {
    return api.patch(`/inscricoes/${id}`, data).then(res => res.data);
  },

  cancel: (id: string): Promise<Inscricao> => {
    return api.put(`/inscricoes/${id}/cancelar`).then(res => res.data);
  },

  delete: (id: string): Promise<void> => {
    return api.delete(`/inscricoes/${id}`).then(res => res.data);
  },
};

// Serviços para Avaliações
export const avaliacaoService = {
  getAll: (
    includeRelations?: boolean,
    tipo?: string,
    unidade?: string,
    clienteId?: string,
    atividadeId?: string,
    semResposta?: boolean
  ): Promise<Avaliacao[]> => {
    const params: any = {};
    if (includeRelations) params.includeRelations = includeRelations;
    if (tipo) params.tipo = tipo;
    if (unidade) params.unidade = unidade;
    if (clienteId) params.clienteId = clienteId;
    if (atividadeId) params.atividadeId = atividadeId;
    if (semResposta) params.semResposta = semResposta;
    return api.get('/avaliacoes', { params }).then(res => res.data);
  },

  getById: (id: string, includeRelations?: boolean): Promise<Avaliacao> => {
    const params = includeRelations ? { includeRelations } : {};
    return api.get(`/avaliacoes/${id}`, { params }).then(res => res.data);
  },

  getEstatisticas: (): Promise<EstatisticasAvaliacoes> => {
    return api.get('/avaliacoes/estatisticas').then(res => res.data);
  },

  create: (data: CreateAvaliacaoDto): Promise<Avaliacao> => {
    return api.post('/avaliacoes', data).then(res => res.data);
  },

  update: (id: string, data: UpdateAvaliacaoDto): Promise<Avaliacao> => {
    return api.patch(`/avaliacoes/${id}`, data).then(res => res.data);
  },

  responder: (id: string, resposta: string, respondidoPor: string): Promise<Avaliacao> => {
    return api.put(`/avaliacoes/${id}/responder`, { resposta, respondidoPor }).then(res => res.data);
  },

  delete: (id: string): Promise<void> => {
    return api.delete(`/avaliacoes/${id}`).then(res => res.data);
  },
};

// Serviços para Administradores
export const adminService = {
  getAll: (nome?: string, matricula?: string): Promise<Admin[]> => {
    const params: any = {};
    if (nome) params.nome = nome;
    if (matricula) params.matricula = matricula;
    return api.get('/admins', { params }).then(res => res.data);
  },

  getById: (id: string): Promise<Admin> => {
    return api.get(`/admins/${id}`).then(res => res.data);
  },

  create: (data: CreateAdminDto): Promise<Admin> => {
    return api.post('/admins', data).then(res => res.data);
  },

  update: (id: string, data: UpdateAdminDto): Promise<Admin> => {
    return api.patch(`/admins/${id}`, data).then(res => res.data);
  },

  alterarStatus: (id: string, ativo: boolean): Promise<Admin> => {
    return api.put(`/admins/${id}/status`, { ativo }).then(res => res.data);
  },

  login: (email: string, senha: string): Promise<LoginResponse> => {
    return api.post('/admins/login', { email, senha }).then(res => res.data);
  },

  delete: (id: string): Promise<void> => {
    return api.delete(`/admins/${id}`).then(res => res.data);
  },
};

// Serviços para CEP
export const cepService = {
  buscarEndereco: (cep: string): Promise<EnderecoViaCep> => {
    return api.get(`/cep/${cep}`).then(res => res.data);
  },

  validarCep: (cep: string): Promise<{ valido: boolean }> => {
    return api.get(`/cep/${cep}/validar`).then(res => res.data);
  },
};

export default api;