# Physically-Based Simulation

This project was part of the Physically-Based Simulation masters course at the [Computer Graphics Lab](https://cgl.ethz.ch/teaching/simulation19/home.php), ETH Zürich, Switzerland
<br/><br/>

The Goal of our project was to creat a physically-based interctive system for games. It should support both soft and rigid bodies, handle collisions and provide support for user interaction (GUI, input etc.). For this reason we used Unity as a framework for rendering while writing our own physics engine.
<br/><br/>

Our engine consists of a position based dynamics system with a Verlet integration scheme. All objects are represented by particles and constraints. In each timestep, every particle's position is predicted by an explicit integration step, then the positions are readjusted to satisfy the constraints. Collisions resolution is handled in the same way, by projection. Solving for the constraints is done iteratively in a Gauss-Seidel fashion.

## Simulation Methods

The main simulation methods we use were

- Verlet Integration based on the paper [Advanced Character Physics by Thomas Jakobsen](http://www.cs.cmu.edu/afs/cs/academic/class/15462-s13/www/lec_slides/Jakobsen.pdf)
- Rigid Body Simulation using Particles
- Collision Detection & Handling
- Soft-Body Simulation

## Results

Our project entered the [Hall of Fame](https://cgl.ethz.ch/teaching/simulation19/fame.php) by making a cinematic trailer using the Unity Game engine and our implemented physics-engine.

<p align="center" class="video-container">
 <video width="640" height="360" controls>
 <source src="../videos/trailer_softbody.mp4" type="video/mp4">
 </video>
</p>

## More info

For more information, our presentation slides are found by following [this link](https://cgl.ethz.ch/teaching/simulation19/projects/02_05_softbody.pdf).
