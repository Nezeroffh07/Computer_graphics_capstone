# Computer_graphics_capstone
Bu layihə **WebGL 2.0** və **GLSL** istifadə edərək sıfırdan proqramlaşdırılmış prosedural 3D sualtı səhnəsidir. Səhnənin render edilməsi ənənəvi poliqonlar (mesh) ilə deyil, riyazi düsturlara əsaslanan *Raymarching* və *Signed Distance Fields (SDF)* texnikaları vasitəsilə həyata keçirilir.

Layihə qabaqcıl renderinq alqoritmlərini, işıqlandırma modellərini və real vaxt animasiyalarını özündə birləşdirən kompleks qrafika nümunəsidir.

## 🚀 Əsas Özəlliklər

* **Raymarching Alqoritmi:** Şüaların (rays) kamera obyektivindən səhnəyə doğru addım-addım göndərilməsi və səthlərlə kəsişmənin hesablanması.
* **Prosedural Mağara Geometriyası:** Obyektləri formalaşdırmaq üçün `sin`, `cos` və səs-küy (noise) funksiyalarından istifadə edərək sonsuz kələ-kötür qaya relyefinin yaradılması.
* **Dinamik Balıq Sürüləri:** Qrafik mühərrik daxilində bədən, quyruq və üzgəclərin hərəkətini simulyasiya edən, yumşaq kəsişmələrlə (Soft Minimum) birləşdirilmiş procedural SDF balıq modelləri.
* **Sualtı Optika və Caustics:** Suyun sınma əmsalını (water wiggle) və qaya səthlərinə düşən hərəkətli işıq dalğalarını (caustics) təcəssüm etdirən riyazi optik effektlər.
* **Kinematik İşıqlandırma:** Həcmli su dumanı (fog absorption), dərinlik hissi və birbaşa görünən kəskin günəş şüalarının (sun rays) kölgələrlə (soft shadows) birlikdə hesablanması.
* **Kamera Splaynı (Spline Curve):** İzləyicini mağaranın dərinliklərinə doğru aparan və əsas balığı dinamik olaraq təqib edən riyazi kamera yolu.

## 🛠 Texnologiyalar və Konseptlər

* **Dil:** GLSL (OpenGL Shading Language) `#version 300 es`
* **Platforma:** WebGL 2.0
* **Riyazi Konseptlər:** Vektor Cəbri, Şüa İzləmə (Raytracing/Raymarching), Fraktal Hesablamalar, Splayn İnterpolyasiyası.

## 📂 Fayl Strukturu

* `shaders.js` - Layihənin əsas mühərrik koddur. İçərisində həm *Vertex Shader*, həm də *Fragment Shader* məntiqini saxlayır. `fragmentShaderSource` səhnənin bütün riyazi, həndəsi və vizual yükünü təkbaşına idarə edir.

## ⚙️ Quraşdırma və İstifadədə Tələblər

Bu shader kodunu işə salmaq üçün standart bir WebGL mühitinə (HTML5 Canvas) ehtiyacınız var. Kodu hər hansı bir WebGL wrapper və ya təmiz WebGL API daxilinə inteqrasiya edə bilərsiniz. 

Səhnənin düzgün animasiya alması və ölçüləndirilməsi üçün aşağıdakı Uniform dəyişənləri render dövrünə (render loop) ötürülməlidir:

* `iResolution` (vec2) - Ekranın genişliyi və hündürlüyü piksel olaraq.
* `iTime` (float) - Başlanğıcdan keçən zaman (saniyə ilə). Animasiyalar, balıqların üzməsi və su dalğalanmaları bu dəyişəndən asılıdır.

---
*Bu layihə Kompüter Qrafikası prinsiplərinin dərindən mənimsənilməsi və tətbiqi məqsədilə inkişaf etdirilmişdir.*
