# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-12-15

### Adicionado
- Sistema completo de autenticação (login/cadastro)
- Tela de onboarding interativa com 3 etapas
- Busca e filtragem de fisioterapeutas por especialidade
- Agendamento de consultas presenciais e online
- Sistema de reagendamento com modal nativo mobile
- Sistema de cancelamento com confirmação
- Perfil de usuário com dados persistentes
- 18 fisioterapeutas distribuídos em 6 especialidades
- Componentes mobile-first otimizados
- Persistência de dados com localStorage
- Tratamento robusto de erros
- Animações CSS suaves
- Toast notifications nativas
- Validação de formulários
- Design responsivo mobile-first

### Características ISO/IEC 25010 Implementadas
- **Funcionalidade**: Sistema completo e funcional
- **Confiabilidade**: Tratamento de erros e validações
- **Usabilidade**: Interface intuitiva e mobile-friendly
- **Eficiência**: Performance otimizada
- **Manutenibilidade**: Código modular e documentado

### Tecnologias
- React 18.3.1 com TypeScript
- Vite para build e desenvolvimento
- Tailwind CSS para estilização
- shadcn/ui para componentes
- localStorage para persistência
- Git/GitHub para controle de versão

### Estrutura do Projeto
```
src/
├── components/          # Componentes reutilizáveis
│   ├── ConfirmDialog.tsx
│   ├── MobileToast.tsx
│   ├── RescheduleModal.tsx
│   └── Toast.tsx
├── pages/              # Telas da aplicação
│   ├── SplashScreen.tsx
│   ├── OnboardingScreen.tsx
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   ├── SimpleHomeScreen.tsx
│   ├── MobileSearchScreen.tsx
│   ├── SimpleConsultationsScreen.tsx
│   ├── BookingScreen.tsx
│   ├── BookingSuccessScreen.tsx
│   └── MobileProfileScreen.tsx
├── services/           # Lógica de negócio
│   └── api.ts
├── context/           # Contextos React
├── hooks/            # Hooks customizados
└── components/UI/    # Componentes de interface
```

### Commits Principais
- `feat: implementa sistema completo de reagendamento e cancelamento mobile`
- `fix: corrige fluxo completo de onboarding e agendamentos`
- `feat: implementa sistema completo de API e agendamento de consultas`
- `fix: restaura onboarding e corrige fluxo de consultas e agendamentos`
- `feat: adiciona tela de sucesso após agendamento`
- `refactor: simplifica componentes e melhora mobile compatibility`

### Branches
- `main`: Código estável para produção
- `develop`: Integração de funcionalidades
- `feature/*`: Desenvolvimento de funcionalidades específicas

---

## Convenções de Commit

Este projeto segue o padrão [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Mudanças na documentação
- `style:` - Mudanças que não afetam o significado do código
- `refactor:` - Mudança de código que não corrige bug nem adiciona funcionalidade
- `test:` - Adição de testes ou correção de testes existentes
- `chore:` - Mudanças no processo de build ou ferramentas auxiliares
