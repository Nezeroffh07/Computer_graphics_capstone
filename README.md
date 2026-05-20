# Computer_graphics_capstone
This project is a procedural 3D underwater scene programmed from scratch using **WebGL 2.0** and **GLSL**. The scene is rendered not with traditional polygons (meshes), but through *Raymarching* and *Signed Distance Fields (SDF)* techniques based on mathematical formulas.
The project is a complex graphics showcase combining advanced rendering algorithms, lighting models, and real-time animations.
## Key Features
* **Raymarching Algorithm:** Step-by-step projection of rays from the camera lens into the scene to calculate surface intersections.
* **Procedural Cave Geometry:** Creation of an infinite, rugged rock terrain using `sin`, `cos`, and noise functions to shape the environment.
* **Dynamic Fish Schools:** Procedural SDF fish models combining soft blending (Soft Minimum) to simulate the movement of the body, tail, and fins directly within the graphics engine.
* **Underwater Optics and Caustics:** Mathematical optical effects representing water refraction (water wiggle) and moving light waves (caustics) casting upon rock surfaces.
* **Cinematic Lighting:** Calculation of volumetric water fog (fog absorption), depth perception, and directly visible sharp sun rays paired with soft shadows.
* **Camera Spline Curve:** A mathematical camera path that guides the viewer deep into the cave while dynamically tracking the main fish.
## Technologies and Concepts
* **Language:** GLSL (OpenGL Shading Language) `#version 300 es`
* **Platform:** WebGL 2.0
* **Mathematical Concepts:** Vector Algebra, Raytracing/Raymarching, Fractal Calculations, Spline Interpolation.
##  File Structure
* `shaders.js` - The core engine code of the project. It contains both *Vertex Shader* and *Fragment Shader* logic. The `fragmentShaderSource` single-handedly manages the entire mathematical, geometric, and visual workload of the scene.
## Installation and Usage Requirements
To run this shader code, you need a standard WebGL environment (HTML5 Canvas). You can integrate the code into any WebGL wrapper or pure WebGL API. 
For the scene to animate and scale correctly, the following Uniform variables must be passed into the render loop:
* `iResolution` (vec2) - The width and height of the screen in pixels.
* `iTime` (float) - Elapsed time since startup (in seconds). Animations, fish swimming, and water ripples depend on this variable.
