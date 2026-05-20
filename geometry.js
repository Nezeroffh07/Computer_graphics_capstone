/**
 * geometry.js
 */

const Geometry = {
    createTorusKnot: (radius, tube, tubularSegments, radialSegments, p, q) => {
        const positions = [];
        const normals = [];
        const indices = [];

        for (let i = 0; i <= tubularSegments; i++) {
            const u = i / tubularSegments * Math.PI * 2 * p;
            const u_orig = i / tubularSegments * Math.PI * 2;
            
            const p1 = getTorusKnotPos(u_orig, p, q, radius, tube);
            const p2 = getTorusKnotPos(u_orig + 0.01, p, q, radius, tube);
            
            const T = Vec3.normalize(Vec3.sub(p2, p1));
            const N = Vec3.normalize(p1);
            const B = Vec3.cross(T, N);

            for (let j = 0; j <= radialSegments; j++) {
                const v = j / radialSegments * Math.PI * 2;
                const cx = -tube * Math.cos(v);
                const cy = tube * Math.sin(v);

                const x = p1[0] + (cx * N[0] + cy * B[0]);
                const y = p1[1] + (cx * N[1] + cy * B[1]);
                const z = p1[2] + (cx * N[2] + cy * B[2]);

                positions.push(x, y, z);
                normals.push(cx * N[0] + cy * B[0], cx * N[1] + cy * B[1], cx * N[2] + cy * B[2]);
            }
        }

        function getTorusKnotPos(u, p, q, r, t) {
            const cu = Math.cos(u), su = Math.sin(u);
            const quOverP = q / p * u;
            const cquOverP = Math.cos(quOverP);
            const x = r * (2 + cquOverP) * cu * 0.5;
            const y = r * (2 + cquOverP) * su * 0.5;
            const z = r * Math.sin(quOverP) * 0.5;
            return Vec3.create(x, y, z);
        }

        for (let i = 1; i <= tubularSegments; i++) {
            for (let j = 1; j <= radialSegments; j++) {
                const a = (radialSegments + 1) * i + j - 1;
                const b = (radialSegments + 1) * (i - 1) + j - 1;
                const c = (radialSegments + 1) * (i - 1) + j;
                const d = (radialSegments + 1) * i + j;
                indices.push(a, b, d, b, c, d);
            }
        }
        return { positions: new Float32Array(positions), normals: new Float32Array(normals), indices: new Uint16Array(indices) };
    },

    createCylinder: (radiusTop, radiusBottom, height, segments) => {
        const positions = [];
        const normals = [];
        const indices = [];

        for (let i = 0; i <= segments; i++) {
            const v = i / segments;
            const r = v * (radiusBottom - radiusTop) + radiusTop;
            const y = (1 - v) * height - height / 2;

            for (let j = 0; j <= segments; j++) {
                const u = j / segments * Math.PI * 2;
                const x = Math.cos(u) * r;
                const z = Math.sin(u) * r;

                positions.push(x, y, z);
                normals.push(Math.cos(u), 0, Math.sin(u));
            }
        }

        for (let i = 1; i <= segments; i++) {
            for (let j = 1; j <= segments; j++) {
                const a = (segments + 1) * i + j - 1;
                const b = (segments + 1) * (i - 1) + j - 1;
                const c = (segments + 1) * (i - 1) + j;
                const d = (segments + 1) * i + j;
                indices.push(a, b, d, b, c, d);
            }
        }
        return { positions: new Float32Array(positions), normals: new Float32Array(normals), indices: new Uint16Array(indices) };
    },

    createPlane: (size, sub) => {
        const p = [], n = [], idx = [];
        const step = size / sub;
        for (let i = 0; i <= sub; i++) {
            for (let j = 0; j <= sub; j++) {
                p.push(j * step - size / 2, 0, i * step - size / 2);
                n.push(0, 1, 0);
            }
        }
        for (let i = 0; i < sub; i++) {
            for (let j = 0; j < sub; j++) {
                const r1 = i * (sub + 1), r2 = (i + 1) * (sub + 1);
                idx.push(r1 + j, r2 + j, r1 + j + 1, r1 + j + 1, r2 + j, r2 + j + 1);
            }
        }
        return { positions: new Float32Array(p), normals: new Float32Array(n), indices: new Uint16Array(idx) };
    }
};
