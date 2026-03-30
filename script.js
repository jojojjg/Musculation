const STORAGE_KEY='workout-tracker-static-v5';
const defaultPlans={training1:{name:'Entraînement 1',blocks:[{key:'A',label:'Bloc A',type:'Circuit',tours:3,exercises:[{id:'t1e1',order:1,name:'Chest Press',substitution:'Pompes au sol',muscle:'Pectoraux / Triceps',targetReps:10,plannedWeight:'25–30kg'},{id:'t1e2',order:2,name:'Tirage vertical',substitution:'Tractions assistées / élastique',muscle:'Dos / Biceps',targetReps:10,plannedWeight:'30–35kg'},{id:'t1e3',order:3,name:'Presse à cuisses',substitution:'Squat poids du corps / goblet squat',muscle:'Quadriceps / Fessiers',targetReps:10,plannedWeight:'70–80kg'}]},{key:'B',label:'Bloc B',type:'Circuit',tours:3,exercises:[{id:'t1e4',order:1,name:'Rowing poulie basse',substitution:'Rowing haltères / élastique',muscle:'Dos milieu / Biceps / Posture',targetReps:10,plannedWeight:'25–30kg'},{id:'t1e5',order:2,name:'Oiseau (reverse fly)',substitution:'Élévations arrière haltères',muscle:'Arrière épaules / Haut du dos',targetReps:15,plannedWeight:'5–8kg'},{id:'t1e6',order:3,name:'Curl biceps poulie basse',substitution:'Curl haltères',muscle:'Biceps / Avant-bras',targetReps:12,plannedWeight:'10–12kg'}]},{key:'FIN',label:'Finition',type:'Fin',tours:2,exercises:[{id:'t1e7',order:1,name:'Gainage',substitution:'Planche classique',muscle:'Abdos profonds / Gainage',targetReps:30,unit:'sec',plannedWeight:'sec'}]}]},training2:{name:'Entraînement 2',blocks:[{key:'A',label:'Bloc A',type:'Circuit',tours:3,exercises:[{id:'t2e1',order:1,name:'Leg Curl',substitution:'Pont fessier / leg curl swiss ball',muscle:'Ischios / Arrière cuisses',targetReps:12,plannedWeight:'20–25kg'},{id:'t2e2',order:2,name:'Chest Press',substitution:'Pompes au sol',muscle:'Pectoraux / Triceps',targetReps:10,plannedWeight:'25–30kg'},{id:'t2e3',order:3,name:'Tirage vertical',substitution:'Tractions assistées / élastique',muscle:'Dos / Biceps',targetReps:10,plannedWeight:'30–35kg'}]},{key:'B',label:'Bloc B',type:'Circuit',tours:3,exercises:[{id:'t2e4',order:1,name:'Triceps poulie',substitution:'Dips banc / extension haltère',muscle:'Triceps',targetReps:12,plannedWeight:'12–15kg'},{id:'t2e5',order:2,name:'Curl biceps poulie basse',substitution:'Curl haltères',muscle:'Biceps / Avant-bras',targetReps:12,plannedWeight:'10–15kg'},{id:'t2e6',order:3,name:'Gainage',substitution:'Planche classique',muscle:'Abdos profonds / Gainage',targetReps:30,unit:'sec',plannedWeight:'sec'}]}]},training3:{name:'Entraînement 3',blocks:[{key:'A',label:'Bloc A',type:'Circuit',tours:3,exercises:[{id:'t3e1',order:1,name:'Presse à cuisses',substitution:'Squat poids du corps / goblet squat',muscle:'Quadriceps / Fessiers',targetReps:10,plannedWeight:'70–80kg'},{id:'t3e2',order:2,name:'Rowing poulie basse',substitution:'Rowing haltères / élastique',muscle:'Dos milieu / Biceps / Posture',targetReps:10,plannedWeight:'25–30kg'},{id:'t3e3',order:3,name:'Pec Fly',substitution:'Écarté haltères',muscle:'Pectoraux',targetReps:12,plannedWeight:'20–25kg'}]},{key:'B',label:'Bloc B',type:'Circuit',tours:3,exercises:[{id:'t3e4',order:1,name:'Tirage vertical',substitution:'Tractions assistées / élastique',muscle:'Dos / Biceps',targetReps:10,plannedWeight:'30–35kg'},{id:'t3e5',order:2,name:'Oiseau',substitution:'Élévations arrière haltères',muscle:'Arrière épaules / Haut du dos',targetReps:15,plannedWeight:'5–8kg'},{id:'t3e6',order:3,name:'Curl marteau poulie',substitution:'Curl marteau haltères',muscle:'Biceps / Brachial / Avant-bras',targetReps:12,plannedWeight:'10–12kg'}]},{key:'FIN',label:'Finition',type:'Fin',tours:2,exercises:[{id:'t3e7',order:1,name:'Mollets',substitution:'Mollets debout poids du corps',muscle:'Mollets',targetReps:15,plannedWeight:'30–40kg'}]}]}};
const defaultLibrary=[
{id:'lib_1',name:'Chest Press',muscle:'Pectoraux / Triceps',substitution:'Pompes au sol',targetReps:'10',plannedWeight:'25–30kg',type:'strength'},
{id:'lib_2',name:'Tirage vertical',muscle:'Dos / Biceps',substitution:'Tractions assistées / élastique',targetReps:'10',plannedWeight:'30–35kg',type:'strength'},
{id:'lib_3',name:'Presse à cuisses',muscle:'Quadriceps / Fessiers',substitution:'Squat poids du corps / goblet squat',targetReps:'10',plannedWeight:'70–80kg',type:'strength'},
{id:'lib_4',name:'Course',muscle:'Cardio',substitution:'Vélo / elliptique',targetReps:'35 min',plannedWeight:'6 km',type:'cardio'}
];
const initialState={selectedTraining:'training1',plans:defaultPlans,currentEntries:{},history:[],timerSeconds:60,calendarYear:(new Date()).getFullYear(),calendarMonth:(new Date()).getMonth(),selectedCalendarDate:null,theme:'light',library:defaultLibrary};
function todayKey(date=new Date()){const local=new Date(date);local.setMinutes(local.getMinutes()-local.getTimezoneOffset());return local.toISOString().slice(0,10)}
function formatDateFr(dateStr){return new Date(dateStr).toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit',year:'numeric'})}
function formatCalendarDate(date){return date.toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit'})}
function loadState(){try{const raw=localStorage.getItem(STORAGE_KEY);return raw?{...initialState,...JSON.parse(raw)}:initialState}catch{return initialState}}
let state=loadState();document.documentElement.setAttribute('data-theme',state.theme||'light');let timerInterval=null;let timerRemaining=state.timerSeconds||60;let audioContext=null;
function saveState(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}
function setState(updater){state=typeof updater==='function'?updater(state):updater;saveState();render()}
function patchStateOnly(updater){
  state=typeof updater==='function'?updater(state):updater;
  saveState();
}
function bestLoggedExercise(){const counts={};state.history.forEach(s=>s.exercises.forEach(ex=>counts[ex.name]=(counts[ex.name]||0)+1));const best=Object.entries(counts).sort((a,b)=>b[1]-a[1])[0];return best?`${best[0]} (${best[1]})`:'Aucune donnée'}
function completionMap(){const map={};state.history.forEach(item=>{map[item.date]=(map[item.date]||0)+1});return map}
function findPreviousExerciseData(exId){for(const session of state.history){const found=session.exercises.find(ex=>ex.id===exId);if(found){return found}}return null}
function getExerciseHistory(exId){const rows=[];for(let i=state.history.length-1;i>=0;i--){const session=state.history[i];const found=session.exercises.find(ex=>ex.id===exId);if(found){rows.push({date:session.date,usedWeight:Number(found.usedWeight||0),totalReps:Number(found.totalReps||0)})}}return rows}
function findPreviousWeight(exId){const found=findPreviousExerciseData(exId);return found&&found.usedWeight?found.usedWeight:null}
function flattenExercises(plan){return plan.blocks.flatMap(b=>b.exercises)}
function syncTheme(){document.documentElement.setAttribute('data-theme',state.theme||'light');const sel=document.getElementById('themeSelect');if(sel)sel.value=state.theme||'light'}
function populateTrainingManagers(){
  const mgr=document.getElementById('trainingManagerSelect');
  const builder=document.getElementById('builderTrainingSelect');
  const creator=document.getElementById('newTrainingExerciseSelect');
  const currentMgr=(mgr&&mgr.value)||state.selectedTraining;
  if(mgr){
    mgr.innerHTML='';
    Object.entries(state.plans).forEach(([key,plan])=>{const opt=document.createElement('option');opt.value=key;opt.textContent=plan.name;mgr.appendChild(opt)});
    mgr.value=state.plans[currentMgr]?currentMgr:state.selectedTraining;
  }
  const currentBuilder=(builder&&builder.value)||state.selectedTraining;
  if(builder){
    builder.innerHTML='';
    Object.entries(state.plans).forEach(([key,plan])=>{const opt=document.createElement('option');opt.value=key;opt.textContent=plan.name;builder.appendChild(opt)});
    builder.value=state.plans[currentBuilder]?currentBuilder:state.selectedTraining;
  }
  if(creator){
    const currentCreator=creator.value||'';
    creator.innerHTML='<option value="">Aucun exercice</option>';
    (state.library||[]).forEach(ex=>{const opt=document.createElement('option');opt.value=ex.id;opt.textContent=`${ex.name} — ${ex.type==='cardio'?'Cardio':'Musculation'}`;creator.appendChild(opt)});
    if(currentCreator && [...creator.options].some(o=>o.value===currentCreator)){creator.value=currentCreator;}
  }
}
function populateLibrarySelect(){
  const sel=document.getElementById('builderExerciseSelect');
  if(!sel) return;
  const current=sel.value;
  sel.innerHTML='';
  (state.library||[]).forEach(ex=>{const opt=document.createElement('option');opt.value=ex.id;opt.textContent=`${ex.name} — ${ex.type==='cardio'?'Cardio':'Musculation'}`;sel.appendChild(opt)});
  if(current && [...sel.options].some(o=>o.value===current)) sel.value=current;
}
function renderLibraryList(){
  const list=document.getElementById('libraryList');
  if(!list) return;
  list.innerHTML='';
  (state.library||[]).forEach(ex=>{
    const card=document.createElement('div');
    card.className='history-card';
    card.innerHTML=`<div class="history-top"><div><div class="history-title">${ex.name}</div><div class="small-text">${ex.type==='cardio'?'Cardio':'Musculation'} • ${ex.muscle}</div></div></div><div class="history-exercises"><div class="history-exercise"><span>Objectif</span><span>${ex.targetReps}</span></div><div class="history-exercise"><span>Charge / distance</span><span>${ex.plannedWeight}</span></div><div class="history-exercise"><span>Substitution</span><span>${ex.substitution||'—'}</span></div></div>`;
    list.appendChild(card);
  });
}
function renderDashboard(){const map=completionMap();const now=new Date();document.getElementById('statTotalSessions').textContent=state.history.length;document.getElementById('statMonthSessions').textContent=state.history.filter(h=>{const d=new Date(h.date);return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear()}).length;document.getElementById('statLastSession').textContent=state.history[0]?.date?formatDateFr(state.history[0].date):'Aucune';document.getElementById('statBestExercise').textContent=bestLoggedExercise();document.getElementById('summaryTraining').textContent=state.plans[state.selectedTraining].name;document.getElementById('summaryExerciseCount').textContent=flattenExercises(state.plans[state.selectedTraining]).length;document.getElementById('summaryDays').textContent=Object.keys(map).length;document.getElementById('summaryToday').textContent=todayKey()}
function renderTrainingSelectors(){populateTrainingManagers();document.getElementById('trainingSelect').value=state.selectedTraining;document.getElementById('selectedTrainingTitle').textContent=state.plans[state.selectedTraining].name;syncTheme()}
function renderTimer(){const min=String(Math.floor(timerRemaining/60)).padStart(2,'0');const sec=String(timerRemaining%60).padStart(2,'0');document.getElementById('timerDisplay').textContent=`${min}:${sec}`}
function renderExercises(){const plan=state.plans[state.selectedTraining];const container=document.getElementById('exerciseList');container.innerHTML='';plan.blocks.forEach(block=>{const blockEl=document.createElement('div');blockEl.className='block-card';blockEl.innerHTML=`<div class="block-title-row"><div><h3 class="block-title">${block.label}</h3><div class="block-subtitle">${block.type} • ${block.tours} tour${block.tours>1?'s':''}</div></div><span class="block-badge">${block.key}</span></div><div class="block-exercises"></div>`;const list=blockEl.querySelector('.block-exercises');block.exercises.forEach(ex=>{const current=state.currentEntries[ex.id]||{};const prevWeight=findPreviousWeight(ex.id);const prevData=findPreviousExerciseData(ex.id);const oldRepsLine=prevData?`<div class="old-reps">Anciennes reps : T1 ${prevData.s1reps||0} • T2 ${prevData.s2reps||0} • T3 ${prevData.s3reps||0}</div>`:'';let seriesHtml='';for(let i=1;i<=block.tours;i++){seriesHtml+=`<div class="series-row"><label class="checkbox-wrap"><input type="checkbox" class="series-check" data-series="${i}" ${current[`s${i}done`]?'checked':''}><span class="series-label">Tour ${i}</span></label><input class="input series-reps" data-series="${i}" type="number" placeholder="${ex.unit||'reps'}" value="${current[`s${i}reps`]??''}"></div>`}const weightLine=prevWeight!==null?`<div class="exercise-meta">Poids de référence : ${prevWeight} kg</div>`:`<div class="exercise-meta">Poids prévu : ${ex.plannedWeight}</div>`;const card=document.createElement('div');card.className='exercise-card';card.innerHTML=`<div class="exercise-main"><div class="exercise-top"><h3>${block.key} • ${ex.order} • ${ex.name}</h3><span class="badge">${ex.muscle}</span></div><div class="exercise-meta">Objectif : ${ex.targetReps} ${ex.unit||'reps'}</div>${weightLine}<div class="exercise-old-weight">Ancien poids : ${prevWeight!==null?prevWeight+' kg':'—'}</div>${oldRepsLine}<div class="exercise-substitution">Substitution : ${ex.substitution}</div></div><div class="series-grid">${seriesHtml}</div><div class="field-group"><label class="field-label">Nouveau poids utilisé</label><input class="input used-weight" type="number" step="0.5" placeholder="kg" value="${current.usedWeight??''}"></div>`;card.querySelectorAll('.series-check').forEach(el=>el.addEventListener('change',e=>{const s=e.target.dataset.series;setState(prev=>({...prev,currentEntries:{...prev.currentEntries,[ex.id]:{...(prev.currentEntries[ex.id]||{}),[`s${s}done`]:e.target.checked}}}))}));card.querySelectorAll('.series-reps').forEach(el=>el.addEventListener('input',e=>{const s=e.target.dataset.series;patchStateOnly(prev=>({...prev,currentEntries:{...prev.currentEntries,[ex.id]:{...(prev.currentEntries[ex.id]||{}),[`s${s}reps`]:e.target.value}}}))}));card.querySelector('.used-weight').addEventListener('input',e=>patchStateOnly(prev=>({...prev,currentEntries:{...prev.currentEntries,[ex.id]:{...(prev.currentEntries[ex.id]||{}),usedWeight:e.target.value}}})));list.appendChild(card)});container.appendChild(blockEl)})}
function renderCalendar(){const grid=document.getElementById('calendarGrid');const weekdays=document.getElementById('calendarWeekdays');const title=document.getElementById('calendarMonthTitle');grid.innerHTML='';weekdays.innerHTML='';grid.classList.add('month-view');const weekdayNames=['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];weekdayNames.forEach(name=>{const el=document.createElement('div');el.className='calendar-weekday';el.textContent=name;weekdays.appendChild(el)});const map=completionMap();const year=state.calendarYear;const month=state.calendarMonth;const firstDay=new Date(year,month,1);const lastDay=new Date(year,month+1,0);title.textContent=firstDay.toLocaleDateString('fr-FR',{month:'long',year:'numeric'});let startOffset=(firstDay.getDay()+6)%7;for(let i=0;i<startOffset;i++){const empty=document.createElement('div');empty.className='calendar-day empty';grid.appendChild(empty)}const today=todayKey();for(let dayNum=1;dayNum<=lastDay.getDate();dayNum++){const d=new Date(year,month,dayNum);const key=todayKey(d);const count=map[key]||0;const level=count>=3?'level-3':count===2?'level-2':count===1?'level-1':'level-0';const day=document.createElement('div');day.className='calendar-day'+(key===today?' today':'');day.innerHTML=`<div class="calendar-cell ${level}" title="${formatDateFr(key)} • ${count} séance(s)"></div><div class="calendar-label">${formatCalendarDate(d)}</div>`;day.addEventListener('click',()=>setState(prev=>({...prev,selectedCalendarDate:key})));grid.appendChild(day)}renderCalendarDayDetails()} 
function populateChartExerciseSelect(){const select=document.getElementById('chartExerciseSelect');if(!select)return;const exercises=flattenExercises(state.plans.training1).concat(flattenExercises(state.plans.training2),flattenExercises(state.plans.training3));const unique=[];const seen=new Set();for(const ex of exercises){if(!seen.has(ex.id)){seen.add(ex.id);unique.push(ex)}}const current=select.value;select.innerHTML='';unique.forEach(ex=>{const opt=document.createElement('option');opt.value=ex.id;opt.textContent=ex.name;select.appendChild(opt)});if(current&&[...select.options].some(o=>o.value===current)){select.value=current}}
function renderProgressChart(){const canvas=document.getElementById('progressChart');const select=document.getElementById('chartExerciseSelect');if(!canvas||!select)return;const ctx=canvas.getContext('2d');const history=getExerciseHistory(select.value);const w=canvas.width=canvas.clientWidth*window.devicePixelRatio;const h=canvas.height=220*window.devicePixelRatio;ctx.scale(window.devicePixelRatio,window.devicePixelRatio);ctx.clearRect(0,0,canvas.clientWidth,220);ctx.fillStyle='#ffffff';ctx.fillRect(0,0,canvas.clientWidth,220);ctx.strokeStyle='#e2e8f0';ctx.strokeRect(0,0,canvas.clientWidth,220);ctx.fillStyle='#64748b';ctx.font='12px sans-serif';if(history.length===0){ctx.fillText('Aucune donnée pour cet exercice.',16,30);return}const pad={l:40,r:16,t:16,b:30};const chartW=canvas.clientWidth-pad.l-pad.r;const chartH=220-pad.t-pad.b;const maxY=Math.max(...history.map(h=>h.usedWeight),1);ctx.strokeStyle='#cbd5e1';ctx.beginPath();for(let i=0;i<=4;i++){const y=pad.t+(chartH/4)*i;ctx.moveTo(pad.l,y);ctx.lineTo(pad.l+chartW,y)}ctx.stroke();ctx.fillStyle='#64748b';for(let i=0;i<history.length;i++){const x=pad.l+(history.length===1?chartW/2:(chartW/(history.length-1))*i);const y=pad.t+chartH-(history[i].usedWeight/maxY)*chartH;if(i===0){ctx.strokeStyle='#2563eb';ctx.beginPath();ctx.moveTo(x,y)}else{ctx.lineTo(x,y)}}ctx.strokeStyle='#2563eb';ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='#2563eb';history.forEach((item,i)=>{const x=pad.l+(history.length===1?chartW/2:(chartW/(history.length-1))*i);const y=pad.t+chartH-(item.usedWeight/maxY)*chartH;ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);ctx.fill();ctx.fillStyle='#64748b';ctx.fillText(String(item.usedWeight),x-8,y-10);ctx.fillText(item.date.slice(5),x-14,210);ctx.fillStyle='#2563eb'})}
function renderCalendarDayDetails(){const wrapper=document.getElementById('calendarDayDetails');const title=document.getElementById('calendarDayTitle');const list=document.getElementById('calendarDaySessions');if(!state.selectedCalendarDate){wrapper.classList.add('hidden');list.innerHTML='';return}const sessions=state.history.filter(s=>s.date===state.selectedCalendarDate);wrapper.classList.remove('hidden');title.textContent=`Séances du ${formatDateFr(state.selectedCalendarDate)}`;if(!sessions.length){list.innerHTML='<div class="empty-state">Aucune séance sur cette date.</div>';return}list.innerHTML='';sessions.forEach(session=>{const card=document.createElement('div');card.className='history-card';const exercises=session.exercises.map(ex=>`<div class="history-exercise"><span>${ex.name}</span><span>${ex.usedWeight||0} kg • ${ex.totalReps} reps</span></div>`).join('');card.innerHTML=`<div class="history-top"><div><div class="history-title">${session.trainingName}</div><div class="small-text">${formatDateFr(session.date)}</div></div><button class="btn delete-btn" data-session-id="${session.id}">Supprimer</button></div><div class="history-exercises">${exercises}</div>`;card.querySelector('.delete-btn').addEventListener('click',()=>{if(!confirm('Supprimer cette séance ?'))return;setState(prev=>({...prev,history:prev.history.filter(s=>s.id!==session.id)}))});list.appendChild(card)})}
function renderHistory(){const list=document.getElementById('historyList');list.innerHTML='';if(!state.history.length){list.innerHTML='<div class="empty-state">Aucune séance enregistrée.</div>';return}state.history.forEach(session=>{const card=document.createElement('div');card.className='history-card';const exercises=session.exercises.map(ex=>`<div class="history-exercise"><span>${ex.name}</span><span>${ex.usedWeight||0} kg • ${ex.totalReps} reps</span></div>`).join('');card.innerHTML=`<div class="history-top"><div><div class="history-title">${session.trainingName}</div><div class="small-text">${formatDateFr(session.date)}</div></div><span class="badge">${session.exercises.length} exos</span></div><div class="history-exercises">${exercises}</div>`;list.appendChild(card)})}
function render(){renderTrainingSelectors();renderExercises();renderCalendar();renderHistory();renderDashboard();renderTimer();populateChartExerciseSelect();renderProgressChart();renderCalendarDayDetails();populateLibrarySelect();renderLibraryList()}
function ensureAudio(){if(!audioContext){audioContext=new(window.AudioContext||window.webkitAudioContext)()}if(audioContext.state==='suspended'){audioContext.resume()}return audioContext}
function beep(duration=220,frequency=880,delay=0){
  setTimeout(()=>{
    try{
      const ctx=ensureAudio();
      const now=ctx.currentTime;
      const oscillator=ctx.createOscillator();
      const gainNode=ctx.createGain();
      oscillator.type='sine';
      oscillator.frequency.setValueAtTime(frequency,now);
      gainNode.gain.setValueAtTime(0.0001,now);
      gainNode.gain.exponentialRampToValueAtTime(0.25,now+0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001,now+duration/1000);
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.start(now);
      oscillator.stop(now+duration/1000+0.03);
    }catch(e){}
  },delay)
}
function notifyTimerDone(){
  beep(220,880,0);
  beep(220,988,320);
  beep(260,1046,640);
  if(navigator.vibrate){navigator.vibrate([200,120,200,120,260])}
}
function startTimer(){clearInterval(timerInterval);ensureAudio();timerInterval=setInterval(()=>{if(timerRemaining>0){timerRemaining-=1;renderTimer()}else{clearInterval(timerInterval);notifyTimerDone();}},1000)}
function pauseTimer(){clearInterval(timerInterval)}
function resetTimer(seconds){clearInterval(timerInterval);timerRemaining=seconds??state.timerSeconds??60;renderTimer()}
function initEvents(){document.getElementById('resetBtn').addEventListener('click',()=>{if(!confirm('Supprimer toutes les données locales ?'))return;localStorage.removeItem(STORAGE_KEY);state=JSON.parse(JSON.stringify(initialState));timerRemaining=60;document.documentElement.setAttribute('data-theme','light');render()});document.getElementById('themeSelect').addEventListener('change',e=>setState(prev=>({...prev,theme:e.target.value})));
document.getElementById('trainingManagerSelect').addEventListener('change',e=>{document.getElementById('trainingCurrentName').value=state.plans[e.target.value].name;});

document.getElementById('selectCurrentTrainingBtn').addEventListener('click',()=>setState(prev=>({...prev,selectedTraining:document.getElementById('trainingManagerSelect').value})));document.getElementById('trainingSelect').addEventListener('change',e=>setState(prev=>({...prev,selectedTraining:e.target.value})));document.getElementById('saveSessionBtn').addEventListener('click',()=>{const plan=state.plans[state.selectedTraining];const sessionExercises=plan.blocks.flatMap(block=>block.exercises.map(ex=>{const cur=state.currentEntries[ex.id]||{};let done=false,totalReps=0;for(let i=1;i<=block.tours;i++){done=done||!!cur[`s${i}done`];totalReps+=Number(cur[`s${i}reps`]||0)}return done?{id:ex.id,name:ex.name,muscle:ex.muscle,plannedWeight:ex.plannedWeight,usedWeight:Number(cur.usedWeight||0),s1reps:Number(cur.s1reps||0),s2reps:Number(cur.s2reps||0),s3reps:Number(cur.s3reps||0),totalReps}:null})).filter(Boolean);if(!sessionExercises.length){alert('Aucun exercice coché pour cette séance.');return}const newSession={id:`${Date.now()}-${Math.random().toString(36).slice(2,8)}`,trainingId:state.selectedTraining,trainingName:plan.name,date:todayKey(),exercises:sessionExercises};setState(prev=>({...prev,history:[newSession,...prev.history],currentEntries:{}}));alert('Séance enregistrée.')});document.querySelectorAll('.tab').forEach(tab=>tab.addEventListener('click',()=>{document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');const target=tab.dataset.tab;document.querySelectorAll('.tab-panel').forEach(p=>p.classList.add('hidden'));document.getElementById(`${target}Tab`).classList.remove('hidden');if(target==='history'){renderProgressChart()}}));document.getElementById('chartExerciseSelect').addEventListener('change',renderProgressChart);window.addEventListener('resize',renderProgressChart);document.getElementById('prevMonthBtn').addEventListener('click',()=>setState(prev=>{let y=prev.calendarYear,m=prev.calendarMonth-1;if(m<0){m=11;y-=1}return {...prev,calendarYear:y,calendarMonth:m}}));document.getElementById('nextMonthBtn').addEventListener('click',()=>setState(prev=>{let y=prev.calendarYear,m=prev.calendarMonth+1;if(m>11){m=0;y+=1}return {...prev,calendarYear:y,calendarMonth:m}}));document.querySelectorAll('[data-timer]').forEach(btn=>btn.addEventListener('click',()=>{const val=Number(btn.dataset.timer);state.timerSeconds=val;saveState();resetTimer(val)}));document.getElementById('startTimerBtn').addEventListener('click',startTimer);document.getElementById('pauseTimerBtn').addEventListener('click',pauseTimer);document.getElementById('resetTimerBtn').addEventListener('click',()=>resetTimer());
const createNewTrainingBtn=document.getElementById('createNewTrainingBtn');
if(createNewTrainingBtn){
  createNewTrainingBtn.addEventListener('click',()=>{
    const name=(document.getElementById('newTrainingName')?.value||'').trim();
    const blockKey=(document.getElementById('newTrainingBlockSelect')?.value||'A');
    const exerciseId=(document.getElementById('newTrainingExerciseSelect')?.value||'');
    if(!name){alert('Entre un nom pour le nouvel entraînement.');return;}
    setState(prev=>{
      const next=JSON.parse(JSON.stringify(prev));
      let idx=1; let newKey='training'+idx;
      while(next.plans[newKey]){idx+=1; newKey='training'+idx;}
      const blocks=[];
      if(exerciseId){
        const lib=(next.library||[]).find(x=>x.id===exerciseId);
        if(lib){
          blocks.push({
            key:blockKey,
            label:blockKey==='FIN'?'Finition':`Bloc ${blockKey}`,
            type:blockKey==='FIN'?'Fin':'Circuit',
            tours:blockKey==='FIN'?2:3,
            exercises:[{
              id:`${newKey}_${Date.now()}`,
              order:1,
              name:lib.name,
              substitution:lib.substitution,
              muscle:lib.muscle,
              targetReps:lib.targetReps,
              plannedWeight:lib.plannedWeight,
              unit:lib.type==='cardio'?'min':'reps'
            }]
          });
        }
      }
      next.plans[newKey]={name:name,blocks:blocks};
      next.selectedTraining=newKey;
      return next;
    });
    document.getElementById('newTrainingName').value='';
    document.getElementById('newTrainingExerciseSelect').value='';
  });
}
document.getElementById('addLibraryExerciseBtn').addEventListener('click',()=>{
  const name=document.getElementById('libName').value.trim();
  if(!name){alert('Entre un nom d\'exercice.');return;}
  const item={id:`lib_${Date.now()}`,name:name,muscle:document.getElementById('libMuscle').value.trim()||'—',substitution:document.getElementById('libSubstitution').value.trim()||'—',targetReps:document.getElementById('libReps').value.trim()||'—',plannedWeight:document.getElementById('libWeight').value.trim()||'—',type:document.getElementById('libType').value};
  setState(prev=>({...prev,library:[...(prev.library||[]),item]}));
  ['libName','libMuscle','libSubstitution','libReps','libWeight'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('libType').value='strength';
});
document.getElementById('addExerciseToTrainingBtn').addEventListener('click',()=>{
  const planKey=document.getElementById('builderTrainingSelect').value;
  const blockKey=document.getElementById('builderBlockSelect').value;
  const exerciseId=document.getElementById('builderExerciseSelect').value;
  const libraryItem=(state.library||[]).find(x=>x.id===exerciseId);
  if(!libraryItem){alert('Choisis un exercice.');return;}
  setState(prev=>{
    const next=JSON.parse(JSON.stringify(prev));
    const plan=next.plans[planKey];
    let block=plan.blocks.find(b=>b.key===blockKey);
    if(!block){
      block={key:blockKey,label:blockKey==='FIN'?'Finition':`Bloc ${blockKey}`,type:blockKey==='FIN'?'Fin':'Circuit',tours:blockKey==='FIN'?2:3,exercises:[]};
      plan.blocks.push(block);
    }
    block.exercises.push({id:`${planKey}_${Date.now()}`,order:block.exercises.length+1,name:libraryItem.name,substitution:libraryItem.substitution,muscle:libraryItem.muscle,targetReps:libraryItem.targetReps,plannedWeight:libraryItem.plannedWeight,unit:libraryItem.type==='cardio'?'min':'reps'});
    return next;
  });
})}
timerRemaining=state.timerSeconds||60;initEvents();render();
