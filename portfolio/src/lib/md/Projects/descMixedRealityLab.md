# Mixed Reality Lab

The [Mixed Reality Lab](https://www.microsoft.com/en-us/research/lab/mixed-reality-ai-zurich/), a masters course at ETH Zürich, is focused on building the future of mixed reality using computer vision to map and understand the environment, recognize and track relevant objects, and assist users performing tasks.
In this project we explore the synergies between mixed reality and robotics.
<br/><br/>

We used the [HoloLens 2](https://www.microsoft.com/en-us/hololens) and the [ABB YuMi](https://new.abb.com/products/robotics/robots/collaborative-robots/yumi/dual-arm) robot to develop a novel interactive application to manipulate the robot from afar.

<p align="center" >
  <img style="overflow:hidden; width: 100%;" src="../images/holo_yumi.png" alt="Satellite Image of a Chicago road"/>
</p>

For this, we developed two interaction methods:

1. External Mode: Manipulate the physical robot by dragging the holographic robot arms. Construct a task on a hologram preview by setting the expected movements and execute it on the physical robot.
2. Internal mode: Your hand and head movements are executed simultaneously on the physical robot. You can switch to a VR mode where one can experience the environment of the physical robot through stereo video stream

## Details

For the robot we were provided with a YuMi simulation environment implemented in C++ by the [Computational Robotics Lab](https://crl.ethz.ch/). This included an inverse kinematics solver for the arms of the robot.
On top of that, we implemented the C++ middlewere that is the communication between this simulation environment and the Unity Game Engine environment, where we implemented the AR application for the HoloLens 2. High-level overview of the implemented feature are:

- Generate control messages
- Visualize robot state
- Audio-visual-tactile UI
- Process control messages
- Send robot states
- Acquire and send stereo images

## Demo

<div align="center">

[![Project Video](https://img.youtube.com/vi/Vg0ykQulvPg/hqdefault.jpg)](https://www.youtube.com/watch?v=Vg0ykQulvPg)

</div>
