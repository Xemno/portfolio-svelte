precision mediump float;
precision mediump int;

varying vec3 vPosition;
varying vec4 vColor;
varying vec2 vUv;

uniform float time;
uniform float blend;
uniform sampler2D tex1;
uniform sampler2D tex2;

// float length = 10.;

// mat2 scale(vec2 scale) {
// 	return mat2(scale.x, 0.0,
// 				0.0, scale.y);
// }

// mat3 k = mat3(
// 	-0.3, 0., 1.,
// 	-0.4, 0., 1.,
// 	2., 0., 1.
// );

float displaceAmount = 0.3;

void main()	{
	float invblend = 1.0 - blend;
	
	vec4 image1 = texture2D(tex1, vUv);
	vec4 image2 = texture2D(tex2, vUv);

	float t1 = ((image2.x * displaceAmount) * blend) * 2.0;
	float t2 = ((image1.x * displaceAmount) * invblend) * 2.0;

	vec4 imageA = texture2D(tex2, vec2(vUv.x, vUv.y - t1)) * invblend;
	vec4 imageB = texture2D(tex1, vec2(vUv.x, vUv.y + t2)) * blend;

	gl_FragColor = imageA.bbra * blend + imageA * invblend + imageB.bbra * invblend + imageB * blend;
}