# A highly optimized CPU rendering engine

The full thesis is available: [CPU Rendering Engine Project Report](../reports/49_report.pdf).

### Short Summary

<p>In this project work at ETH Zurich in a small team of four we designed and implemented  a rendering engine using the Ray Marcher method based on Sphere Tracing from the ground up. Sphere Tracing is a well-known technique
for rendering implicit functions. This method is used in computer graphics for a variety of effects. Although
fast implementations are usually programmed on the GPU, we focus optimization on CPU by employing a systematic
approach summarized in four phases. </p> <br>

<p>Eliminating memorybound issues and unnecessary computations initially and after leveraging SIMD vectorization we obtain a speed-up of 32×. Finally, we suggest the use of multithreading to extend our implementation for real-time rendering. </p> <br>

## Some example renderings

### Baseline scene

This scene was renderd using our engine, which we used as a baseline for various measurements.

<img class="w-full md:w-1/2"  style="overflow:hidden;  display: block; margin: 0 auto; border-radius: 5px" style="overflow:hidden; width: 100%;" src="../images/scene0.avif" alt="Satellite Image of a Chicago road"/>

### Mandelbulb

Rendering implicit surfaces using geometric distances allows to more easily render fractals, as can be seen here the Mandelbulb fractal.

<img class="w-full md:w-1/2"  style="overflow:hidden;  display: block; margin: 0 auto; border-radius: 5px"  style="overflow:hidden; width: 100%;" src="../images/mandelbulb.avif" alt="Satellite Image of a Chicago road"/>

### Inception

An example rendering of our program of the infinite cube repetition with reflective material.

<img class="w-full md:w-1/2"  style="overflow:hidden;  display: block; margin: 0 auto; border-radius: 5px"  style="overflow:hidden; width: 100%;" src="../images/inception_0.avif" alt="Satellite Image of a Chicago road"/>
