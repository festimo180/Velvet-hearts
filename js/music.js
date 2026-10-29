(() => {
 const cards=document.querySelectorAll('.track-card');
 cards.forEach(card=>{
  const frame=card.querySelector('iframe');
  if(!frame)return;
  frame.addEventListener('load',()=>card.classList.add('player-ready'),{once:true});
 });
})();
