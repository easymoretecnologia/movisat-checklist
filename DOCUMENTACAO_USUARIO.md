# Documentação do Usuário - Sistema de Gestão de Frotas Next Movisat

## Visão Geral
O Next Movisat é um sistema abrangente de gestão de frotas projetado para simplificar inspeções veiculares, rastreamento de manutenção e supervisão de frotas. O sistema atende empresas que gerenciam frotas de veículos e precisam garantir conformidade com padrões de segurança e manutenção.

## Acesso ao Sistema e Autenticação

### Processo de Login
1. Navegue até a página de login do sistema
2. Digite seu endereço de email cadastrado
3. Digite sua senha
4. Clique em "Entrar" para acessar o sistema

### Tipos de Conta e Segurança de Senhas
- Todas as senhas são criptografadas de forma segura usando hash padrão da indústria
- As sessões são válidas por 3 dias antes de exigir nova autenticação
- Entre em contato com seu administrador do sistema se esquecer sua senha

## Funções de Usuário e Permissões

O sistema opera com três funções distintas de usuário, cada uma com permissões específicas e níveis de acesso:

### 1. Administrador (Super Usuário)
**Nível de Acesso**: Controle Completo do Sistema

**Permissões:**
- **Gerenciamento de Usuários**: Criar, editar, excluir e gerenciar todas as contas de usuário
- **Gerenciamento de Empresas**: Adicionar, modificar e remover registros de empresas
- **Gerenciamento de Veículos**: Supervisão completa da frota de veículos e configuração
- **Relatórios do Sistema**: Acesso a todos os recursos de relatórios e análises
- **Supervisão de Checklists**: Visualizar e gerenciar todos os checklists de inspeção entre empresas
- **Gerenciamento de Dados**: Realizar operações de limpeza e manutenção de dados
- **Configuração do Sistema**: Modificar configurações e definições do sistema

**Casos de Uso Típicos:**
- Configuração e setup do sistema
- Gerenciamento multi-empresarial
- Administração de contas de usuário
- Relatórios e análises de todo o sistema
- Manutenção e limpeza de dados

### 2. Supervisor (Gerente da Empresa)
**Nível de Acesso**: Gerenciamento com Escopo da Empresa

**Permissões:**
- **Gerenciamento de Lembretes**: Criar, editar e gerenciar lembretes de manutenção
- **Gerenciamento de Notificações**: Manipular notificações e alertas do sistema
- **Rastreamento de Incidentes**: Monitorar e gerenciar relatórios de incidentes
- **Relatórios de Não Conformidade**: Rastrear e abordar questões de conformidade
- **Acesso a Dados da Empresa**: Visualizar dados apenas dentro de sua empresa designada
- **Supervisão de Motoristas**: Monitorar motoristas e veículos dentro de sua empresa

**Casos de Uso Típicos:**
- Supervisão de frota dentro de uma empresa
- Agendamento e lembretes de manutenção
- Gerenciamento de incidentes e conformidade
- Monitoramento de performance de motoristas
- Relatórios específicos da empresa

### 3. Motorista (Operador de Veículo)
**Nível de Acesso**: Gerenciamento Pessoal de Veículos

**Permissões:**
- **Acesso a Veículos**: Visualizar e interagir apenas com veículos designados
- **Execução de Checklists**: Realizar inspeções diárias, semanais e mensais
- **Gerenciamento de Perfil**: Atualizar informações pessoais e configurações
- **Histórico de Inspeções**: Visualizar histórico pessoal de inspeções

**Casos de Uso Típicos:**
- Inspeções diárias de veículos
- Conclusão de checklists de manutenção
- Relatórios de incidentes
- Gerenciamento de perfil pessoal

## Funcionalidades Principais

### Sistema de Inspeção Veicular

#### Checklists Diários
**Propósito**: Verificações essenciais de segurança realizadas antes da operação do veículo

**Itens de Inspeção:**
- **Faróis**: Verificar funcionamento e alinhamento
- **Lataria**: Inspecionar danos, amassados ou arranhões
- **Vidros**: Verificar visibilidade e rachaduras
- **Hodômetro**: Registrar quilometragem atual
- **Nível de Combustível**: Verificar medidor e nível de combustível
- **Água/Líquido de Arrefecimento**: Verificar níveis de líquido de arrefecimento
- **Luzes**: Testar todos os sistemas de iluminação do veículo

**Processo:**
1. Selecione seu veículo designado
2. Tire uma selfie do motorista para verificação
3. Inspecione cada item e marque como "OK" ou "Não Conforme"
4. Adicione observações para quaisquer problemas encontrados
5. Anexe fotos se necessário
6. Envie o checklist para completar a inspeção

#### Checklists Semanais
**Propósito**: Inspeções focadas em manutenção para saúde contínua do veículo

