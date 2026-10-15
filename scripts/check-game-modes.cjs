const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),ts=require('typescript');
const cache={};
function load(name){if(cache[name])return cache[name];const m={exports:{}};new Function('require','module','exports',ts.transpileModule(fs.readFileSync(`src/${name}.ts`,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(id=>id.startsWith('@/')?load(id.slice(2)):id.startsWith('.')?load(path.posix.join(path.posix.dirname(name),id)):require(id),m,m.exports);return cache[name]=m.exports;}
const {isGameSelection,restoreSelection,rankNames}=load('data/gameSelection');
const {rulesForGame}=load('data/gameRules');const {rulesFor}=load('data/rules');const {searchGameRules}=load('lib/gameSearch');
const {emptyRecord,validRecord,finishPlayer,moveRank}=load('lib/rankRecord');
for(let p=0;p<=15;p++)for(const mode of ['team','individual','invalid'])assert.equal(isGameSelection({playerCount:p,mode}),mode==='team'?[4,6].includes(p):mode==='individual'&&p>=5&&p<=12,`${p} ${mode}`);
assert(!isGameSelection({playerCount:'6',mode:'team'}));assert(!isGameSelection({playerCount:6.5,mode:'individual'}));
assert.deepEqual(restoreSelection(null,'6'),{playerCount:6,mode:'team'});
assert.deepEqual(restoreSelection('{broken','5'),{playerCount:5,mode:'individual'});
assert.deepEqual(restoreSelection('{"playerCount":8,"mode":"individual"}','6'),{playerCount:8,mode:'individual'});
assert.deepEqual(restoreSelection('{"playerCount":4,"mode":"individual"}','4'),{playerCount:4,mode:'team'});
for(const p of [4,5,6])assert.deepEqual(rulesForGame(p,p===5?'individual':'team'),rulesFor(p));
assert.deepEqual(rankNames[5],['황제','재상','장군','평민','천민']);
for(let p=5;p<=12;p++){
 assert.equal(rankNames[p].length,p);assert.equal(new Set(rankNames[p]).size,p);assert.equal(rankNames[p][0],'황제');assert.equal(rankNames[p].at(-1),'천민');
 let record=emptyRecord(p);record.names[0]='민지';record.names[1]='민지';
 for(let id=p-1;id>=0;id--)record=finishPlayer(record,id);
 assert(validRecord(record,p));assert.equal(record.order.length,p);assert.equal(new Set(record.order).size,p);
 assert.deepEqual(finishPlayer(record,0),record);assert.deepEqual(finishPlayer(record,p),record);
 const swapped=moveRank(record,0,1);assert.equal(swapped.order[1],record.order[0]);assert(validRecord(swapped,p));assert(!validRecord({...record,order:[0,0]},p));assert(!validRecord(record,p+1));
 if(p>5){const rules=rulesForGame(p,'individual');for(const card of load('data/cards').cards.filter(c=>c.character))assert(rules.some(r=>r.id===card.rule),`${p}: ${card.id} rule missing`);assert(!rules.some(r=>['grand6','triple','points','grand','one-two','tribute','deal5'].includes(r.id)));for(const [q,id] of [['세금은 몇 장?','exchange-individual'],['몇 장씩 나눠?','deal-individual'],['용은 어떻게 써?','dragon'],['트리플 승리','individual'],['계급','rank-individual']])assert.equal(searchGameRules(q,p,'individual')[0]?.id,id);}
}
(async()=>{const {POST}=load('app/api/chat/route');let count=0;for(let p=4;p<=12;p++)for(const mode of ['team','individual']){const valid=isGameSelection({playerCount:p,mode});const r=await POST(new Request('http://localhost/api/chat',{method:'POST',body:JSON.stringify({players:p,gameMode:mode,question:'용은 어떻게 써?'})}));assert.equal(r.status,valid?200:400);if(valid&&mode==='individual'&&p>5)assert.match((await r.json()).answer,/공식 설명서 확인 필요/);count++;}for(const body of [{players:6,question:'트리플 승리'},{players:5,question:'세금은 몇 장?'},{players:4,question:'용 25점'}])assert.equal((await POST(new Request('http://localhost/api/chat',{method:'POST',body:JSON.stringify(body)}))).status,200);for(const body of [{players:3,gameMode:'individual',question:'용'},{players:13,gameMode:'individual',question:'용'},{players:8,question:'용'},{players:5,question:''},{players:5,question:'a'.repeat(501)}])assert.equal((await POST(new Request('http://localhost/api/chat',{method:'POST',body:JSON.stringify(body)}))).status,400);console.log(`PASS: selection validation/migration, legacy rule preservation, ranks 5–12, record integrity, mode-isolated search, ${count} API mode combinations and compatibility checks`);})().catch(e=>{console.error(e);process.exitCode=1});
