// math.js 

const MathUtils = {
    cameraPath: function(z) {
        return {
            x: 100.2 * Math.sin(z * 0.0045) + 90.0 * Math.cos(z * 0.012),
            y: 43.0 * (Math.cos(z * 0.0047) + Math.sin(z * 0.0013)) + 53.0 * Math.sin(z * 0.0112),
            z: z
        };
    }
};