**Itens de Inspeção:**
- **Óleo do Motor**: Verificar nível e condição do óleo
- **Água do Limpador de Para-brisa**: Verificar níveis de fluido
- **Óleo de Freio**: Verificar fluido do sistema de freio
- **Pneus**: Inspecionar condição, pressão e banda de rodagem dos pneus
- **Sistema de Escapamento**: Verificar danos ou vazamentos
- **Vidros**: Inspeção detalhada dos vidros
- **Sistemas de Iluminação**: Verificação abrangente do sistema de luzes

#### Checklists Mensais
**Propósito**: Inspeção abrangente do interior e detalhada do veículo

**Itens de Inspeção:**
- **Estofados**: Inspecionar condição e limpeza dos assentos
- **Documentação**: Verificar todos os documentos obrigatórios do veículo
- **Volante**: Verificar funcionalidade e condição da direção
- **Câmbio**: Testar mudanças de marcha e operação da transmissão
- **Higiene Interna**: Avaliar limpeza geral
- **Porta-malas**: Inspecionar condição da área de carga
- **Bateria**: Verificar condição e conexões da bateria
- **Faróis**: Inspeção detalhada dos faróis

### Fluxo de Trabalho da Inspeção

#### Para Motoristas:
1. **Seleção de Veículo**: Escolha seu veículo designado no painel
2. **Tipo de Checklist**: O sistema determina automaticamente o tipo de checklist devido
3. **Auto-verificação**: Tire uma selfie para verificar identidade
4. **Inspeção de Itens**: Percorra cada item de inspeção sistematicamente
5. **Documentação**: 
   - Marque cada item como "OK" ou "Não Conforme"
   - Adicione observações detalhadas para quaisquer problemas
   - Anexe fotos para documentação visual
6. **Confirmação**: Confirme conhecimento de quaisquer questões de não conformidade
7. **Envio**: Complete e envie o checklist

#### Para Supervisores:
1. **Visão Geral do Painel**: Visualize todas as inspeções pendentes e concluídas
2. **Monitoramento de Incidentes**: Rastreie veículos com problemas relatados
3. **Rastreamento de Conformidade**: Monitore padrões de não conformidade
4. **Gerenciamento de Lembretes**: Configure lembretes de manutenção
5. **Relatórios**: Gere relatórios de conformidade e incidentes

### Sistema de Lembretes

#### Criando Lembretes (Supervisores)
- **Título**: Descrição breve do lembrete
- **Descrição**: Informações detalhadas sobre a tarefa
- **Data e Hora**: Quando o lembrete deve ser acionado
- **Atribuição**: Atribuir a motoristas específicos ou todos os motoristas

#### Tipos de Lembretes:
- Cronogramas de manutenção
- Renovações de documentação
- Lembretes de treinamento de segurança
- Datas de vencimento de inspeções
- Lembretes operacionais personalizados

### Sistema de Notificações

#### Notificações Automáticas:
- Inspeções em atraso
- Alertas de não conformidade
- Atualizações do sistema
- Lembretes de manutenção

#### Gerenciamento de Notificações:
- Marcar notificações como lidas
- Níveis de prioridade para diferentes tipos de alerta
- Notificações para toda a empresa ou individuais

### Rastreamento de Incidentes e Conformidade

#### Relatórios de Incidentes (Ocorrências):
- Gerados automaticamente a partir de itens de checklist reprovados
- Rastrear status de resolução
- Documentação fotográfica
- Comentários de motoristas e supervisores

#### Relatórios de Não Conformidade (Inconformidades):
- Rastreamento sistemático de violações de segurança
- Análise de tendências de conformidade
- Rastreamento de ações corretivas
- Suporte a relatórios regulatórios

## Recursos do Painel

### Painel do Motorista:
- **Veículos Designados**: Acesso rápido aos seus veículos
- **Inspeções Pendentes**: Requisitos de checklist pendentes
- **Atividade Recente**: Seu histórico recente de inspeções
- **Notificações**: Alertas e lembretes pessoais

### Painel do Supervisor:
- **Visão Geral da Frota**: Status de todos os veículos da empresa
- **Lembretes Diários**: Tarefas agendadas e alertas de hoje
- **Notificações Recentes**: Notificações de toda a empresa e do sistema
- **Métricas de Conformidade**: Indicadores-chave de performance
- **Resumo de Incidentes**: Incidentes abertos atuais

### Painel do Administrador:
- **Estatísticas do Sistema**: Uso geral do sistema e saúde
- **Visão Geral Multi-empresa**: Métricas de performance entre empresas
- **Atividade do Usuário**: Engajamento do usuário em todo o sistema
- **Saúde do Sistema**: Status técnico do sistema

## Exportação de Dados e Relatórios

### Exportações Disponíveis:
- **Dados de Checklist**: Registros completos de inspeção em formato CSV
- **Relatórios de Conformidade**: Rastreamento e tendências de não conformidade
- **Relatórios de Incidentes**: Documentação detalhada de incidentes
- **Atividade do Usuário**: Relatórios de uso e performance do sistema

### Filtragem de Relatórios:
- Intervalos de datas
- Tipos de veículos
- Limites da empresa
- Funções de usuário
- Tipos de inspeção
- Status de conformidade

