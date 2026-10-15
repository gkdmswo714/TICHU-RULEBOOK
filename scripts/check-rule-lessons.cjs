const fs = require('node:fs'), ts = require('typescript'), assert = require('node:assert/strict');
const cache = {};
function load(name) {
 if(cache[name]) return cache[name];
 const m={exports:{}};
 new Function('require','module','exports',ts.transpileModule(fs.readFileSync(`src/${name}.ts`,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(id=>load(id==='./fivePlayer'?'data/fivePlayer':id.replace('@/','')),m,m.exports);
 return cache[name]=m.exports;
}
const {searchRules}=load('lib/search'), {rulesFor,combinations}=load('data/rules');
for(const p of [4,5,6]) for(const [q,id] of [['용 25점','dragon'],['용이 안 좋은 이유','dragon'],['용으로 끝내면','dragon'],['누가 먼저 시작해','lead'],['참새부터 내야 해','lead'],['진행 방향','lead'],['한 바퀴','trick'],['패스','pass'],['라운드와 트릭 차이','round']]) assert.equal(searchRules(q,p)[0]?.id,id,p+q);
assert.match(rulesFor(4).find(r=>r.id==='dragon').detail,/이전에 얻은 트릭은 주지/);
assert.match(rulesFor(5).find(r=>r.id==='dragon').summary,/점수 선물을 계산하지/);
assert.match(rulesFor(6).find(r=>r.id==='dragon').detail,/용으로 이긴 트릭은 상대 팀에게 넘겨요/);
assert.match(rulesFor(4).find(r=>r.id==='round').caution,/200점/);
assert.deepEqual(combinations.map(([,title])=>title),['싱글','페어','연속 페어','트리플','풀하우스','스트레이트','폭탄']);
assert.match(rulesFor(4).find(r=>r.id==='full-house').detail,/세 장짜리 숫자가 높은 쪽/);
console.log('PASS: 27 natural-language queries, dragon handling, player-count isolation');
