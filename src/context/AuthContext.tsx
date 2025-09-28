import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserType } from '@/types';
import { mockPatients, mockPhysiotherapists } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  userType: UserType | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, userType: UserType) => Promise<boolean>;
  register: (userData: Partial<User>, userType: UserType) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  console.log("AuthProvider inicializado");
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('fisiovem_user');
    const savedUserType = localStorage.getItem('fisiovem_userType') as UserType;
    
    if (savedUser && savedUserType) {
      setUser(JSON.parse(savedUser));
      setUserType(savedUserType);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string, loginUserType: UserType): Promise<boolean> => {
    // Mock authentication - in real app, this would be an API call
    const users = loginUserType === 'patient' ? mockPatients : mockPhysiotherapists;
    const foundUser = users.find(u => u.email === email);
    
    if (foundUser) {
      setUser(foundUser);
      setUserType(loginUserType);
      setIsAuthenticated(true);
      
      // Save to localStorage
      localStorage.setItem('fisiovem_user', JSON.stringify(foundUser));
      localStorage.setItem('fisiovem_userType', loginUserType);
      
      return true;
    }
    
    return false;
  };

  const register = async (userData: Partial<User>, registerUserType: UserType): Promise<boolean> => {
    // Mock registration - in real app, this would be an API call
    const newUser: User = {
      id: `${registerUserType}_${Date.now()}`,
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone || '',
      address: userData.address || '',
      userType: registerUserType,
      profileImage: userData.profileImage,
      createdAt: new Date(),
      ...userData
    };

    setUser(newUser);
    setUserType(registerUserType);
    setIsAuthenticated(true);
    
    // Save to localStorage
    localStorage.setItem('fisiovem_user', JSON.stringify(newUser));
    localStorage.setItem('fisiovem_userType', registerUserType);
    
    return true;
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
    setIsAuthenticated(false);
    
    // Clear localStorage
    localStorage.removeItem('fisiovem_user');
    localStorage.removeItem('fisiovem_userType');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('fisiovem_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      userType,
      isAuthenticated,
      login,
      register,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};