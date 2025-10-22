
document.addEventListener('DOMContentLoaded', ()=>{
  const form = document.getElementById('finForm');
  const btn = document.getElementById('btnCalc');
  const out = document.getElementById('ratio-result');

  if(btn){
    btn.addEventListener('click', async ()=>{
      const formData = new FormData(form);
      const obj = {};
      for(const [k,v] of formData.entries()) obj[k] = v.trim();
      try{
        const res = await fetch('/api/ratios/calculate', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify(obj)
        });
        const json = await res.json();
        if(json && json.success){
          const ratios = json.ratios;
          let html = '<h4>Calculated Ratios</h4><table>';
          for(const k in ratios){
            html += `<tr><td style="padding:6px 12px; font-weight:600">${k}</td><td style="padding:6px 12px">${ratios[k]}</td></tr>`;
          }
          html += '</table>';
          out.innerHTML = html;
        } else {
          out.innerText = 'Calculation failed';
        }
      }catch(e){
        console.error(e);
        out.innerText = 'Error during calc';
      }
    });
  }
});
