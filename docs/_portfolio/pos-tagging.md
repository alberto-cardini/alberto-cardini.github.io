---
title: "POS Tagging with Hidden Markov Models"
card_title: "POS Tagging"
slug: pos-tagging
order: 2
category: "Probabilistic modelling"
technologies: "Python · NumPy · HMM · Viterbi"
summary: "Learning a probabilistic model of grammatical sequences, with log-space decoding, unknown-word handling and an interactive Viterbi walkthrough."
math: true
demo: viterbi
---

## Problem and motivation

Part-of-speech tagging assigns a grammatical category to every token in a sentence. The challenge is contextual: a word such as “houses” can be a plural noun or a verb, and choosing the most frequent tag for each word independently can produce an incoherent sequence. This project builds a supervised Hidden Markov Model (HMM) and its decoder from first principles, making the relationship between data, probabilities and decisions explicit.

The project covers parameter estimation, rare-word normalization, additive smoothing, log-space Viterbi decoding, and quantitative and qualitative evaluation. The accompanying report examines not only accuracy but why particular mistakes occur.

## Model and supervised learning

Words are observations and grammatical tags are hidden states. The model makes two simplifying assumptions: a tag depends only on the preceding tag, and the current word depends only on its own tag. For a sentence with words \(w_{1:n}\) and tags \(t_{1:n}\), the joint score is

$$P(t_{1:n},w_{1:n}) = A_{\mathrm{START},t_1} B_{t_1}(w_1)\prod_{i=2}^n A_{t_{i-1},t_i}B_{t_i}(w_i)\,A_{t_n,\mathrm{END}}.$$

Here \(A_{u,v}=P(v\mid u)\) is a transition probability and \(B_t(w)=P(w\mid t)\) an emission probability. START and END are control states, not labels assigned to words. The final END transition matters: a sequence that explains the words well may still receive a low score if its last tag rarely ends a sentence.

The corpus is already annotated, so training uses counts rather than expectation-maximization or Baum–Welch. `train.py` makes two passes. The first counts word frequencies; the second collects emissions, adjacent-tag transitions, sentence starts and sentence endings. With additive smoothing coefficient \(\lambda\), the implementation estimates

$$A_{u,v}=\frac{c(u,v)+\lambda}{c(u,\cdot)+\lambda|T|},\qquad B_t(w)=\frac{c(t,w)+\lambda}{c(t)+\lambda|V|}.$$

The transition denominator uses the number of tag states, while the emission denominator uses vocabulary size. This follows the implementation and disambiguates the notation in the report. In the code, the transition state set includes the two control states; the decoder excludes them from ordinary token positions.

### Unknown words and smoothing

The default minimum word frequency is two. Training words occurring fewer than twice are replaced by `<UNK>`, which creates a learned emission distribution for unfamiliar vocabulary. At inference, every out-of-vocabulary word is mapped to the same token. This avoids a zero likelihood for an unseen word, but loses distinctions such as capitalization, morphology and suffixes.

Smoothing handles a different problem: transitions and emissions that have not appeared in the training set. Adding a small pseudocount gives them nonzero probability. Adding too much makes distributions nearly uniform, weakening the patterns that the corpus actually supports. The report evaluates this trade-off explicitly.

## Decoding with Viterbi

Viterbi finds the **globally highest-scoring tag sequence under the model**. It is not a greedy choice of the best tag at each word. For every word position and possible current tag, the dynamic program preserves the best prefix ending in that tag. In log space,

$$D_i(t)=\log B_t(w_i)+\max_u\big[D_{i-1}(u)+\log A_{u,t}\big].$$

The initial column uses START transitions. A backpointer stores the maximizing predecessor for each cell. Termination adds the END transition before choosing the final tag, after which backtracking recovers the sequence. Logarithms turn long products into sums and avoid numerical underflow. For \(n\) words and \(m\) tags, runtime is \(O(nm^2)\); the stored score and backpointer tables require \(O(nm)\) space.

