const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const React = require('react');
const {renderToStaticMarkup} = require('react-dom/server');
const cache = {};
function load(name) {
 if (cache[name]) return cache[name];
 const file = ['ts','tsx'].map(ext=>`src/${name}.${ext}`).find(fs.existsSync);
 const m = {exports:{}};
 const output = ts.transpileModule(fs.readFileSync(file,'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 new Function('require','module','exports',output)(id=>id.startsWith('@/')?load(id.slice(2)):id.startsWith('.')?load(path.posix.join(path.posix.dirname(name),id)):require(id),m,m.exports);
 return cache[name]=m.exports;
}
const {getHomeContent}=load('data/homeContent');
const {HomeIntroduction}=load('components/HomeIntroduction');
const {rankNames}=load('data/gameSelection');
const selections=[{playerCount:4,mode:'team'},{playerCount:6,mode:'team'},...Array.from({length:8},(_,i)=>({playerCount:i+5,mode:'individual'}))];
for(const selection of selections) {
 const {playerCount:p,mode}=selection;
 const c=getHomeContent(selection);
 const html=renderToStaticMarkup(React.createElement(HomeIntroduction,{selection,onCards:()=>{}}));
 assert.equal((html.match(/class="team-dot"/g)||[]).length,p,`${p} ${mode} player icons`);
 assert.equal((html.match(/<figure /g)||[]).length,3);
 assert(html.includes(`${p} PLAYERS`));
 assert(html.includes('tichu-wordmark.png'));
 if(mode==='team') {
  assert(html.includes(`${p/2} VS ${p/2}`));assert(!html.includes('home-rank-graphic'));
  assert(html.includes('카드 1세트를 준비해요.'));
  assert(html.includes('1000'));assert(html.includes('POINTS'));
 } else {
  assert(!html.includes('VS'));assert(!html.includes('1000'));assert(html.includes('FREE FOR ALL'));
  assert(html.includes(rankNames[p][0])&&html.includes(rankNames[p].at(-1)));
  assert.equal((html.match(/class="home-rank-entry"/g)||[]).length,p>=7?2:p);
  assert.equal(c.twoDecks,p>=7);
  if(p>=7){assert(html.includes('카드 2세트를 준비해요.'));assert(html.includes('권장'));assert(html.includes('112'));}
  else assert(html.includes('카드 1세트를 준비해요.'));
  if(p===5)assert(html.includes('개를 뺀 55장'));
 }
}
assert.notDeepEqual(getHomeContent({playerCount:6,mode:'team'}),getHomeContent({playerCount:6,mode:'individual'}));
console.log('PASS: all 10 game selections rendered; exact player icons, 3 facts, mode-specific victory/ranks/decks, legacy five-player names');
const {StepNavigation,StepActions}=load('components/StepNavigation');
for(const count of [3,5,6]) {
 const labels=Array.from({length:count},(_,i)=>`단계 ${i+1}`);
 for(const step of [0,count-1]) {
  const html=renderToStaticMarkup(React.createElement(StepNavigation,{labels,step,onChange:()=>{},prefix:'test',markers:labels.map((_,i)=>i===3?'★':String(i+1))}));
  assert.equal((html.match(/role="tab"/g)||[]).length,count);
  assert.equal((html.match(/aria-selected="true"/g)||[]).length,1);
  assert(html.includes(`id="test-${step}"`));
  const actions=renderToStaticMarkup(React.createElement(StepActions,{step,count,onChange:()=>{}}));
  assert.equal((actions.match(/disabled=""/g)||[]).length,1);
  assert(actions.includes(step===0?'다음 단계':'마지막 단계'));
 }
}
console.log('PASS: dynamic step counts, active state, and first/last navigation boundaries');
const {EssentialTerms,Combinations}=load('components/Rules');
const {CardOverview}=load('components/CardOverview');
const {RankSystem}=load('components/IndividualGuide');
for(const selection of selections) {
 const html=renderToStaticMarkup(React.createElement(EssentialTerms,{players:selection.playerCount,mode:selection.mode,query:''}));
 assert(html.indexOf('<h3>트릭')<html.indexOf('<h3>라운드'));
 for(const unwanted of ['플레이 예시','풀하우스','소원','카드의 강함'])assert(!html.includes(unwanted));
 assert(html.includes('트릭에서 승리하는 것과'));
 const overview=renderToStaticMarkup(React.createElement(CardOverview,{players:selection.playerCount,learning:true,suit:'all',onSuit:()=>{}}));
 assert(overview.includes('A &gt; K &gt; Q &gt; J &gt; 10 &gt; 9 &gt; 8 &gt; 7 &gt; 6 &gt; 5 &gt; 4 &gt; 3 &gt; 2'));
 assert(overview.includes('<span>05</span>'));
}
const combos=renderToStaticMarkup(React.createElement(Combinations,{players:4}));
let previous=-1;
for(const id of ['single','pair','pairs','triple','full-house','straight','bomb']) {
 const position=combos.indexOf(`id="combo-button-${id}"`);assert(position>previous);previous=position;
 assert(combos.includes(`aria-controls="combo-detail-${id}"`));
}
const rankHtml=renderToStaticMarkup(React.createElement(RankSystem,{players:5}));
assert.equal((rankHtml.match(/<li/g)||[]).length,5);
assert(!rankHtml.includes('<input'));assert(!rankHtml.includes('<details'));
console.log('PASS: concise terms for all modes, card hierarchy, seven combination controls in order, static five-player ranks');
