/* Coffee Shop V2: product exploration, local favorites, customizations, and draft checkout. */
(()=>{
'use strict';
const lang=()=>window.CoffeeI18n?.getLocale?.()||'pt';
const messages={
 pt:{search:'Buscar produtos',searchHint:'Busque por café, croissant, ingredientes…',sort:'Ordenar',recommended:'Relevância',cheap:'Menor preço',expensive:'Maior preço',popular:'Mais curtidos',saved:'Meus favoritos',all:'Todos os produtos',none:'Nenhum produto encontrado.',details:'Ver detalhes',save:'Salvar favorito',unsave:'Remover favorito',size:'Tamanho',milk:'Leite',regular:'Tradicional',large:'Grande',whole:'Integral',oat:'Aveia',lactosefree:'Sem lactose',custom:'Personalizar seu café',choice:'Personalização',add:'Adicionar à sacola',back:'Voltar',close:'Fechar',from:'a partir de',warning:'Preços ilustrativos. Pedido demonstrativo.',ingredients:'Ingredientes (exemplo)',allergens:'Composição ilustrativa: confirme ingredientes e alergênicos antes de consumir.',review:'Revisar sacola',pickup:'Retirada',pickupInfo:'Este é um protótipo. Não há loja ou horário de retirada configurados.',confirm:'Resumo do pedido',next:'Continuar',finish:'Finalizar demonstração',done:'Resumo criado apenas para demonstração. Nenhum pedido foi enviado nem pago.',share:'Copiar resumo',copied:'Resumo copiado',whatsapp:'Abrir rascunho no WhatsApp',unavailable:'WhatsApp oficial indisponível',favInfo:'Os favoritos ficam salvos apenas neste dispositivo.',noorder:'Adicione produtos antes de continuar.',step:'Etapa',demo:'Demonstração — não é um pedido confirmado',bag:'Sacola',price:'Preço',noDetails:'Selecione um produto.'},
 en:{search:'Search products',searchHint:'Search coffee, pastries, ingredients…',sort:'Sort',recommended:'Recommended',cheap:'Lowest price',expensive:'Highest price',popular:'Most liked',saved:'My favorites',all:'All products',none:'No products found.',details:'View details',save:'Save favorite',unsave:'Remove favorite',size:'Size',milk:'Milk',regular:'Regular',large:'Large',whole:'Whole',oat:'Oat',lactosefree:'Lactose-free',custom:'Customize your coffee',choice:'Customization',add:'Add to bag',back:'Back',close:'Close',from:'from',warning:'Illustrative prices. Demo ordering only.',ingredients:'Sample ingredients',allergens:'Illustrative ingredients only. Confirm ingredients and allergens before consuming.',review:'Review bag',pickup:'Pickup',pickupInfo:'This is a demo. No store or pickup time is configured.',confirm:'Order summary',next:'Continue',finish:'Finish demo',done:'Summary created for demonstration only. No order was placed or paid.',share:'Copy summary',copied:'Summary copied',whatsapp:'Open WhatsApp draft',unavailable:'Official WhatsApp unavailable',favInfo:'Favorites are saved only on this device.',noorder:'Add a product to continue.',step:'Step',demo:'Demo — not a confirmed order',bag:'Bag',price:'Price',noDetails:'Choose a product.'},
 es:{search:'Buscar productos',searchHint:'Buscá café, medialunas, ingredientes…',sort:'Ordenar',recommended:'Recomendados',cheap:'Menor precio',expensive:'Mayor precio',popular:'Más queridos',saved:'Mis favoritos',all:'Todos los productos',none:'No encontramos productos.',details:'Ver detalles',save:'Guardar favorito',unsave:'Quitar favorito',size:'Tamaño',milk:'Leche',regular:'Tradicional',large:'Grande',whole:'Entera',oat:'Avena',lactosefree:'Sin lactosa',custom:'Personalizá tu café',choice:'Personalización',add:'Agregar al carrito',back:'Volver',close:'Cerrar',from:'desde',warning:'Precios ilustrativos. Pedido de demostración.',ingredients:'Ingredientes (de ejemplo)',allergens:'Composición ilustrativa: confirmá ingredientes y alérgenos antes de consumir.',review:'Revisar carrito',pickup:'Retiro',pickupInfo:'Esto es una demostración. No hay local ni horario de retiro configurado.',confirm:'Resumen del pedido',next:'Continuar',finish:'Finalizar demostración',done:'Resumen creado solo para demostrar. No se envió ni pagó ningún pedido.',share:'Copiar resumen',copied:'Resumen copiado',whatsapp:'Abrir borrador en WhatsApp',unavailable:'WhatsApp oficial no disponible',favInfo:'Los favoritos se guardan solo en este dispositivo.',noorder:'Agregá productos para continuar.',step:'Paso',demo:'Demostración — no es un pedido confirmado',bag:'Carrito',price:'Precio',noDetails:'Elegí un producto.'}
};
const t=k=>messages[lang()]?.[k]||messages.pt[k]||k;
const favoritesKey='coffeehouse-favorites-v1';
let favorites=new Set();
try{favorites=new Set(JSON.parse(localStorage.getItem(favoritesKey)||'[]').filter(id=>typeof id==='string'&&/^[a-z][a-z0-9-]{1,39}$/.test(id)))}catch(_){}
let query='',sort='recommended',favoritesOnly=false,activeProduct=null,step=0,modalReturnFocus=null;
function esc(s){return String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}
function productName(p){return window.CoffeeCatalog?.plainFor(p.id)?.name||window.CoffeeI18n.product(p.id)?.name||p.name}
function productDesc(p){return window.CoffeeCatalog?.plainFor(p.id)?.desc||window.CoffeeI18n.product(p.id)?.desc||p.desc}
function isDrink(p){return p.category==='bebidas'}
function displayPrice(v){return format(v)}
function favoriteButton(p){return '<button class="bookmark" type="button" data-favorite="'+p.id+'" aria-pressed="'+favorites.has(p.id)+'" aria-label="'+esc(favorites.has(p.id)?t('unsave'):t('save'))+' '+esc(productName(p))+'">'+(favorites.has(p.id)?'★':'☆')+'</button>'}
function getVisibleProducts(prods){
 let result=prods.filter(p=>(!favoritesOnly||favorites.has(p.id))&&(!query||[productName(p),productDesc(p),p.id].join(' ').toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').includes(query)));
 if(sort==='cheap')result.sort((a,b)=>a.price-b.price);
 if(sort==='expensive')result.sort((a,b)=>b.price-a.price);
 if(sort==='popular')result.sort((a,b)=>window.CoffeeLikes.count(b.id)-window.CoffeeLikes.count(a.id));
 return result;
}
function toolsHTML(){return '<div class="discovery" id="discovery-tools"><label for="product-search">'+t('search')+'</label><input id="product-search" type="search" autocomplete="off" placeholder="'+esc(t('searchHint'))+'" value="'+esc(searchText)+'"><div class="discovery-actions"><label for="product-sort">'+t('sort')+'</label><select id="product-sort">'+[['recommended','recommended'],['cheap','cheap'],['expensive','expensive'],['popular','popular']].map(([v,k])=>'<option value="'+v+'" '+(sort===v?'selected':'')+'>'+t(k)+'</option>').join('')+'</select><button id="favorites-filter" type="button" aria-pressed="'+favoritesOnly+'">☆ '+t('saved')+'</button></div><small>'+t('favInfo')+'</small></div>'}
let searchText='';
function decorateMenu(){
 if(!document.getElementById('discovery-tools'))document.getElementById('categories').insertAdjacentHTML('beforebegin',toolsHTML());
 const search=document.getElementById('product-search');if(search&&search.value!==searchText)search.value=searchText;
 const list=document.querySelector('#menu .menu-items');
 if(!list)return;
 const rows=[...list.querySelectorAll('.product')];
 rows.forEach(row=>decorateRow(row));
 if(rows.length===0&&!list.querySelector('.empty-search'))list.innerHTML='<p class="empty-search">'+t('none')+'</p>';
}
function decorateRow(row){
 const id=row.dataset.productId;
 if(!id||!window.COFFEE_PRODUCT_IDS.includes(id))return;
 const p=PRODUCTS.find(p=>p.id===id);
 if(!row.querySelector('[data-detail]')){
 const area=row.querySelector('.product-info')||row;
 area.insertAdjacentHTML('beforeend','<div class="product-more"><button type="button" data-detail="'+id+'">'+t('details')+'</button>'+favoriteButton(p)+'</div>');
 }
}
function decorateFeatured(){document.querySelectorAll('#featured .featured').forEach(row=>{const id=row.dataset.productId,p=PRODUCTS.find(p=>p.id===id);if(!p||row.querySelector('[data-detail]'))return;const area=row.querySelector('.featured-body');area.insertAdjacentHTML('beforeend','<div class="product-more"><button type="button" data-detail="'+id+'">'+t('details')+'</button>'+favoriteButton(p)+'</div>')})}
function bindMenuTools(){
 const search=document.getElementById('product-search');if(!search||search.dataset.bound)return;search.dataset.bound='yes';
 search.addEventListener('input',()=>{searchText=search.value;query=searchText.trim().toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');selectedCategory='all';renderMenu();search.focus();try{search.setSelectionRange(searchText.length,searchText.length)}catch(_){}});
 document.getElementById('product-sort').addEventListener('change',e=>{sort=e.target.value;renderMenu()});
 document.getElementById('favorites-filter').addEventListener('click',()=>{favoritesOnly=!favoritesOnly;selectedCategory='all';renderMenu()});
}
function enhanceAfterRender(){decorateMenu();decorateFeatured();bindMenuTools();const x=document.getElementById('favorites-filter');if(x)x.setAttribute('aria-pressed',String(favoritesOnly));const selector=document.getElementById('product-sort');if(selector)selector.value=sort;}
function choices(p,selection){
 if(!isDrink(p))return '';
 return '<fieldset><legend>'+t('size')+'</legend>'+[['regular','regular'],['large','large']].map(([v,k])=>'<label><input type="radio" name="detail-size" value="'+v+'" '+(selection.size===v?'checked':'')+'>'+t(k)+'</label>').join('')+'</fieldset>'+
 '<fieldset><legend>'+t('milk')+'</legend>'+[['whole','whole'],['oat','oat'],['lactosefree','lactosefree']].map(([v,k])=>'<label><input type="radio" name="detail-milk" value="'+v+'" '+(selection.milk===v?'checked':'')+'>'+t(k)+'</label>').join('')+'</fieldset>';
}
const sampleIngredients={"pt":{"espresso":["Café espresso","Água"],"latte":["Café espresso","Leite"],"cappuccino":["Café espresso","Leite","Cacau"],"coldbrew":["Café extraído a frio","Água"],"croissant":["Farinha de trigo","Manteiga","Leite","Fermento"],"crocafe":["Massa de croissant","Manteiga","Creme sabor café"],"cookie":["Farinha de trigo","Chocolate","Manteiga"],"mocca":["Café espresso","Chocolate","Leite"],"sanduiche":["Pão artesanal","Queijo","Tomate"]},"en":{"espresso":["Espresso coffee","Water"],"latte":["Espresso coffee","Milk"],"cappuccino":["Espresso coffee","Milk","Cocoa"],"coldbrew":["Cold-extracted coffee","Water"],"croissant":["Wheat flour","Butter","Milk","Yeast"],"crocafe":["Croissant dough","Butter","Coffee-flavored cream"],"cookie":["Wheat flour","Chocolate","Butter"],"mocca":["Espresso coffee","Chocolate","Milk"],"sanduiche":["Artisan bread","Cheese","Tomato"]},"es":{"espresso":["Café espresso","Agua"],"latte":["Café espresso","Leche"],"cappuccino":["Café espresso","Leche","Cacao"],"coldbrew":["Café extraído en frío","Agua"],"croissant":["Harina de trigo","Manteca","Leche","Levadura"],"crocafe":["Masa de croissant","Manteca","Crema sabor café"],"cookie":["Harina de trigo","Chocolate","Manteca"],"mocca":["Café espresso","Chocolate","Leche"],"sanduiche":["Pan artesanal","Queso","Tomate"]}};
function ingredientsFor(id){const items=sampleIngredients[lang()]?.[id];if(!items)return '';return '<h3 class="detail-subtitle">'+t('ingredients')+'</h3><ul class="detail-ingredients">'+items.map(item=>'<li>'+esc(item)+'</li>').join('')+'</ul><p class="detail-allergens">'+t('allergens')+'</p>'}
function variant(p,size,milk){return isDrink(p)&&!(size==='regular'&&milk==='whole')?p.id+'~'+size+'~'+milk:p.id}
function priceFor(key,p){const parts=key.split('~');return p.price+(parts[1]==='large'?400:0)+(parts[2]==='oat'?300:0)}
function variantLabel(key){const parts=key.split('~');return parts.length===3?t('choice')+': '+t(parts[1])+' · '+t(parts[2]):''}
function addCustom(p,selection,qty){
 const id=variant(p,selection.size,selection.milk);const old=cart[id]||0;
 cart[id]=Math.min(99,old+qty);storeCart();updateBadge();renderOrders();
 if(id===p.id)syncQuantityControls(id);
 toast(window.CoffeeI18n.t('toast.added',{name:productName(p)}));
}
function modal(){let el=document.getElementById('experience-modal');if(!el){el=document.createElement('div');el.id='experience-modal';el.className='experience-overlay';el.setAttribute('role','presentation');document.body.appendChild(el)}return el}
function close(){const el=modal();el.hidden=true;el.innerHTML='';document.body.classList.remove('dialog-open');modalReturnFocus?.focus?.();modalReturnFocus=null}
function show(html){const el=modal();if(!modalReturnFocus)modalReturnFocus=document.activeElement;el.innerHTML='<div class="experience-dialog" role="dialog" aria-modal="true"><button class="dialog-x" type="button" data-experience-close aria-label="'+t('close')+'">×</button>'+html+'</div>';el.hidden=false;document.body.classList.add('dialog-open');const heading=el.querySelector('.experience-dialog h2');if(heading){heading.id='experience-dialog-heading';el.querySelector('[role="dialog"]').setAttribute('aria-labelledby',heading.id)}el.querySelector('.dialog-x')?.focus()}
function detail(id,selection={size:'regular',milk:'whole'},qty=1){
 const p=PRODUCTS.find(p=>p.id===id);if(!p)return;
 activeProduct=id;const current=variant(p,selection.size,selection.milk),cost=priceFor(current,p);
 show('<div class="detail-layout"><img class="detail-image" src="'+IMAGES[p.img]+'" alt="'+esc(productName(p))+'"><div><p class="about-eyebrow">COFFEE HOUSE</p><h2 class="serif">'+esc(productName(p))+'</h2><p>'+esc(productDesc(p))+'</p>'+ingredientsFor(p.id)+'<p class="detail-price">'+displayPrice(cost)+'</p><p class="detail-note">'+t('warning')+'</p><div class="detail-choices">'+choices(p,selection)+'</div><div class="detail-buttons"><button type="button" class="confirm" id="detail-add">'+t('add')+' · '+displayPrice(cost*qty)+'</button></div></div></div>');
 const el=modal();const add=el.querySelector('#detail-add');add.dataset.qty=qty;
 el.querySelectorAll('input').forEach(input=>input.addEventListener('change',()=>{const selected={size:el.querySelector('[name="detail-size"]:checked')?.value||'regular',milk:el.querySelector('[name="detail-milk"]:checked')?.value||'whole'};detail(id,selected,qty)}));
 add.addEventListener('click',()=>{const selected={size:el.querySelector('[name="detail-size"]:checked')?.value||'regular',milk:el.querySelector('[name="detail-milk"]:checked')?.value||'whole'};addCustom(p,selected,qty);close()});
}
function summary(){
 return Object.keys(cart).map(k=>{const p=PRODUCTS.find(p=>p.id===k.split('~')[0]);return p?'- '+(cart[k]||0)+' × '+productName(p)+(variantLabel(k)?' ('+variantLabel(k)+')':'')+' — '+displayPrice(priceFor(k,p)*(cart[k]||0)):''}).filter(Boolean).join('\n')
}
function priceTotal(){return Object.keys(cart).reduce((sum,id)=>{const p=PRODUCTS.find(p=>p.id===id.split('~')[0]);return sum+(p?priceFor(id,p)*(cart[id]||0):0)},0)}
function checkout(){
 if(!Object.keys(cart).length){toast(t('noorder'));return}
 step=0;renderCheckout();
}
function whatsappUrl(){
 const raw=window.COFFEE_SOCIAL_LINKS?.whatsapp||'';try{const u=new URL(raw);if(u.hostname==='wa.me'&&/^\/[0-9]{8,15}\/?$/.test(u.pathname))return u.origin+u.pathname+'?text='+encodeURIComponent(t('demo')+'\n'+summary())}catch(_){}
 return null;
}
function renderCheckout(){
 const title=[t('review'),t('pickup'),t('confirm')][step];
 const content=step===0?'<pre class="checkout-summary">'+esc(summary())+'</pre><p><strong>'+t('price')+': '+displayPrice(priceTotal())+'</strong></p>':step===1?'<p>'+t('pickupInfo')+'</p>':'<p>'+t('done')+'</p><pre class="checkout-summary">'+esc(summary())+'</pre>';
 const button=step<2?'<button class="confirm" id="demo-next">'+t('next')+'</button>':'<button class="confirm" id="demo-copy">'+t('share')+'</button>';
 const wa=step===2&&whatsappUrl()?'<a class="cta" href="'+whatsappUrl()+'" target="_blank" rel="noopener noreferrer">'+t('whatsapp')+'</a>':'';
 show('<p class="about-eyebrow">'+t('step')+' '+(step+1)+' / 3 · '+t('demo')+'</p><h2 class="serif">'+title+'</h2><div class="checkout-content">'+content+'</div><div class="checkout-actions">'+button+wa+(step>0?'<button id="demo-back">'+t('back')+'</button>':'')+'</div>');
 const el=modal();el.querySelector('#demo-next')?.addEventListener('click',()=>{step++;renderCheckout()});el.querySelector('#demo-back')?.addEventListener('click',()=>{step--;renderCheckout()});el.querySelector('#demo-copy')?.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(t('demo')+'\n'+summary());toast(t('copied'))}catch(_){toast(t('done'))}});
}
document.addEventListener('click',e=>{
 const item=e.target.closest('[data-detail]');if(item){e.preventDefault();detail(item.dataset.detail);return}
 const fav=e.target.closest('[data-favorite]');if(fav){e.preventDefault();const id=fav.dataset.favorite;favorites.has(id)?favorites.delete(id):favorites.add(id);try{localStorage.setItem(favoritesKey,JSON.stringify([...favorites]))}catch(_){};renderMenu();renderFeatured();enhanceAfterRender();return}
 if(e.target.closest('#checkout')){e.preventDefault();e.stopImmediatePropagation();checkout();return}
 if(e.target.closest('[data-experience-close]')||e.target.id==='experience-modal'){e.preventDefault();close()}
},true);
document.addEventListener('keydown',e=>{
 const el=document.getElementById('experience-modal');
 if(!el||el.hidden)return;
 if(e.key==='Escape'){e.preventDefault();close();return}
 if(e.key!=='Tab')return;
 const controls=[...el.querySelectorAll('button:not(:disabled),a[href],input:not(:disabled),select:not(:disabled)')].filter(node=>node.getClientRects().length>0);
 if(!controls.length)return;
 const first=controls[0],last=controls[controls.length-1];
 if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
 else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
});
window.addEventListener('coffee:language-change',()=>{if(!modal().hidden)close();document.getElementById('discovery-tools')?.remove();enhanceAfterRender()});
window.CoffeeExperience={t,filter:getVisibleProducts,enhanceAfterRender,priceFor,variantLabel,checkout,summary};
enhanceAfterRender();
})();