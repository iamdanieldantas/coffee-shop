# Curtidas compartilhadas — Coffee House

O GitHub Pages é estático. Para mostrar o número **real** de curtidas entre visitantes, esta implementação usa **Supabase (PostgreSQL + Auth anônima)**.

## O que a interface faz
- Um coração e contagem ao lado de cada produto (Menu e Destaques da Home).
- Um clique curte; o próximo remove a curtida.
- Cada identidade anônima do navegador pode curtir um mesmo produto uma vez.
- A Home mostra os 4 produtos mais curtidos quando existem votos; caso contrário conserva Destaques da casa.
- O Menu tem ordenação "Mais curtidos" por categoria.
- Sem backend, o coração fica desabilitado e aparece "—", nunca um número inventado.

## Ativação (necessária antes da publicação das curtidas)

1. Crie um projeto em [Supabase](https://supabase.com/dashboard) (pode começar no plano Free).
2. Em **Authentication → Providers**, habilite **Anonymous Sign-Ins**. Não há cadastro com email nem senha.
3. Em **SQL Editor**, execute **todo** o arquivo `supabase/migrations/001_product_likes.sql`.
4. Em **Project Settings → API Keys**, copie somente a chave **Publishable** (`sb_publishable_...`), e o **Project URL** (`https://<project>.supabase.co`).
5. Preencha `assets/likes-config.js` no repositório:

```javascript
window.COFFEE_LIKES_CONFIG = {
  supabaseUrl: 'https://SEU-PROJETO.supabase.co',
  publishableKey: 'sb_publishable_SUA_CHAVE_PUBLICA'
};
```

6. Execute `python -m harness.runner --mode review --browser`, faça PR e publique pelo GitHub Actions.
7. Confira com dois navegadores/perfis: curtir em um, atualizar no outro e verificar a mesma contagem.

**Nunca** coloque `service_role`, `sb_secret_...`, token pessoal ou senha em arquivos públicos ou no GitHub Pages.

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
