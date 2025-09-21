precision mediump float;
precision mediump int;

attribute vec4 color;
varying vec3 vPosition;
varying vec4 vColor;
varying vec2 vUv;

void main()	{
	vUv = uv;
	vPosition = position;
	vColor = color;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1);
}