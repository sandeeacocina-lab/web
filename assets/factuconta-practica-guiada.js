(() => {
  let dialog, last;
  document.addEventListener('click', (event) => {
    const link = event.target.closest && event.target.closest('a.fc-zoom');
    if (!link || event.defaultPrevented || event.button > 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || !window.HTMLDialogElement) return;
    if (!dialog) {
      dialog=document.createElement('dialog'); dialog.className='fc-modal';
      const close=document.createElement('button'); close.type='button'; const img=document.createElement('img');
      dialog.append(close,img); document.body.appendChild(dialog);
      close.addEventListener('click',()=>dialog.close());
      dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
      dialog.addEventListener('close',()=>{if(last && last.isConnected)last.focus({preventScroll:true});dialog.lastElementChild.removeAttribute('src');});
    }
    const source=link.querySelector('img'); if(!source)return;
    event.preventDefault();last=link;
    const en=(link.closest('[lang]')||document.documentElement).lang==='en';
    dialog.firstElementChild.textContent=en?'Close':'Cerrar';dialog.setAttribute('aria-label',en?'Enlarged image':'Imagen ampliada');
    dialog.lastElementChild.src=link.href;dialog.lastElementChild.alt=source.alt;
    dialog.showModal();dialog.firstElementChild.focus();
  });
})();
