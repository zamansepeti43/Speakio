import fs from 'node:fs';
import assert from 'node:assert/strict';
const json=JSON.parse(fs.readFileSync('content/a1-curriculum.json','utf8'));
assert.equal(json.course.id,'en-a1');
assert.equal(json.course.level,'A1');
assert.equal(json.units.length,12);
const ids=new Set();
for(const u of json.units){
  assert.ok(!ids.has(u.id),`duplicate unit ${u.id}`); ids.add(u.id);
  assert.ok(u.title&&u.goal&&u.grammar);
  assert.ok(Array.isArray(u.vocabulary)&&u.vocabulary.length>=4);
  assert.ok(Array.isArray(u.sentences)&&u.sentences.length>=4);
  assert.ok(Array.isArray(u.listening)&&u.listening.length>=2);
  assert.ok(Array.isArray(u.speaking)&&u.speaking.length>=1);
  assert.ok(Array.isArray(u.exercises)&&u.exercises.length>=4);
  for(const e of u.exercises){
    assert.ok(['mcq','translate','build'].includes(e.type),`${u.id}: unknown exercise ${e.type}`);
    if(e.type==='mcq'){assert.ok(Array.isArray(e.options)&&e.options.length>=2);assert.ok(Number.isInteger(e.answer));assert.ok(e.answer>=0&&e.answer<e.options.length)}
    if(e.type==='translate')assert.ok(e.answer);
    if(e.type==='build')assert.ok(Array.isArray(e.parts)||Array.isArray(e.words));
  }
}
for(const file of ['index.html','app.js','runtime-fixes.js','build-fix.js','premium.js','sw.js','manifest.json'])assert.ok(fs.existsSync(file),`missing ${file}`);
console.log(`Speakio QA OK — ${json.units.length} A1 units validated.`);