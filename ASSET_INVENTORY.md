# 3D Asset Inventory

Inventory of all 74 GLB assets under `static/models/` (about 4.78 MB total).
Base-model mesh counts and file sizes were read from each GLB; scene positions
and use were traced through `Resources.js` and the section constructors. The
workstation's source and license are recorded in
`static/models/technical/README.md`.
Authored static-scene descriptions are intentionally conservative: their GLB
geometry and material metadata were inspected, but a visual GLB preview tool
was not available in this environment.

| Model filename(s) | Observed visual / geometry | Scene location and current purpose | Decision |
| --- | --- | --- | --- |
| `technical/developer-workstation.glb` | Laptop-and-monitor workstation; 68 nodes, 81 primitives, about 60 KB. | Intro / Garage at `(17.25, -4.75)`; developer desk landmark. Recolored to the shared silver/graphite palette; uses a simplified box collider. | Preserve and modify in-place; retain the CC BY 3.0 attribution in the adjacent README. |
| `intro/static/{base,collision}.glb` | Static display scene (29 visual meshes) and a separate eight-mesh collision scene. | Engineering Garage at the origin; forms the existing intro environment. | Preserve; collision remains separate. |
| `intro/{a,b,d,e,h,i,m,o,s}/{base,collision}.glb` | Nine 3D letterforms spelling ABBASSI MOOHAMED; collision files are simple per-letter shapes. | Garage name display. | Preserve. |
| `intro/subtitles/{computer,engineer}/{base,collision}.glb` | Two 3D title word meshes with simple collision shapes. | Garage professional title. | Preserve; keep the additional identity copy on the workstation display. |
| `intro/arrowKey/{base,collision}.glb`, `intro/instructions/labels.glb` | Arrow-key models and a label plane; instruction textures are PNGs. | Garage driving instructions and keyboard props. | Preserve; existing touch/keyboard instructions stay in place. |
| `crossroads/static/{base,collision}.glb` | 115-mesh static crossroads scene (about 631 KB) and seven collision meshes. | Engineering Crossroads at `(0, -30)`; central navigation landmark. | Preserve the authored scene/collider; new directional signs are lightweight procedural meshes. |
| `projects/board/{structure,collision,plane}.glb` | Small board stand, simplified collision mesh, and screen plane. | Reused across seven project exhibits at the Projects Section. | Preserve and reuse; existing SVGs remain the exhibit product previews. |
| `information/static/{base-abbassi-social-instagram,collision-abbassi,instagram}.glb` | Existing social/contact landmark (31 visual meshes), simplified collision, and a textured Instagram icon model. | Information / Contact Section at `(1.2, -55)`. | Preserve; retain social interactions and add adjacent Engineering HQ terminals. |
| `playground/static/{base,collision}.glb` | Separate 119-mesh playground scene (about 162 KB) and seven collision meshes. | Optional Playground Section at `(-38, -34)`. | Preserve; keep it separate from the professional route. |
| `car/{default,cyberTruck}/{chassis,wheel,backLightsBrake,backLightsReverse,antena}.glb` | Two drivable vehicle variants with separate wheels, lights, and antenna components. | Vehicle and physics presentation across the whole world. | Preserve unchanged; do not alter vehicle collision or handling models. |
| `tiles/{a,b,c,d,e}/{base,collision}.glb` | Five small road-tile variants and matching collision meshes. | Procedural connections between Garage, Crossroads, Projects, Information, and Playground. | Preserve unchanged; route connectivity remains owned by `Tiles.js`. |
| `{brick,bowlingBall,bowlingPin,horn,lemon,webbyTrophy}/{base,collision}.glb` | Reusable small physics props (brick, bowling equipment, horn, lemon, trophy) paired with simplified colliders. | Bricks and bowling equipment serve the Playground; horn and bowling-ball effects serve the vehicle variant; lemon is used by an Easter egg. Webby Trophy is only referenced by a currently disabled distinction section. | Preserve for optional play; do not introduce these props into the professional route. |
| `wigs/{wig1,wig2,wig3,wig4}.glb` | Four small character/accessory meshes. | Existing Easter-egg/vehicle customization resources. | Preserve as optional content; not used as engineering-city decoration. |

The existing model set already supplies the car, road connectivity, project
frames, contact landmark, and a licensed developer workstation. No external
models were added or collision meshes replaced. The new signs, terminals, and
screen graphics use shared Three.js primitives and palette colors, avoiding
extra GLB downloads and retaining the existing physics architecture.

## Asset notes

- The project exhibit images are locally bundled SVG product-preview graphics,
  not externally verified product screenshots.
- No project-specific repository or live-demo URL could be verified against the
  named projects, so project panels intentionally expose no outbound project
  links. The individual GitHub, LinkedIn, Instagram, and email links in the
  Contact Section remain unchanged.
- The authored static scenes are retained rather than replaced based on
  filenames alone. Main-world physics continues to use the paired simplified
  collision assets where the original architecture expects them.
