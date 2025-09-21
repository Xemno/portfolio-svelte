#define GLSLIFY 1

// Common varyings
varying vec3 v_position;
varying vec3 v_normal;
varying vec2 v_uv;

uniform float u_time;

void main()	{
	// Save the varyings
	v_uv = uv;
	v_position = position;
	v_normal = normalize(normalMatrix * normal);
	

	// Vertex shader output
	gl_Position = projectionMatrix * viewMatrix * modelMatrix * instanceMatrix * vec4(position, 1.0);

}