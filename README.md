# Alberto Cardini — academic portfolio

A buildless, responsive academic website for GitHub Pages. All publishable files are in `docs/`.

## Pages

- `docs/index.html`: academic introduction, experience, education, activities, and four project cards.
- `docs/projects/cbct.html`: BSc thesis on CBCT volumetric denoising, with an illustrative patch-inference walkthrough.
- `docs/projects/pos-tagging.html`: HMM POS tagging, with an interactive Viterbi trellis and backtracking.
- `docs/projects/ppm.html`: PPM image editor with actual filter-stage images from the public repository.
- `docs/projects/edumeter.html`: course-review prototype and an illustrative product walkthrough.
- `docs/cv.html`: print-friendly CV. Use the print button to save a PDF.

## GitHub Pages setup

Create the public repository `alberto-cardini.github.io` under the `alberto-cardini` account, initialised with a README. Commit this source tree to its `main` branch. Under Settings → Pages, choose Deploy from a branch, then `main` and `/docs`, and save. The intended address is `https://alberto-cardini.github.io/`; this address is not a deployment confirmation.

No build command, framework, API key, payment account, backend or third-party analytics are required. The `.openai/hosting.json` file is for local preview only and can be omitted from GitHub.

## Editing

Edit the individual HTML files for content, `docs/assets/style.css` for styling, and `docs/assets/site.js` for the walkthroughs. Keep relative links so the site also works from a project Pages subdirectory. The GitHub avatar and PPM examples load from the author's existing public GitHub assets.

## Content and verification

The content was prepared from the supplied CV and BSc thesis, and the public repositories POS-tagging-with-HMM, PPM_Photo_Editor, and EduMeter, on 5 November 2026. The thesis project is presented without naming the industrial partner. The original CV and thesis PDFs are deliberately not published because they contain that name.

The CBCT metrics reproduce Table 4.2: +0.70 dB in mean PSNR improvement, +0.016 in mean SSIM improvement, and 4.15% relative gain in mean MSE reduction versus RED-CNN. Synthetic diagrams are explicitly labelled; no clinical data or trained model is served. EduMeter is accurately described as a prototype with test authentication.

The toy HMM is normalised and its Viterbi result was verified by enumerating all 27 possible tag sequences. Its probabilities are educational and do not represent the trained WSJ model. Walkthroughs start paused, support manual stepping/reset and pause when the browser tab is hidden.

The visual direction takes inspiration from the bright, restrained academic layout at https://rikiyat.github.io/; the implementation and copy are original.
