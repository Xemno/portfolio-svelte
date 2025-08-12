# Computational Intelligence

The [Computational Intelligence Lab](https://www.vorlesungen.ethz.ch//Vorlesungsverzeichnis/lerneinheit.view?lerneinheitId=127561&semkez=2019S&ansicht=KATALOGDATEN&lang=en), masters course at ETH Zürich teaches fundamental concepts in computational science and machine learning with a special emphasis on matrix factorization and representation learning.
<br/><br/>

Part of the course if to work in a group of four people on the Road segmentation in aerial imagery application problem and develop a novel solution for it.
It was done as a team of four where the goal was to find a novel solution to the road segmentation of sattelite pictures. Our approach was to use image segmentation with a convolutional network architecture, based on the [U-Net](https://lmb.informatik.uni-freiburg.de/people/ronneber/u-net/), where we stack the U-Net and perform the training using Keras on satellite image data.
<br/><br/>

## Image Data

Our data consisted of road images and their segmented labels. An example road and the corresponding label is shown here:

<p align="center" >
  <img class="w-full md:w-1/3"  style="overflow:hidden;  ; margin: 0 auto; border-radius: 5px" src="../images/chicago108.png" alt="Satellite Image of a Chicago road" >
  <img class="w-full md:w-1/3"  style="overflow:hidden;  ; margin: 0 auto; border-radius: 5px" src="../images/label108.png" alt="Corresponding segmented label" >
</p>

## More info

For more information about the project, follow the [GitHub](https://github.com/laurinpaech/segme-net) link.
