/* Protected Supabase catalog editor. No tokens are stored on disk or browser storage. */
(()=>{
'use strict';
const cfg=window.COFFEE_LIKES_CONFIG||{};
const base=String(cfg.supabaseUrl||'').replace(/\/+$/,'');
const apiKey=String(cfg.publishableKey||'');
const ok=/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(base)&&apiKey.startsWith('sb_publishable_');
const form=document.getElementById('admin-editor');
const status=document.getElementById('admin-status');
let token=null,products=[],currentId=null,likes={};
function message(text){status.textContent=text}
function field(k){return form.elements.namedItem(k)}
function request(path,{method='GET',body,auth=token,headers={}}={}){
 const opts={method,headers:{apikey:apiKey,accept:'application/json',...headers}};
 if(auth)opts.headers.authorization='Bearer '+auth;
 if(body!==undefined){opts.headers['content-type']='application/json';opts.body=JSON.stringify(body)}
 return fetch(base+path,opts).then(async response=>{
  let data=null;try{const txt=await response.text();data=txt?JSON.parse(txt):null}catch(_){}
  if(!response.ok)throw new Error(data?.message||data?.error_description||('HTTP '+response.status));
  return data;
 });
}
function fill(item){
 currentId=item?.product_id||null;form.reset();
 field('product_id').value=item?.product_id||'';
 field('product_id').readOnly=!!item;
 field('price_brl').value=item?(item.price_cents/100).toFixed(2):'';
 field('category').value=item?.category||'bebidas';
 field('image_key').value=item?.image_key||'croissant';
 for(const loc of ['pt','en','es']){
  field('name_'+loc).value=item?.['name_'+loc]||'';
  field('desc_'+loc).value=item?.['desc_'+loc]||'';
 }
 field('active').checked=item?.active!==false;
 document.querySelectorAll('#admin-list button').forEach(b=>b.setAttribute('aria-current',String(b.dataset.productId===currentId)));
}
function showList(){
 const list=document.getElementById('admin-list');list.replaceChildren();
 products.forEach(p=>{
  const button=document.createElement('button');
  button.type='button';button.dataset.productId=p.product_id;
  button.textContent=p.name_pt+' · '+(p.price_cents/100).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})+(p.active?'':' (indisponível)')+' · '+(likes[p.product_id]||0)+' ♥';
  button.addEventListener('click',()=>fill(p));
  list.appendChild(button);
 });
}
async function refresh(){
 if(!token)return;
 const rows=await request('/rest/v1/coffee_catalog?select=*&order=product_id.asc');
 if(!Array.isArray(rows))throw new Error('Catálogo indisponível');
 products=rows;
 try {
  const totals=await request('/rest/v1/rpc/coffee_likes_snapshot',{method:'POST',body:{}});
  likes=Object.fromEntries((totals||[]).map(t=>[t.product_id,t.likes]));
 }catch(_){likes={}}
 document.getElementById('admin-analytics').textContent=products.length+' produtos · '+products.filter(x=>x.active).length+' disponíveis · '+Object.values(likes).reduce((a,b)=>a+Number(b||0),0)+' curtidas';
 showList();fill(products.find(p=>p.product_id===currentId)||products[0]||null);
}
async function login(event){
 event.preventDefault();
 if(!ok){message('Conexão com Supabase não configurada.');return}
 const email=document.getElementById('admin-email').value.trim();
 const password=document.getElementById('admin-password').value;
 try{
  message('Verificando acesso…');
  const session=await request('/auth/v1/token?grant_type=password',{method:'POST',body:{email,password},auth:null});
  const candidate=session?.access_token;
  if(!candidate)throw new Error('Sessão inválida');
  const allowed=await request('/rest/v1/rpc/coffee_admin_whoami',{method:'POST',body:{},auth:candidate});
  if(allowed!==true)throw new Error('Esta conta ainda não foi autorizada como administradora.');
  token=candidate;document.getElementById('admin-password').value='';
  document.getElementById('admin-login').hidden=true;
  document.getElementById('admin-workspace').hidden=false;
  await refresh();message('Acesso autorizado. As alterações são salvas diretamente no catálogo.');
 }catch(err){token=null;message(err.message||'Não foi possível autenticar.')}
}
async function save(event){
 event.preventDefault();
 if(!token){message('Sessão não autorizada.');return}
 const id=field('product_id').value.trim();
 if(!/^[a-z][a-z0-9-]{1,39}$/.test(id)){message('ID do produto inválido.');return}
 const price_cents=Math.round(Number(field('price_brl').value)*100);
 if(!Number.isInteger(price_cents)||price_cents<100||price_cents>100000){message('Preço deve estar entre R$ 1,00 e R$ 1.000,00.');return}
 const item={product_id:id,price_cents,category:field('category').value,image_key:field('image_key').value,active:field('active').checked};
 for(const loc of ['pt','en','es']){
  item['name_'+loc]=field('name_'+loc).value.trim();
  item['desc_'+loc]=field('desc_'+loc).value.trim();
  if(!item['name_'+loc]||!item['desc_'+loc]||/[<>]/.test(item['name_'+loc]+item['desc_'+loc])){message('Preencha as traduções sem caracteres HTML.');return}
 }
 try {
  message('Salvando no banco…');
  const exists=products.some(p=>p.product_id===id);
  const data={...item};if(exists)delete data.product_id;
  await request(exists?'/rest/v1/coffee_catalog?product_id=eq.'+encodeURIComponent(id):'/rest/v1/coffee_catalog',
   {method:exists?'PATCH':'POST',body:exists?data:item,headers:{Prefer:'return=representation'}});
  currentId=id;await refresh();message('Produto salvo com sucesso.');
 }catch(err){message(err.message||'Não foi possível salvar o produto.')}
}
document.getElementById('admin-login-form').addEventListener('submit',login);
form.addEventListener('submit',save);
document.getElementById('admin-new').addEventListener('click',()=>fill(null));
document.getElementById('admin-refresh').addEventListener('click',()=>refresh().catch(err=>message(err.message)));
document.getElementById('admin-logout').addEventListener('click',()=>{
 token=null;products=[];currentId=null;likes={};
 document.getElementById('admin-workspace').hidden=true;
 document.getElementById('admin-login').hidden=false;
 document.getElementById('admin-login-form').reset();
 message('Sessão encerrada. Nenhum token foi armazenado no navegador.');
});
if(!ok)message('Supabase não configurado.');
})();
