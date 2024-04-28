
This is the Physically-Based Simulation masters course project at the [Computer Graphics Lab](https://cgl.ethz.ch/teaching/simulation19/home.php), ETH Zürich, Switzerland


The Goal of our project was to creat a physically-based interctive system for games. It should support both soft and rigid bodies, handle collisions and provide support for user interaction (GUI, input etc.). For this reason we used Unity as a framework for rendering while writing our own physics engine.

Our engine consists of a position based dynamics system with a Verlet integration scheme. All objects are represented by particles and constraints. In each timestep, every particle's position is predicted by an explicit integration step, then the positions are readjusted to satisfy the constraints. Collisions resolution is handled in the same way, by projection. Solving for the constraints is done iteratively in a Gauss-Seidel fashion.



With our project we entered the [Hall of Fame](https://cgl.ethz.ch/teaching/simulation19/fame.php) by making a cinematic trailer of our physics-engine.

For more information, our presentation slides are found by following [this link](https://cgl.ethz.ch/teaching/simulation19/projects/02_05_softbody.pdf).

