# DeXplicit project page

A self-contained, anonymous research project page with real model-result videos. No build step or external libraries are required.

## Open

The website entry point is `index.html` at the repository root. Keep the JavaScript, stylesheet, and complete `assets/` folder alongside it. All media and page resources use relative paths, so the site can be served from a repository subdirectory.

For a local preview, open `index.html` in a modern browser or run `python3 -m http.server 8765 --bind 127.0.0.1` from this directory and visit `http://127.0.0.1:8765`.

## Contents

- Four selected HOT3D appendix cases, with synchronized reference/model playback, frame scrubbing, viewing-speed selection, and matched crop/full-frame toggles.
- Four actual 3D forecasts with synchronized ground-truth RGB, DeXplicit prediction, and ground-truth 3D, plus shared playback and frame controls.
- Three paper comparisons of articulation and deformation over recorded scene photographs.
- Three generated-history causal videos, with the same crops used in the paper.
- An explanation of the method and actual geometry, hand-action, and appearance-transport streams.
- The paper's long-horizon moved-point error values on HOT3D, OakInk2, and PhysTwin.

## Scientific labels

The 14B and causal rendering examples use supplied future geometry. They are labeled separately from actual 3D forecasting results. The causal paper illustrations overlap the causal training population; their protocol note is retained. Photographic 3D overlays are explicitly identified as recorded backgrounds. Selected example errors and full-cohort benchmark errors are not conflated.

Generated RGB was not retouched or frame-interpolated. Crops and viewing-speed changes affect presentation only. The original 3D visualization clips are preserved. Displayed 3D panels crop only surrounding titles and whitespace from those clips; the plotted points and fixed camera are unchanged. Matched recorded RGB and both 3D panels show states 0–32 at the same viewing speed.

## Edit

- `index.html`: text and page structure.
- `style.css`: desktop and mobile styling.
- `data.js`: gallery selections, media locations, and captions.
- `app.js`: synchronized playback and interactive selectors.
- `assets/`: all local video, image, and icon files.

The page has no analytics, external fonts, trackers, or runtime dependencies. Media is loaded conservatively and off-screen playback pauses. Reduced-motion preferences disable automatic previews.

Author names, affiliations, personal repository links, and local source paths are omitted for anonymous review. The repository contains only the website and its media; internal curation notes and source archives are excluded.
