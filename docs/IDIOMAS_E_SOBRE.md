# Experiência multilíngue do Coffee House

A interface tem três idiomas:

- **Português brasileiro (pt-BR)** — padrão no primeiro acesso
- **English (en-US)** — inglês americano
- **Español (es-AR)** — espanhol com expressões argentinas

O seletor de idioma fica no canto superior direito, nas três telas. O site guarda
a escolha em `localStorage`, sem criar conta ou enviar o idioma ao servidor.

## Conteúdo traduzido

- Home: título, diferenciais, destaques e a nova seção **Sobre nós**
- Menu: categorias, nomes e descrições dos nove produtos, curtidas e ordenação
- Pedidos: itens da sacola, botões **− quantidade +**, subtotal, cupom,
  confirmação e mensagens de retorno
- Rodapé: chamada, contatos, disponibilidade e textos auxiliares
- Acessibilidade: rótulos de botões, imagens, regiões e navegação
- Moeda: reais brasileiros (BRL) formatados para cada idioma

A alteração de idioma não recria a sacola nem troca os IDs dos produtos; o
pedido e o total permanecem iguais. As curtidas continuam compartilhadas no
Supabase, independentemente do idioma.

## Manutenção

O arquivo `assets/i18n.js` é o catálogo principal. As chaves de `strings`,
`categories` e `products` devem existir em **pt/en/es**. Os textos estáticos
usam atributos `data-i18n`, `data-i18n-html`, `data-i18n-alt` e
`data-i18n-aria-label`; os textos dinâmicos usam `CoffeeI18n.t`.

Ao adicionar um produto, defina primeiro seu ID em `assets/app.js`, depois
adicione tradução do nome e descrição nos três catálogos.

## Identidade e conteúdo da seção Sobre nós

O texto é a **narrativa conceitual da marca** para este protótipo. Ele não
afirma a existência de uma loja física, viagens específicas da equipe, ou
operações comerciais reais.

## Testes

```bash
python -m harness.runner --mode review --browser
```

A suíte verifica chaves completas, mudança de idioma entre as três telas,
persistência após recarregar a página, sincronização da sacola, cupom,
rodapé e estilo único dos controles de quantidade em telas móveis e desktop.
