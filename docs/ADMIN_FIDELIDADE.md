# Administração e fidelidade — Coffee House V2

## Estado de segurança
O catálogo foi projetado para ser lido publicamente pelo aplicativo, mas **somente contas
explicitamente cadastradas em `public.coffee_staff`** podem criar ou alterar produtos.
O arquivo `admin.html` não contém senhas nem privilégios embutidos. A autorização é verificada
**no banco por RLS**, não por uma senha no JavaScript.

O login usa Supabase Auth com email e senha. O token fica somente na memória da aba
(ao atualizar a página, faça login novamente). Não use uma conta anônima de curtidas como administrador.

## Configuração inicial (administrador)
1. Execute a migração `supabase/migrations/002_catalog_staff.sql` **uma vez**
   no projeto Supabase `coffee-shop`.
2. Em **Authentication → Users**, crie ou convide a conta administrativa com
   um email que você controla. Configure senha/convite **somente no painel do Supabase**.
3. Identifique o UUID criado para essa conta em Authentication → Users.
4. Em SQL Editor, com privilégios administrativos, execute:

```sql
insert into public.coffee_staff (user_id, role)
values ('UUID_DA_CONTA_ADMINISTRATIVA'::uuid, 'admin')
on conflict (user_id) do nothing;
```

5. Abra `https://iamdanieldantas.github.io/coffee-shop/admin.html`, entre e confirme o acesso.
6. Para revogar: `delete from public.coffee_staff where user_id='UUID...'::uuid;`

Apenas seu administrador pode autorizar novas contas. Nenhum visitante pode fazê-lo.
Não forneça senhas/tokens ou dados pessoais no chat ou no repositório.

## Funcionalidades do painel
- Ver catálogo e total de curtidas por produto
- Editar nomes, descrições (PT, EN, ES), preços, categorias, disponibilidade
- Selecionar uma das **sete fotos locais já disponíveis**
- Cadastrar novos produtos com IDs únicos; IDs não podem ser alterados após cadastro
- Ocultar itens no cardápio sem apagar históricos de curtidas

O backend mantém uma tabela `coffee_catalog` com RLS e limites nos campos.
O frontend faz leitura pública apenas de produtos ativos e usa o catálogo estático como
fallback quando estiver offline. Imagens continuam sendo arquivos locais versionados no
GitHub; adicionar uma **nova fotografia** requer publicação de um arquivo WebP na pasta
`assets/photos/` e permitir seu `image_key` em SQL.

## Dados e privacidade
- Contagens públicas são agregadas; IDs de usuários que curtiram não são expostos
- A tabela de equipe não permite leitura/gravação pública
- Não há checkout real, pagamento, coleta de endereço ou histórico de pedidos
- O catálogo demonstrativo tem valores ilustrativos

## Cartão de fidelidade
A Home mostra um cartão **de demonstração**, com dez selos simulados e controles
para experimentar e reiniciar. Os números são locais e não refletem compras reais.
Nenhum benefício ou resgate é prometido.

Fidelidade **real** exige validação de compras concluídas por um backend confiável,
regras de campanha, política de privacidade, anti-fraude e aprovação comercial antes
da ativação. Não atribua pontos com base em cliques no checkout demonstrativo.

## Regressão e publicação
```bash
python -m harness.runner --mode review --browser
python scripts/verify_catalog_api.py
```
A API pública de curtidas continua ativa; os nove produtos originais permanecem no
catálogo após a migração. Se você cadastrar novos produtos, não use um teste com lista
de IDs rigidamente fechada.
