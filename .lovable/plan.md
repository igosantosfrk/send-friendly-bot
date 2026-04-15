

## Sistema de Disparo WhatsApp - Interface Frontend

Vou criar uma interface completa e funcional com dados simulados, pronta para ser conectada a um backend real posteriormente.

### Estrutura da Interface

**1. Painel de Conexão WhatsApp**
- QR Code simulado com estados: Desconectado → Escaneando → Conectado
- Indicador de status com cores (verde/amarelo/vermelho)
- Botão para gerar novo QR Code e desconectar

**2. Upload de Contatos CSV**
- Área de drag & drop para upload de CSV
- Parser que lê colunas `nome` e `telefone`
- Validação de números (formato com DDI/DDD)
- Tabela mostrando contatos válidos vs inválidos
- Contador resumo

**3. Editor de Mensagem**
- Campo de texto com suporte a variáveis (`{nome}`)
- Preview da mensagem com variável substituída
- Suporte a quebras de linha

**4. Upload de Mídia**
- Upload de imagens, PDFs, vídeos
- Preview de imagem antes do envio
- Indicador do tipo de arquivo

**5. Controle de Disparo**
- Slider para configurar delay entre envios (3-10s)
- Botão "Iniciar Disparo" / "Pausar" / "Retomar"
- Barra de progresso com contadores (enviados/restantes/falhas)
- Simulação de envio com delays reais

**6. Logs em Tempo Real**
- Lista de envios com status (Enviado ✅ / Falhou ❌)
- Timestamps
- Filtro por status
- Botão para exportar logs

### Design
- Layout em seções verticais com cards
- Tema limpo e funcional
- Cores de status claras
- Responsivo

