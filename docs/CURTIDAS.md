# Curtidas compartilhadas — Coffee House

O GitHub Pages é estático. Para mostrar o número **real** de curtidas entre visitantes, esta implementação usa **Supabase (PostgreSQL + Auth anônima)**.

## O que a interface faz
- Um coração e contagem ao lado de cada produto (Menu e Destaques da Home).
- Um clique curte; o próximo remove a curtida.
- Cada identidade anônima do navegador pode curtir um mesmo produto uma vez.
- A Home mostra os 4 produtos mais curtidos quando existem votos; caso contrário conserva Destaques da casa.
- O Menu tem ordenação "Mais curtidos" por categoria.
- Sem backend, o coração fica desabilitado e aparece "—", nunca um número inventado.

## Estado do projeto — 17/11/2026

- **Supabase:** projeto `coffee-shop` ativo na região `sa-east-1` (São Paulo), custo informado US$ 0/mês.
- **Banco:** migração `coffee_product_likes` aplicada, com RLS, RPCs e 9 produtos retornando totais reais.
- **Configuração pública:** URL do projeto e chave *publishable* configuradas na PR de ativação. Nenhuma chave secreta no repositório.
- **Pendente:** habilitar **Anonymous Sign-Ins** no painel e integrar/publicar a PR de configuração após os testes.

### Passo obrigatório no painel Supabase

1. Abra https://supabase.com/dashboard/project/jasnepwcihsuvelwcmvu/auth/providers
2. Em **Authentication → Sign In / Providers**, habilite **Allow anonymous sign-ins** (ou **Anonymous Sign-Ins**).
3. Salve. Assim a aplicação poderá criar uma sessão anônima no primeiro clique em curtir.
4. Após a ativação, valide a API via `python scripts/verify_likes_api.py` e a interface em dois navegadores.

**Não é necessário** criar outro projeto, executar SQL novamente nem inserir credenciais secretas.
Não use `service_role`, `sb_secret_...`, token pessoal ou senha em arquivos públicos.

## Segurança e privacidade

- Curtir exige **sessão anônima** criada apenas no primeiro clique; a autenticação guarda um identificador aleatório e tokens de sessão no `localStorage` do navegador. Nenhum campo de nome, telefone ou email é pedido.
- A tabela guarda `product_id`, `user_id` anônimo e data da curtida; acesso direto por clientes públicos é revogado, RLS é ativada e só funções controladas podem consultar totais e alterar a própria curtida.
- A RPC de leitura retorna somente agregados e se o próprio visitante curtiu; não retorna IDs de outros visitantes.
- A unicidade vale **por identidade anônima**; limpeza do navegador, novas sessões, troca de aparelhos ou abuso deliberado podem permitir novos votos. Para limite forte de **uma pessoa**, seria necessário login/verificação real, e política de privacidade adequada.
- Ao crescer, acrescente CAPTCHA e limites de criação de contas/votos. A plataforma pode exigir políticas de privacidade e consentimento conforme LGPD.
- Dados de votação são mantidos no Supabase (e não no GitHub). Excluir uma conta anônima faz suas curtidas sumirem pelo `on delete cascade`.
- Sem configuração Supabase, a nova UI não coleta credenciais e mantém os botões desabilitados.

## Consultas administrativas

```sql
select product_id, count(*) as total
from public.coffee_product_likes
group by product_id
order by total desc, product_id;
```
