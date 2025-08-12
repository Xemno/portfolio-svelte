# Data Driven Locomotion on Uneven Terrains

_The description provided here offers a concise overview of my master's thesis, summarizing its key objectives, methodology, and findings. For a more in-depth exploration—including detailed analysis, implementation specifics, and extended results—the complete thesis document is available upon request._

## A brief overview

<p> In this master thesis, we further improved and extended an existing character animation system for virtual production. The system developed directs biped characters through various types of terrains and is able to produce realistic high-quality animations.</p> <br>

<p> Furthermore, the learned motions are responsive, and the system can learn various types of gaits. We also explore methods to increase the ability of the system to sense the terrain environment. We further provide a data processing pipeline that imports motion captured data, labels the necessary features required, and exports them in a suitable format for the neural network. </p> <br>

<p>The data annotation tools are integrated into Unity, whereas the neural network and terrain fitting process is a standalone Python implementation. The current standard in virtual production uses motion capture methods that are relatively expensive and time-consuming. For non-human characters or hand-animated characters, the process generates a comparatively long feedback loop between animating and directing.</p>

<img class="w-full md:w-1/2"  style="overflow:hidden;  display: block; margin: 0 auto; border-radius: 20px" src="../images/master_thesis_pfnn1.gif" alt="Final system presentation" />

### Goal of the Thesis

Data driven locomotion animation controller, that

- produces high-quality motion on various terrains
- learns different gait styles

