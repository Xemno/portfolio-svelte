import * as THREE from 'three';

export function toScreenPosition(
	obj: THREE.Object3D,
	camera: THREE.Camera,
	renderer: THREE.WebGLRenderer
): THREE.Vector2 {
	let vector = new THREE.Vector3();

	// TODO: need to update this when resize window
	let widthHalf = 0.5 * renderer.getContext().canvas.width;
	let heightHalf = 0.5 * renderer.getContext().canvas.height;

	obj.updateMatrixWorld();
	vector.setFromMatrixPosition(obj.matrixWorld);
	vector.project(camera);

	vector.x = vector.x * widthHalf + widthHalf;
	vector.y = -(vector.y * heightHalf) + heightHalf;

	return new THREE.Vector2(vector.x, vector.y);
}

// TODO: https://stackoverflow.com/questions/29884485/threejs-canvas-size-based-on-container

export function toWorldPosition(
	screenPos: THREE.Vector2,
	camera: THREE.Camera,
	renderer: THREE.WebGLRenderer
): THREE.Vector3 {

	let vec = new THREE.Vector3();
	let pos = new THREE.Vector3();

	// TODO: maybe use this instead of window.innerWidth 
	// let widthHalf = 0.5 * renderer.getContext().canvas.width;
	// let heightHalf = 0.5 * renderer.getContext().canvas.height;

	vec.set(
		(screenPos.x / window.innerWidth) * 2 - 1,
		- (screenPos.y / window.innerHeight) * 2 + 1,
		-0.5,
	);
	
	vec.unproject(camera);
    vec.sub( camera.position );                
	vec.normalize();

	let distance = - camera.position.z / vec.z;
	pos.copy(camera.position).add(vec.multiplyScalar(distance));
	return pos;
}

export function randomPointsInBufferGeometry(
	geometry: THREE.BufferGeometry,
	n: number
): Array<THREE.Vector3> {
	let i: number;
	let totalArea: number = 0;
	let vertices = geometry.attributes.position.array;
	let cumulativeAreas: Array<number> = [];
	let vA: THREE.Vector3, vB: THREE.Vector3, vC: THREE.Vector3;

	// precompute face areas
	vA = new THREE.Vector3();
	vB = new THREE.Vector3();
	vC = new THREE.Vector3();

	// geometry._areas = [];
	var il = vertices.length / 9;

	for (i = 0; i < il; i++) {
		vA.set(vertices[i * 9 + 0], vertices[i * 9 + 1], vertices[i * 9 + 2]);
		vB.set(vertices[i * 9 + 3], vertices[i * 9 + 4], vertices[i * 9 + 5]);
		vC.set(vertices[i * 9 + 6], vertices[i * 9 + 7], vertices[i * 9 + 8]);

		totalArea += triangleArea(vA, vB, vC);

		cumulativeAreas.push(totalArea);
	}

	// binary search cumulative areas array
	function binarySearchIndices(value: number) {
		function binarySearch(start: number, end: number) {
			// return closest larger index
			// if exact number is not found

			if (end < start) return start;

			var mid = start + Math.floor((end - start) / 2);

			if (cumulativeAreas[mid] > value) {
				return binarySearch(start, mid - 1);
			} else if (cumulativeAreas[mid] < value) {
				return binarySearch(mid + 1, end);
			} else {
				return mid;
			}
		}

		let result = binarySearch(0, cumulativeAreas.length - 1);
		return result;
	}

	// pick random face weighted by face area

	let r: number;
	let index: number;
	let result: Array<THREE.Vector3> = [];

	for (i = 0; i < n; i++) {
		r = Math.random() * totalArea;

		index = binarySearchIndices(r);

		// result[ i ] = GeometryUtils.randomPointInFace( faces[ index ], geometry, true );
		vA.set(vertices[index * 9 + 0], vertices[index * 9 + 1], vertices[index * 9 + 2]);
		vB.set(vertices[index * 9 + 3], vertices[index * 9 + 4], vertices[index * 9 + 5]);
		vC.set(vertices[index * 9 + 6], vertices[index * 9 + 7], vertices[index * 9 + 8]);
		result[i] = randomPointInTriangle(vA, vB, vC);
	}

	return result;
}

/*
 ** Private Methods
 */

// Get random point in triangle (via barycentric coordinates)
// 	(uniform distribution)
// 	http://www.cgafaq.info/wiki/Random_Point_In_Triangle
function randomPointInTriangle(
	vectorA: THREE.Vector3,
	vectorB: THREE.Vector3,
	vectorC: THREE.Vector3
) {
	let vector = new THREE.Vector3();
	let point = new THREE.Vector3();

	let a = Math.random();
	let b = Math.random();

	if (a + b > 1) {
		a = 1 - a;
		b = 1 - b;
	}

	let c = 1 - a - b;

	point.copy(vectorA);
	point.multiplyScalar(a);

	vector.copy(vectorB);
	vector.multiplyScalar(b);

	point.add(vector);

	vector.copy(vectorC);
	vector.multiplyScalar(c);

	point.add(vector);

	return point;
}

// Get triangle area (half of parallelogram)
// http://mathworld.wolfram.com/TriangleArea.html
function triangleArea(vectorA: THREE.Vector3, vectorB: THREE.Vector3, vectorC: THREE.Vector3) {
	let vector1 = new THREE.Vector3();
	let vector2 = new THREE.Vector3();

	vector1.subVectors(vectorB, vectorA);
	vector2.subVectors(vectorC, vectorA);
	vector1.cross(vector2);

	return 0.5 * vector1.length();
}
