---
title: "POS Tagging with Hidden Markov Models"
card_title: "POS Tagging"
slug: pos-tagging
order: 2
category: "Probabilistic modelling"
technologies: "Python · NumPy · HMM · Viterbi"
summary: "Implementing an HMM-based part-of-speech tagger with Viterbi decoding, smoothing and unknown-word handling."
description: "A from-scratch probabilistic sequence-tagging project with an interactive Viterbi walkthrough."
math: true
demo: viterbi
---

Part-of-speech tagging assigns a grammatical category to each word in a sentence, taking into account its context. In this project, I implemented a supervised Hidden Markov Model (HMM) in Python, together with a Viterbi decoder, to explore how probabilistic assumptions and dynamic programming can solve a practical sequence-labelling problem. I developed the training and inference pipeline from scratch and evaluated how smoothing and unknown-word handling affect prediction accuracy.

## Model and implementation

The HMM treats words as observations and grammatical tags as hidden states. Each tag depends on the previous tag, while the observed word depends on its current tag. I estimated transition and emission probabilities directly from an annotated corpus, including START and END transitions to represent sentence boundaries. To avoid zero probabilities for unseen events, I used additive smoothing with coefficient $\lambda$; infrequent words are mapped to an `<UNK>` token that can also be used at inference time.

$$
A_{u,v}=\frac{c(u,v)+\lambda}{c(u,\cdot)+\lambda\lvert T\rvert},\qquad
B_t(w)=\frac{c(t,w)+\lambda}{c(t)+\lambda\lvert V\rvert}.
$$

Here, $\lvert T\rvert$ is the number of transition states considered by the implementation and $\lvert V\rvert$ is the vocabulary size. For decoding, I implemented Viterbi in log space to avoid numerical underflow and recover the globally highest-scoring tag sequence, rather than making independent decisions for each word. Its recurrence is

$$
D_i(t)=\log B_t(w_i)+\max_u\left[D_{i-1}(u)+\log A_{u,t}\right].
$$

Backpointers preserve the best preceding state, enabling reconstruction of the optimal sequence after the final END transition. For a sentence containing $n$ words and $m$ tags, the algorithm runs in $O(nm^2)$ time.

## Interactive Viterbi walkthrough

The interactive example below illustrates how the dynamic-programming table is filled and how backtracking recovers the most likely sequence. It uses a small illustrative probability model rather than the trained model used in the experiments.

{% include viterbi-demo.html %}

## Results

I trained the model on approximately 13,000 annotated sentences and evaluated it on about 1,400 test sentences, comparing different additive-smoothing coefficients. The best reported token accuracy was 94.07% with $\lambda=0.01$, an improvement of 2.95 percentage points over add-one smoothing. Sentence-level accuracy at low smoothing was approximately 29.7%, reflecting the stricter requirement that every tag in a sentence must be correct.

The experiments also helped explain individual errors. Ambiguous words such as “houses” can be difficult to classify when the model lacks semantic context, and strong END-transition probabilities can influence predictions near sentence boundaries. These observations reinforced an important lesson: exact Viterbi decoding finds the best sequence under the model, but cannot compensate for the limitations of its first-order assumptions.

## Outcome and resources

The project brought together probability estimation, numerical stability, dynamic programming and error analysis in a complete NLP implementation. It also showed how comparatively small design choices—particularly smoothing and unknown-word treatment—can substantially affect performance.

<div class="resource-box" markdown="1">

[Full technical report (PDF)](https://raw.githubusercontent.com/alberto-cardini/POS-tagging-with-HMM/main/project-report.pdf) · [GitHub repository](https://github.com/alberto-cardini/POS-tagging-with-HMM) · [Training code](https://github.com/alberto-cardini/POS-tagging-with-HMM/blob/main/src/train.py) · [Viterbi decoder](https://github.com/alberto-cardini/POS-tagging-with-HMM/blob/main/src/viterbi.py)

</div>
