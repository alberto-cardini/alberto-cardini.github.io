'use strict';
// Small, normalised teaching model; independent of the trained WSJ model.
const toyHMM = {
  tags: ['DET', 'NOUN', 'VERB'], words: ['the', 'birds', 'sing'],
  start: [.70,.20,.10],
  transition: [[.05,.90,.05],[.10,.10,.80],[.60,.30,.10]],
  emission: [[.85,.01,.01,.13],[.01,.70,.10,.19],[.01,.10,.75,.14]]
};
function decode(model) {
  const scores = [], back = [];
  for(let t=0;t<model.words.length;t++) {
    scores[t]=[]; back[t]=[];
    for(let j=0;j<model.tags.length;j++) {
      if(t===0) {scores[t][j]=Math.log(model.start[j])+Math.log(model.emission[j][t]);back[t][j]=-1;}
      else {const candidates=scores[t-1].map((v,i)=>v+Math.log(model.transition[i][j]));
        const best=Math.max(...candidates);back[t][j]=candidates.indexOf(best);scores[t][j]=best+Math.log(model.emission[j][t]);}
    }
  }
  const path=[scores.at(-1).indexOf(Math.max(...scores.at(-1)))];
  for(let t=scores.length-1;t>0;t--)path.unshift(back[t][path[0]]);
  return {scores,back,path};
}
const solved = decode(toyHMM);
function renderTrellis(step,root) {
  const xs=[145,355,565],ys=[65,130,195];
  let svg='<svg viewBox="0 0 690 250" role="img" aria-label="Log-score trellis. Green indicates the final best path during backtracking.">';
  toyHMM.words.forEach((word,t)=>{svg+=`<text x="${xs[t]}" y="24" text-anchor="middle" fill="#243239" font-size="16">${word}</text>`;});
  toyHMM.tags.forEach((tag,j)=>{svg+=`<text x="10" y="${ys[j]+5}" fill="#637178" font-size="11">${tag}</text>`;});
  for(let t=1;t<3;t++)for(let j=0;j<3;j++)for(let i=0;i<3;i++) {
    const traced=step>=5 && t>=7-step && solved.path[t]===j && solved.path[t-1]===i;
    const retained=step>=t+1 && solved.back[t][j]===i;
    svg+=`<line x1="${xs[t-1]+41}" y1="${ys[i]}" x2="${xs[t]-41}" y2="${ys[j]}" stroke="${traced?'#17676b':retained?'#91b3b3':'#e4eaea'}" stroke-width="${traced?3:retained?1.7:1}" ${!retained?'stroke-dasharray="3 4"':''}/>`;
  }
  for(let t=0;t<3;t++)for(let j=0;j<3;j++) {
    const traced=step>=4 && t>=6-step && solved.path[t]===j;
    const visible=step>t;
    svg+=`<rect x="${xs[t]-41}" y="${ys[j]-20}" width="82" height="40" rx="6" fill="${traced?'#17676b':visible?'#e8f1f0':'#fff'}" stroke="${traced?'#17676b':'#c9d9d8'}"/><text x="${xs[t]}" y="${ys[j]+4}" text-anchor="middle" fill="${traced?'white':'#3d6265'}" font-size="13">${visible?solved.scores[t][j].toFixed(3):'—'}</text>`;
  }
  svg+='<text x="345" y="241" text-anchor="middle" fill="#637178" font-size="10">Log scores · solid lines retain the best predecessor for each state</text></svg>';
  root.querySelector('#trellis').innerHTML=svg;
}
function drawVolume(step) {
  const canvas=document.querySelector('#volume'), ctx=canvas.getContext('2d');
  ctx.fillStyle='#edf3f2';ctx.fillRect(0,0,720,260);
  for(let i=0;i<5;i++) {
    const x=55+i*17,y=62-i*7;
    ctx.fillStyle='#c5d9d5';ctx.strokeStyle='#8caea7';ctx.fillRect(x,y,160,150);ctx.strokeRect(x,y,160,150);
  }
  ctx.fillStyle='#dfebe5';ctx.fillRect(123,34,160,150);
  ctx.fillStyle='#8bada1';ctx.beginPath();ctx.ellipse(203,109,55,65,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#dce8df';ctx.beginPath();ctx.ellipse(203,109,37,48,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#7b9d90';ctx.beginPath();ctx.ellipse(210,103,12,22,.3,0,Math.PI*2);ctx.fill();
  if(step>0){ctx.strokeStyle='#17676b';ctx.lineWidth=3;ctx.strokeRect(160,70,65,65);ctx.lineWidth=1;ctx.setLineDash([5,5]);ctx.beginPath();ctx.moveTo(225,70);ctx.lineTo(390,65);ctx.moveTo(225,135);ctx.lineTo(390,160);ctx.stroke();ctx.setLineDash([]);}
  ctx.font='12px sans-serif';ctx.textAlign='center';ctx.fillStyle='#536d65';ctx.fillText('Synthetic volume',190,236);
  if(step>0){ctx.fillStyle='#dbe8df';ctx.fillRect(390,65,95,95);ctx.strokeStyle='#17676b';ctx.strokeRect(390,65,95,95);ctx.fillStyle='#70968a';ctx.beginPath();ctx.ellipse(435,111,25,38,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#536d65';ctx.fillText(step===1?'Overlapping patch':step===2?'Network prediction':'Weighted patch',438,187);}
  if(step===2){ctx.strokeStyle='#17676b';for(let i=0;i<3;i++)ctx.strokeRect(512+i*8,76+i*8,42,42);ctx.fillStyle='#536d65';ctx.fillText('3D network',550,187);}
  if(step===3){const grad=ctx.createRadialGradient(595,112,3,595,112,46);grad.addColorStop(0,'#397f6d');grad.addColorStop(1,'#e3eee7');ctx.fillStyle=grad;ctx.fillRect(550,65,95,95);ctx.fillStyle='#536d65';ctx.fillText('Gaussian weights',595,187);}
}
const descriptions={
  viterbi:[
    'Start with three words and three candidate tags. Each column will store the best log-score ending in each tag.',
    '1 · Initialise “the”: log P(tag at start) + log P(the | tag). DET has the highest score, but all three candidates are retained.',
    '2 · For “birds”, compare every predecessor for each tag. Add the transition and emission log-probabilities, then retain the maximum and its backpointer.',
    '3 · Repeat for “sing”. Each score now represents the best full prefix ending in that tag. VERB is the best final state.',
    '4 · Begin backtracking from VERB at “sing”. Choosing the highest final score determines which stored path to recover.',
    '5 · Follow the backpointer from VERB to NOUN at “birds”. These pointers record the earlier maximising choices.',
    '6 · Follow the last backpointer to DET. The optimal sequence is DET → NOUN → VERB. This is a globally optimal path under this toy HMM.'
  ],
  cbct:[
    '1 · Prepare the data. Rescale voxel intensities and use reflection padding to make 64 × 64 × 16 samples compatible with the network’s 64 × 64 × 64 input.',
    '2 · Extract overlapping 3D patches. Processing smaller subvolumes makes inference possible without passing the entire scan through the network at once.',
    '3 · Denoise each patch with the fine-tuned IDDNet-based residual UNet. Its 3D operations use spatial context across neighbouring slices.',
    '4 · Reconstruct the volume. Weight patch centres more strongly with a Gaussian kernel, accumulate overlapping predictions and divide by accumulated weights to reduce seams.'
  ],
  ppm:[
    'Original image · Start with the RGB pixel values of an ASCII PPM file.',
    '1 · Gaussian smoothing reduces high-frequency noise before measuring image gradients.',
    '2 · Sobel operators estimate the magnitude and direction of local intensity changes.',
    '3 · Non-maximum suppression thins the responses by keeping local maxima along the gradient direction.',
    '4 · Double thresholding separates strong edges, weak edges and non-edge pixels.',
    '5 · Hysteresis retains weak edges connected to strong edges, producing the final edge map.'
  ],
  edumeter:[
    '1 · Find a course. The intended platform gives university students a place to discover feedback about the courses they are considering.',
    '2 · Read students’ experiences. Reviews add context about workload and teaching that a course title alone cannot convey.',
    '3 · Contribute a review of a course you attended. The project is a prototype; this walkthrough does not submit or store anything.'
  ]
};
document.querySelectorAll('[data-demo]').forEach(root=>{
  const kind=root.dataset.demo,list=descriptions[kind]; let step=0,timer=null;
  const prev=root.querySelector('[data-action=prev]'),next=root.querySelector('[data-action=next]'),play=root.querySelector('[data-action=play]');
  function pause(){if(timer!==null)clearInterval(timer);timer=null;play.textContent='Play';}
  function render(){
    root.querySelector('.demo-description').textContent=list[step];
    root.querySelector('.step-count').textContent=`${step+1} / ${list.length}`;
    prev.disabled=step===0;next.disabled=step===list.length-1;
    root.querySelectorAll('.pipeline span').forEach((el,i)=>{el.classList.toggle('active',i===step);if(i===step)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');});
    if(kind==='viterbi')renderTrellis(step,root);
    if(kind==='cbct')drawVolume(step);
    if(kind==='ppm'){const img=root.querySelector('#edge-image');img.src=`https://raw.githubusercontent.com/alberto-cardini/PPM_Photo_Editor/main/assets/${step===0?'BlurSigma0.png':`Edge${step}.png`}`;img.alt=list[step];}
    if(kind==='edumeter')root.querySelector('.example-content').innerHTML=[
      '<p>Explore course information and student perspectives in one place.</p><span class="caption">Illustrative course listing</span>',
      '<p><strong>Example student review</strong><br>“Weekly exercises helped connect the theory to practical problems.”</p><span class="caption">Fictional review, not a real user testimonial</span>',
      '<p><strong>Your experience can help the next student.</strong><br>Describe what you learned, the workload and what you found useful.</p><span class="caption">Contribution flow shown for explanation only</span>'
    ][step];
  }
  prev.addEventListener('click',()=>{pause();step=Math.max(0,step-1);render();});
  next.addEventListener('click',()=>{pause();step=Math.min(list.length-1,step+1);render();});
  root.querySelector('[data-action=reset]').addEventListener('click',()=>{pause();step=0;render();});
  play.addEventListener('click',()=>{if(timer!==null){pause();return;}if(step===list.length-1){step=0;render();}play.textContent='Pause';timer=setInterval(()=>{step++;render();if(step===list.length-1)pause();},2500);});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
  render();
});
