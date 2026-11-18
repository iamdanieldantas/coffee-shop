/* Keyboard shortcut to the current page's content, without changing routes. */
(()=>{
 'use strict';
 const link=document.querySelector('.skip-link');
 if(!link)return;
 link.addEventListener('click',event=>{
  event.preventDefault();
  const heading=document.querySelector('.screen.active h1');
  if(!heading)return;
  heading.setAttribute('tabindex','-1');
  heading.focus({preventScroll:true});
  heading.scrollIntoView({block:'start',behavior:'instant'});
 });
})();
