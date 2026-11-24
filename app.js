// Set to the approved HTTPS server endpoint before deployment.
const API = '';
const $ = id => document.getElementById(id);
const result = $('resultContainer');
function show(message, rows=[]) {
  result.replaceChildren(); result.classList.remove('hidden');
  const card=document.createElement('div'); card.className='bg-white rounded-2xl p-5 border border-slate-200 card-shadow';
  const p=document.createElement('p'); p.textContent=message; card.append(p);
  for(const r of rows){const line=document.createElement('p'); line.className='mt-3 font-bold text-lg'; line.textContent=[r.category,r.status,r.rank?'순번 '+r.rank:''].filter(Boolean).join(' · '); card.append(line);}
  result.append(card);
}
$('searchForm').addEventListener('submit',async e=>{e.preventDefault(); if(!API){show('조회 서비스 연결 준비 중입니다.');return;} const phone=$('searchPhone').value.replace(/\D/g,''); const name=$('searchName').value.trim(); const code=$('code').value.trim(); if(!name||!/^010\d{8}$/.test(phone)||!code){show('이름, 전화번호 전체 및 조회코드를 확인해 주세요.');return;} const btn=e.target.querySelector('[type=submit]'); if(btn)btn.disabled=true; try{const r=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,phone,code,category:$('searchCategory').value}),cache:'no-store',credentials:'omit'}); if(r.status===429){show('잠시 후 다시 조회해 주세요.');return;} if(!r.ok)throw Error(); const data=await r.json(); show(data.results.length?'추첨 결과':'일치하는 조회 결과가 없습니다.',data.results);}catch{show('조회 서비스에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.');}finally{if(btn)btn.disabled=false;}});
$('resetSearchBtn').addEventListener('click',()=>{$('searchForm').reset();result.replaceChildren();result.classList.add('hidden');});
