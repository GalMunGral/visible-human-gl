# Visible Human: Slicer

**Live demo:** https://galmungral.github.io/visible-human-slicer/

## Rhetorical Design

### Purpose

Multi-plane CT slicing may appear to be a complex rendering problem, but the underlying idea is straightforward: once a CT volume is treated as a 3D texture, slicing along any axis reduces to a single texture lookup. This demo makes that point concrete.

### Strategy

The full CT volume is stored as a 3D texture. Three orthogonal planes — axial, coronal, and sagittal — each sample that texture at a depth controlled by its slider. Free rotation allows the viewer to inspect all three planes intersecting simultaneously.