// Simple API service using localStorage to simulate backend

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

  // User Authentication
  async register(userData: Omit<User, 'id' | 'createdAt'>): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const users = this.getUsers();
      
      // Check if email already exists
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
      
      // Auto login after registration
      localStorage.setItem(this.getStorageKey('current_user'), JSON.stringify(newUser));

      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: 'Erro ao criar conta' };
    }
  }

  async login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const users = this.getUsers();
      const user = users.find(u => u.email === email && u.password === password);

      if (!user) {
        return { success: false, error: 'E-mail ou senha incorretos' };
      }

      localStorage.setItem(this.getStorageKey('current_user'), JSON.stringify(user));
      return { success: true, user };
    } catch (error) {
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
      const consultations = this.getConsultations();
      const consultationIndex = consultations.findIndex(c => c.id === consultationId);
      
      if (consultationIndex === -1) {
        return { success: false, error: 'Consulta não encontrada' };
      }

      consultations[consultationIndex].status = status;
      localStorage.setItem(this.getStorageKey('consultations'), JSON.stringify(consultations));

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Erro ao atualizar consulta' };
    }
  }

  async cancelConsultation(consultationId: string): Promise<{ success: boolean; error?: string }> {
    return this.updateConsultationStatus(consultationId, 'cancelada');
  }

  // Physiotherapists
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

  // Initialize with demo data
  initializeDemoData(): void {
    const users = this.getUsers();
    
    // Add demo users if they don't exist
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
}

export const apiService = new ApiService();

// Initialize demo data on first load
apiService.initializeDemoData();
