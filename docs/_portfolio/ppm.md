---
title: "PPM Image: From Pixels to Edges"
card_title: "PPM Image"
slug: ppm
order: 3
category: "Image processing"
technologies: "C++14 · CMake · GoogleTest · Matplot++"
summary: "A C++ image-processing library exploring separable Gaussian filtering, grayscale conversion and the stages of Canny-style edge detection."
description: "A C++ image-processing library exploring separable Gaussian filtering, grayscale conversion and the stages of Canny-style edge detection."
math: true
---

## Problem and motivation

PPM Photo Editor explores how image-processing algorithms work beneath a graphical editor. Working with an uncompressed, text-based image format makes the pixel representation inspectable and places the emphasis on kernels, numerical operations and software design. The repository builds a C++ executable and a reusable image-processing library.

This article is based on the illustrated README, implementation and test sources. A separate technical report was not present in the inspected public repository. The original documentation remains linked below; no additional experimental report is assumed.

## Image representation and software architecture

The supported input formats are **ASCII PPM (P3)** for RGB images and **ASCII PGM (P2)** for grayscale images. Binary P6/P5 files are outside the documented format. The header supplies the format identifier, dimensions and channel range, followed by whitespace-separated pixel values. The current README instructs users to remove exporter comment lines; the parser reads tokens directly and does not implement general Netpbm comment handling.

`Image` owns three channel matrices. P2 inputs are expanded into identical red, green and blue channels, allowing filters to operate through a common RGB representation. `Matrix<T>` stores values in a flat vector with row and column dimensions and provides padding, axis flips and convolution. The filter classes operate on the image abstraction rather than parsing files themselves.

| Component | Responsibility |
|---|---|
| `Image` | Load/save P3 and P2, channel access, grayscale conversion, histograms |
| `Matrix<T>` | Pixel storage and numerical operations |
| `Gaussian_Blur` | Construct and apply horizontal and vertical Gaussian kernels |
| `Edge_Detection` | Gradient computation, thinning, thresholding and local edge tracking |
| CMake targets | Build the editor executable, `PPM_Editor_lib`, and GoogleTest tests |

CMake specifies C++14, retrieves Matplot++ for plotting, and supports an `ENABLE_TESTS` option. Smart pointers express ownership of image channels, temporary arrays and filter kernels.

## Gaussian blur and separability

Gaussian filtering replaces each pixel with a weighted neighbourhood average. Nearby pixels receive larger weights than distant ones. In continuous form,

$$G_\sigma(x,y)=\frac{1}{2\pi\sigma^2}\exp\left(-\frac{x^2+y^2}{2\sigma^2}\right).$$

The key computational observation is separability: the two-dimensional kernel is a product of two one-dimensional kernels. The implementation constructs a row and a column kernel and applies both to each RGB channel. For an image of $$H\times W$$ pixels and kernel width $$k$$, separable filtering requires $$O(HWk)$$ operations rather than the $$O(HWk^2)$$ cost of a dense square kernel.

The code derives an odd kernel size from approximately $$2\pi\sigma$$, samples the Gaussian and then convolves each channel vertically and horizontally. Matrix padding uses a value obtained from the image matrix’s arithmetic average. These boundary choices affect the result near the image border.

Increasing $$\sigma$$ suppresses progressively larger-scale variation: noise is reduced, but fine structure disappears too. The viewer below uses the **actual saved repository figures**, rather than simulating Gaussian blur with a browser CSS effect. “Original” corresponds to the README’s unblurred reference; it does not invoke the constructor with a zero standard deviation.

<div class="demo" data-viewer="blur"><h3>Explore the recorded blur results</h3><label for="blur-choice">Blur setting</label> <select id="blur-choice"><option value="0">Original</option><option value="3">σ = 3</option><option value="7">σ = 7</option><option value="14">σ = 14</option></select><figure><img id="blur-image" class="stage-image" src="{{ '/assets/images/BlurSigma0.webp' | relative_url }}" alt="Original sunflower from the repository" width="260" height="260"><figcaption id="blur-caption" aria-live="polite">Original image. Compare fine petal boundaries with the blurred variants.</figcaption></figure></div>

