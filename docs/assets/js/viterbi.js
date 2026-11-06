/* A normalized illustrative HMM, independent of the project's trained model. */
(function () {
'use strict';
const model = {tags:['DET','NOUN','VERB'], words:['the','birds','sing'],
 start:[.65,.25,.10], transition:[[.10,.65,.20],[.10,.15,.65],[.20,.25,.25]], end:[.05,.10,.30],
 emission:[[.75,.03,.02,.20],[.05,.60,.10,.25],[.02,.08,.70,.20]]};
function decode(m) {
 const n=m.words.length,k=m.tags.length,D=Array.from({length:n},()=>Array(k).fill(-Infinity)),bp=Array.from({length:n},()=>Array(k).fill(-1));
 for(let j=0;j<k;j++) D[0][j]=Math.log(m.start[j])+Math.log(m.emission[j][0]);
 for(let t=1;t<n;t++) for(let j=0;j<k;j++) for(let i=0;i<k;i++) {
  const s=D[t-1][i]+Math.log(m.transition[i][j])+Math.log(m.emission[j][t]);
  if(s>D[t][j]){D[t][j]=s;bp[t][j]=i;}
 }
 const final=D[n-1].map((x,j)=>x+Math.log(m.end[j]));
 const path=Array(n);path[n-1]=final.indexOf(Math.max(...final));
 for(let t=n-1;t>0;t--) path[t-1]=bp[t][path[t]];
 return {D,bp,final,path,score:Math.max(...final)};
}
if(typeof module!=='undefined') module.exports={model,decode};
if(typeof document==='undefined'||!document.getElementById('viterbi-demo'))return;
const result=decode(model), n=model.words.length,maxStep=2*n+1;
let step=0;
const get=id=>document.getElementById(id),fmt=x=>x.toFixed(3);
function detail(t,j){
 if(t===0){get('v-detail').textContent=`${model.tags[j]} at “${model.words[t]}”: log START ${model.start[j]} + log emission ${model.emission[j][t]} = ${fmt(result.D[t][j])}.`;return;}
 get('v-detail').innerHTML='<strong>Candidate prefixes for '+model.tags[j]+' at “'+model.words[t]+'”</strong><table><thead><tr><th>Predecessor</th><th>Previous score</th><th>log transition</th><th>log emission</th><th>Total</th></tr></thead><tbody>'+model.tags.map((tag,i)=>'<tr><th>'+tag+(result.bp[t][j]===i?' ✓':'')+'</th><td>'+fmt(result.D[t-1][i])+'</td><td>'+fmt(Math.log(model.transition[i][j]))+'</td><td>'+fmt(Math.log(model.emission[j][t]))+'</td><td>'+fmt(result.D[t-1][i]+Math.log(model.transition[i][j])+Math.log(model.emission[j][t]))+'</td></tr>').join('')+'</tbody></table><p>The largest total is stored; ✓ marks its backpointer.</p>';
}
function render(){
 const cols=Math.min(step,n), backCount=Math.max(0,step-n-1);
 get('v-table').innerHTML='<table aria-label="Viterbi log-score table"><thead><tr><th>Tag / word</th>'+model.words.map(w=>'<th>'+w+'</th>').join('')+'</tr></thead><tbody>'+model.tags.map((tag,j)=>'<tr><th>'+tag+'</th>'+model.words.map((w,t)=>'<td class="'+(t===cols-1&&step<=n?'current ':'')+(backCount>0&&t>=n-backCount&&result.path[t]===j?'path':'')+'">'+(t<cols?'<button type="button" data-t="'+t+'" data-j="'+j+'" aria-label="Inspect '+tag+' at '+w+'">'+fmt(result.D[t][j])+'</button>':'—')+'</td>').join('')+'</tr>').join('')+'</tbody></table>';
 const messages=['Start with an empty score table. All scores use natural logarithms.','Initialize the first word: log P(tag | START) + log P(the | tag).','For “birds”, compare all predecessor tags for each current state. Store the maximum and its backpointer.','For “sing”, repeat the recurrence. The best tag in each column alone does not yet define the optimal sequence.','Terminate by adding log P(END | tag): '+model.tags.map((t,j)=>t+' '+fmt(result.final[j])).join('; ')+'. Choose '+model.tags[result.path[n-1]]+'.','Backtrack: select the final VERB state after accounting for END.','Follow the stored backpointer from VERB to NOUN.','Follow the last backpointer to DET. Optimal sequence: DET → NOUN → VERB. Joint log-score including END: '+fmt(result.score)+'.'];
 get('v-status').textContent=`Step ${step} of ${maxStep}. ${messages[step]}`;
 get('v-prev').disabled=step===0;get('v-next').disabled=step===maxStep;
 get('v-detail').textContent='';
 get('v-table').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>detail(Number(b.dataset.t),Number(b.dataset.j))));
}
get('v-prev').addEventListener('click',()=>{step=Math.max(0,step-1);render();});
get('v-next').addEventListener('click',()=>{step=Math.min(maxStep,step+1);render();});
get('v-reset').addEventListener('click',()=>{step=0;render();});
get('v-finish').addEventListener('click',()=>{step=maxStep;render();});
get('v-model').innerHTML='<p>START: '+model.start.map((p,i)=>model.tags[i]+' '+p).join(', ')+'.</p><table><caption>Transition probabilities (each row sums to one including END)</caption><thead><tr><th>From</th>'+model.tags.map(t=>'<th>'+t+'</th>').join('')+'<th>END</th></tr></thead><tbody>'+model.tags.map((t,i)=>'<tr><th>'+t+'</th>'+[...model.transition[i],model.end[i]].map(p=>'<td>'+p+'</td>').join('')+'</tr>').join('')+'</tbody></table><table><caption>Emission probabilities (each row sums to one)</caption><thead><tr><th>Tag</th>'+[...model.words,'UNK'].map(t=>'<th>'+t+'</th>').join('')+'</tr></thead><tbody>'+model.tags.map((t,i)=>'<tr><th>'+t+'</th>'+model.emission[i].map(p=>'<td>'+p+'</td>').join('')+'</tr>').join('')+'</tbody></table>';
render();
})();
