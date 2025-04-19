in vec2 texCoord;
out vec2 vTexCoord;

void main() {
  gl_Position = vec4(position, 1.0);
  vTexCoord = texCoord;
}