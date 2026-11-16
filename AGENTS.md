# Orientações dos agentes — Coffee House

- Abrir branch e PR para qualquer mudança após o primeiro deploy bootstrap.
- Rodar `python -m harness.runner --mode review --browser` antes do PR.
- Não mudar identidade ou navegação aprovada sem teste de regressão.
- Imagens não devem depender de serviço externo.
- Não implementar pedidos reais, pagamento ou coleta de dados pessoais sem arquitetura e aprovação específicas.
- O publicador bloqueia o deploy se a suíte falhar.
