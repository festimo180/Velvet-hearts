(() => {
 const $=id=>document.getElementById(id);
 const intro=$('intro');
 function enter(){intro.classList.add('done');document.body.classList.add('experience-started');}
 $('enterExperience')?.addEventListener('click',enter);
 $('skipIntro')?.addEventListener('click',enter);
 $('menuToggle')?.addEventListener('click',()=>{
  const nav=$('navigation'),open=nav.classList.toggle('open');
  $('menuToggle').setAttribute('aria-expanded',String(open));
  $('menuToggle').setAttribute('aria-label',open?'Close navigation':'Open navigation');
  $('menuToggle').textContent=open?'×':'☰';
 });
 document.querySelectorAll('.navigation a').forEach(a=>a.addEventListener('click',()=>{
  $('navigation').classList.remove('open');$('menuToggle').setAttribute('aria-expanded','false');$('menuToggle').textContent='☰';
 }));
 $('themeToggle')?.addEventListener('click',()=>{
  document.body.classList.toggle('light-mode');
  $('themeToggle').textContent=document.body.classList.contains('light-mode')?'☾':'☼';
 });
 const progress=$('readingProgress');
 function scrollProgress(){const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?scrollY/max*100:0)+'%';}
 addEventListener('scroll',scrollProgress,{passive:true});scrollProgress();
 const revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{
  if(e.isIntersecting){e.target.classList.add('visible');revealObserver.unobserve(e.target);}
 }),{threshold:.12});
 document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));
 $('openLetter')?.addEventListener('click',()=>{
  const msg=$('letterMessage');msg.hidden=false;$('openLetter').textContent='♡ Your letter is open';msg.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'nearest'});
 });
 $('closeLetter')?.addEventListener('click',()=>{$('letterMessage').hidden=true;$('openLetter').textContent='Open your letter ♡';});
 const date=$('specialDate');let countdownTimer;
 date?.addEventListener('change',()=>{
  clearInterval(countdownTimer);tickCountdown();countdownTimer=setInterval(tickCountdown,1000);
 });
 function tickCountdown(){
  if(!date?.value)return;
  const target=new Date(date.value).getTime(),diff=target-Date.now();
  if(!Number.isFinite(target))return;
  if(diff<=0){['days','hours','minutes','seconds'].forEach(id=>$(id).textContent='00');$('countdownMessage').textContent='Your special moment is here. ♡';clearInterval(countdownTimer);return;}
  const units=[Math.floor(diff/86400000),Math.floor(diff%86400000/3600000),Math.floor(diff%3600000/60000),Math.floor(diff%60000/1000)];
  ['days','hours','minutes','seconds'].forEach((id,i)=>$(id).textContent=String(units[i]).padStart(2,'0'));
  $('countdownMessage').textContent='Every second brings it a little closer.';
 }
 if(date){date.min=new Date(Date.now()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,16);}
 const thoughts=['You deserve little reasons to smile.','Some memories become favourite stories.','Kindness makes ordinary days beautiful.','Good things are worth waiting for.','You found one of the little surprises. ♡','May life always leave room for wonder.','You are allowed to enjoy the small things.','Every chapter has something new to offer.'];
 $('starField')?.addEventListener('click',e=>{
  const star=e.target.closest('button');if(!star)return;
  $('starMessage').textContent=thoughts[Math.floor(Math.random()*thoughts.length)];
  star.animate([{transform:'scale(1)'},{transform:'scale(1.55)'},{transform:'scale(1)'}],{duration:420});
 });
 const form=$('nameForm'),question=$('questionArea'),result=$('resultArea');
 form?.addEventListener('submit',e=>{
  e.preventDefault();const name=$('visitorName').value.trim();if(!name)return;
  $('personalTitle').textContent='Alright, '+name+'...';
  form.hidden=true;question.hidden=false;$('formNotice').textContent='';
  question.scrollIntoView({behavior:'smooth',block:'center'});
 });
 function finish(answer){
  const name=$('visitorName').value.trim()||'darling';question.hidden=true;result.hidden=false;
  if(answer==='yes'){$('resultTitle').textContent='A little plot twist, '+name+'!';$('resultMessage').textContent='You said yes! ❤️ This was a playful surprise made for a smile.';}
  else{$('resultTitle').textContent='Got you, '+name+'!';$('resultMessage').textContent='No pressure, no hard feelings — just a little playful surprise. Hope it made you smile. 💌';}
  result.scrollIntoView({behavior:'smooth',block:'center'});
 }
 $('yesButton')?.addEventListener('click',()=>finish('yes'));
 $('noButton')?.addEventListener('click',()=>finish('no'));
 $('replayButton')?.addEventListener('click',()=>{
  result.hidden=true;question.hidden=true;form.hidden=false;form.reset();$('formNotice').textContent='';
  $('finale').scrollIntoView({behavior:'smooth',block:'start'});
 });
 const toast=$('toast');let toastTimeout;
 function showToast(message){toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>toast.classList.remove('show'),2600);}
 $('shareButton')?.addEventListener('click',async()=>{
  const data={title:document.title,text:'A little cinematic surprise from Velvet Hearts.',url:location.href};
  try{if(navigator.share)await navigator.share(data);else if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(location.href);showToast('Website link copied. Share it with someone special.');}else showToast('Copy the website address from your browser to share it.');}
  catch(e){if(e.name!=='AbortError')showToast('Copy the website address from your browser to share it.');}
 });
 $('year').textContent=new Date().getFullYear();
})();
