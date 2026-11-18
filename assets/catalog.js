/* Public editable catalog mirror. Static data remains as offline/demo fallback. */
(()=>{
 'use strict';
 const raw=window.COFFEE_LIKES_CONFIG||{};
 const origin=String(raw.supabaseUrl||'').replace(/\/+$/,'');
 const key=String(raw.publishableKey||'');
 const valid=/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(origin)&&key.startsWith('sb_publishable_');
 const allowedImages=new Set(Object.keys(IMAGES));
 const allowedCats=new Set(['bebidas','padaria','doces','salgados']);
 const catalog=new Map();
 const safe=s=>String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
 function record(row){
  if(!row || !/^[a-z][a-z0-9-]{1,39}$/.test(row.product_id)||!allowedCats.has(row.category)||!allowedImages.has(row.image_key))return null;
  const price=Number(row.price_cents);
  if(!Number.isInteger(price)||price<100||price>100000)return null;
  for(const loc of ['pt','en','es'])if(!row['name_'+loc]||!row['desc_'+loc])return null;
  return { ...row, price_cents:price };
 }
 function nameFor(id){
  const row=catalog.get(id);if(!row)return null;
  const locale=window.CoffeeI18n.getLocale();
  return {name:safe(row['name_'+locale]),desc:safe(row['desc_'+locale])};
 }
 function status(){return catalog.size?'live':'fallback'}
 async function load(){
  if(!valid)return false;
  try {
   const resp=await fetch(origin+'/rest/v1/coffee_catalog?select=product_id,category,image_key,price_cents,name_pt,name_en,name_es,desc_pt,desc_en,desc_es,active&active=eq.true&order=product_id.asc',{headers:{apikey:key,accept:'application/json'},cache:'no-store'});
   if(!resp.ok)throw Error('catalog not available');
   const rows=await resp.json();if(!Array.isArray(rows))throw Error('invalid catalog');
   const map=new Map(rows.map(row=>record(row)).filter(Boolean).map(row=>[row.product_id,row]));
   if(map.size===0)throw Error('catalog empty');
   catalog.clear();
   for(const [id,row] of map)catalog.set(id,row);
   for(const p of PRODUCTS){
    const row=map.get(p.id);
    p.available=!!row;
    if(row){p.price=row.price_cents;p.category=row.category;p.img=row.image_key}
   }
   for(const [id,row] of map){
    if(!PRODUCTS.some(p=>p.id===id))PRODUCTS.push({id,name:row.name_pt,desc:row.desc_pt,price:row.price_cents,category:row.category,img:row.image_key,available:true});
   }
   window.COFFEE_PRODUCT_IDS=PRODUCTS.filter(p=>p.available!==false).map(p=>p.id);
   renderMenu();renderFeatured();renderOrders();
   window.dispatchEvent(new CustomEvent('coffee:catalog-loaded',{detail:{count:map.size}}));
   return true;
  } catch(_) { return false; } // Offline fallback, never block browsing.
 }
 window.CoffeeCatalog={load,nameFor,status};
 load();
})();