## Gerenciamento de Arquivos

### Upload de Imagens:
- **Formatos Suportados**: JPG, PNG, GIF
- **Limites de Tamanho**: Otimizado para uploads de dispositivos móveis
- **Armazenamento**: Armazenamento seguro em nuvem com backup
- **Acesso**: Acesso baseado em função a imagens carregadas

### Gerenciamento de Documentos:
- Armazenamento de documentação de veículos
- Arquivos de fotos de inspeção
- Rastreamento de documentos de conformidade
- Capacidades de exportação para registros

## Acessibilidade Móvel

### Design Responsivo:
- Otimizado para smartphones e tablets
- Interface amigável ao toque
- Integração com câmera móvel
- Capacidade offline para inspeções

### Recursos Móveis:
- **Integração com Câmera**: Captura direta de fotos para inspeções
- **Integração GPS**: Rastreamento de localização para inspeções
- **Modo Offline**: Complete inspeções sem conexão à internet
- **Capacidade de Sincronização**: Sincronização automática de dados quando online

## Recursos de Segurança

### Proteção de Dados:
- **Criptografia**: Todos os dados criptografados em trânsito e em repouso
- **Controle de Acesso**: Permissões baseadas em função e limites da empresa
- **Trilha de Auditoria**: Rastreamento completo de ações do usuário
- **Sistemas de Backup**: Backups automatizados regulares

### Segurança do Usuário:
- **Requisitos de Senha**: Aplicação de senhas fortes
- **Gerenciamento de Sessão**: Timeout automático para segurança
- **Suporte Multi-dispositivo**: Acesso seguro de múltiplos dispositivos
- **Bloqueio de Conta**: Proteção contra tentativas de acesso não autorizado

## Melhores Práticas

### Para Motoristas:
1. **Rotina Diária**: Realize inspeções antes da operação do veículo
2. **Documentação Completa**: Tire fotos claras e notas detalhadas
3. **Relatórios Honestos**: Relate todos os problemas, por menores que sejam
4. **Atualizações Regulares**: Mantenha informações pessoais atualizadas
5. **Segurança em Primeiro Lugar**: Nunca opere um veículo inseguro

### Para Supervisores:
1. **Monitoramento Regular**: Verifique painéis diariamente para alertas
2. **Lembretes Proativos**: Configure cronogramas de manutenção com antecedência
3. **Resposta Rápida**: Aborde questões de não conformidade prontamente
4. **Documentação**: Mantenha registros detalhados de ações corretivas
5. **Comunicação**: Mantenha motoristas informados sobre mudanças de política

### Para Administradores:
1. **Treinamento de Usuários**: Garanta que todos os usuários entendam suas funções
2. **Backups Regulares**: Mantenha backups do sistema e dados
3. **Atualizações de Segurança**: Mantenha a segurança do sistema atualizada
4. **Monitoramento de Performance**: Rastreie métricas de performance do sistema
5. **Documentação**: Mantenha documentação atual do sistema

## Solução de Problemas

### Problemas Comuns:

#### Problemas de Login:
- Verifique a ortografia do endereço de email
- Verifique maiúsculas e minúsculas da senha
- Limpe cache e cookies do navegador
- Entre em contato com o administrador para reset de senha

#### Problemas de Upload de Fotos:
- Verifique conexão com a internet
- Verifique tamanho do arquivo de imagem (deve ser razoável)
- Tente formato de imagem diferente
- Atualize a página e tente novamente

#### Falhas de Envio de Checklist:
- Garanta que todos os campos obrigatórios estejam preenchidos
- Verifique conectividade com a internet
- Salve rascunho e tente novamente mais tarde
- Entre em contato com supervisor se problemas persistirem

#### Problemas de Performance:
- Feche abas desnecessárias do navegador
- Limpe cache do navegador
- Verifique velocidade da internet
- Tente navegador diferente

### Contato de Suporte:
- Entre em contato com seu administrador do sistema para problemas técnicos
- Supervisores podem ajudar com questões operacionais
- Consulte esta documentação para procedimentos padrão
- Relate bugs ou melhorias do sistema ao suporte técnico

## Treinamento e Integração

### Configuração de Novo Usuário:
1. Criação de conta pelo administrador
2. Atribuição de função e configuração de permissões
3. Login inicial e mudança de senha
4. Familiarização com o painel
5. Walkthrough da primeira inspeção

### Treinamento Contínuo:
- Atualizações regulares do sistema e anúncios de recursos
- Sessões de compartilhamento de melhores práticas
- Atualizações de treinamento de conformidade
- Revisões de procedimentos de segurança

## Atualizações do Sistema

### Atualizações de Versão:
- Atualizações automáticas do sistema com tempo de inatividade mínimo
- Anúncios de recursos via notificações
- Materiais de treinamento atualizados com novos recursos
- Compatibilidade retroativa mantida

### Comunicação do Usuário:
- Notificações de manutenção do sistema
- Anúncios de novos recursos
- Mudanças de política e atualizações
- Notificações de atualizações de segurança