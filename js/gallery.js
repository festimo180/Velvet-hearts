(() => {
 const picker=document.getElementById('photoPicker'),grid=document.getElementById('memoryGrid'),status=document.getElementById('galleryStatus');
 const lightbox=document.getElementById('lightbox'),lightboxImage=document.getElementById('lightboxImage'),caption=document.getElementById('lightboxCaption');
 const close=()=>{lightbox.hidden=true;lightboxImage.removeAttribute('src');};
 document.getElementById('closeLightbox')?.addEventListener('click',close);
 lightbox?.addEventListener('click',e=>{if(e.target===lightbox)close();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
 grid?.addEventListener('click',e=>{
  const tile=e.target.closest('.memory-tile');if(!tile)return;
  const img=tile.querySelector('img');if(!img)return;
  lightboxImage.src=img.src;lightboxImage.alt=img.alt;caption.textContent=tile.dataset.caption||img.alt;lightbox.hidden=false;
 });
 picker?.addEventListener('change',()=>{
  const files=Array.from(picker.files||[]).filter(f=>f.type.startsWith('image/')).slice(0,12);
  if(!files.length){status.textContent='Choose image files to preview.';return;}
  grid.replaceChildren();
  files.forEach(file=>{
   const tile=document.createElement('button');tile.className='memory-tile has-photo';tile.dataset.caption=file.name;tile.setAttribute('aria-label','View '+file.name);
   const img=document.createElement('img');img.alt=file.name;img.src=URL.createObjectURL(file);
   img.onload=()=>URL.revokeObjectURL(img.src);
   tile.append(img);grid.append(tile);
  });
  status.textContent=files.length+' photo(s) previewed in this browser only.';
 });
})();
