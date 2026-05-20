// shaders.js 

const vertexShaderSource = `#version 300 es
in vec2 a_position;
void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const fragmentShaderSource = `#version 300 es
precision highp float;
out vec4 fragColor;

uniform vec2 iResolution;
uniform float iTime;

#define FAR 850.
#define SUN_COLOUR vec3(0.6, 0.95, 1.0)   // Bir az daha işıqlı və təmiz sualtı günəş işığı
#define FOG_COLOUR vec3(0.06, 0.14, 0.26)  // Qaranlığı azaltmaq üçün azca aydınladılmış su dumanı

vec3 sunLight;
float fishMarker = 0.0;

vec3 cameraPath(float z) {
    return vec3(
        100.2 * sin(z * .0045) + 90. * cos(z * .012), 
        43. * (cos(z * .0047) + sin(z * .0013)) + 53. * (sin(z * 0.0112)), 
        z
    );
}

mat3 setCamMat(in vec3 ro, in vec3 ta, float cr) {
    vec3 cw = normalize(ta - ro);
    vec3 cp = vec3(sin(cr), cos(cr), 0.0);
    vec3 cu = normalize(cross(cw, cp));
    vec3 cv = normalize(cross(cu, cw));
    return mat3(cu, cv, cw);
}

float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
}

float sMax(float a, float b, float s) {
    float h = clamp(0.5 + 0.5 * (a - b) / s, 0., 1.);
    return mix(b, a, h) + h * (1.0 - h) * s;
}

float sMin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
}

float sdFish(vec3 p, float scaleModifier) {
    float wave = sin(p.z * 2.2 - iTime * 9.5) * 0.22;
    float lFactor = smoothstep(0.4, -2.0, p.z);
    p.x += wave * lFactor;

    vec3 bodyScale = vec3(0.5, 0.8, 1.6) * scaleModifier;
    float body = (length(p / bodyScale) - 0.9) * 0.6;

    vec3 tailP = p - vec3(0.0, 0.0, -1.6 * scaleModifier);
    float tailFin = (length(tailP / vec3(0.08, 1.1, 0.5)) - 0.7) * 0.3;

    vec3 dorsalP = p - vec3(0.0, 0.8 * scaleModifier, -0.1 * scaleModifier);
    float dorsalFin = (length(dorsalP / vec3(0.12, 0.5, 0.7)) - 0.6) * 0.4;

    float fishG = sMin(body, tailFin, 0.12);
    fishG = sMin(fishG, dorsalFin, 0.12);

    return fishG;
}

float map(in vec3 p) {
    float h = dot(sin(p * .0173), cos(p.zxy * .0191)) * 30.;
    float d = h + p.y * .2 + 15.0;
    
    vec3 tunnelP = p;
    tunnelP.xy -= cameraPath(p.z).xy;
    float tunnel = 15. - length(tunnelP.xy) - h; 
    float caveSDF = sMax(d, tunnel, 80.);

    float finalD = caveSDF;
    fishMarker = 0.0;

    float gTime = (iTime + 110.) * 32.;

    vec3 mainFishPos = p;
    mainFishPos.xy -= cameraPath(gTime + 26.0).xy;
    mainFishPos.z -= (gTime + 26.0);
    
    float dMainFish = sdFish(mainFishPos, 1.0);
    if(dMainFish < finalD) {
        finalD = dMainFish;
        fishMarker = 1.0;
    }

    float positions[6] = float[](15.0, 45.0, -20.0, -50.0, 30.0, -10.0);
    float offsetsX[6] = float[](6.0, -7.0, 5.5, -4.0, -5.0, 7.0);
    float offsetsY[6] = float[](-4.0, 5.0, -3.0, 2.5, -2.0, 4.0);

    for(int i = 0; i < 6; i++) {
        vec3 envFishP = tunnelP;
        float segmentZ = floor(envFishP.z / 70.0) * 70.0; // Hüceyrə aralığı sıxlaşdırıldı (çox balıq üçün)
        envFishP.z = mod(envFishP.z, 70.0) - 35.0;

        // Balıqları ətrafa, mağaranın boşluqlarına yayırıq
        envFishP.x += offsetsX[i] + sin(segmentZ + iTime * 1.2) * 2.5;
        envFishP.y += offsetsY[i] + cos(segmentZ * 0.5 + iTime) * 2.0;
        envFishP.z += positions[i];

        float dEnvFish = sdFish(envFishP, 0.8); // Köməkçi balıqlar
        if(dEnvFish < finalD) {
            finalD = dEnvFish;
            fishMarker = 2.0;
        }
    }

    return finalD;
}

vec3 getSky(vec3 dir) {
    return mix(vec3(FOG_COLOUR), vec3(0.03, 0.08, 0.18), abs(dir.y));
}

