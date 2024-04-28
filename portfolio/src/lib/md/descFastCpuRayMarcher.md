We implement a rendering engine using the Ray Marcher
method based on Sphere Tracing, a well-known technique
for rendering implicit functions. This method is used in
computer graphics for a variety of effects. Although
fast implementations are usually programmed on the GPU,
we focus optimization on CPU by employing a systematic
approach summarized in four phases. Eliminating memorybound issues and unnecessary computations initially and after leveraging vectorization we obtain a speed-up of 32.1×.
Finally, we suggest the use of multithreading to extend our
implementation for real-time rendering.




[Report](https://github.com/devnio/Optimized-CPU-Ray-Marcher/blob/master/49_report.pdf)