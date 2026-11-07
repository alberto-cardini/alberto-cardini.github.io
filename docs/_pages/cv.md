---
title: Curriculum Vitae
permalink: /cv.html
description: "Education, research experience, skills and academic activities of Alberto Cardini."
---

Alberto Cardini · [albycardini@gmail.com](mailto:albycardini@gmail.com) · [GitHub](https://github.com/alberto-cardini)

## Education

**ETH Zürich — MSc in Computer Science**  
September 2026–present · Expected graduation September 2028  
Major: Machine Intelligence. Minor: Data Management Systems.

**University of Florence — BSc in Computer Engineering**  
September 2023–July 2026  
110/110 with honours; GPA 29.4/30. Merit- and need-based tuition waiver and regional scholarship.

## Research and professional experience

**Research Intern**  
[Imaginalis](https://www.imaginalis.it), Florence · March–May 2026

- Fine-tuned an IDDNet-based residual 3D U-Net in PyTorch for CBCT denoising. The thesis reports 14.83% greater mean PSNR improvement and 10.46% greater mean SSIM improvement than RED-CNN, measured as relative gains in improvement over noisy input.
- Developed a composite objective combining L1, SSIM, a PSNR-related component and a non-negativity penalty, with cosine-annealed training on 20,000 paired subvolume samples split between training and validation.
- Built sliding-window inference with 64³-voxel patches and Gaussian-weighted blending for full CBCT volumes on an 8 GB GPU.

[Research article and detailed evaluation]({{ '/projects/cbct.html' | relative_url }})

**Head of Software**  
[Red Propulsion](https://redpropulsion.it) · September 2024–January 2026

- Led embedded C++ software development for an STM32H7 rocket control board using FreeRTOS.
- Integrated BNO088, BMP585 and MS56 sensors and implemented real-time Kalman filtering.

## Selected projects

- [POS Tagging]({{ '/projects/pos-tagging.html' | relative_url }}): supervised HMM with log-space Viterbi, rare-word mapping and smoothing analysis; reported token accuracy 94.07%.
- [PPM Image]({{ '/projects/ppm.html' | relative_url }}): C++ image-processing library with separable Gaussian blur, grayscale conversion and Canny-style edge detection.
- [EduMeter]({{ '/projects/edumeter.html' | relative_url }}): Java REST backend and course-review system design, with PostgreSQL persistence, moderation, tests and frontend mockups.
- [Bachelor’s thesis]({{ '/projects/cbct.html' | relative_url }}): adaptation and evaluation of residual 3D networks for medical image denoising.

## Technical skills

**Programming and libraries:** Python, C++, PyTorch, torchvision, NumPy; Java, Jakarta REST and PostgreSQL through project work.

**Machine learning:** CNNs, residual 3D U-Nets, HMMs, Viterbi decoding and image processing.

**Embedded systems and data:** STM32H7, FreeRTOS, Kalman filtering, HDF5 and DICOM.

## Awards and activities

- **BOOST 26 / ELICSIR Foundation**, July 2026: selected for a fully funded Computer Science Summer School in Oropa.
- **FA’26 / ELICSIR Foundation**, January 2026: selected for a fully funded Computer Science Winter School in Venice.
- **RustLab / Develer**, October 2025: funded ticket to the three-day international Rust conference in Florence.
- **BOOST 25 / ELICSIR Foundation**, September 2025: selected for a fully funded Computer Science Summer School in Bologna.
- **EUDIS Defence Hackathon / Sapienza University of Rome**, May 2025: contributed to a proof of concept for an AI-guided multi-drug injector intended to support first aid.
- **SwissHack / Tenity Zürich**, April 2025: developed an invoice-management and settlement MVP using RLUSD on the XRP Ledger.
- **VisionnAIres / Bocconi University**, February 2025: selected among 60 students for a four-day hackathon; designed an AI search concept connecting non-profit and student organizations with philanthropists.

This public web CV omits confidential organizational references. Use your browser’s print command for a print-friendly version.
