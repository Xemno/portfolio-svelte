# Sensing for Soft Robots Using Electrical Resistance/Impedance Tomography

_The description provided here offers a concise overview of my bachelor's thesis, summarizing its key objectives, methodology, and findings. For a more in-depth exploration—including detailed analysis, implementation specifics, and extended results—the complete thesis document is available upon request._

## Intro

In this thesis I am researching touch and/or deformation sensing in soft substrates using electrical resistance/impedance tomography techniques.
I investigated the use of conductive soft foam material to localize touch inputs on its surface and to sense its own volumetric deformation with electrical impedance changes.

## Tomographic Reconstruction

[Tomography](https://en.wikipedia.org/wiki/Tomography) is an imaging technique by sections through the use of any kind of penetrating wave and the goal was to produce such tomographic images.
Tomographic Reconstruction is a multidimensional inverse problem. So the challenge is to yield an estimate of a specific system from a finite number of projections/observations.

> An inverse problem is the process of calculating from a set of observations the causal factors that produced them: for example, calculating an image in X-ray computed tomography, source reconstruction in acoustics, or calculating the density of the Earth from measurements of its gravity field. It is called an inverse problem because it starts with the results and then calculates the causes. This is the inverse of a forward problem, which starts with the causes and then calculates the results.

## Electrical Impedance/Resistivity Tomography

- Radiation-free
- Non-Invasive
- Impedance = Resistance & Reactance
- Reactance => amplitude and phase changes of sinusoidal alternating currents
- Penetrating wave: sinusoidal alternating currents
- Assumption: Constant current

## System Overview

<img class="w-full md:w-1/2"  style="overflow:hidden;  display: block; margin: 0 auto; border-radius: 5px" src="../images/soft_system.png" alt="System overview" />

### Signal Generation

The signal was produced by using a [AD5930 Waveform Generator](https://www.analog.com/en/products/ad5930.html). It needs a continuous master clock needed and produces a continuous sinusoidal signal
with a constant current output of typically 3 mA.

Depicted below is the resulting schematic. An instrumentation Amplifier is used to have the flexibility to change amplitude of signal with R_G, because the
AD5930 produces a current output. Thus, resulting in no issues with the voltage compliance of the AD5930.

Input current to AD8220 is negligible because of very high input impedance. Thus, we can set the output voltage of the AD5930 with resistors.
Here with 200 Ohm and 3mA the output voltage is set to 0.6V

### VCCS - Voltage Controlled Current Source

The VCCS accepts an input voltage and produces a constant output current, which is important for our impedance measurements.
As a VCCS a [Howland Current Pump](https://www.allaboutcircuits.com/technical-articles/the-howland-current-pump/) was used to produce a constant current.

<img class="w-full md:w-1/2"  style="overflow:hidden;  display: block; margin: 0 auto; border-radius: 5px" src="../images/signal_gen.png" alt="Signal generation" >

#### Simulating error currents

1k to 100k OHMs stepsize is 5k, resulting in 20 traces. R_S is 20k Ohm and V_in is 0.6V peak to peak.

<img class="w-full md:w-1/2"  style="overflow:hidden;  display: block; margin: 0 auto; border-radius: 5px" src="../images/error_currents.png" alt="Error currents" >

## Measurement Scheme

The system applys is an adjacent pattern measurement scheme. In the adjacent method the measurement pattern consists of differential measurements between all adjacent electrodes except the injecting electrodes. This is then done for all adjacent electrodes as injecting electrodes resulting in 40 measurements. This results in 5 measurements per adjacent pair, which for 8 electrode pair results in a measurement matrix M of 40 entries.

<img class="w-full md:w-2/3"  style="overflow:hidden;  display: block; margin: 0 auto; border-radius: 5px" src="../images/measure_scheme.png" alt="Measurement scheme" >

### Multiplexers

A multiplexer is an integrated device that selects one of several analog inputs as an output.
In our case, the multiplexed inputs M_1 to M_4 in the system overview are the adjacent measurement nodes and the output is the measured voltage differential.
Required in single current source systems
Required for curent injection & voltage measurements
Introduces additional input and output capacitance
And more non-ideal properties

### Differential Voltage Measurement

<img class="w-full md:w-1/2"  style="overflow:hidden;  display: block; margin: 0 auto; border-radius: 5px" src="../images/diff_measure.png" alt="Difference measurement" >

## Signal Sampling

Using the programmable delay block (PDB) of the [Teensy](https://www.pjrc.com/teensy/) microcontroller we were able to generate a sampling frequency 10 times higher than the generated measurement signal.
As depicted is the measured sampling of a full signal period of the system.

<p align="center" >
  <img class="w-full md:w-1/3"  style="overflow:hidden;  ; margin: 0 auto; border-radius: 5px" src="../images/sampled_signal.png" alt="Signal sampling" >
  <img class="w-full md:w-1/3"  style="overflow:hidden;  ; margin: 0 auto; border-radius: 5px" src="../images/sampled_signal_2.png" alt="Signal sampling" >
</p>

The system takes up to 512 samples per signal measurement and reducing this to one RMS value.
