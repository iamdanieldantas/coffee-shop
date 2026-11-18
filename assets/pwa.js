/* Install only in secure contexts; feature detection for iOS/Android. */
if('serviceWorker' in navigator){
 window.addEventListener('load',()=>{
  navigator.serviceWorker.register('./sw.js',{scope:'./'}).catch(()=>{/* Browsing still works online. */});
 });
}
