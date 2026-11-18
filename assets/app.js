
const IMAGES={"latte":"assets/photos/latte.webp","croissant":"assets/photos/croissant.webp","espresso":"assets/photos/espresso.webp","cappuccino":"assets/photos/cappuccino.webp","coldbrew":"assets/photos/coldbrew.webp","hero-food":"assets/photos/hero-food.webp","bokeh":"assets/photos/bokeh.webp"};
const PRODUCTS=[{"id": "espresso", "name": "Espresso", "price": 990, "category": "bebidas", "desc": "Café intenso e encorpado.", "img": "espresso"}, {"id": "latte", "name": "Latte Clássico", "price": 1690, "category": "bebidas", "desc": "Espresso, leite vaporizado e creme aveludado.", "img": "latte"}, {"id": "cappuccino", "name": "Cappuccino", "price": 1590, "category": "bebidas", "desc": "Espresso, leite cremoso e toque de cacau.", "img": "cappuccino"}, {"id": "coldbrew", "name": "Cold Brew", "price": 1790, "category": "bebidas", "desc": "Café gelado, suave e refrescante.", "img": "coldbrew"}, {"id": "croissant", "name": "Croissant Tradicional", "price": 1290, "category": "padaria", "desc": "Massa folhada, leve e crocante.", "img": "croissant"}, {"id": "crocafe", "name": "Croissant de Café", "price": 1890, "category": "padaria", "desc": "Croissant amanteigado com recheio cremoso.", "img": "croissant"}, {"id": "cookie", "name": "Cookie da Casa", "price": 1190, "category": "doces", "desc": "Chocolate e bordas levemente crocantes.", "img": "croissant"}, {"id": "mocca", "name": "Mocha Especial", "price": 1890, "category": "doces", "desc": "Espresso, chocolate e leite cremoso.", "img": "latte"}, {"id": "sanduiche", "name": "Sanduíche da Casa", "price": 2690, "category": "salgados", "desc": "Pão artesanal, queijo e tomate.", "img": "croissant"}];
const categories=[{id:'bebidas',label:'Bebidas',icon:"<svg class=\"ico \" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M4 9h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9ZM17 11h2a3 3 0 0 1 0 6h-2M6 4c2 2-2 2 0 4M12 4c2 2-2 2 0 4\"/></svg>"},{id:'padaria',label:'Padaria',icon:"<svg class=\"ico \" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M2 16c0-6 4-9 8-10 3-4 9-3 12 4-1 5-6 8-11 7-3 3-7 2-9-1ZM10 6c-3 4-3 8-2 11M16 6c-2 4-2 8 0 11\"/></svg>"},{id:'doces',label:'Doces',icon:"<svg class=\"ico \" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 12h18v9H3v-9ZM3 12l5-7 5 4 4-4 4 7M12 9v12\"/></svg>"},{id:'salgados',label:'Salgados',icon:"<svg class=\"ico \" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M20 4C8 4 4 9 4 16c0 3 3 4 5 4 7 0 11-6 11-16ZM4 20c3-6 7-8 12-11\"/></svg>"}];
const ICONS={plus:"<svg class=\"ico \" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M12 5v14M5 12h14\"/></svg>",minus:"<svg class=\"ico \" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M5 12h14\"/></svg>",tag:"<svg class=\"ico \" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 12V4h8l10 10-7 7L3 12ZM7 8h.01\"/></svg>",chevron:"<svg class=\"ico \" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"m9 6 6 6-6 6\"/></svg>",bag:"<svg class=\"ico \" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M5 9h14l1 12H4L5 9ZM9 10V7a3 3 0 0 1 6 0v3\"/></svg>",check:"<svg class=\"ico \" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"m5 12 5 5L20 7\"/></svg>"};
const I18N=window.CoffeeI18n;
const t=(key,args)=>I18N.t(key,args);
const productLabel=p=>{const fromCatalog=window.CoffeeCatalog?.nameFor(p.id);if(fromCatalog)return {...p,...fromCatalog};const translation=I18N.product(p.id);return translation?{...p,...translation}:p};
const format=v=>(v/100).toLocaleString(I18N.localeTag(),{style:'currency',currency:'BRL'});
const byId=id=>PRODUCTS.find(p=>p.id===String(id).split('~')[0]);
window.COFFEE_PRODUCT_IDS=PRODUCTS.map(p=>p.id);
categories.push({id:'all',label:'Todos',icon:ICONS.check});
const $=id=>document.getElementById(id);
let cart={};try{let saved=JSON.parse(localStorage.getItem('coffeehouse-cart-v3')||'{}');for(const [id,q] of Object.entries(saved))if(byId(id)&&Number.isInteger(q)&&q>0&&q<100)cart[id]=q;}catch(e){}
let selectedCategory='bebidas',couponApplied=false,toastTimer;
function storeCart(){try{localStorage.setItem('coffeehouse-cart-v3',JSON.stringify(cart))}catch(e){}}
function toast(message){const el=$('toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2000)}
function count(){return Object.values(cart).reduce((a,b)=>a+b,0)}
function updateBadge(){const el=$('cart-badge'),n=count();el.textContent=n;el.hidden=!n}
const MAX_QUANTITY=99;
// Show a single + until the first item is added; then reveal - quantity +.
function quantityControl(p){
 const q=cart[p.id]||0;
 return `<div class="product-qty-slot" data-qty-slot="${p.id}">
   <button class="round-add" type="button" data-add="${p.id}" aria-label="${t('qty.add',{name:p.name})}" ${q?'hidden':''}>${ICONS.plus}</button>
   <div class="qty-picker" role="group" aria-label="${t('qty.label',{name:p.name})}" ${q?'':'hidden'}>
     <button type="button" data-change="${p.id}" data-diff="-1" aria-label="${t('qty.down',{name:p.name})}">${ICONS.minus}</button>
     <output aria-label="${t('qty.label',{name:p.name})}">${q}</output>
     <button type="button" data-change="${p.id}" data-diff="1" aria-label="${t('qty.up',{name:p.name})}" ${q>=MAX_QUANTITY?'disabled':''}>${ICONS.plus}</button>
   </div>
 </div>`;
}
function syncQuantityControls(id){
 const q=cart[id]||0;
 document.querySelectorAll('[data-qty-slot]').forEach(slot=>{
   if(slot.dataset.qtySlot!==id)return;
   slot.querySelector('.round-add').hidden=q>0;
   slot.querySelector('.qty-picker').hidden=q===0;
   slot.querySelector('output').textContent=String(q);
   slot.querySelector('[data-diff="1"]').disabled=q>=MAX_QUANTITY;
 });
}
function change(id,diff){
 if(!byId(id)||![1,-1].includes(diff))return false;
 if(diff>0&&byId(id).available===false)return false;
 const next=Math.max(0,Math.min(MAX_QUANTITY,(cart[id]||0)+diff));
 if(next===(cart[id]||0))return false;
 if(next===0)delete cart[id];else cart[id]=next;
 storeCart();updateBadge();syncQuantityControls(id);renderOrders();
 return true;
}
function add(id){if(change(id,1))toast(t('toast.added',{name:productLabel(byId(id)).name}))}
let carouselIndex=0,carouselTimer=null,carouselStartX=null;
function setCarouselSlide(index){const slides=[...document.querySelectorAll('.hero-carousel .hero-slide')];if(!slides.length)return;carouselIndex=((index%slides.length)+slides.length)%slides.length;slides.forEach((el,i)=>{const active=i===carouselIndex;el.classList.toggle('is-active',active);el.setAttribute('aria-hidden',String(!active))});document.querySelectorAll('.hero-dot').forEach((el,i)=>{const active=i===carouselIndex;el.classList.toggle('is-active',active);el.setAttribute('aria-current',String(active))})}
function syncCarouselPlayback(){clearInterval(carouselTimer);carouselTimer=null;if(!document.getElementById('home').classList.contains('active')||document.hidden||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;carouselTimer=setInterval(()=>setCarouselSlide(carouselIndex+1),4500)}
const heroCarousel=document.querySelector('.hero-carousel');
if(heroCarousel){heroCarousel.addEventListener('touchstart',e=>{carouselStartX=e.changedTouches[0].clientX},{passive:true});heroCarousel.addEventListener('touchend',e=>{if(carouselStartX===null)return;const delta=e.changedTouches[0].clientX-carouselStartX;carouselStartX=null;if(Math.abs(delta)>45){setCarouselSlide(carouselIndex+(delta<0?1:-1));syncCarouselPlayback()}},{passive:true});heroCarousel.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();setCarouselSlide(carouselIndex+(e.key==='ArrowRight'?1:-1));syncCarouselPlayback()}})}
document.addEventListener('visibilitychange',syncCarouselPlayback);
function nav(page,updateHistory=true){if(!['home','menu','pedidos'].includes(page))return;document.querySelectorAll('.screen').forEach(el=>el.classList.toggle('active',el.id===page));document.querySelectorAll('.nav-btn').forEach(btn=>{const on=btn.dataset.go===page;btn.classList.toggle('active',on);if(on)btn.setAttribute('aria-current','page');else btn.removeAttribute('aria-current')});if(page==='pedidos')renderOrders();window.scrollTo(0,0);if(updateHistory&&location.hash!=='#'+page){try{history.pushState(null,'','#'+page)}catch(e){location.hash=page}}syncCarouselPlayback()}
function itemCard(p){p=productLabel(p);return `<article class="product" data-product-id="${p.id}"><img alt="${p.name}" src="${IMAGES[p.img]}" loading="lazy" decoding="async"><div class="product-info"><h3>${p.name}</h3><p>${p.desc}</p><div class="product-price-row"><strong>${format(p.price)}</strong>${quantityControl(p)}</div>${window.CoffeeLikes.button(p)}</div></article>`}
function renderFeatured(){
 const defaults=['latte','croissant','cappuccino','coldbrew'].map(byId).filter(p=>p&&p.available!==false);
 const likes=window.CoffeeLikes;
 const available=PRODUCTS.filter(p=>p.available!==false);
 const hasLikes=likes.available()&&available.some(p=>likes.count(p.id)>0);
 const picks=hasLikes?[...available].sort((a,b)=>likes.count(b.id)-likes.count(a.id)).slice(0,4):defaults;
 $('featured-heading').textContent=t(hasLikes?'hero.popular':'hero.featured');
 $('featured').innerHTML=picks.map(raw=>{const p=productLabel(raw);return `<article class="featured" data-product-id="${p.id}"><img src="${IMAGES[p.img]}" alt="${p.name}" loading="lazy" decoding="async">${likes.button(p)}<div class="featured-body"><h3>${p.name}</h3><p>${p.desc}</p><div class="price-row"><strong class="price">${format(p.price)}</strong>${quantityControl(p)}</div></div></article>`}).join('');
 window.CoffeeExperience?.enhanceAfterRender();
}
let sortByLikes=false;
function renderMenu(){
 $('categories').innerHTML=categories.map(cat=>`<button type="button" class="category ${selectedCategory===cat.id?'selected':''}" data-category="${cat.id}" aria-pressed="${selectedCategory===cat.id}">${cat.icon}<span>${I18N.category(cat.id)}</span></button>`).join('');
 const likes=window.CoffeeLikes;
 $('likes-status').textContent=likes.statusText();
 let prods=PRODUCTS.filter(p=>p.available!==false&&(selectedCategory==='all'||p.category===selectedCategory));
 if(window.CoffeeExperience)prods=window.CoffeeExperience.filter(prods);
 if(sortByLikes&&likes.available())prods.sort((a,b)=>likes.count(b.id)-likes.count(a.id));
 $('menu-items').innerHTML=`<div class="menu-sort"><span>${t('menu.sort')}</span><button type="button" data-sort-likes aria-pressed="${sortByLikes}" ${!likes.available()?'disabled':''} >${sortByLikes?'✓ ':''}${t('menu.popular')}</button></div><section class="menu-section"><h2 class="serif">${I18N.category(selectedCategory)}</h2><div class="menu-items">${prods.map(itemCard).join('')}</div></section>`;
 window.CoffeeExperience?.enhanceAfterRender();
}

