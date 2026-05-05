uniform sampler3D image3d;

in vec3 vTexCoord;
out vec4 fragColor;

void main() {
  fragColor = texture(image3d, vTexCoord);
}