vec3 getNormal(vec3 p) {
    vec2 e = vec2(0.01, 0.0);
    return normalize(vec3(
        map(p + e.xyy) - map(p - e.xyy),
        map(p + e.yxy) - map(p - e.yxy),
        map(p + e.yyx) - map(p - e.yyx)
    ));
}

float marchScene(in vec3 rO, in vec3 rD, vec2 co) {
    float t = 10. + 10. * hash12(co);
    for(int j = 0; j < 120; j++) {
        if (t >= FAR) break;
        vec3 p = rO + t * rD;
        float h = map(p);
        if(h < 0.05) break;
        t += h * .4 + t * .004;
    }
    return t;
}
float getCaustics(vec3 p) {
    vec2 uv = p.xz * 0.07;
    uv += iTime * 0.12;
    float n = sin(uv.x + sin(uv.y)) + sin(uv.y + cos(uv.x));
    n += sin(uv.x * 2.0 + iTime) * 0.5;
    return clamp(pow(n, 3.0) * 0.18, 0.0, 1.0);
}

float shadow(in vec3 ro, in vec3 rd) {
    float res = 1.0;
    float t = 0.5;
    for(int i = 0; i < 20; i++) {
        float h = map(ro + rd * t);
        res = min(res, 6. * h / t);
        t += h + 0.2;
    }
    return clamp(res, 0., 1.0);
}

vec3 lighting(in vec3 pos, in vec3 normal, in vec3 eyeDir, float currentFish) {
    vec3 matColor = vec3(0.18, 0.26, 0.32); // Sualtı qayaların o sən bəyəndiyin orijinal rəngi
    
    if(normal.y > 0.5) {
        matColor = mix(matColor, vec3(0.3, 0.45, 0.55), smoothstep(0.5, 0.9, normal.y)); 
    }

    if(currentFish > 0.5) {
        if(currentFish < 1.5) {
            matColor = vec3(0.25, 0.65, 0.85); // Əsas balıq
            if(sin(pos.z * 5.0) > 0.1) matColor = vec3(0.5, 0.8, 0.95); 
        } else {
            matColor = vec3(0.2, 0.5, 0.7); // Ətrafdakı digər balıqlar
        }
    }

    float sh = shadow(pos + normal * 0.5, sunLight);
    float diff = max(dot(sunLight, normal), 0.0);
    vec3 col = matColor * SUN_COLOUR * diff * sh;

    float caustic = getCaustics(pos);
    col += caustic * SUN_COLOUR * max(0.0, normal.y) * sh;

    // Səhnə çox qaranlıq olmasın deyə ambient işığı azca gücləndirdik (.35)
    col += matColor * abs(normal.y * .35);

    vec3 r = reflect(eyeDir, normal);
    float spec = pow(max(dot(sunLight, r), 0.0), 32.0);
    col += spec * SUN_COLOUR * sh * 0.4;

    return min(col, 1.0);
}

void main() {
    vec2 uv = (-iResolution.xy + 2.0 * gl_FragCoord.xy) / iResolution.y;

    uv.x += sin(uv.y * 12.0 + iTime * 2.5) * 0.008;
    uv.y += cos(uv.x * 10.0 + iTime * 2.0) * 0.006;

    sunLight = normalize(vec3(0.4, 0.9, 0.3));

    float gTime = (iTime + 110.) * 32.;

    vec3 camPos = cameraPath(gTime);
    vec3 camTar = cameraPath(gTime + 20.);

    mat3 camMat = setCamMat(camPos, camTar, (camTar.x - camPos.x) * .02);
    vec3 dir = camMat * normalize(vec3(uv, cos(length(uv * .5))));

    vec3 sky = getSky(dir);
    float dhit = marchScene(camPos, dir, gl_FragCoord.xy);
    
    float activeObject = fishMarker;

    vec3 col;
    if (dhit < FAR) {
        vec3 p = camPos + dhit * dir;
        vec3 nor = getNormal(p);
        vec3 sceneColor = lighting(p, nor, dir, activeObject);
        col = mix(sky, sceneColor, exp(-dhit * .0025)); // Aydınlığı qorumaq üçün duman absorbsiyası azaldıldı
    } else {
        col = sky;
    }

    float sunDot = max(dot(sunLight, dir), 0.0);
    col += pow(sunDot, 120.0) * SUN_COLOUR * 2.0;

    vec2 pData = uv * 7.0;
    float pHash = hash12(floor(pData) + floor(iTime * 0.12));
    if (pHash > 0.994) {
        vec2 pOffset = fract(pData) - 0.5;
        col += vec3(0.5, 0.85, 1.0) * (0.002 / length(pOffset));
    }
    col = pow(col, vec3(1.3, 1.5, 1.6)) * 1.4;
    vec2 xy = gl_FragCoord.xy / iResolution.xy;
    col *= pow(16.0 * xy.x * xy.y * (1.0 - xy.x) * (1.0 - xy.y), 0.25);

    fragColor = vec4(col, 1.0);
}`;
