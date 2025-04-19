uniform sampler3D image3d;
uniform float z;
uniform int axis;

in vec2 vTexCoord;
out vec4 fragColor;

void main() {
  vec3 uv = axis == 0 
    ? vec3(vTexCoord.x, vTexCoord.y, z) 
    : axis == 1 
    ? vec3(vTexCoord.x, z, vTexCoord.y) 
    : vec3(z, vTexCoord.x,  vTexCoord.y);

  fragColor = texture(image3d, uv);
}