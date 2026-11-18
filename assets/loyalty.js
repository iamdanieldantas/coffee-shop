/* Loyalty concept only: simulated stamps, no real purchases or rewards. */
(()=>{
'use strict';
const messages={
 pt:{eyebrow:'FIDELIDADE · DEMONSTRAÇÃO',title:'Cada pausa merece voltar.',desc:'Explore como poderia funcionar nosso futuro programa de fidelidade. Este cartão é apenas uma simulação neste dispositivo; nenhum selo corresponde a uma compra real ou garante recompensa.',stamps:'selos de demonstração',add:'Simular um selo',reset:'Reiniciar simulação',max:'Simulação completa! O benefício ainda não está disponível.'},
 en:{eyebrow:'LOYALTY · DEMO',title:'Every coffee break is worth repeating.',desc:'Preview how our future loyalty card could work. This is an on-device demo only: stamps are not real purchases and do not grant rewards.',stamps:'demo stamps',add:'Try a stamp',reset:'Reset demo',max:'Demo complete! No reward is available yet.'},
 es:{eyebrow:'FIDELIDAD · DEMOSTRACIÓN',title:'Cada pausa merece repetirse.',desc:'Mirá cómo podría funcionar nuestro futuro programa de fidelidad. Esta tarjeta es solo una demostración en tu dispositivo: los sellos no representan compras reales ni dan premios.',stamps:'sellos de prueba',add:'Simular un sello',reset:'Reiniciar',max:'¡Simulación completa! El beneficio todavía no está disponible.'}
};
const key='coffeehouse-demo-stamps-v1';let n=0;
try{const value=Number(localStorage.getItem(key));if(Number.isInteger(value)&&value>=0&&value<=10)n=value}catch(_){}
function tr(id){return (messages[window.CoffeeI18n.getLocale()]||messages.pt)[id]}
function draw(){
 const holder=document.getElementById('loyalty-card');if(!holder)return;
 holder.innerHTML='<div class="loyalty-intro"><p class="about-eyebrow">'+tr('eyebrow')+'</p><h2 class="serif">'+tr('title')+'</h2><p>'+tr('desc')+'</p></div><div class="loyalty-progress"><div class="loyalty-stamps" role="img" aria-label="'+n+' de 10 '+tr('stamps')+'">'+Array.from({length:10},(_,i)=>'<span class="'+(i<n?'filled':'')+'" aria-hidden="true">☕</span>').join('')+'</div><strong>'+n+' / 10 '+tr('stamps')+'</strong><div class="loyalty-actions"><button type="button" data-demo-stamp '+(n>=10?'disabled':'')+'>'+tr('add')+'</button><button type="button" data-demo-reset>'+tr('reset')+'</button></div><p class="loyalty-feedback" role="status">'+(n===10?tr('max'):'')+'</p></div>';
}
document.addEventListener('click',event=>{
 if(event.target.closest('[data-demo-stamp]')){n=Math.min(10,n+1);try{localStorage.setItem(key,n)}catch(_){}draw()}
 if(event.target.closest('[data-demo-reset]')){n=0;try{localStorage.removeItem(key)}catch(_){}draw()}
});
window.addEventListener('coffee:language-change',draw);
draw();
})();
