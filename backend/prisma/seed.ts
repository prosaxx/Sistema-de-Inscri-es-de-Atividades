import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes
  await prisma.avaliacao.deleteMany();
  await prisma.inscricao.deleteMany();
  await prisma.responsavel.deleteMany();
  await prisma.atividade.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.admin.deleteMany();

  // Criar admin padrão
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.admin.create({
    data: {
      nome: 'Administrador Sistema',
      email: 'admin@sesc.com.br',
      senha: hashedPassword,
      status: 'ATIVO',
    },
  });
  console.log('✅ Admin criado:', admin.email);

  // Criar clientes de exemplo
  const cliente1 = await prisma.cliente.create({
    data: {
      nome: 'João Silva Santos',
      email: 'joao.silva@email.com',
      telefone: '(11) 99999-1234',
      cpf: '123.456.789-01',
      dataNascimento: new Date('1985-03-15'),
      cep: '01310-100',
      endereco: 'Avenida Paulista',
      numero: '1000',
      complemento: 'Apto 101',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      estado: 'SP',
      status: 'ATIVO',
    },
  });

  const cliente2 = await prisma.cliente.create({
    data: {
      nome: 'Maria Oliveira Costa',
      email: 'maria.oliveira@email.com',
      telefone: '(11) 88888-5678',
      cpf: '987.654.321-09',
      dataNascimento: new Date('1990-07-22'),
      cep: '04038-001',
      endereco: 'Rua Vergueiro',
      numero: '2000',
      bairro: 'Vila Mariana',
      cidade: 'São Paulo',
      estado: 'SP',
      status: 'ATIVO',
    },
  });

  const cliente3 = await prisma.cliente.create({
    data: {
      nome: 'Pedro Souza Lima',
      email: 'pedro.souza@email.com',
      telefone: '(11) 77777-9012',
      cpf: '456.789.123-45',
      dataNascimento: new Date('2005-12-10'),
      cep: '05407-002',
      endereco: 'Rua Teodoro Sampaio',
      numero: '500',
      bairro: 'Pinheiros',
      cidade: 'São Paulo',
      estado: 'SP',
      status: 'ATIVO',
    },
  });

  console.log('✅ Clientes criados:', [cliente1.nome, cliente2.nome, cliente3.nome]);

  // Criar responsáveis para o cliente menor de idade
  const responsavel1 = await prisma.responsavel.create({
    data: {
      nome: 'Ana Souza Lima',
      email: 'ana.souza@email.com',
      telefone: '(11) 66666-3456',
      cpf: '789.123.456-78',
      clienteId: cliente3.id,
      status: 'ATIVO',
    },
  });

  console.log('✅ Responsável criado:', responsavel1.nome);

  // Criar atividades
  const atividade1 = await prisma.atividade.create({
    data: {
      nome: 'Natação Infantil',
      descricao: 'Aulas de natação para crianças de 6 a 12 anos',
      tipo: 'ESPORTE',
      dataInicio: new Date('2025-02-01'),
      dataFim: new Date('2025-06-30'),
      horarioInicio: '08:00',
      horarioFim: '09:00',
      vagas: 20,
      vagasDisponiveis: 18,
      idadeMinima: 6,
      idadeMaxima: 12,
      valor: 150.00,
      local: 'Piscina Principal - SESC Pompeia',
      instrutor: 'Carlos Aquático',
      observacoes: 'Trazer touca e óculos de natação',
      status: 'ATIVO',
    },
  });

  const atividade2 = await prisma.atividade.create({
    data: {
      nome: 'Teatro Adulto',
      descricao: 'Oficina de teatro para adultos iniciantes',
      tipo: 'CULTURA',
      dataInicio: new Date('2025-01-15'),
      dataFim: new Date('2025-05-15'),
      horarioInicio: '19:00',
      horarioFim: '21:00',
      vagas: 15,
      vagasDisponiveis: 12,
      idadeMinima: 18,
      valor: 200.00,
      local: 'Teatro SESC Vila Mariana',
      instrutor: 'Fernanda Dramática',
      observacoes: 'Roupas confortáveis para exercícios',
      status: 'ATIVO',
    },
  });

  const atividade3 = await prisma.atividade.create({
    data: {
      nome: 'Curso de Informática Básica',
      descricao: 'Curso básico de informática para terceira idade',
      tipo: 'EDUCACAO',
      dataInicio: new Date('2025-01-20'),
      dataFim: new Date('2025-04-20'),
      horarioInicio: '14:00',
      horarioFim: '16:00',
      vagas: 12,
      vagasDisponiveis: 10,
      idadeMinima: 60,
      valor: 100.00,
      local: 'Laboratório de Informática - SESC Consolação',
      instrutor: 'Roberto Digital',
      observacoes: 'Não é necessário conhecimento prévio',
      status: 'ATIVO',
    },
  });

  const atividade4 = await prisma.atividade.create({
    data: {
      nome: 'Yoga no Parque',
      descricao: 'Sessões de yoga ao ar livre',
      tipo: 'LAZER',
      dataInicio: new Date('2025-01-10'),
      dataFim: new Date('2025-12-31'),
      horarioInicio: '07:00',
      horarioFim: '08:00',
      vagas: 25,
      vagasDisponiveis: 20,
      idadeMinima: 16,
      valor: 80.00,
      local: 'Parque SESC Interlagos',
      instrutor: 'Lucia Zen',
      observacoes: 'Trazer tapete de yoga',
      status: 'ATIVO',
    },
  });

  console.log('✅ Atividades criadas:', [atividade1.nome, atividade2.nome, atividade3.nome, atividade4.nome]);

  // Criar inscrições
  const inscricao1 = await prisma.inscricao.create({
    data: {
      clienteId: cliente3.id,
      atividadeId: atividade1.id,
      status: 'CONFIRMADA',
      observacoes: 'Cliente menor de idade com responsável cadastrado',
    },
  });

  const inscricao2 = await prisma.inscricao.create({
    data: {
      clienteId: cliente1.id,
      atividadeId: atividade2.id,
      status: 'CONFIRMADA',
    },
  });

  const inscricao3 = await prisma.inscricao.create({
    data: {
      clienteId: cliente2.id,
      atividadeId: atividade4.id,
      status: 'PENDENTE',
    },
  });

  console.log('✅ Inscrições criadas');

  // Criar avaliações
  const avaliacao1 = await prisma.avaliacao.create({
    data: {
      clienteId: cliente1.id,
      atividadeId: atividade2.id,
      nota: 5,
      comentario: 'Excelente atividade! Instrutor muito competente.',
    },
  });

  console.log('✅ Avaliações criadas');

  console.log('🎉 Seed concluído com sucesso!');
  console.log('\n📊 Dados criados:');
  console.log('- 1 Administrador');
  console.log('- 3 Clientes');
  console.log('- 1 Responsável');
  console.log('- 4 Atividades');
  console.log('- 3 Inscrições');
  console.log('- 1 Avaliação');
  console.log('\n🔑 Credenciais do Admin:');
  console.log('Email: admin@sesc.com.br');
  console.log('Senha: admin123');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });