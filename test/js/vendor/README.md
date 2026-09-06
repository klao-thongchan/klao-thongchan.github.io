# Three.js contour field dependency

`three-field.min.js` is a local, minified ES module built from **three@0.180.0**
with **esbuild@0.25.9**. Only the exports in `three-field.entry.js` are retained.
The MIT license is in `THREE-LICENSE.txt`. No runtime CDN or CSP changes are needed.

Rebuild from the repository root (temporary tools stay outside the site):

```sh
npm install --prefix /tmp/klao-three-build --no-audit --no-fund --ignore-scripts three@0.180.0 esbuild@0.25.9
NODE_PATH=/tmp/klao-three-build/node_modules /tmp/klao-three-build/node_modules/.bin/esbuild test/js/vendor/three-field.entry.js --bundle --minify --format=esm --outfile=test/js/vendor/three-field.min.js
```

The optional module is about 474 KiB uncompressed and is loaded after page startup,
only for fine-pointer devices without reduced motion, Save-Data, or reported memory
of 2 GiB or less. The field has 1,664 vertices, 1,638 line segments and one draw call.
Rendering is limited to 30 fps while settling after input; no frames are scheduled
once settled or offscreen. The backing buffer is capped at 720,000 pixels, with no
multisampling, depth, stencil, textures, lighting, or post-processing. Hidden tabs
and page exits dispose the renderer and GPU context; returning recreates the field.
Unsupported WebGL and context loss leave the CSS background intact.

Design references: [rendering on demand](https://threejs.org/manual/en/rendering-on-demand.html)
and [responsive resolution](https://threejs.org/manual/en/responsive.html).
These budgets limit the effect's work; total browser RAM varies by browser/device.

Verification: run `node test/verify.js`, then serve the repository locally and open
`/scripts/verify-cursor-field.html` in a WebGL2 desktop browser with reduced motion
disabled. Its eight checks instrument GPU draw calls, cursor response, frame budget,
idle/offscreen pauses, pixel budget, and teardown. Keep the check tab active until complete.
