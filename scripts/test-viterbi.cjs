const assert=require('node:assert/strict');
const {model:m,decode}=require('../docs/assets/js/viterbi.js');
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-10);
close(m.start.reduce((a,b)=>a+b),1);m.transition.forEach((r,i)=>close(r.reduce((a,b)=>a+b)+m.end[i],1));m.emission.forEach(r=>close(r.reduce((a,b)=>a+b),1));
let best=-Infinity,path;
for(let i=0;i<3;i++)for(let j=0;j<3;j++)for(let k=0;k<3;k++){
const score=Math.log(m.start[i]*m.emission[i][0]*m.transition[i][j]*m.emission[j][1]*m.transition[j][k]*m.emission[k][2]*m.end[k]);if(score>best){best=score;path=[i,j,k];}}
const r=decode(m);close(r.score,best);assert.deepEqual(r.path,path);assert.deepEqual(path,[0,1,2]);
// A strong END transition must be able to overturn the pre-termination winner.
const altered={...m,end:[.99,.005,.005]};const a=decode(altered);let exhaustive=-Infinity;
for(let i=0;i<3;i++)for(let j=0;j<3;j++)for(let k=0;k<3;k++)exhaustive=Math.max(exhaustive,Math.log(altered.start[i]*altered.emission[i][0]*altered.transition[i][j]*altered.emission[j][1]*altered.transition[j][k]*altered.emission[k][2]*altered.end[k]));close(a.score,exhaustive);
console.log('PASS: normalized demo model; Viterbi matches exhaustive enumeration, including END transitions.');
