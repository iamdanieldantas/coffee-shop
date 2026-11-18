/* Coffee House i18n — static and interactive content, local-first, no external provider. */
(function() {
 'use strict';
 const translations={
  "pt": {
    "strings": {
      "language.label": "Idioma",
      "language.aria": "Selecionar idioma",
      "hero.title": "Café, croissants<br>e boas pausas",
      "hero.description": "Bebidas artesanais, panificação fresca e um ambiente feito para você relaxar.",
      "hero.menu": "Ver o menu",
      "hero.coffee": "Cafés<br>especiais",
      "hero.bakery": "Panificação<br>artesanal",
      "hero.ingredients": "Ingredientes<br>selecionados",
      "hero.featured": "Destaques da casa",
      "hero.popular": "Mais curtidos da casa",
      "hero.note": "Cardápio e preços ilustrativos para este protótipo.",
      "about.eyebrow": "NOSSA HISTÓRIA",
      "about.heading": "Uma pausa com gosto de viagem.",
      "about.p1": "A Coffee House nasceu de uma ideia simples: transformar a pausa para um café naquele momento que dá vontade de guardar na memória.",
      "about.p2": "Inspirada na atmosfera das cafeterias e padarias que descobrimos pelo caminho, ela reúne cafés especiais, croissants e pequenos prazeres da vida. Um lugar imaginado para desacelerar, conversar e criar boas lembranças.",
      "menu.heading": "Menu",
      "menu.subtitle": "Escolha sua bebida ou favorito da casa.",
      "menu.note": "Fotos conceituais e preços demonstrativos.",
      "menu.sort": "Ordenar por",
      "menu.popular": "Mais curtidos",
      "orders.heading": "Pedidos",
      "orders.subtitle": "Revise seus itens antes da retirada.",
      "orders.emptyTitle": "Sua sacola está vazia",
      "orders.emptyDescription": "Escolha seus favoritos no Menu e prepare seu pedido para retirada.",
      "orders.explore": "Explorar o menu",
      "orders.subtotal": "Subtotal",
      "orders.total": "Total",
      "orders.choose": "Escolha um produto",
      "orders.couponApplied": "Cupom CAFE10 aplicado",
      "orders.coupon": "Cupom de desconto",
      "orders.couponPlaceholder": "Digite um cupom",
      "orders.apply": "Aplicar",
      "orders.couponError": "Use o cupom demonstrativo CAFE10.",
      "orders.discount": "Desconto (10%)",
      "orders.confirm": "Confirmar pedido (retirada)",
      "nav.home": "Home",
      "nav.menu": "Menu",
      "nav.orders": "Pedidos",
      "footer.title": "Boas pausas merecem continuar.",
      "footer.description": "Um cantinho para acompanhar novidades, encontrar inspirações e descobrir a trilha sonora do próximo café.",
      "footer.social": "Conecte-se com a gente",
      "footer.soon": "Em breve",
      "footer.open": "Acessar",
      "footer.chat": "Conversar",
      "footer.motto": "Feito para quem ama café, pão quentinho e boas histórias.",
      "footer.demo": "Coffee House · Site demonstrativo",
      "admin.link": "Área administrativa",
      "modal.title": "Pedido simulado!",
      "modal.message": "Esta é uma demonstração. Nenhum pedido foi enviado à loja e nenhum pagamento foi realizado.",
      "modal.close": "Voltar para o café",
      "qty.label": "Quantidade de {name}",
      "qty.add": "Adicionar {name} à sacola",
      "qty.up": "Aumentar {name}",
      "qty.down": "Diminuir {name}",
      "qty.count": "Quantidade",
      "toast.added": "{name} adicionado à sacola",
      "toast.coupon": "Cupom de 10% aplicado",
      "likes.unavailable": "Curtidas aguardando ativação. Nenhum total foi simulado.",
      "likes.loading": "Carregando curtidas...",
      "likes.help": "Uma curtida por visitante neste navegador. Os totais são compartilhados entre visitantes.",
      "likes.loadError": "Não foi possível consultar as curtidas. Tente novamente mais tarde.",
      "likes.saveError": "Não foi possível salvar a curtida. Tente novamente.",
      "likes.service": "Serviço indisponível",
      "likes.session": "Não foi possível iniciar a sessão anônima",
      "likes.wait": "Aguardando conexão com o serviço de curtidas",
      "likes.setup": "Curtidas disponíveis após ativação do banco de dados",
      "likes.like": "Curtir {name}",
      "likes.unlike": "Remover curtida de {name}",
      "aria.logo": "Croissant e copo de café",
      "aria.home": "Página inicial",
      "aria.menu": "Cardápio",
      "aria.orders": "Pedidos",
      "aria.footer": "Rodapé do Coffee House",
      "aria.navigation": "Navegação principal",
      "aria.social": "Redes sociais e contato",
      "aria.carousel": "Fotos de cafés e panificação",
      "aria.carousel1": "Mostrar foto 1: croissant e café",
      "aria.carousel2": "Mostrar foto 2: croissant",
      "aria.carousel3": "Mostrar foto 3: latte",
      "aria.image1": "Croissant e café especial sobre a mesa",
      "aria.image2": "Croissant artesanal dourado",
      "aria.image3": "Café com leite cremoso",
      "aria.openSocial": "Abrir {service} do Coffee House em nova aba",
      "meta.description": "Coffee House — café, croissants e boas pausas. Protótipo de cafeteria e bakery.",
      "about.inspiration": "Inspirada nas pausas de viagem",
      "about.cities": "Buenos Aires · Nova York · São Paulo"
    },
    "categories": {
      "bebidas": "Bebidas",
      "padaria": "Padaria",
      "doces": "Doces",
      "salgados": "Salgados",
      "all": "Todos"
    },
    "products": {
      "espresso": {
        "name": "Espresso",
        "desc": "Café intenso e encorpado."
      },
      "latte": {
        "name": "Latte Clássico",
        "desc": "Espresso, leite vaporizado e creme aveludado."
      },
      "cappuccino": {
        "name": "Cappuccino",
        "desc": "Espresso, leite cremoso e toque de cacau."
      },
      "coldbrew": {
        "name": "Cold Brew",
        "desc": "Café gelado, suave e refrescante."
      },
      "croissant": {
        "name": "Croissant Tradicional",
        "desc": "Massa folhada, leve e crocante."
      },
      "crocafe": {
        "name": "Croissant de Café",
        "desc": "Croissant amanteigado com recheio cremoso."
      },
      "cookie": {
        "name": "Cookie da Casa",
        "desc": "Chocolate e bordas levemente crocantes."
      },
      "mocca": {
        "name": "Mocha Especial",
        "desc": "Espresso, chocolate e leite cremoso."
      },
      "sanduiche": {
        "name": "Sanduíche da Casa",
        "desc": "Pão artesanal, queijo e tomate."
      }
    }
  },
  "en": {
    "strings": {
      "language.label": "Language",
      "language.aria": "Choose language",
      "hero.title": "Coffee, croissants<br>and good moments",
      "hero.description": "Handcrafted drinks, fresh pastries, and a space made for slowing down.",
      "hero.menu": "View menu",
      "hero.coffee": "Specialty<br>coffee",
      "hero.bakery": "Artisan<br>baking",
      "hero.ingredients": "Thoughtfully<br>chosen ingredients",
      "hero.featured": "House favorites",
      "hero.popular": "Most liked",
      "hero.note": "Menu and prices are illustrative for this demo.",
      "about.eyebrow": "OUR STORY",
      "about.heading": "A little getaway in every cup.",
      "about.p1": "Coffee House started with a simple idea: make a coffee break feel like a moment worth remembering.",
      "about.p2": "Inspired by the cafés and bakeries we discover while traveling, it brings together specialty coffee, croissants, and life's small pleasures. A place imagined for slowing down, catching up, and making memories.",
      "menu.heading": "Menu",
      "menu.subtitle": "Choose your favorite drink or house specialty.",
      "menu.note": "Concept photos and sample prices.",
      "menu.sort": "Sort by",
      "menu.popular": "Most liked",
      "orders.heading": "Orders",
      "orders.subtitle": "Review your items before pickup.",
      "orders.emptyTitle": "Your bag is empty",
      "orders.emptyDescription": "Explore the menu and choose your favorites for pickup.",
      "orders.explore": "Explore menu",
      "orders.subtotal": "Subtotal",
      "orders.total": "Total",
      "orders.choose": "Choose a product",
      "orders.couponApplied": "CAFE10 coupon applied",
      "orders.coupon": "Discount coupon",
      "orders.couponPlaceholder": "Enter a coupon",
      "orders.apply": "Apply",
      "orders.couponError": "Try the demo coupon CAFE10.",
      "orders.discount": "Discount (10%)",
      "orders.confirm": "Confirm order (pickup)",
      "nav.home": "Home",
      "nav.menu": "Menu",
      "nav.orders": "Orders",
      "footer.title": "Good moments deserve to linger.",
      "footer.description": "Stay up to date, find a little inspiration, and discover the soundtrack for your next coffee break.",
      "footer.social": "Stay in touch",
      "footer.soon": "Coming soon",
      "footer.open": "Visit",
      "footer.chat": "Chat",
      "footer.motto": "Made for coffee, warm pastries, and good stories.",
      "footer.demo": "Coffee House · Demo website",
      "admin.link": "Admin area",
      "modal.title": "Demo order placed!",
      "modal.message": "This is a demo. No order was sent to a store and no payment was made.",
      "modal.close": "Back to the café",
      "qty.label": "Quantity of {name}",
      "qty.add": "Add {name} to bag",
      "qty.up": "Increase {name}",
      "qty.down": "Decrease {name}",
      "qty.count": "Quantity",
      "toast.added": "{name} added to your bag",
      "toast.coupon": "10% coupon applied",
      "likes.unavailable": "Likes are not activated yet. No counts have been simulated.",
      "likes.loading": "Loading likes...",
      "likes.help": "One like per visitor in this browser. Totals are shared between visitors.",
      "likes.loadError": "Couldn't load likes. Please try again later.",
      "likes.saveError": "Couldn't save your like. Please try again.",
      "likes.service": "Service unavailable",
      "likes.session": "Couldn't start an anonymous session",
      "likes.wait": "Connecting to the likes service",
      "likes.setup": "Likes will be available after the database is activated",
      "likes.like": "Like {name}",
      "likes.unlike": "Unlike {name}",
      "aria.logo": "Croissant and takeaway coffee cup",
      "aria.home": "Home page",
      "aria.menu": "Menu page",
      "aria.orders": "Orders page",
      "aria.footer": "Coffee House footer",
      "aria.navigation": "Main navigation",
      "aria.social": "Social media and contact",
      "aria.carousel": "Coffee and bakery photos",
      "aria.carousel1": "Show photo 1: croissant and coffee",
      "aria.carousel2": "Show photo 2: croissant",
      "aria.carousel3": "Show photo 3: latte",
      "aria.image1": "Croissant and specialty coffee on a table",
      "aria.image2": "Golden handmade croissant",
      "aria.image3": "Creamy latte",
      "aria.openSocial": "Open Coffee House {service} in a new tab",
      "meta.description": "Coffee House — coffee, croissants, and good moments. Café and bakery demo.",
      "about.inspiration": "Inspired by coffee breaks abroad",
      "about.cities": "Buenos Aires · New York · São Paulo"
    },
    "categories": {
      "bebidas": "Drinks",
      "padaria": "Bakery",
      "doces": "Sweets",
      "salgados": "Savory",
      "all": "All"
    },
    "products": {
      "espresso": {
        "name": "Espresso",
        "desc": "Bold, full-bodied coffee."
      },
      "latte": {
        "name": "Classic Latte",
        "desc": "Espresso, steamed milk, and silky foam."
      },
      "cappuccino": {
        "name": "Cappuccino",
        "desc": "Espresso, creamy milk, and a hint of cocoa."
      },
      "coldbrew": {
        "name": "Cold Brew",
        "desc": "Smooth and refreshing iced coffee."
      },
      "croissant": {
        "name": "Classic Croissant",
        "desc": "Light, flaky, buttery pastry."
      },
      "crocafe": {
        "name": "Coffee Croissant",
        "desc": "Buttery croissant with a creamy filling."
      },
      "cookie": {
        "name": "House Cookie",
        "desc": "Chocolate and lightly crisp edges."
      },
      "mocca": {
        "name": "Special Mocha",
        "desc": "Espresso, chocolate, and creamy milk."
      },
      "sanduiche": {
        "name": "House Sandwich",
        "desc": "Artisan bread, cheese, and tomato."
      }
    }
  },
  "es": {
    "strings": {
      "language.label": "Idioma",
      "language.aria": "Elegir idioma",
      "hero.title": "Café, medialunas<br>y buenos momentos",
      "hero.description": "Bebidas artesanales, panadería fresca y un espacio para bajar un cambio.",
      "hero.menu": "Ver menú",
      "hero.coffee": "Cafés<br>especiales",
      "hero.bakery": "Panadería<br>artesanal",
      "hero.ingredients": "Ingredientes<br>seleccionados",
      "hero.featured": "Favoritos de la casa",
      "hero.popular": "Los más queridos",
      "hero.note": "El menú y los precios son ilustrativos para esta demostración.",
      "about.eyebrow": "NUESTRA HISTORIA",
      "about.heading": "Una pausa con sabor a viaje.",
      "about.p1": "Coffee House nació de una idea sencilla: convertir una pausa para tomar café en un momento que valga la pena recordar.",
      "about.p2": "Inspirada en las cafeterías y panaderías que descubrimos al viajar, reúne cafés especiales, croissants y pequeños placeres. Un lugar imaginado para disfrutar sin apuro, charlar y crear lindos recuerdos.",
      "menu.heading": "Menú",
      "menu.subtitle": "Elegí tu bebida o especialidad favorita de la casa.",
      "menu.note": "Fotos conceptuales y precios de ejemplo.",
      "menu.sort": "Ordenar por",
      "menu.popular": "Más queridos",
      "orders.heading": "Pedidos",
      "orders.subtitle": "Revisá tus productos antes de retirarlos.",
      "orders.emptyTitle": "Tu carrito está vacío",
      "orders.emptyDescription": "Elegí tus favoritos del menú y prepará tu pedido para retirar.",
      "orders.explore": "Explorar el menú",
      "orders.subtotal": "Subtotal",
      "orders.total": "Total",
      "orders.choose": "Elegí un producto",
      "orders.couponApplied": "Cupón CAFE10 aplicado",
      "orders.coupon": "Cupón de descuento",
      "orders.couponPlaceholder": "Ingresá un cupón",
      "orders.apply": "Aplicar",
      "orders.couponError": "Usá el cupón de prueba CAFE10.",
      "orders.discount": "Descuento (10%)",
      "orders.confirm": "Confirmar pedido (retiro)",
      "nav.home": "Inicio",
      "nav.menu": "Menú",
      "nav.orders": "Pedidos",
      "footer.title": "Los buenos momentos merecen durar.",
      "footer.description": "Un rincón para conocer novedades, encontrar inspiración y descubrir la música de tu próximo café.",
      "footer.social": "Conectate con nosotros",
      "footer.soon": "Próximamente",
      "footer.open": "Visitar",
      "footer.chat": "Chatear",
      "footer.motto": "Hecho para quienes aman el café, el pan recién horneado y las buenas historias.",
      "footer.demo": "Coffee House · Sitio de demostración",
      "admin.link": "Administración",
      "modal.title": "¡Pedido de prueba!",
      "modal.message": "Esto es una demostración. No se envió ningún pedido a una tienda ni se realizó ningún pago.",
      "modal.close": "Volver al café",
      "qty.label": "Cantidad de {name}",
      "qty.add": "Agregar {name} al carrito",
      "qty.up": "Aumentar {name}",
      "qty.down": "Disminuir {name}",
      "qty.count": "Cantidad",
      "toast.added": "{name} agregado al carrito",
      "toast.coupon": "Cupón del 10% aplicado",
      "likes.unavailable": "Los me gusta todavía no están activos. No se simularon cantidades.",
      "likes.loading": "Cargando me gusta...",
      "likes.help": "Un me gusta por visitante en este navegador. Los totales se comparten entre visitantes.",
      "likes.loadError": "No pudimos consultar los me gusta. Intentá de nuevo más tarde.",
      "likes.saveError": "No pudimos guardar tu me gusta. Intentá de nuevo.",
      "likes.service": "Servicio no disponible",
      "likes.session": "No se pudo iniciar una sesión anónima",
      "likes.wait": "Conectando con el servicio de me gusta",
      "likes.setup": "Los me gusta estarán disponibles cuando se active la base de datos",
      "likes.like": "Me gusta {name}",
      "likes.unlike": "Quitar me gusta de {name}",
      "aria.logo": "Croissant y vaso de café",
      "aria.home": "Página de inicio",
      "aria.menu": "Página del menú",
      "aria.orders": "Página de pedidos",
      "aria.footer": "Pie de página de Coffee House",
      "aria.navigation": "Navegación principal",
      "aria.social": "Redes sociales y contacto",
      "aria.carousel": "Fotos de café y panadería",
      "aria.carousel1": "Mostrar foto 1: croissant y café",
      "aria.carousel2": "Mostrar foto 2: croissant",
      "aria.carousel3": "Mostrar foto 3: latte",
      "aria.image1": "Croissant y café especial sobre la mesa",
      "aria.image2": "Croissant artesanal dorado",
      "aria.image3": "Café con leche cremoso",
      "aria.openSocial": "Abrir {service} de Coffee House en una pestaña nueva",
      "meta.description": "Coffee House — café, croissants y buenos momentos. Demostración de cafetería y panadería.",
      "about.inspiration": "Inspirada en las pausas de viaje",
      "about.cities": "Buenos Aires · Nueva York · São Paulo"
    },
    "categories": {
      "bebidas": "Bebidas",
      "padaria": "Panadería",
      "doces": "Dulces",
      "salgados": "Salados",
      "all": "Todos"
    },
    "products": {
      "espresso": {
        "name": "Espresso",
        "desc": "Café intenso y con cuerpo."
      },
      "latte": {
        "name": "Latte clásico",
        "desc": "Espresso, leche vaporizada y espuma aterciopelada."
      },
      "cappuccino": {
        "name": "Cappuccino",
        "desc": "Espresso, leche cremosa y un toque de cacao."
      },
      "coldbrew": {
        "name": "Cold Brew",
        "desc": "Café frío, suave y refrescante."
      },
      "croissant": {
        "name": "Croissant tradicional",
        "desc": "Hojaldre liviano y crocante."
      },
      "crocafe": {
        "name": "Croissant de café",
        "desc": "Croissant de manteca con relleno cremoso."
      },
      "cookie": {
        "name": "Cookie de la casa",
        "desc": "Chocolate y bordes apenas crocantes."
      },
      "mocca": {
        "name": "Mocha especial",
        "desc": "Espresso, chocolate y leche cremosa."
      },
      "sanduiche": {
        "name": "Sándwich de la casa",
        "desc": "Pan artesanal, queso y tomate."
      }
    }
  }
};
 const options={pt:'pt-BR',en:'en-US',es:'es-AR'};
 const key='coffeehouse-language-v1';
 let locale='pt';
 try { const saved=localStorage.getItem(key); if(Object.hasOwn(options,saved))locale=saved; } catch (_) {}
 function t(id,args={}) {
   const raw=translations[locale].strings[id]??translations.pt.strings[id]??id;
   return raw.replace(/\{([a-z]+)\}/gi,(_,name)=>args[name]===undefined?'':String(args[name]));
 }
 function product(id){return translations[locale].products[id]||translations.pt.products[id]||null}
 function category(id){return translations[locale].categories[id]||translations.pt.categories[id]||id}
 function apply(){
   document.documentElement.lang=options[locale];
   document.title='Coffee House · '+(locale==='en'?'Coffee & Bakery':locale==='es'?'Cafetería y Panadería':'Cafeteria & Bakery');
   const description=document.querySelector('meta[name="description"]');
   if(description)description.content=t('meta.description');
   for(const el of document.querySelectorAll('[data-i18n]'))el.textContent=t(el.dataset.i18n);
   for(const el of document.querySelectorAll('[data-i18n-html]'))el.innerHTML=t(el.dataset.i18nHtml);
   for(const el of document.querySelectorAll('[data-i18n-aria-label]'))el.setAttribute('aria-label',t(el.dataset.i18nAriaLabel));
   for(const el of document.querySelectorAll('[data-i18n-alt]'))el.alt=t(el.dataset.i18nAlt);
   for(const el of document.querySelectorAll('[data-i18n-placeholder]'))el.placeholder=t(el.dataset.i18nPlaceholder);
   const selector=document.getElementById('site-language');
   if(selector)selector.value=locale;
 }
 function setLocale(next){
   if(!Object.hasOwn(options,next)||next===locale)return;
   locale=next;
   try{localStorage.setItem(key,next)}catch(_){}
   apply();
   window.dispatchEvent(new CustomEvent('coffee:language-change',{detail:{locale}}));
 }
 window.CoffeeI18n={t,product,category,apply,setLocale,getLocale:()=>locale,localeTag:()=>options[locale]};
 function ready(){
   apply();
   const select=document.getElementById('site-language');
   if(select)select.addEventListener('change',event=>setLocale(event.target.value));
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();
