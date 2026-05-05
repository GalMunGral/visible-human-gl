uniform vec3 displacement;

in vec3 uv3;

out vec3 vTexCoord;

void main() {
  vTexCoord = uv3 + displacement;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}