# Web assets for mockup v0.33 (demo.hiloni.xyz)

Copy this folder's contents into the repo's `docs/` folder, next to `index.html` (the mockup):

| Path in docs/ | What | Size |
|---|---|---|
| media/Loni_Intro_Tour_v1.mp4 | Marketing's 3:50 tour video (from Marketing/Video/Loni_Intro_Tour_v1) | 47 MB |
| media/Loni_Intro_Tour_v1_poster.jpg | Poster frame | 26 KB |
| models/kokoro/kokoro-v1.0.int8.onnx | Kokoro-82M v1.0 voice model, int8 (kokoro-onnx release model-files-v1.0) | 92 MB |
| models/kokoro/af_heart.bin | Voice "Heart" style vectors (float32 510x256), from voices-v1.0.bin | 0.5 MB |
| models/kokoro/vocab.json | Phoneme vocabulary (kokoro-onnx config) | 1 KB |
| vendor/loni-voice.js | In-browser voice engine (esbuild bundle of loni-voice.src.js) | 1.4 MB |
| vendor/ort/ort-wasm-simd-threaded.{wasm,mjs} | ONNX Runtime Web 1.20.1 | 11 MB |

The mockup loads these with relative paths when served from demo.hiloni.xyz, and from https://demo.hiloni.xyz/ when opened as a local file.
If anything is missing, Loni falls back to the browser voice and the tour button shows an error toast.

Licenses: Kokoro-82M (Apache-2.0), kokoro-onnx files (MIT), ONNX Runtime Web (MIT), phonemizer.js with espeak-ng (GPL-3.0; bundled in loni-voice.js, source: npm "phonemizer" 1.2.1 and github.com/espeak-ng/espeak-ng). Text normalisation adapted from kokoro-js 1.2.1 (Apache-2.0).