function renderOrders(){
 const ids=Object.keys(cart);
 if(!ids.length){
  couponApplied=false;
  $('order-list').innerHTML=`<div class="empty">${ICONS.bag}
   <h3 class="serif">${t('orders.emptyTitle')}</h3>
   <p>${t('orders.emptyDescription')}</p>
   <a class="cta" href="#menu" data-go="menu">${t('orders.explore')}</a></div>`;
  $('order-summary').innerHTML=`<div class="summary-line"><span>${t('orders.subtotal')}</span><strong>${format(0)}</strong></div>
   <div class="total-line"><span>${t('orders.total')}</span><strong>${format(0)}</strong></div>
   <button class="confirm" type="button" disabled>${t('orders.choose')}</button>`;
  return;
 }
 $('order-list').innerHTML=ids.map(id=>{
  const p=productLabel(byId(id));
  const unitPrice=window.CoffeeExperience?.priceFor(id,p)??p.price;
  const variantNote=window.CoffeeExperience?.variantLabel(id)??'';
  return `<div class="order-row"><img src="${IMAGES[p.img]}" alt="${p.name}" loading="lazy" decoding="async">
   <div><h3>${p.name}</h3>${variantNote?`<small class="variant-note">${variantNote}</small>`:""}<p>${format(unitPrice)}</p></div>
   <div class="quantity qty-picker" role="group" aria-label="${t('qty.label',{name:p.name})}">
    <button type="button" data-change="${id}" data-diff="-1" aria-label="${t('qty.down',{name:p.name})}">${ICONS.minus}</button>
    <span aria-label="${t('qty.count')}">${cart[id]}</span>
    <button type="button" data-change="${id}" data-diff="1" aria-label="${t('qty.up',{name:p.name})}" ${cart[id]>=MAX_QUANTITY?'disabled':''}>${ICONS.plus}</button>
   </div></div>`
 }).join('');
 const subtotal=ids.reduce((sum,id)=>{const p=byId(id);return sum+(window.CoffeeExperience?.priceFor(id,p)??p.price)*cart[id]},0);
 const discount=couponApplied?Math.round(subtotal*.1):0;
 const total=subtotal-discount;
 $('order-summary').innerHTML=`
  <div class="summary-line"><span>${t('orders.subtotal')}</span><span>${format(subtotal)}</span></div>
  <button class="coupon-trigger" type="button" id="coupon-trigger">
   <span class="coupon-left">${ICONS.tag}<span>${t(couponApplied?'orders.couponApplied':'orders.coupon')}</span></span>${ICONS.chevron}
  </button>
  <div class="coupon-body" id="coupon-body">
   <input aria-label="${t('orders.coupon')}" placeholder="${t('orders.couponPlaceholder')}" id="coupon-input" maxlength="24" autocomplete="off">
   <button id="apply-coupon" type="button">${t('orders.apply')}</button>
  </div>
  <p class="coupon-error" id="coupon-error">${t('orders.couponError')}</p>
  ${couponApplied?`<div class="summary-line"><span>${t('orders.discount')}</span><span>− ${format(discount)}</span></div>`:''}
  <div class="total-line"><span>${t('orders.total')}</span><span>${format(total)}</span></div>
  <button class="confirm" type="button" id="checkout">${ICONS.bag}${t('orders.confirm')}</button>`;
}
window.addEventListener('hashchange',()=>nav(location.hash.slice(1)||'home',false));
window.addEventListener('popstate',()=>nav(location.hash.slice(1)||'home',false));
// Event delegation keeps all controls working after menu and cart updates.
document.addEventListener('click',e=>{const go=e.target.closest('[data-go]');if(go){e.preventDefault();nav(go.dataset.go);return}const dot=e.target.closest('[data-carousel-index]');if(dot){setCarouselSlide(Number(dot.dataset.carouselIndex));syncCarouselPlayback();return}const addBtn=e.target.closest('[data-add]');if(addBtn){add(addBtn.dataset.add);return}const cat=e.target.closest('[data-category]');if(cat){selectedCategory=cat.dataset.category;renderMenu();return}if(e.target.closest('[data-sort-likes]')){sortByLikes=!sortByLikes;renderMenu();return}const qty=e.target.closest('[data-change]');if(qty){change(qty.dataset.change,Number(qty.dataset.diff));return}if(e.target.closest('#coupon-trigger')){$('coupon-body')?.classList.toggle('open');return}if(e.target.closest('#apply-coupon')){const value=($('coupon-input').value||'').trim().toUpperCase();if(value==='CAFE10'){couponApplied=true;renderOrders();toast(t('toast.coupon'))}else{$('coupon-error').style.display='block'}return}if(e.target.closest('#checkout')){$('checkout-modal').classList.add('show');return}if(e.target.closest('#close-modal')){ $('checkout-modal').classList.remove('show');nav('home');return}if(e.target.id==='checkout-modal'){$('checkout-modal').classList.remove('show')}});
document.addEventListener('keydown',e=>{if(e.key==='Escape')$('checkout-modal').classList.remove('show')});
window.CoffeeLikes.onError=message=>toast(message);
window.addEventListener('coffee:likes-update',()=>{renderFeatured();renderMenu()});
window.addEventListener('coffee:language-change',()=>{renderFeatured();renderMenu();renderOrders();});
renderFeatured();renderMenu();renderOrders();updateBadge();document.documentElement.classList.add('js-ready');nav(location.hash.slice(1)||'home',false);window.CoffeeLikes.init();
