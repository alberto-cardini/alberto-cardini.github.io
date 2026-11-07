---
title: "PPM Image: From Pixels to Edges"
card_title: "PPM Image"
slug: ppm
order: 3
category: "Image processing"
technologies: "C++14 · CMake · GoogleTest · Matplot++"
summary: "Implementing a C++ image-processing library with Gaussian filtering and Canny-style edge detection."
description: "An image-processing project exploring convolution, separable filters, grayscale conversion and edge detection in C++."
math: true
---

I developed PPM Photo Editor to understand image processing at the level of pixels, kernels and numerical operations, rather than relying on ready-made filtering functions. The project is a modular C++14 library and executable supporting ASCII PPM (P3) and PGM (P2) images, with reusable image and matrix abstractions for manipulating colour channels, applying convolution and saving results. My main focus was implementing Gaussian filtering and a Canny-style edge-detection pipeline from their underlying mathematical ideas.

## Gaussian filtering

I implemented Gaussian blur using separable convolution: instead of applying a two-dimensional kernel directly, the filter processes each channel with one horizontal and one vertical one-dimensional kernel. For an image of $H\times W$ pixels and kernel width $k$, this reduces the approximate computational complexity from $O(HWk^2)$ to $O(HWk)$. The parameter $\sigma$ controls the strength of smoothing, creating a trade-off between noise suppression and fine-detail preservation.

<div class="demo" data-viewer="blur">
  <h3>Explore the Gaussian blur results</h3>
  <label for="blur-choice">Blur setting</label>
  <select id="blur-choice">
    <option value="0">Original</option>
    <option value="3">σ = 3</option>
    <option value="7">σ = 7</option>
    <option value="14">σ = 14</option>
  </select>
  <figure>
    <img id="blur-image" class="stage-image" src="{{ '/assets/images/BlurSigma0.webp' | relative_url }}" alt="Original sunflower image" width="260" height="260">
    <figcaption id="blur-caption" aria-live="polite">Original image. Compare fine petal boundaries with the blurred variants.</figcaption>
  </figure>
  <p class="small">Saved outputs from my C++ implementation; the browser only switches between the images.</p>
</div>

## Edge detection

Building on the filtering code, I implemented a Canny-style pipeline combining Gaussian smoothing, grayscale conversion, Sobel gradient estimation, non-maximum suppression, double thresholding and local edge tracking. The gradient magnitude and orientation identify the strength and direction of intensity changes, while the later stages thin broad responses and retain relevant edge candidates. My hysteresis implementation uses a local eight-neighbour check rather than recursive tracking of entire connected chains, so it is a simplified version of the full Canny algorithm.

<div class="demo" data-viewer="edges">
  <h3>Follow the edge-detection pipeline</h3>
  <label for="edge-choice">Processing stage</label>
  <select id="edge-choice">
    <option value="1">1 · Noise reduction</option>
    <option value="2">2 · Gradient magnitude</option>
    <option value="3">3 · Non-maximum suppression</option>
    <option value="4">4 · Thresholding</option>
    <option value="5">5 · Edge tracking</option>
  </select>
  <figure>
    <img id="edge-image" class="stage-image" src="{{ '/assets/images/Edge1.webp' | relative_url }}" alt="Output after Gaussian noise reduction" width="260" height="260">
    <figcaption id="edge-caption" aria-live="polite">Gaussian smoothing reduces noise before computing derivatives.</figcaption>
  </figure>
  <p class="small">Recorded intermediate results from the image-processing pipeline.</p>
</div>

## Outcome and resources

The project gave me hands-on experience with convolution, numerical image representations, algorithmic optimization and reusable C++ software design. I used GoogleTest to check image and filtering operations and compared recorded outputs to understand how different parameters affect the result. The emphasis was on implementing and understanding the algorithms, rather than measuring performance against an optimized library such as OpenCV.

<div class="resource-box" markdown="1">

**Project materials**

[Read the full project documentation](https://github.com/alberto-cardini/PPM_Photo_Editor/blob/main/README.md)

[GitHub repository](https://github.com/alberto-cardini/PPM_Photo_Editor) · [Filter implementations](https://github.com/alberto-cardini/PPM_Photo_Editor/tree/main/image_processing/src) · [Tests](https://github.com/alberto-cardini/PPM_Photo_Editor/tree/main/test)

**Course materials**

- Shree K. Nayar, [*First Principles of Computer Vision* — Monographs](https://fpcv.cs.columbia.edu/Monographs), Columbia University. The collection includes *Image Processing I* and *Image Processing II*.

**Wikipedia — background on the implemented methods**

- [Netpbm](https://en.wikipedia.org/wiki/Netpbm) — ASCII PPM (P3) and PGM (P2) image formats.
- [Kernel (image processing)](https://en.wikipedia.org/wiki/Kernel_(image_processing)) — convolution, image filtering, and separable kernels.
- [Gaussian blur](https://en.wikipedia.org/wiki/Gaussian_blur) — Gaussian smoothing and the role of the standard deviation.
- [Edge detection](https://en.wikipedia.org/wiki/Edge_detection) — the problem of identifying intensity discontinuities.
- [Image gradient](https://en.wikipedia.org/wiki/Image_gradient) — gradient magnitude and direction.
- [Sobel operator](https://en.wikipedia.org/wiki/Sobel_operator) — estimation of horizontal and vertical image derivatives.
- [Canny edge detector](https://en.wikipedia.org/wiki/Canny_edge_detector) — smoothing, non-maximum suppression, double thresholding, and edge tracking by hysteresis.
- [Thresholding (image processing)](https://en.wikipedia.org/wiki/Thresholding_(image_processing)) — classification of image responses by thresholds.
- [Grayscale](https://en.wikipedia.org/wiki/Grayscale) — conversion from RGB to a single intensity channel.

</div>