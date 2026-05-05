# Visible Human: Slicer

**Live demo:** https://galmungral.github.io/visible-human-slicer/

## Rhetorical Design

### Purpose

This demo is intended for those new to 3D graphics who may assume that multi-plane CT slicing is a technically demanding problem. The goal is to show that it is not: once a volumetric dataset is loaded as a 3D texture, extracting a cross-section along any axis requires only a single texture lookup. The shader is nearly trivial.

## Technical Challenges

### Sampling a moving cross-section

**Problem.** Each plane samples a fixed 2D cross-section of the 3D texture, but the slice position changes as the slider moves.

**Solution.** Base 3D texture coordinates are pre-baked into the geometry. A displacement uniform shifts the active slice at runtime without modifying geometry.