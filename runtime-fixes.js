(function(){
  'use strict';
  const KEY = 'speakio_state_v3';

  function addFailed(id) {
    const state = read() || {};
    const failed = Array.isArray(state.failed) ? state.failed : [];
    if (!failed.includes(id)) failed.push(id);
    state.failed = failed;
    write(state);
    return state.failed;
  }

  function removeFailed(id) {
    const state = read() || {};
    const failed = Array.isArray(state.failed) ? state.failed.filter(item => item !== id) : [];
    state.failed = failed;
    write(state);
    return state.failed;
  }

  function beginRepeat() {
    const phase='repeat';
    if(phase!=='normal')return;
    return { phase, ok: true };
  }

  function read(){
    try { return JSON.parse(localStorage.getItem(KEY) || 'null'); }
    catch { return null; }
  }
  function write(value){
    localStorage.setItem(KEY, JSON.stringify(value));
  }
  function today(){
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function ensureState(){
    const state = read() || {};
    state.completed = Array.isArray(state.completed) ? Array.from(new Set(state.completed.map(Number))) : [];
    state.savedWords = Array.isArray(state.savedWords) ? Array.from(new Set(state.savedWords)) : [];
    state.week = Array.isArray(state.week) && state.week.length === 7 ? state.week.map(Number) : [0,0,0,0,0,0,0];
    state.daily = state.daily && state.daily.date === today() ? state.daily : { date: today(), done: 0, listening: 0, speaking: 0 };
    state.mistakes = Array.isArray(state.mistakes) ? state.mistakes.slice(-50) : [];
    state.failed = Array.isArray(state.failed) ? Array.from(new Set(state.failed.map(Number))) : [];
    write(state);
    return state;
  }
  if(!window.SpeechRecognition && !window.webkitSpeechRecognition){
    document.documentElement.dataset.voiceSupport = 'false';
  }
  ensureState();
  window.SpeakioRuntime = Object.assign(window.SpeakioRuntime || {}, { addFailed, removeFailed, beginRepeat });
})();