## From intensity gradients to edges

The edge detector follows a Canny-style pipeline. It first smooths the input with a Gaussian filter using $$\sigma=2$$, then obtains grayscale values. Sobel filters estimate horizontal and vertical derivatives. Gradient magnitude and direction are calculated as

$$M=\sqrt{G_x^2+G_y^2},\qquad \theta=\operatorname{atan2}(G_y,G_x).$$

Magnitude indicates how strongly intensity changes; direction indicates which neighbours should be compared when deciding whether an edge response is a local maximum. The Sobel operators are themselves applied through separable one-dimensional components.

Non-maximum suppression compares each response with neighbours along a quantized direction (0°, 45°, 90° or 135°). Responses that are not strict local maxima are removed. A low threshold removes weak evidence, while a high threshold identifies strong responses that support neighbouring weak edges.

<div class="demo" data-viewer="edges"><h3>Follow the edge-detection pipeline</h3><label for="edge-choice">Processing stage</label> <select id="edge-choice"><option value="1">1 · Noise reduction</option><option value="2">2 · Gradient magnitude</option><option value="3">3 · Non-maximum suppression</option><option value="4">4 · Thresholding</option><option value="5">5 · Edge tracking</option></select><figure><img id="edge-image" class="stage-image" src="{{ '/assets/images/Edge1.webp' | relative_url }}" alt="Repository result after noise reduction" width="260" height="260"><figcaption id="edge-caption" aria-live="polite">Gaussian smoothing reduces noise before computing derivatives.</figcaption></figure><p class="small">Recorded outputs from the original repository. Switching stages reveals the stored intermediate images; it does not rerun the C++ implementation.</p></div>

### Implementation versus the textbook algorithm

The distinction between an algorithm’s ideal description and its actual implementation matters. In this version, hysteresis performs a single eight-neighbour inspection against a copied gradient map. It retains weak responses directly adjacent to a strong response; it does not recursively trace an arbitrarily long connected chain of weak responses. Accordingly, this article calls the implementation Canny-style rather than claiming full equivalence to a reference Canny detector.

The direction quantization also maps negative angles to the default 0° branch, rather than first normalizing all directions modulo 180°. This is a concrete opportunity for refinement. The general matrix convolution uses modular indexing suited to the one-dimensional kernels used here; a robust general-purpose two-dimensional implementation would need additional indexing tests.

## Grayscale conversion

The grayscale operation computes a weighted RGB sum, reflecting the unequal contribution of the three channels to perceived intensity. Saving grayscale creates a P2 file with one channel per pixel; loading a grayscale file replicates its channel internally. This separates the representation used by the processing library from the output file representation.

Eight-bit channel storage keeps the implementation simple, but intermediate filtering and conversion require care. Floating-point convolution results assigned back to an eight-bit matrix lose precision. A refined pipeline would retain floating-point intermediates, explicitly normalize discrete Gaussian kernels, and clamp and round only at output.

## Evaluation and discussion

The repository provides visual comparisons for Gaussian blur, grayscale conversion and all five edge-detection stages, together with GoogleTest sources for image handling, matrix operations and edge detection. These establish the intended behaviours and illustrate output characteristics. They do **not** establish a benchmark accuracy, latency or comparison against OpenCV, and no such measurements are claimed here.

The project’s contribution is an inspectable implementation and an understanding of the full pipeline. It demonstrates why smoothing precedes differentiation, why large gradient values alone do not produce thin edges, and why thresholds need connectivity information. Its deliberately constrained file format and educational numerical implementation also make the limitations easy to identify.

Useful next steps are robust Netpbm parsing, floating-point intermediates, normalized directions, connected-component hysteresis, and tests against synthetic images with known expected edges. A benchmark against a mature library would then quantify accuracy and runtime trade-offs.

## References and resources

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
