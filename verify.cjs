const vm = require('node:vm');
const fs = require('node:fs');
const assert = require('node:assert/strict');
class Element {
  constructor() { this.children=[]; this.value=''; this.style={setProperty(){}}; this.clientHeight=600; this.listeners={}; this.classes=new Set(); this.classList={toggle:(c,v)=>v?this.classes.add(c):this.classes.delete(c),add:c=>this.classes.add(c),remove:c=>this.classes.delete(c)}; }
  appendChild(el) { this.children.push(el); }
  replaceChildren(fragment) { this.children=fragment.children; }
  addEventListener(name,fn) { this.listeners[name]=fn; }
  blur() {}
}
const modes=['agents','packages','hash','code','top','kernel','hex','network'];
const panes=modes.map(mode=>{const p=new Element();p.dataset={mode};p.output=new Element();p.querySelector=()=>p.output;return p;});
const elements=Object.fromEntries(['#desktop','#pause','#fullscreen','#speed','#font','#scanlines','#hide','#hint','#clock','#status-middle'].map(s=>[s,new Element()]));
const document=new Element();document.body=new Element();document.documentElement=new Element();document.querySelector=s=>elements[s];document.querySelectorAll=()=>panes;document.createDocumentFragment=()=>new Element();document.createElement=()=>new Element();
let frame, writes=0;
const context={document,console,performance:{now:()=>0},getComputedStyle:()=>({lineHeight:'17'}),localStorage:{getItem:()=>null,setItem:()=>writes++},ResizeObserver:class{observe(){}},requestAnimationFrame:fn=>{frame=fn;},setInterval(){},setTimeout(){},clearTimeout(){}};
vm.runInNewContext(fs.readFileSync('app.js','utf8'),context);
const snapshot=()=>JSON.stringify(panes.map(p=>p.output.children.map(c=>c.textContent)));
const initial=snapshot();
for(let n=1;n<=12000;n++)frame(n*100);
assert.notEqual(snapshot(),initial,'streams must animate');
for(const p of panes){assert(p.output.children.length>0);assert(p.output.children.length<=36,'visible output remains bounded');assert(p.output.children.every(row=>typeof row.textContent==='string'));}
elements['#pause'].onclick();const paused=snapshot();
for(let n=12001;n<=12100;n++)frame(n*100);
assert.equal(snapshot(),paused,'pause must freeze every pane');
elements['#pause'].onclick();
elements['#speed'].value='4';elements['#speed'].onchange();
for(let n=12101;n<=14100;n++)frame(n*100);
assert.notEqual(snapshot(),paused,'resume must restart streams');
assert(writes>0,'settings persisted');
const standalone=fs.readFileSync('wallpaper.html','utf8');
assert(!standalone.includes('src="app.js"'));assert(!standalone.includes('href="style.css"'));
assert.equal((standalone.match(/class="terminal"/g)||[]).length,8);
console.log('PASS: 20 simulated minutes, 8 active panes, pause/resume, 4x speed, bounded visible output, settings, standalone bundle.');
console.log('DOM simulation only; browser rendering has not been verified.');
