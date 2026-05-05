# Visible Human: Slicer

**Live demo:** https://galmungral.github.io/visible-human-slicer/

## Rhetorical Design

### Purpose

This demo is intended for those new to 3D graphics who may assume that multi-plane CT slicing is a technically demanding problem. The goal is to show that it is not: once a volumetric dataset is loaded as a 3D texture, extracting a cross-section along any axis requires only a single texture lookup. The shader is nearly trivial.

### Strategy

The full CT volume is stored as a 3D texture. Three orthogonal planes — axial, coronal, and sagittal — each sample that texture at a depth controlled by its slider. Free rotation allows the viewer to inspect all three planes intersecting simultaneously.