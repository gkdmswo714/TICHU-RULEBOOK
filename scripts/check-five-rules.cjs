// Check shared rule data and retrieval without contacting an external AI.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const cache = {};
function load(name) {
  if (cache[name]) return cache[name];
  const output = ts.transpileModule(fs.readFileSync(`src/${name}.ts`, 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
  const module = {exports:{}};
  new Function('require','module','exports',output)((id)=>load(id === './fivePlayer' ? 'data/fivePlayer' : id.replace('@/', '')),module,module.exports);
  return cache[name] = module.exports;
}
const {rulesFor}=load('data/rules');
const {searchRules}=load('lib/search');
const five=rulesFor(5);
assert(!/확인 필요|대조 예정|추후/.test(JSON.stringify(five)));
assert.equal(new Set(five.map(r=>r.id)).size,five.length);
assert(!five.some(r=>['small','grand','grand6','one-two','triple','points'].includes(r.id)));
for(const [query,id] of [
 ['5인은 몇 장씩 받아?','deal5'],['세금은 몇 장씩 보내?','tribute'],
 ['세금 카드 순서는?','tax-rank5'],['세금으로 어떤 강한 카드를 보내?','tax-rank5'],
 ['첫 판도 교환해?','tribute'],['황제는 어디 앉아?','rank5'],
 ['언제 라운드가 끝나?','rank5'],['개는 어떻게 써?','dog'],
 ['라운드와 트릭의 차이','round'],['트릭을 가져가면 손패에 넣어?','trick']
]) assert.equal(searchRules(query,5)[0]?.id,id,query);
assert.match(five.find(r=>r.id==='deal5').summary,/11장/);
assert.match(five.find(r=>r.id==='tribute').detail,/장군은 교환하지/);
assert.match(five.find(r=>r.id==='tax-rank5').summary,/용 > 봉황 > 참새 > A/);
assert.match(five.find(r=>r.id==='trick').detail,/네 명의 패스/);
assert.match(five.find(r=>r.id==='trick').detail,/반시계 방향/);
assert.match(rulesFor(4).find(r=>r.id==='exchange').summary,/세 사람/);
assert.match(rulesFor(6).find(r=>r.id==='grand6').summary,/7번째/);
console.log('PASS: 5-player completeness, tax order, retrieval, and 4/6-player isolation');
