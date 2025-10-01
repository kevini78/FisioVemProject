// Serviço de API simples usando localStorage para simular backend

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  userType: 'patient' | 'physiotherapist';
  createdAt: string;
}

export interface Consultation {
  id: string;
  patientId: string;
  physiotherapistId: string;
  physiotherapistName: string;
  date: string;
  time: string;
  type: 'presencial' | 'online';
  specialty: string;
  status: 'agendada' | 'confirmada' | 'concluida' | 'cancelada';
  address?: string;
  city?: string;
  state?: string;
  notes?: string;
  price: number;
  createdAt: string;
}

export interface Physiotherapist {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  price: number;
  available: boolean;
  bio: string;
}

class ApiService {
  private getStorageKey(key: string): string {
    return `fisiovem_${key}`;
  }

  // Autenticação de Usuário
  async register(userData: Omit<User, 'id' | 'createdAt'>): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const users = this.getUsers();
      console.log('Usuários existentes antes do cadastro:', users.map(u => u.email));
      
      // Verificar se o email já existe
      if (users.find(u => u.email === userData.email)) {
        return { success: false, error: 'E-mail já cadastrado' };
      }

      const newUser: User = {
        ...userData,
        id: `user_${Date.now()}`,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem(this.getStorageKey('users'), JSON.stringify(users));
      console.log('Usuário salvo na lista:', newUser);
      console.log('Lista atualizada de usuários:', users.map(u => u.email));
      
      // NÃO fazer login automático - usuário deve fazer login manualmente
      console.log('Cadastro concluído sem login automático');

      return { success: true, user: newUser };
    } catch (error) {
      console.error('Erro no cadastro:', error);
      return { success: false, error: 'Erro ao criar conta' };
    }
  }

  async login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const users = this.getUsers();
      console.log('Usuários disponíveis para login:', users.map(u => ({ email: u.email, userType: u.userType })));
      console.log('Buscando usuário com email:', email, 'e senha:', password);
      
      const user = users.find(u => u.email === email && u.password === password);
      console.log('Usuário encontrado:', user ? { email: user.email, userType: user.userType } : 'Nenhum');

      if (!user) {
        return { success: false, error: 'E-mail ou senha incorretos' };
      }

      localStorage.setItem(this.getStorageKey('current_user'), JSON.stringify(user));
      console.log('Usuário salvo como atual:', user);
      
      return { success: true, user };
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: 'Erro ao fazer login' };
    }
  }

  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem(this.getStorageKey('current_user'));
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem(this.getStorageKey('current_user'));
  }

  // Consultations
  async bookConsultation(consultationData: Omit<Consultation, 'id' | 'createdAt' | 'status'>): Promise<{ success: boolean; consultation?: Consultation; error?: string }> {
    try {
      const consultations = this.getConsultations();
      
      const newConsultation: Consultation = {
        ...consultationData,
        id: `consultation_${Date.now()}`,
        status: 'agendada',
        createdAt: new Date().toISOString()
      };

      consultations.push(newConsultation);
      localStorage.setItem(this.getStorageKey('consultations'), JSON.stringify(consultations));

      return { success: true, consultation: newConsultation };
    } catch (error) {
      return { success: false, error: 'Erro ao agendar consulta' };
    }
  }

  getConsultations(userId?: string): Consultation[] {
    try {
      const consultationsStr = localStorage.getItem(this.getStorageKey('consultations'));
      const consultations: Consultation[] = consultationsStr ? JSON.parse(consultationsStr) : [];
      
      if (userId) {
        return consultations.filter(c => c.patientId === userId);
      }
      
      return consultations;
    } catch {
      return [];
    }
  }

  async updateConsultationStatus(consultationId: string, status: Consultation['status']): Promise<{ success: boolean; error?: string }> {
    try {
      // Buscar TODAS as consultas para poder atualizar
      const consultations = this.getConsultations(); // Sem userId para pegar todas
      console.log('Todas as consultas antes da atualização:', consultations);
      console.log('Procurando consulta com ID:', consultationId);
      
      const consultationIndex = consultations.findIndex(c => c.id === consultationId);
      console.log('Índice da consulta encontrada:', consultationIndex);
      
      if (consultationIndex === -1) {
        console.log('Consulta não encontrada!');
        return { success: false, error: 'Consulta não encontrada' };
      }

      console.log('Consulta antes da atualização:', consultations[consultationIndex]);
      consultations[consultationIndex].status = status;
      console.log('Consulta após atualização:', consultations[consultationIndex]);
      
      localStorage.setItem(this.getStorageKey('consultations'), JSON.stringify(consultations));
      console.log('Consultas salvas no localStorage');

      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar consulta:', error);
      return { success: false, error: 'Erro ao atualizar consulta' };
    }
  }

  async cancelConsultation(consultationId: string): Promise<{ success: boolean; error?: string }> {
    console.log('=== CANCELANDO CONSULTA ===');
    console.log('ID recebido:', consultationId);
    const result = await this.updateConsultationStatus(consultationId, 'cancelada');
    console.log('Resultado do cancelamento:', result);
    return result;
  }

  async updateConsultationDateTime(consultationId: string, newDate: string, newTime: string): Promise<{ success: boolean; error?: string }> {
    try {
      const consultations = this.getConsultations();
      const consultationIndex = consultations.findIndex(c => c.id === consultationId);
      
      if (consultationIndex === -1) {
        return { success: false, error: 'Consulta não encontrada' };
      }

      consultations[consultationIndex].date = newDate;
      consultations[consultationIndex].time = newTime;
      localStorage.setItem(this.getStorageKey('consultations'), JSON.stringify(consultations));

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Erro ao reagendar consulta' };
    }
  }

  // Fisioterapeutas
  getPhysiotherapists(): Physiotherapist[] {
    const defaultPhysiotherapists: Physiotherapist[] = [
      {
        id: 'physio_1',
        name: 'Dr. Carlos Silva',
        specialty: 'Ortopedia',
        experience: '8 anos',
        rating: 4.9,
        price: 120,
        available: true,
        bio: 'Especialista em fisioterapia ortopédica com foco em reabilitação pós-cirúrgica.'
      },
      {
        id: 'physio_2',
        name: 'Dra. Ana Costa',
        specialty: 'Neurologia',
        experience: '12 anos',
        rating: 4.8,
        price: 150,
        available: true,
        bio: 'Fisioterapeuta neurológica com especialização em AVC e lesões medulares.'
      },
      {
        id: 'physio_3',
        name: 'Dr. Pedro Oliveira',
        specialty: 'Esportiva',
        experience: '6 anos',
        rating: 4.7,
        price: 100,
        available: true,
        bio: 'Especialista em fisioterapia esportiva e prevenção de lesões.'
      },
      {
        id: 'physio_4',
        name: 'Dra. Maria Santos',
        specialty: 'Geriatria',
        experience: '10 anos',
        rating: 4.9,
        price: 130,
        available: true,
        bio: 'Fisioterapeuta geriátrica com foco em mobilidade e qualidade de vida.'
      },
      {
        id: 'physio_5',
        name: 'Dr. João Lima',
        specialty: 'RPG',
        experience: '7 anos',
        rating: 4.6,
        price: 110,
        available: true,
        bio: 'Especialista em RPG (Reeducação Postural Global) e pilates terapêutico.'
      },
      {
        id: 'physio_6',
        name: 'Dra. Lucia Ferreira',
        specialty: 'Pediatria',
        experience: '9 anos',
        rating: 4.8,
        price: 140,
        available: true,
        bio: 'Fisioterapeuta pediátrica especializada em desenvolvimento motor infantil.'
      },
      // Mais fisioterapeutas para Ortopedia
      {
        id: 'physio_7',
        name: 'Dr. Roberto Silva',
        specialty: 'Ortopedia',
        experience: '15 anos',
        rating: 4.9,
        price: 130,
        available: true,
        bio: 'Especialista em ortopedia com foco em coluna vertebral e articulações.'
      },
      {
        id: 'physio_8',
        name: 'Dra. Fernanda Rocha',
        specialty: 'Ortopedia',
        experience: '11 anos',
        rating: 4.7,
        price: 125,
        available: true,
        bio: 'Fisioterapeuta ortopédica especializada em lesões de joelho e quadril.'
      },
      // Mais fisioterapeutas para Neurologia
      {
        id: 'physio_9',
        name: 'Dr. André Martins',
        specialty: 'Neurologia',
        experience: '14 anos',
        rating: 4.8,
        price: 160,
        available: true,
        bio: 'Neurologista com especialização em Parkinson e esclerose múltipla.'
      },
      {
        id: 'physio_10',
        name: 'Dra. Camila Nunes',
        specialty: 'Neurologia',
        experience: '9 anos',
        rating: 4.6,
        price: 145,
        available: true,
        bio: 'Especialista em reabilitação neurológica pós-trauma.'
      },
      // Mais fisioterapeutas para Esportiva
      {
        id: 'physio_11',
        name: 'Dr. Bruno Alves',
        specialty: 'Esportiva',
        experience: '8 anos',
        rating: 4.8,
        price: 115,
        available: true,
        bio: 'Fisioterapeuta esportivo com experiência em atletas profissionais.'
      },
      {
        id: 'physio_12',
        name: 'Dra. Juliana Castro',
        specialty: 'Esportiva',
        experience: '7 anos',
        rating: 4.5,
        price: 105,
        available: true,
        bio: 'Especialista em prevenção e tratamento de lesões esportivas.'
      },
      // Mais fisioterapeutas para Geriatria
      {
        id: 'physio_13',
        name: 'Dr. Sérgio Barbosa',
        specialty: 'Geriatria',
        experience: '16 anos',
        rating: 4.9,
        price: 135,
        available: true,
        bio: 'Geriatra com foco em fisioterapia preventiva para idosos.'
      },
      {
        id: 'physio_14',
        name: 'Dra. Regina Campos',
        specialty: 'Geriatria',
        experience: '13 anos',
        rating: 4.7,
        price: 128,
        available: true,
        bio: 'Especialista em reabilitação geriátrica e cuidados domiciliares.'
      },
      // Mais fisioterapeutas para RPG
      {
        id: 'physio_15',
        name: 'Dr. Marcos Pereira',
        specialty: 'RPG',
        experience: '10 anos',
        rating: 4.8,
        price: 118,
        available: true,
        bio: 'Especialista em RPG e correção postural avançada.'
      },
      {
        id: 'physio_16',
        name: 'Dra. Patrícia Gomes',
        specialty: 'RPG',
        experience: '8 anos',
        rating: 4.6,
        price: 112,
        available: true,
        bio: 'Fisioterapeuta RPG com foco em dores crônicas e postura.'
      },
      // Mais fisioterapeutas para Pediatria
      {
        id: 'physio_17',
        name: 'Dr. Rafael Souza',
        specialty: 'Pediatria',
        experience: '11 anos',
        rating: 4.8,
        price: 145,
        available: true,
        bio: 'Pediatra especializado em fisioterapia respiratória infantil.'
      },
      {
        id: 'physio_18',
        name: 'Dra. Carla Mendes',
        specialty: 'Pediatria',
        experience: '7 anos',
        rating: 4.7,
        price: 138,
        available: true,
        bio: 'Fisioterapeuta pediátrica com foco em desenvolvimento neuromotor.'
      }
    ];

    return defaultPhysiotherapists;
  }

  getPhysiotherapistById(id: string): Physiotherapist | null {
    const physiotherapists = this.getPhysiotherapists();
    return physiotherapists.find(p => p.id === id) || null;
  }

  // Helper methods
  private getUsers(): User[] {
    try {
      const usersStr = localStorage.getItem(this.getStorageKey('users'));
      return usersStr ? JSON.parse(usersStr) : [];
    } catch {
      return [];
    }
  }

  // Inicializar com dados demo
  initializeDemoData(): void {
    const users = this.getUsers();
    
    // Adicionar usuários demo se não existirem
    if (!users.find(u => u.email === 'maria.silva@email.com')) {
      const demoPatient: User = {
        id: 'demo_patient',
        name: 'Maria Silva',
        email: 'maria.silva@email.com',
        phone: '(11) 99999-9999',
        address: 'Rua das Flores, 123 - Vila Madalena, São Paulo',
        password: 'demo123',
        userType: 'patient',
        createdAt: new Date().toISOString()
      };
      
      users.push(demoPatient);
      localStorage.setItem(this.getStorageKey('users'), JSON.stringify(users));
    }

    if (!users.find(u => u.email === 'ana.beatriz@fisiovem.com')) {
      const demoPhysio: User = {
        id: 'demo_physio',
        name: 'Ana Beatriz Costa',
        email: 'ana.beatriz@fisiovem.com',
        phone: '(11) 88888-8888',
        address: 'Av. Paulista, 1000 - Bela Vista, São Paulo',
        password: 'demo123',
        userType: 'physiotherapist',
        createdAt: new Date().toISOString()
      };
      
      users.push(demoPhysio);
      localStorage.setItem(this.getStorageKey('users'), JSON.stringify(users));
    }
  }

  // Criar consultas demo para qualquer usuário
  createDemoConsultationsForUser(userId: string): void {
    const existingConsultations = this.getConsultations();
    const userConsultations = existingConsultations.filter(c => c.patientId === userId);
    
    // Só criar se o usuário não tiver consultas
    if (userConsultations.length === 0) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dayAfterTomorrow = new Date();
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
      
      const demoConsultations: Consultation[] = [
        {
          id: `demo_consultation_1_${userId}`,
          patientId: userId,
          physiotherapistId: 'demo_physio',
          physiotherapistName: 'Ana Beatriz Costa',
          date: dayAfterTomorrow.toISOString().split('T')[0], // 2 dias no futuro
          time: '14:00',
          type: 'presencial',
          specialty: 'Ortopedia',
          status: 'agendada',
          address: 'Rua das Flores, 123 - Vila Madalena, São Paulo',
          price: 120.00,
          notes: 'Consulta de teste para 2 dias no futuro',
          createdAt: new Date().toISOString()
        },
        {
          id: `demo_consultation_2_${userId}`,
          patientId: userId,
          physiotherapistId: 'demo_physio',
          physiotherapistName: 'Ana Beatriz Costa',
          date: tomorrow.toISOString().split('T')[0], // Amanhã
          time: '16:00',
          type: 'online',
          specialty: 'Neurologia',
          status: 'agendada',
          price: 100.00,
          notes: 'Consulta de teste para amanhã (não deve permitir cancelar)',
          createdAt: new Date().toISOString()
        }
      ];
      
      const allConsultations = [...existingConsultations, ...demoConsultations];
      localStorage.setItem(this.getStorageKey('consultations'), JSON.stringify(allConsultations));
    }
  }
}

export const apiService = new ApiService();

// Initialize demo data on first load
apiService.initializeDemoData();