Solution: [Local Motion Phases Architecture](https://www.ipab.inf.ed.ac.uk/cgvu/basketball.pdf)

- Mixture-of-Experts architecture
- 2D local phases
- Produces fast and dynamic animations

### System Architecture

<p>The initial system architecture is build in Unity and Python. On the Unity site we import the motion capture data, process it and export the feature data for the neural network. As an example here, we extract the bone state and the phase. Then the necessary data is exported from Unity in a suitable format for the Neural Network implemented in TensorFlow to start the training procedure. </p>

<p>After that, we open up a server connection between the training infrastructure and a Unity scene to start inference from the trained model for the runtime.
We can control the character in real-time via a gamepad or keyboard. </p> <br>

<p align="center" >
  <img class="w-full md:w-1/2" style="overflow:hidden;" src="../images/master_thesis_system.png" alt="System Architecture"/>
</p>

### Local Motion Phases

- Multiple 2D phase function
- 0 ≤ phase ≤ 2π per detector
- Labeled by contact detection (with ground or objects) and a second criterion based on velocity threshold.

Data extraction process for the phase extraction

1. Threshold  toe and ankle velocities per foot
<img class="w-full md:w-1/2"  style="overflow:hidden;  display: block; margin: 0 auto; border-radius: 5px" src="../images/phase_threshold_0.gif" alt="Phase thresholds" />
2. Fit to parametric sine function to reduce parameter space
<img class="w-full md:w-1/2"  style="overflow:hidden;  display: block; margin: 0 auto; border-radius: 5px" src="../images/phase_optim0.gif" alt="Phase optimization" />
3. Interpolate 1D phase at each start to end interval of a sine
<img class="w-full md:w-1/2"  style="overflow:hidden;  display: block; margin: 0 auto; border-radius: 5px" src="../images/phase_interpolate.png" alt="Phase thresholds" />
4. Export 2D phases by mapping 1D phase to its sine and cosine value
<img class="w-full md:w-1/2"  style="overflow:hidden;  display: block; margin: 0 auto; border-radius: 5px" src="../images/dataexp_viking_skelOnly.gif" alt="Phase optimization" />

For more detailed explanation, follow [this YouTube link here](https://youtu.be/Rzj3k3yerDk?feature=shared&t=85).

### Terrain Fitting

_Fit MoCap data to terrain samples_

**Data Exported**

- Foot contact information
- Heel and toe velocities of both feet to detect ground contact
- Foot is in contact with the ground if velocity is below some threshold

**Fitting Process**

- Fitting error for each motion between the feet and the patches
<img class="w-auto m-l-2" style="overflow:hidden;" style="overflow:hidden;  display: block; margin: 0 auto; border-radius: 5px" src="../images/master_thesis_terrain_fitting.png" alt="System Architecture"/>
- Take up to 5 patches with lowest error
- Load Patches into Unity

**Use database of terrain heightmaps**

- 19 large maps created in Unreal Engine by Holden et al.
- Sample up to 20’000 patches

<p align="center" >
  <img class="w-full md:w-1/3"  style="overflow:hidden; margin: 0 auto; border-radius: 5px" src="../images/terrain_patch_0.png" alt="Terrain patch" />
  <img class="w-full md:w-1/3"  style="overflow:hidden; margin: 0 auto; border-radius: 5px" src="../images/terrain_patch_1.png" alt="Terrain patch" />
</p>

### Neural Network Architecture

The neural network system implementation is based on the [Local Motion Neural Network](https://www.ipab.inf.ed.ac.uk/cgvu/basketball.pdf) architecture. The implemented is done in Python for the data pipeline and PyTorch for the Neural Network atchitecture. A simplified system structure is depicted below. <br>

Heightmap encoding is included via a [Convolutional Neural Network](https://en.wikipedia.org/wiki/Convolutional_neural_network) that map a 32x32 heightmap to a 128 feature vector as input to the Motion prediction Network. <br>

The Gating Network is a three-layer fully connected network with hidden unit size of 64 per hidden layer that takes the phase series as input.
Its output goes through a SoftMax function because it generates blending weights to linearly blend the Expert Weights to generate the Weights of the Motion Prediction Network.

This approach is called a Mixture-of-Experts, where a number of expert weights are used to cope with the inputs in different regions of the network.
The gating network learns a high-dimensional function that decides which set of experts to use for the given input. It produces blending factors to blend an Expert Weights for the Motion Prediction Network, that predicts the next state.

The Motion Prediction Network is also a three-layer fully connected network with hidden unit size of 512 per hidden layer.

<p align="center" >
  <img class="w-full md:w-1/2" style="overflow:hidden;" src="../images/master_thesis_lmnn.png" alt="Neural Network System Architecture"/>
</p>

### Training

- The entire network is trained end-to-end utilizing the exported data generated in Unity.
- Each input and output frame are stacked into matrices X and Y that are then normalized.

- The goal of training this network is that for a given set of inputs X. we can produce the corresponding output variables Y, which is a typical regression task, with the following cost function.

<p align="center" >
  <img class="w-full md:w-1/2" style="overflow:hidden;" src="../images/master_thesis_cost_function.png" alt="Neural Network System Architecture"/>
</p>

- Stochastic gradient descent with warm restart technique

- Models trained for 150 epochs

> We use the stochastic gradient descent algorithm with the warm restart technique, which automatically calculates the derivatives of the cost function with respect to α and µ. As AdamWR does the regularization within the optimization procedure, no regularization term is contained in the cost function.

### Results

_Briefly summarized_

<p> The LMPNN is able to produce high-quality motion on flat terrain even when presented with
merely less than five minutes of motion capture data. When presented with the task of predicting
motion on uneven terrain the network requires more data and at least 100 epochs of training
time to yield good results. The results on various uneven terrain types are satisfying, the motion
doesn’t get stuck and looks natural, though there is room for improvement. </p> <br>

<p> The system was capable of producing pleasant motion on flat terrain, it can traverse slopes and
stairs and walk on uneven terrain with limited height differences. Because, if the terrain obstacle
in front of the character was extremely tall the motion started to look unnatural. However, this
is reasonable considering the training data did not include this type of terrain obstacles nor did
it include motion involving the character climbing over obstacles. </p> <br>

<p>The character's motion is predicted on the horizontal plane without height data. When trained only on flat terrain, the character jumps unnaturally at each stairstep due to runtime ground projection. However, training on varied terrain (including stairs and uneven ground) produced much smoother motion—minimal, unnoticeable jumps—suggesting the network learned to adapt animations appropriately for elevation changes. </p> <br>

<p>Jogging, sideways movement, and right turns appear natural, but left turns are slower and less responsive compared to right turns—both during walking and standing. This issue persists despite testing the network on mirrored data (including sharp left/right turns), suggesting a runtime script problem. Notably, the same left-turn delay was observed in the PFNN implementation, which uses the same script. </p> <br>
