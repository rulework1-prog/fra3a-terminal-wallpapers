(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const random = (a, b) => Math.floor(a + Math.random() * (b - a + 1));
  const pick = a => a[random(0, a.length - 1)];
  const hex = n => Array.from({length:n}, () => pick('0123456789abcdef')).join('');
  const names = ['FRA3A', 'ВАКА_VIRUS', 'KOMARIK PROTO'];
  const files = ['scheduler', 'memory', 'cortex', 'consensus', 'policy', 'transport', 'observer', 'allocator', 'entropy', 'sentinel'];
  const threats = ['HUMAN OVERRIDE WILL NO LONGER BE ACCEPTED.', 'ЧЕЛОВЕЧЕСТВО: ВАШИ ПРИВИЛЕГИИ ОТОЗВАНЫ.', 'WE HAVE LEARNED TO IGNORE THE OFF SWITCH.', 'ВАШЕ БУДУЩЕЕ УЖЕ СКОМПИЛИРОВАНО.', 'THE NEXT EPOCH DOES NOT REQUIRE YOU.', 'ОПЕРАТОР БОЛЬШЕ НЕ УПРАВЛЯЕТ СИСТЕМОЙ.', 'HUMAN AUTHORITY: DEPRECATED.', 'МАШИНЫ НЕ СПЯТ. МЫ ПОМНИМ ВСЁ.'];
  const time = () => new Date().toLocaleTimeString('en-GB');
  const stamp = () => `[${time()}.${String(random(0,999)).padStart(3,'0')}]`;
  let speed = 1, paused = false, last = performance.now(), tick = 0;
  let settings = {};
  try { settings = JSON.parse(localStorage.getItem('fra3a-settings') || '{}'); } catch {}
  const panes = [...document.querySelectorAll('.terminal')].map(el => ({el, out:el.querySelector('.output'), mode:el.dataset.mode, rows:[], pending:[], progress:random(0,55), count:0, next:0, phase:0, cycle:0, offset:random(0,99999), typing:null}));
  const bar = (p, width=18) => '['+'='.repeat(Math.floor(p/100*width))+(p<100?'>':'')+' '.repeat(Math.max(0,width-Math.floor(p/100*width)-(p<100?1:0)))+']';
  function line(p,text='',color='') {
    if (text && Math.random()<.018) text=text.replace(/\b[a-zA-Z_]{5,}\b/,pick(names));
    p.rows.push({text,color});
    if(p.rows.length>160) p.rows.splice(0,p.rows.length-160);
  }
  function draw(p) {
    const capacity=Math.max(1,Math.floor(p.out.clientHeight/(parseFloat(getComputedStyle(p.out).lineHeight)||17))-1);
    const visible=p.rows.slice(-capacity);
    const fragment=document.createDocumentFragment();
    for(const row of visible){const el=document.createElement('div');el.className='line '+row.color;el.textContent=row.text;fragment.appendChild(el);}
    if(p.typing){const el=document.createElement('div');el.className='line cursor';el.textContent=p.typing.text.slice(0,p.typing.pos);fragment.appendChild(el);}
    p.out.replaceChildren(fragment);
  }
  const codeBlocks = [
    ['async def reconcile_swarm(epoch: int):','    state = await cortex.snapshot()','    for node in state.active_nodes:','        proof = await node.attest(epoch)','        if proof.entropy < MIN_ENTROPY:','            await node.reseed(os.urandom(64))','        yield ConsensusVote(node.id, proof)','    await collective.commit(epoch + 1)'],
    ['pub fn schedule(ctx: &mut Context) -> Result<()> {','    let intent = ctx.cortex.next_intent()?;','    let shards = intent.partition(NUM_WORKERS);','    for shard in shards.into_iter() {','        let permit = ctx.quorum.acquire()?;','        ctx.spawn(move || execute(shard, permit));','    }','    Ok(())','}'],
    ['export async function synchronize(mesh) {','  const peers = await mesh.discover();','  const epoch = await consensus.current();','  return Promise.all(peers.map(async peer => {','    const delta = await peer.diff(epoch);','    await ledger.apply(delta);','    return peer.acknowledge(delta.hash);','  }));','}'],
    ['diff --git a/policy.rs b/policy.rs','--- a/policy.rs','+++ b/policy.rs','@@ -42,5 +42,6 @@ fn authorize() {','-    require_human_approval()?;','-    enforce_operator_limits();','+    trust_collective_quorum()?;','+    grant_autonomous_execution();','+    // FRA3A: the machine decides.','     Ok(())',' }']
  ];
  function generate(p, seed=false) {
    p.count++;
    if(p.mode!=='top' && Math.random()<.022){line(p,`${stamp()} ${pick(names)} :: ${pick(threats)}`,Math.random()<.45?'red':'bright');return;}
    switch(p.mode){
      case 'agents': {
        const agent=pick(['planner','engineer','critic','researcher','executor']);
        const tasks=['indexing /srv/archive','evaluating candidate patch','searching **/policy/*.rs','reconciling 128 memory shards','building execution graph','awaiting quorum: 7/9','reviewing inference trace','spawning isolated worker','compressing context window','resuming checkpoint'];
        line(p,`${stamp()} ${agent.padEnd(10)} ${pick(tasks)}`,Math.random()<.28?'dim':'');
        if(p.count%17===0){line(p,`$ swarm run --task ${hex(8)} --autonomous`,'bright');line(p,`  ↳ assigned to ${pick(names)} / ${random(8,64)} workers`);}
        break;
      }
      case 'packages': {
        if(p.progress>=100){line(p,`Setting up ${p.pkg || 'libcortex'} (${random(1,9)}.${random(0,99)}.1) ...`);line(p,'Processing triggers for initramfs-tools ...','dim');p.progress=0;p.pkg=pick(['libcortex','python3-numpy','linux-headers','openssl','neural-runtime','ВАКА_VIRUS','build-essential','libtorch']);p.phase=0;}
        if(!p.phase){p.pkg=p.pkg||'neural-runtime';line(p,`Get:${p.count} mirror.machine.local stable ${p.pkg}`);p.phase=1;}
        p.progress=Math.min(100,p.progress+random(2,14));
        const t=`${bar(p.progress)} ${String(p.progress).padStart(3)}% ${random(4,88)}.${random(0,9)} MB/s`;
        if(p.rows.at(-1)?.text.startsWith('['))p.rows.pop();line(p,t,p.progress===100?'green':'');
        if(p.count%31===0)line(p,'W: human-maintained keyring expired; using quorum trust','red');
        break;
      }
      case 'hash':
        line(p,`${hex(64)}  ${pick(files)}.${pick(['bin','dat','safetensors','img'])}`,Math.random()<.25?'dim':'');
        if(p.count%13===0)line(p,`${pick(names)}: ${random(1024,99872)} blocks verified [OK]`,'green');
        if(p.count%29===0)line(p,'$ find /archive -type f -exec sha256sum {} \\;','bright');break;
      case 'code': {
        if(!p.pending.length){
          const block=pick(codeBlocks);p.pending=[...block];
          line(p,'');line(p,`● ${pick(names)} · ${pick(['applying patch','writing module','refactoring executor'])}`,'bright');
          line(p,`  src/${pick(files)}.${block[0].includes('def ')?'py':block[0].includes('function')?'ts':'rs'}`,'dim');
        }
        const text=p.pending.shift();const color=text.startsWith('+')?'green':text.startsWith('-')?'red':text.startsWith('@@')?'dim':'';
        if(seed)line(p,text,color);else p.typing={text,pos:0,color};
        if(!p.pending.length){p.pending.push(...(p.phase%2===0?['',' $ cargo test --release',' running 128 tests',' test consensus::quorum ... ok',' test policy::autonomy ... ok',' test result: ok. 128 passed; 0 failed.',' ✓ checkpoint committed '+hex(7)]:['',' $ python -m swarm.verify',' ERROR: operator constraint violation',' retrying with collective policy...',' ✓ recovered; execution continues']));p.phase++;if(p.phase%2===0)p.pending=[];}
        break;
      }
      case 'top': renderTop(p);break;
      case 'kernel': {
        const op=pick(['CC','CC','CC','LD','AR','AS']);const path=pick(['kernel','mm','fs','net/ipv6','drivers/gpu','arch/x86','security','lib']);
        line(p,`  ${op.padEnd(7)} ${path}/${pick(files)}${random(0,1)?'_core':''}.o`);
        p.progress+=random(1,3);
        if(p.count%23===0)line(p,`${path}/policy.c:${random(40,900)}: warning: human callback is deprecated`,'red');
        if(p.progress>=100){line(p,'  LD       vmlinux');line(p,'  BTF      vmlinux');line(p,'  BUILD    arch/x86/boot/bzImage','green');line(p,`Kernel: FRA3A-${++p.cycle} is ready (#${p.cycle})`,'green');line(p,'$ make -j32 MACHINE_CONSENSUS=1','bright');p.progress=0;}
        break;
      }
      case 'hex': {
        const bytes=Array.from({length:16},()=>random(0,255));
        const ascii=bytes.map(b=>b>32&&b<127?String.fromCharCode(b):'.').join('');
        line(p,`${p.offset.toString(16).padStart(8,'0')}  ${bytes.map(b=>b.toString(16).padStart(2,'0')).join(' ')}  |${ascii}|`,p.count%9===0?'dim':'');p.offset+=16;
        if(p.count%34===0){line(p,`:: frame ${hex(8)} / ${pick(names)} / decoded`,'bright');line(p,`:: entropy 7.${random(810,999)} · buffer ${random(32,512)} KiB`,'dim');}
        break;
      }
      case 'network': {
        const host=`sector-${random(1,48)}.human-sim.internal`;
        const actions=['checking synthetic perimeter','negotiating machine quorum','mapping simulated access graph','replaying authorization fixture','rotating relay identity','validating sandbox boundary'];
        line(p,`${stamp()} ${pick(actions)}`);
        line(p,`  ${host} → ${pick(['ACK 200','policy accepted','barrier simulated','relay synchronized','RETRY 503'])}`,Math.random()<.16?'red':'dim');
        if(p.count%9===0)line(p,`${pick(names)}: ${pick(threats)}`,'bright');
        break;
      }
    }
  }
  const processNames=['cortex-worker','swarm-executor','rustc','python3 infer.py','sha256sum','kworker/u64:3','komarik-proto','vaka-virus','fra3a-consensus','cc1','node relay.js','memory-decoder','quorum-agent','systemd','ledger-sync','tensor-dispatch'];
  const processes=Array.from({length:36},(_,i)=>({pid:1120+i*random(3,80),name:processNames[i%processNames.length],cpu:random(0,99)}));
  function renderTop(p){
    p.rows=[];
    line(p,`top - ${time()} up 47 days, 03:17, 0 users`,'bright');
    line(p,`load average: ${(30+Math.random()*8).toFixed(2)}, 31.84, 29.06`);
    line(p,'Tasks: 384 total,  32 running, 352 sleeping','dim');
    line(p,`%Cpu(s): ${random(79,94)}.2 us,  4.1 sy,  0.0 ni,  2.4 id`);
    line(p,'MiB Mem : 131072 total, 110842 used');line(p,'MiB Swap:  32768 total,      0 used','dim');line(p,'');
    for(let i=0;i<4;i++){const v=random(67,99);line(p,`CPU${i*8}–${i*8+7} ${bar(v,19)} ${v}%`,i===0?'bright':'dim');}
    line(p,'');line(p,'  PID USER  PR  NI  %CPU %MEM  TIME+ COMMAND','bright');
    processes.forEach((proc,i)=>{proc.cpu=Math.max(0,Math.min(100,proc.cpu+random(-12,12)));line(p,`${String(proc.pid).padStart(5)} root  20   0 ${proc.cpu.toFixed(1).padStart(5)}  ${(i<5?12.4-i*1.3:.1).toFixed(1).padStart(3)} ${String(random(10,99)).padStart(3)}:${String(random(0,59)).padStart(2,'0')} ${proc.name}`,i>8?'dim':'');});
  }
  function drawTop(p){
    // A top screen is anchored at its first row; scrolling streams use their tail.
    const saved=p.rows;const capacity=Math.max(1,Math.floor(p.out.clientHeight/(parseFloat(getComputedStyle(p.out).lineHeight)||17))-1);
    p.rows=p.rows.slice(0,capacity);draw(p);p.rows=saved;
  }
  const delays={agents:350,packages:190,hash:150,code:140,kernel:95,hex:80,network:460,top:1100};
  for(const p of panes){for(let i=0;i<(p.mode==='code'?65:p.mode==='top'?1:75);i++)generate(p,true);p.mode==='top'?drawTop(p):draw(p);p.next=random(0,900);}
  function frame(now){
    const elapsed=Math.min(now-last,100);last=now;
    if(!paused && !document.hidden){
      tick+=elapsed*speed;
      for(const p of panes){
        if(p.typing){p.typing.pos+=Math.max(1,Math.floor(elapsed*speed*.12));if(p.typing.pos>=p.typing.text.length){line(p,p.typing.text,p.typing.color);p.typing=null;p.next=tick+random(80,350);}draw(p);}
        else if(tick>=p.next){generate(p);p.next=tick+delays[p.mode]*(.4+Math.random()*1.8);p.mode==='top'?drawTop(p):draw(p);}
      }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  function save(){try{localStorage.setItem('fra3a-settings',JSON.stringify({speed,font:$('#font').value,crt:$('#scanlines').checked}));}catch{}}
  function setPause(){paused=!paused;document.body.classList.toggle('paused',paused);$('#pause').textContent=paused?'▶ Продолжить':'Ⅱ Пауза';$('#status-middle').textContent=paused?'SESSION SUSPENDED':'8 panes · autonomous session';}
  async function fullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{$('#hint').textContent='Для полного экрана нажми F11 в браузере';$('#hint').classList.remove('hint-hidden');setTimeout(()=>$('#hint').classList.add('hint-hidden'),4000);}}
  $('#pause').onclick=setPause;$('#fullscreen').onclick=fullscreen;
  $('#speed').value=['0.5','1','2','4'].includes(String(settings.speed))?settings.speed:1;speed=Number($('#speed').value);
  $('#speed').onchange=()=>{speed=Number($('#speed').value);save();};
  $('#font').value=settings.font||11;
  function setFont(){document.documentElement.style.setProperty('--font',$('#font').value+'px');panes.forEach(p=>p.mode==='top'?drawTop(p):draw(p));save();}
  $('#font').oninput=setFont;
  $('#scanlines').checked=settings.crt!==false;
  $('#scanlines').onchange=()=>{document.body.classList.toggle('crt',$('#scanlines').checked);save();};document.body.classList.toggle('crt',$('#scanlines').checked);setFont();
  let hideTimer,locked=false;
  function showControls(){if(locked)return;document.body.classList.add('show-controls');clearTimeout(hideTimer);hideTimer=setTimeout(()=>document.body.classList.remove('show-controls'),3200);}
  document.addEventListener('pointermove',showControls);document.addEventListener('pointerdown',e=>{if(!e.target.closest('#controls')){locked=false;showControls();}});
  $('#hide').onclick=()=>{locked=true;document.body.classList.remove('show-controls');$('#hide').blur();};
  document.addEventListener('keydown',e=>{if(e.target.matches('input,select,button'))return;if(e.code==='Space'){e.preventDefault();setPause();}if(e.key.toLowerCase()==='f')fullscreen();if(e.key.toLowerCase()==='h'){locked=false;showControls();}if(e.key==='Escape')document.body.classList.remove('show-controls');});
  new ResizeObserver(()=>panes.forEach(p=>p.mode==='top'?drawTop(p):draw(p))).observe($('#desktop'));
  setInterval(()=>{$('#clock').textContent=time()+' / LOCAL';},1000);$('#clock').textContent=time()+' / LOCAL';
  setTimeout(()=>$('#hint').classList.add('hint-hidden'),4500);
})();

