## Data Driven Locomotion on Uneven Terrains

In this master thesis, we further improved and extended an existing character animation system
for virtual production. The system developed directs biped characters through various types
of terrains and is able to produce realistic high-quality animations. Furthermore, the learned
motions are responsive, and the system can learn various types of gaits. We also explore meth-
ods to increase the ability of the system to sense the terrain environment. We further provide
a data processing pipeline that imports motion captured data, labels the necessary features re-
quired, and exports them in a suitable format for the neural network. The data annotation tools
are integrated into Unity, whereas the neural network and terrain fitting process is a standalone
Python implementation. The current standard in virtual production uses motion capture methods
that are relatively expensive and time-consuming. For non-human characters or hand-animated
characters, the process generates a comparatively long feedback loop between animating and
directing.
