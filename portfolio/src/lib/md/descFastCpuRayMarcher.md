# A highly optimized CPU rendering engine

We implement a rendering engine using the Ray Marcher method based on Sphere Tracing, a well-known technique
for rendering implicit functions. This method is used in computer graphics for a variety of effects. Although
fast implementations are usually programmed on the GPU, we focus optimization on CPU by employing a systematic
approach summarized in four phases. Eliminating memorybound issues and unnecessary computations initially and after leveraging SIMD vectorization we obtain a speed-up of 32×.
Finally, we suggest the use of multithreading to extend our implementation for real-time rendering.

## Some example renderings

### Baseline scene

This scene was renderd using our engine, which we used as a baseline for various measurements.
<p align="center" >
  <img style="overflow:hidden; width: 100%;" src="../images/scene0.png" alt="Satellite Image of a Chicago road"/>
</p>

### Mandelbulb

Rendering implicit surfaces using geometric distances allows to more easily render fractals, as can be seen here the Mandelbulb fractal.
<p align="center" >
  <img style="overflow:hidden; width: 100%;" src="../images/mandelbulb.png" alt="Satellite Image of a Chicago road"/>
</p>

### Inception

An example rendering of our program of the infinite cube repetition with reflective material.
<p align="center" >
  <img style="overflow:hidden; width: 100%;" src="../images/inception_0.png" alt="Satellite Image of a Chicago road"/>
</p>

## More info

For further readin see our [Paper](../reports/49_report.pdf) about this project,
