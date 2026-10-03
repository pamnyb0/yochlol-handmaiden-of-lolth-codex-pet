const assert = require('node:assert/strict');
const data = require('./dialogue.js');
const { Companion } = require('./engine.js');
const tests = [];
function test(name, fn) { tests.push({ name, fn }); }
function fixture(saved) {
  let at = 1800000000000;
  const pet = new Companion(data, { now: () => at, random: () => 0, saved });
  return { pet, advance: ms => { at += ms; }, time: () => at };
}
test('Repeated clicks escalate in order, then remain angry after ten seconds', () => {
  const { pet, advance } = fixture();
  const pools = [];
  for(let i=0;i<6;i++){pools.push(pet.event('click').line.pool);advance(1000);}
  assert.deepEqual(pools,['click1','click2','click3','click4','click5','click6']);
  assert.equal(pet.snapshot().mood,'angry');
  advance(10000);pet.tick();assert.equal(pet.snapshot().mood,'angry');
  advance(40*60000);pet.tick();assert.equal(pet.snapshot().irritation,0);
});
test('Touch count resets after a pause without instantly erasing irritation', () => {
  const { pet,advance }=fixture();
  for(let i=0;i<5;i++){pet.event('click');advance(1000);}
  advance(21000);
  const result=pet.event('click');
  assert.equal(result.line.pool,'click1');
  assert.equal(result.snapshot.clickCount,1);
  assert.ok(result.snapshot.irritation>60);
});
test('Dragging has its own ordered escalation', () => {
  const {pet,advance}=fixture();
  assert.equal(pet.event('drag').line.pool,'drag1');advance(1000);
  assert.equal(pet.event('drag').line.pool,'drag2');advance(1000);
  assert.equal(pet.event('drag').line.pool,'drag3');
  assert.equal(pet.state.clickCount,0);
});
test('Failures distinguish repetition from revision and reward understood success', () => {
  const {pet}=fixture();
  assert.equal(pet.event('failure').line.pool,'failure');
  assert.equal(pet.event('failure').line.pool,'repeatedFailure');
  assert.equal(pet.event('failure',{changed:true,signature:'new test'}).line.pool,'changedFailure');
  assert.equal(pet.event('failure').line.pool,'repeatedFailure');
  assert.equal(pet.event('success',{understood:true}).line.pool,'earnedSuccess');
  assert.equal(pet.state.failureCount,0);
  assert.equal(pet.state.lastFailure,null);
  assert.equal(pet.snapshot().mood,'pleased');
});
test('Accidental success prompts explanation rather than earned approval', () => {
  const {pet}=fixture();pet.event('failure');
  assert.equal(pet.event('success',{understood:false}).line.pool,'accidentalSuccess');
});
test('Brief absence is silent; a long absence uses a separate pool', () => {
  const {pet}=fixture();
  assert.equal(pet.event('return',{awayMs:30000}).line,null);
  assert.equal(pet.event('return',{awayMs:180000}).line.pool,'return');
  assert.equal(pet.event('return',{awayMs:3*3600000}).line.pool,'longReturn');
});
test('Exhausted pools produce silence and never force a repeated line', () => {
  const {pet}=fixture();
  const ids = new Set();
  for(let i=0;i<4;i++){const line=pet.event('certainty').line;assert.ok(line);ids.add(line.id);}
  assert.equal(ids.size,4);
  assert.equal(pet.event('certainty').line,null);
});
test('Rare remarks share a daily cooldown across pools', () => {
  const {pet}=fixture();
  const first=pet.choose('rare');assert.equal(first.rarity,'rare');
  assert.equal(pet.choose('rare'),null);
  assert.equal(pet.choose('longReturn').rarity,'common');
});
test('Asking about Lolth has a topic cooldown', () => {
  const {pet,advance}=fixture();
  assert.equal(pet.event('lolth').line.pool,'lolth');
  assert.equal(pet.event('lolth').line,null);
  advance(61000);assert.equal(pet.event('lolth').line.pool,'lolth');
});
test('New lore topics select their dedicated dialogue pools', () => {
  const {pet}=fixture();
  for(const topic of ['matron','priestess','menzoberranzan','form','abyss','fear','summoning','drow']) {
    const result=pet.event(topic);
    assert.equal(result.line.pool,topic);
    assert.equal(result.animation,topic==='form'?'waving':'review');
  }
});
test('Authored telepathic delivery survives dialogue selection', () => {
  const line=Object.values(data.pools).flat().find(item=>item.delivery==='telepathic');
  assert.ok(line);
  const dialogue={...data,pools:{...data.pools,telepathic:[line]}};
  const pet=new Companion(dialogue,{random:()=>0});
  assert.equal(pet.choose('telepathic').delivery,'telepathic');
});
test('Quiet company keeps ambient remarks silent', () => {
  const {pet,advance}=fixture();pet.state.ambientEnabled=false;
  advance(3*3600000);
  assert.equal(pet.event('ambient').line,null);
  assert.ok(pet.event('question').line);
});
test('Saved acquaintance restores cooldowns, and time away settles the mood', () => {
  const {pet}=fixture();const previous=pet.event('question').line.id;
  pet.state.irritation=90;const saved=pet.export();
  let at=pet.now()+40*60000;
  const restored=new Companion(data,{saved,now:()=>at,random:()=>0});
  assert.equal(restored.snapshot().irritation,0);
  assert.notEqual(restored.event('question').line.id,previous);
  assert.ok(!Object.keys(restored.export()).includes('history'));
});
test('Invalid saved line IDs are discarded', () => {
  const {pet}=fixture({used:{injected:12,'question:0':12, 'curious:0':12},recent:[42]});
  assert.deepEqual(pet.state.used,{'curious:0':12});
  assert.deepEqual(pet.state.recent,[]);
});
test('All authored lines use unique IDs and avoid banned prose patterns', () => {
  const lines=Object.values(data.pools).flat();
  assert.ok(lines.length>=120);
  assert.equal(new Set(lines.map(x=>x.id)).size,lines.length);
  for(const line of lines){
    assert.ok(!line.text.includes('—'),line.id);
    assert.ok(
      !/\b(additionally|align with|boasts|bolstered|crucial|delve|emphasizing|enduring|enhance|essential|fostering|garner|highlight|interplay|intricate|key|landscape|meticulous|perfectly|pivotal|showcase|significant|tapestry|testament|underscore|valuable|vibrant|robust|holistic|transformative|empowering|seamless|leverage|cacophony|predatory)\b/i.test(line.text),
      line.id
    );
    assert.ok(!/\bnot (?:just|only)\b/i.test(line.text), line.id);
    assert.ok(!/\bnot\b[^.!?;]{0,80}\bbut\b/i.test(line.text), line.id);
    assert.ok(line.text.length<220,line.id);
  }
});
const report={passed:0,failed:0,dialogueLines:Object.values(data.pools).flat().length,checks:[]};
for(const {name,fn} of tests){try{fn();report.passed++;report.checks.push({name,ok:true});}catch(error){report.failed++;report.checks.push({name,ok:false,error:error.message});}}
console.log(JSON.stringify(report,null,2));
process.exitCode=report.failed?1:0;