```python
scores = previous_scores + log_transition_to_current + log_emission
viterbi_table[current_tag, position] = scores.max()
backpointer[current_tag, position] = scores.argmax()
```

This condensed fragment captures the core operation in `src/viterbi.py`. The actual code also normalizes unknown words and handles initial and final transitions.

## Interactive walkthrough

The following demonstration computes the recurrence in your browser. Its small, explicitly defined probability model is **illustrative**, not the trained model used for the reported benchmarks. Step through initialization, recurrence, termination and backtracking. Click a computed cell to inspect every predecessor contribution.

{% include viterbi-demo.html %}

## Experiments and results

The report trains on approximately **13,000 annotated sentences** from `batterydata/pos_tagging` and evaluates on approximately **1,400 test sentences**. It compares smoothing coefficients 0.01, 0.1, 1 and 30. Two metrics answer different questions: token accuracy measures individual labels; sentence accuracy requires every label in a sentence to be correct.

| Observation | Reported result |
|---|---|
| Token accuracy at low smoothing | Approximately 94.1% |
| Sentence accuracy at low smoothing | Approximately 29.7% |
| Best token result summarized in the CV | 94.07% with smoothing 0.01 |
| Change from add-one smoothing, as summarized in the CV | +2.95 percentage points |
| Strong smoothing, coefficient 30 | Substantial degradation as distributions flatten |

These are reported results, not a new training run. High token accuracy can coexist with modest sentence accuracy because even one mistake makes an entire sentence incorrect. The report also plots frequent tag substitutions and transition/emission heatmaps to connect aggregate accuracy to model behaviour.

### What the diagnostic sentences reveal

For “John is going to the office .”, the reported prediction is `NNP VBZ VBG TO DT NN .`. Removing the final punctuation can cause “office” to be assigned the punctuation tag. The strong learned transition from a period to END can overpower lexical evidence. This is a dataset and model interaction, not a failure of Viterbi to optimize its objective.

“The complex houses many students .” illustrates lexical ambiguity. The report obtains `DT JJ NNS JJ NNS .`, interpreting “complex” as an adjective and “houses” as a plural noun, rather than the intended noun–verb pair. The model has no representation of the sentence’s broader meaning, even though decoding considers complete paths.

A separate nonsense-word experiment uses smoothing 0.001 to investigate how syntax and `<UNK>` emissions can still yield a plausible grammatical sequence. This coefficient belongs to that diagnostic experiment and should not be confused with the main 0.01 benchmark.

## Discussion and limitations

The main lesson is that numerical stability, unknown-word treatment and smoothing are central modelling decisions. Viterbi provides exact inference for this HMM, but exact inference cannot repair inadequate assumptions or biased probabilities. A first-order model cannot express long-range grammatical dependencies, and a single unknown-word class ignores valuable lexical structure.

Natural extensions include suffix- and capitalization-aware unknown-word classes, better smoothing, higher-order transitions, or a discriminative sequence model. These are possible improvements, not results established by this project. Evaluation on a separate development split would also make smoothing selection and final test reporting easier to distinguish.

## References and resources

<div class="resource-box" markdown="1">
[Read the full technical report (PDF)](https://raw.githubusercontent.com/alberto-cardini/POS-tagging-with-HMM/main/project-report.pdf)

[GitHub repository](https://github.com/alberto-cardini/POS-tagging-with-HMM) · [Training implementation](https://github.com/alberto-cardini/POS-tagging-with-HMM/blob/main/src/train.py) · [Viterbi implementation](https://github.com/alberto-cardini/POS-tagging-with-HMM/blob/main/src/viterbi.py)

The report includes the full experimental plots and references to Rabiner’s HMM tutorial, Jurafsky and Martin’s *Speech and Language Processing*, and Chen and Goodman’s work on smoothing.
</div>
