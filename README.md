# AI Replacement Map · AI 替代地图

A bilingual (EN / 中文) hand-curated map of ~106 occupations scored on AI exposure across four axes. Methodology in the open: every row is hand-set by one analyst against a transparent rubric, with an explicit per-row analytical rationale visible on click. Built around the thesis that the public conversation about "AI taking jobs" lacks a shared, defensible scoring frame, and that a small-but-defended dataset is more useful than a large auto-rated one.

The site is single-page and includes: a hero with explicit methodology disclosure (this is one analyst's structural read, not a forecast); a four-axis methodology block (R-COG / R-PHY / NR-COG / NR-INT, with the composite formula stated in mono); a four-tier legend (low 0–39, moderate 40–59, high 60–79, critical 80+) with plain-language meanings; an interactive map of 106 occupations with full search, multi-sector and multi-tier filtering, four sort modes (exposure desc/asc, alphabetical, by sector), and click-to-expand cards that reveal the four sub-score bars plus the analytical note for that role; a sector-level summary bar chart showing average exposure across the 13 sectors sampled; and a five-question Q&A panel that answers honestly — is this a prediction, why hand-curated, what's most over- and under-rated, what "exposed" actually means for an individual, and what would change the scores fast.

## Methodology

Each occupation gets four sub-scores on 0–100:

- **R-COG · routine cognitive** — repeatable text/data manipulation following a clear rule
- **R-PHY · routine physical** — repeatable physical motion in a structured environment
- **NR-COG · non-routine cognitive** — judgment under ambiguity, novel synthesis
- **NR-INT · non-routine interpersonal** — embodied presence, empathy, dexterity in unstructured settings

Composite intuition: `exposure ≈ 0.50 × R-COG + 0.30 × R-PHY − 0.40 × NR-COG − 0.30 × NR-INT`, rebased to 0–100 then hand-calibrated. The framing follows the labour-economics distinction between routine and non-routine task content. Scoring is original.

The 13 sectors covered: knowledge work, creative, healthcare & care, education, trades, manufacturing, transport, hospitality & service, security & defence, finance, legal, science & research, public service. Public occupation taxonomy is adapted from US BLS / O*NET; analytical scoring is original.

## Links

- **Live:** [ai-replacement-map.psyverse.fun](https://ai-replacement-map.psyverse.fun)
- **GitHub:** [github.com/gewenbo888/ai-replacement-map](https://github.com/gewenbo888/ai-replacement-map)

## Stack

Plain HTML, CSS, vanilla JS. No frameworks, no build step. Space Grotesk display + Inter body + Noto Sans SC Chinese + JetBrains Mono. Traffic-light palette: safe green / moderate amber / hot orange / critical rose, all on a dark `#0b0c10` background.

## About

Part of the [Psyverse](https://psyverse.fun) portfolio by [Gewenbo](https://psyverse.fun).
