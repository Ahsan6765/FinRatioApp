
document.addEventListener('DOMContentLoaded', ()=>{
  // Example: fetch macro data and fill dashboard cards
  fetch('/api/macro').then(r=>r.json()).then(data=>{
    if(!data) return;
    document.getElementById('kse')?.innerText = data.kse_index || '--';
    document.getElementById('policy')?.innerText = data.policy_rate ? data.policy_rate + '%' : '--';
    document.getElementById('inflation')?.innerText = data.inflation || '--';
    document.getElementById('fx')?.innerText = data.exchange_rate || '--';
  }).catch(err=>console.warn('Macro fetch failed', err));

  // Company fetch on company page
  const btn = document.getElementById('btnFetch');
  if(btn){
    btn.addEventListener('click', ()=>{
      const ticker = document.getElementById('ticker').value.trim();
      if(!ticker) return alert('Enter ticker');
      fetch('/api/company/' + ticker).then(r=>r.json()).then(json=>{
        const el = document.getElementById('company-result');
        if(json && json.name){
          el.innerHTML = '<h3>' + json.name + ' ('+json.ticker+')</h3><pre>' + JSON.stringify(json, null, 2) + '</pre>';
        } else {
          el.innerText = 'Not found';
        }
      }).catch(err=>{
        console.error(err);
        alert('Error fetching company');
      });
    });
  }
});
