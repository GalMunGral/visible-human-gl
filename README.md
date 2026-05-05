# Visible Human: GL Slicing

**Live demo:** https://galmungral.github.io/visible-human-gl/

## Rhetorical Design

### Purpose

Custom rendering libraries give precise control over how volumetric data is sampled and displayed, but that flexibility comes with implementation cost. This demo uses Three.js and a minimal custom GLSL shader to show that interactive multi-plane slicing — all three anatomical cross-sections simultaneously in a shared 3D scene — can be achieved with surprisingly little code.

### Strategy

A single WebGL 3D texture holds the full CT volume. Three quads — axial, coronal, and sagittal — are positioned as orthogonal planes in one Three.js scene, each sampling the texture along its respective axis via a shared fragment shader. Moving a slider updates both the mesh position in world space and the texture coordinate passed as a uniform, keeping the visual slice and its 3D location in sync. ArcballControls allow free rotation so the viewer can inspect the intersection geometry from any angle.