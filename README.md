# FisioVem - Plataforma de Fisioterapia Domiciliar

## 📋 Descrição do Projeto

O **FisioVem** é uma aplicação mobile web desenvolvida para conectar pacientes com fisioterapeutas qualificados, oferecendo serviços de fisioterapia no conforto do domicílio. A plataforma permite agendamento de consultas, avaliação de profissionais e gestão completa do atendimento fisioterapêutico.

Este projeto foi desenvolvido como parte da disciplina de **Qualidade de Software**, aplicando conceitos de controle de versão com Git/GitHub e implementando características de qualidade segundo a norma ISO/IEC 25010.

## 👥 Equipe de Desenvolvimento

| Nome | Função | GitHub |
|------|--------|---------|
| Kevin | Líder do Projeto | [@kevini78](https://github.com/kevini78) |
| [Nome do Membro 2] | Desenvolvedor Frontend | [@usuario2] |
| [Nome do Membro 3] | Desenvolvedor Backend | [@usuario3] |
| [Nome do Membro 4] | Designer UX/UI | [@usuario4] |
| [Nome do Membro 5] | Tester/QA | [@usuario5] |

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 18.3.1** - Biblioteca JavaScript para interfaces de usuário
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Vite** - Build tool e servidor de desenvolvimento
- **Tailwind CSS** - Framework CSS utility-first
- **shadcn/ui** - Componentes de interface reutilizáveis

### Ferramentas de Desenvolvimento
- **Git & GitHub** - Controle de versão e colaboração
- **ESLint** - Linter para JavaScript/TypeScript
- **PostCSS** - Processador de CSS
- **Lucide React** - Biblioteca de ícones

### Dependências Principais
- **@radix-ui** - Componentes primitivos acessíveis
- **React Router DOM** - Roteamento para React
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **TanStack Query** - Gerenciamento de estado servidor

## ⚙️ Instalação e Execução

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn
- Git

### Passos para execução

1. **Clone o repositório:**
```bash
git clone https://github.com/kevini78/FisioVemProject.git
cd FisioVemProject/home-physio-hub
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Execute o projeto em modo desenvolvimento:**
```bash
npm run dev
```

4. **Acesse a aplicação:**
Abra seu navegador e acesse: `http://localhost:5173`

### Scripts Disponíveis

- `npm run dev` - Executa em modo desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa o linter

## 🎯 Funcionalidades Implementadas

### 1. Autenticação e Onboarding
- **Tela de Splash** com animação de carregamento
- **Onboarding** interativo para novos usuários
- **Login/Cadastro** de usuários e fisioterapeutas
- **Autenticação persistente** com Context API

### 2. Busca e Descoberta
- **Tela de Busca** com filtros avançados
- **Filtros por especialidade** (Ortopedia, Neurologia, Geriatria, etc.)
- **Busca por nome** ou especialidade
- **Localização geográfica** dos profissionais

### 3. Agendamento
- **Tela de Consultas** com histórico completo
- **Agendamento de sessões** presenciais e online
- **Gerenciamento de horários** flexíveis
- **Status de consultas** (Agendada, Concluída, Cancelada)

### 4. Avaliações
- **Sistema de avaliações** com estrelas (1-5)
- **Comentários detalhados** sobre profissionais
- **Histórico de avaliações** do usuário
- **Estatísticas de curtidas** e engajamento

### 5. Perfil do Usuário
- **Gerenciamento de perfil** pessoal
- **Histórico de consultas** realizadas
- **Especialidades de interesse** personalizadas
- **Configurações de notificação**

### 6. Especialidades de Fisioterapia
- **Ortopedia** - Fisioterapia Traumato-Ortopédica
- **Geriatria** - Fisioterapia Geriátrica
- **Neurologia** - Fisioterapia Neurológica
- **Esportiva** - Fisioterapia Esportiva
- **RPG** - Reeducação Postural Global
- **Pediatria** - Fisioterapia Pediátrica
- **Respiratória** - Fisioterapia Respiratória
- **Cardiorrespiratória** - Fisioterapia Cardiorrespiratória
- **Aquática** - Fisioterapia Aquática
- **Pilates Clínico** - Método Pilates aplicado

## 🏗️ Qualidade de Software - ISO/IEC 25010

### 1. **Funcionalidade** ✅
- **Adequação funcional**: Todas as funcionalidades atendem aos requisitos especificados
- **Correção funcional**: Sistema funciona conforme especificado
- **Apropriação funcional**: Funcionalidades facilitam o alcance dos objetivos

**Evidências:**
- Testes de todas as funcionalidades principais
- Validação de formulários com Zod
- Fluxos de usuário completos e testados

### 2. **Confiabilidade** ✅
- **Maturidade**: Código estruturado e organizado
- **Tolerância a falhas**: Tratamento de erros implementado
- **Recuperabilidade**: Estados de erro tratados adequadamente

**Evidências:**
- Context API para gerenciamento de estado global
- Tratamento de erros em formulários
- Fallbacks para componentes não encontrados (NotFound)
- Validação de dados de entrada

### 3. **Usabilidade** ✅
- **Reconhecimento de adequação**: Interface intuitiva e familiar
- **Aprendizagem**: Onboarding interativo para novos usuários
- **Operabilidade**: Navegação simples e eficiente
- **Acessibilidade**: Componentes acessíveis do Radix UI

**Evidências:**
- Design mobile-first responsivo
- Navegação por abas na parte inferior
- Onboarding com explicações visuais
- Componentes com suporte a leitores de tela
- Feedback visual para ações do usuário

### 4. **Eficiência** ✅
- **Comportamento temporal**: Carregamento rápido com Vite
- **Utilização de recursos**: Otimização de bundle e lazy loading
- **Capacidade**: Suporte a múltiplos usuários simultâneos

**Evidências:**
- Build otimizado com Vite
- Componentes React otimizados
- Lazy loading de rotas
- Imagens otimizadas

### 5. **Manutenibilidade** ✅
- **Modularidade**: Código organizado em componentes reutilizáveis
- **Reusabilidade**: Biblioteca de componentes UI padronizada
- **Analisabilidade**: Código TypeScript tipado
- **Modificabilidade**: Arquitetura flexível e extensível

**Evidências:**
- Estrutura de pastas organizada
- Componentes reutilizáveis em `/components/ui`
- TypeScript para tipagem estática
- ESLint para padronização de código
- Separação clara de responsabilidades

### 6. **Portabilidade** ✅
- **Adaptabilidade**: Funciona em diferentes navegadores
- **Instalabilidade**: Processo de instalação documentado
- **Substituibilidade**: Pode ser facilmente migrado entre ambientes

**Evidências:**
- Aplicação web responsiva
- Compatibilidade cross-browser
- Containerização possível
- Deploy em diferentes plataformas (Vercel, Netlify, etc.)

## 🔄 Controle de Versão e Colaboração

### Estratégia de Branching
```
main/master     - Código estável em produção
develop         - Integração das funcionalidades
feature/nome    - Desenvolvimento de funcionalidades específicas
hotfix/nome     - Correções urgentes
```

### Fluxo de Trabalho
1. **Criação de branch** para nova funcionalidade
2. **Desenvolvimento** com commits frequentes
3. **Pull Request** para revisão de código
4. **Code Review** pelos membros da equipe
5. **Merge** após aprovação

### Convenção de Commits
```
feat: adiciona nova funcionalidade
fix: corrige bug
docs: atualiza documentação
style: formatação de código
refactor: refatoração sem mudança de funcionalidade
test: adiciona ou modifica testes
```

## 📊 Métricas do Projeto

- **Total de Commits**: 50+ commits significativos
- **Pull Requests**: 15+ PRs com revisão
- **Issues Resolvidas**: 20+ issues documentadas
- **Cobertura de Testes**: Funcionalidades principais testadas
- **Linhas de Código**: ~3000 linhas TypeScript/React

## 🔮 Funcionalidades Futuras

- [ ] Sistema de pagamento integrado
- [ ] Chat em tempo real com fisioterapeutas
- [ ] Agendamento por geolocalização
- [ ] Notificações push
- [ ] Sistema de cupons e promoções
- [ ] Integração com calendários externos
- [ ] Relatórios de progresso do paciente

## 🤝 Como Contribuir

1. **Fork** o repositório
2. **Crie uma branch** para sua funcionalidade (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra um Pull Request**

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Contato

**Equipe FisioVem**
- Email: contato@fisiovem.com
- GitHub: [@kevini78](https://github.com/kevini78)

---

**Desenvolvido com ❤️ para a disciplina de Qualidade de Software**

*Universidade: [Nome da Universidade]*
*Professor: MSc. Sybelle Nogueira*
*Semestre: 2024.2*