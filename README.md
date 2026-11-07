# Alberto Cardini — academic portfolio

Live: https://alberto-cardini.github.io/

## Foundation
Integrated from [Academic Pages](https://github.com/academicpages/academicpages.github.io), commit `9e19e6318817bd3a6060a76d5af98124d394f3a0`. Its `_layouts` (including `default`, `single`, `archive`, and `compress`), `_includes`, `_sass`, localization data and Jekyll collection architecture are retained in `docs/`. Academic Pages is derived from Minimal Mistakes; the upstream MIT license is retained. `project.html` extends the upstream `single` layout. Personal styling is layered over the original Sass framework, not a replacement static site.

## Publishing
GitHub Pages source: `main`, `/docs`. There is deliberately no `.nojekyll`. `docs/_pages/about.html` has `permalink: /` and builds to `index.html`; the repository README is outside the publishing source. The four articles are the `_portfolio` collection. Existing `/projects/*.html` URLs are preserved.

## Local development
With Ruby and Bundler installed: `cd docs && bundle install && bundle exec jekyll serve`. GitHub Pages uses its managed Jekyll builder. Run `python3 scripts/validate.py docs/_site` after a local build. Interactive algorithms can be checked with `node scripts/test-viterbi.cjs`.
