import fs from 'node:fs';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const syntaxOnly = process.argv.includes('--syntax-only');
const required = ['index.html','app.js','runtime-fixes.js','build-fix.js','premium.js','sw.js','content/content-loader.js','content/a1-curriculum.json','api/coach.js'];
for (const file of required) assert.ok(fs.existsSync(file), `missing ${file}`);

for (const file of ['app.js','runtime-fixes.js','build-fix.js','premium.js','sw.js','content/content-loader.js']) {
  const source = fs.readFileSync(file, 'utf8');
  assert.ok(source.trim().length > 0, `empty ${file}`);
  try { new Function(source); } catch (error) { throw new Error(`${file}: syntax error — ${error.message}`); }
}
const moduleCheck = spawnSync(process.execPath, ['--check', 'api/coach.js'], { encoding: 'utf8' });
assert.equal(moduleCheck.status, 0, `api/coach.js: syntax error — ${moduleCheck.stderr}`);

if (syntaxOnly) {
  console.log('Speakio syntax QA OK.');
  process.exit(0);
}

const json = JSON.parse(fs.readFileSync('content/a1-curriculum.json', 'utf8'));
assert.equal(json.course.id, 'en-a1');
assert.equal(json.course.language, 'English');
assert.equal(json.course.nativeLanguage, 'Turkish');
assert.equal(json.course.level, 'A1');
assert.equal(json.units.length, 12);
assert.ok(json.review?.masteryTarget >= 0.8);
const tokens = value => String(value).toLowerCase().replace(/[.,!?;:'"“”‘’]/g,'').split(/\s+/).filter(Boolean).sort().join('|');

const ids = new Set();
for (const u of json.units) {
  assert.ok(Number.isInteger(u.id) && !ids.has(u.id), `duplicate/invalid unit ${u.id}`);
  ids.add(u.id);
  assert.ok(u.title && u.goal && u.grammar, `unit ${u.id}: missing core metadata`);
  assert.ok(Array.isArray(u.vocabulary) && u.vocabulary.length >= 8, `unit ${u.id}: vocabulary`);
  assert.ok(u.vocabulary.every(v => Array.isArray(v) && v.length === 2 && v[0] && v[1]), `unit ${u.id}: bad vocabulary pair`);
  assert.ok(Array.isArray(u.sentences) && u.sentences.length >= 4, `unit ${u.id}: sentences`);
  assert.ok(u.sentences.every(v => Array.isArray(v) && v.length === 2 && v[0] && v[1]), `unit ${u.id}: bad sentence pair`);
  assert.ok(Array.isArray(u.dialogue) && u.dialogue.length >= 2, `unit ${u.id}: dialogue`);
  assert.ok(Array.isArray(u.listening) && u.listening.length >= 4, `unit ${u.id}: listening`);
  assert.ok(new Set(u.listening).size === u.listening.length, `unit ${u.id}: duplicate listening item`);
  assert.ok(Array.isArray(u.speaking) && u.speaking.length >= 2, `unit ${u.id}: speaking`);
  assert.ok(Array.isArray(u.exercises) && u.exercises.length === 4, `unit ${u.id}: expected 4 exercises`);
  assert.deepEqual(u.exercises.map(e => e.type), ['mcq','mcq','translate','build'], `unit ${u.id}: exercise order`);
  for (const e of u.exercises) {
    assert.ok(e.q, `unit ${u.id}: exercise question`);
    if (e.type === 'mcq') {
      assert.ok(Array.isArray(e.options) && e.options.length === 4, `unit ${u.id}: mcq options`);
      assert.ok(new Set(e.options).size === e.options.length, `unit ${u.id}: duplicate mcq options`);
      assert.ok(Number.isInteger(e.answer) && e.answer >= 0 && e.answer < e.options.length, `unit ${u.id}: mcq answer`);
    }
    if (e.type === 'translate') assert.ok(typeof e.answer === 'string' && e.answer.length > 0, `unit ${u.id}: translate answer`);
    if (e.type === 'build') {
      const parts = e.parts || e.words;
      assert.ok(Array.isArray(parts) && parts.length >= 2, `unit ${u.id}: build parts`);
      assert.equal(tokens(parts.join(' ')), tokens(e.answer), `unit ${u.id}: build token mismatch`);
    }
  }
}

const index = fs.readFileSync('index.html','utf8');
assert.ok(index.includes('content/content-loader.js') && index.includes('app.js') && index.includes('premium.js'));
assert.ok(index.includes('manifest.json'));
const sw = fs.readFileSync('sw.js','utf8');
for (const asset of ['./index.html','./app.js','./runtime-fixes.js','./build-fix.js','./premium.js','./manifest.json','./content/a1-curriculum.json','./content/content-loader.js']) assert.ok(sw.includes(asset), `SW missing ${asset}`);
const manifest = JSON.parse(fs.readFileSync('manifest.json','utf8'));
assert.equal(manifest.short_name, 'Speakio');
assert.equal(manifest.display, 'standalone');
assert.ok(Array.isArray(manifest.icons) && manifest.icons.length > 0);
const coach = fs.readFileSync('api/coach.js','utf8');
assert.ok(coach.includes('AI_API_URL') && coach.includes('AI_API_KEY') && coach.includes('AI_MODEL'));

console.log(`Speakio QA OK — ${json.units.length} A1 units, ${json.units.reduce((n,u)=>n+u.exercises.length,0)} exercises, PWA assets and API contract validated.`);
