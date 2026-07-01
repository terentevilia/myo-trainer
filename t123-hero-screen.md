# Первый экран для Tilda T123

Скопируйте содержимое блока ниже целиком и вставьте в `T123`.

```html
<section class="tt-hero" id="hero-training-course">
  <style>
    .tt-hero {
      --tt-bg: #0b0d12;
      --tt-bg-soft: rgba(17, 20, 27, 0.88);
      --tt-line: rgba(255, 255, 255, 0.08);
      --tt-text: #f5f7fb;
      --tt-muted: #a7afc0;
      --tt-accent: #2f6bff;
      --tt-accent-soft: #78a6ff;
      --tt-shadow: 0 20px 80px rgba(16, 32, 78, 0.35);
      --tt-radius-xl: 32px;
      --tt-radius-lg: 24px;
      --tt-radius-md: 18px;
      position: relative;
      overflow: hidden;
      background:
        radial-gradient(circle at 12% 14%, rgba(47, 107, 255, 0.20), transparent 28%),
        radial-gradient(circle at 88% 10%, rgba(47, 107, 255, 0.16), transparent 24%),
        linear-gradient(180deg, #090b10 0%, #0b0d12 100%);
      color: var(--tt-text);
      padding: 28px 0 72px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    .tt-hero *,
    .tt-hero *::before,
    .tt-hero *::after {
      box-sizing: border-box;
    }

    .tt-hero__glow {
      position: absolute;
      inset: auto auto 0 50%;
      width: 720px;
      height: 720px;
      transform: translateX(-50%);
      background: radial-gradient(circle, rgba(47, 107, 255, 0.12) 0%, rgba(47, 107, 255, 0) 68%);
      pointer-events: none;
      filter: blur(24px);
    }

    .tt-hero__noise {
      position: absolute;
      inset: 0;
      opacity: 0.12;
      background-image: radial-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px);
      background-size: 18px 18px;
      mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.65));
      pointer-events: none;
    }

    .tt-hero__container {
      width: min(100% - 32px, 1180px);
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }

    .tt-hero__topbar {
      display: flex;
      justify-content: center;
      margin-bottom: 28px;
    }

    .tt-hero__brand {
      display: inline-flex;
      align-items: center;
      gap: 14px;
      min-height: 76px;
      padding: 14px 24px;
      border: 1px solid var(--tt-line);
      border-radius: 999px;
      background: rgba(9, 12, 18, 0.84);
      backdrop-filter: blur(14px);
      box-shadow: 0 14px 40px rgba(0, 0, 0, 0.22);
    }

    .tt-hero__logo {
      width: 46px;
      height: 46px;
      border-radius: 14px;
      display: grid;
      place-items: center;
      background: linear-gradient(135deg, rgba(47, 107, 255, 0.28), rgba(120, 166, 255, 0.16));
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: var(--tt-text);
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      flex: 0 0 auto;
    }

    .tt-hero__brand-text {
      display: grid;
      gap: 2px;
    }

    .tt-hero__brand-label {
      margin: 0;
      color: var(--tt-muted);
      font-size: 12px;
      line-height: 1.2;
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }

    .tt-hero__brand-name {
      margin: 0;
      color: var(--tt-text);
      font-size: 22px;
      line-height: 1.05;
      font-weight: 800;
      letter-spacing: -0.03em;
    }

    .tt-hero__grid {
      display: grid;
      grid-template-columns: minmax(0, 1.02fr) minmax(320px, 0.98fr);
      align-items: center;
      gap: 34px;
    }

    .tt-hero__content {
      max-width: 590px;
    }

    .tt-hero__chip {
      display: inline-flex;
      align-items: center;
      min-height: 46px;
      padding: 12px 18px;
      margin-bottom: 22px;
      border: 1px solid var(--tt-line);
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.04);
      color: var(--tt-text);
      font-size: 14px;
      line-height: 1.4;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18);
    }

    .tt-hero__title {
      margin: 0 0 18px;
      font-size: clamp(38px, 6.2vw, 76px);
      line-height: 0.96;
      letter-spacing: -0.05em;
      font-weight: 800;
      text-wrap: balance;
    }

    .tt-hero__title-accent {
      color: var(--tt-accent-soft);
    }

    .tt-hero__descr {
      margin: 0 0 28px;
      color: var(--tt-muted);
      font-size: clamp(18px, 2.1vw, 22px);
      line-height: 1.62;
      max-width: 560px;
    }

    .tt-hero__facts {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin: 0 0 34px;
      padding: 0;
      list-style: none;
    }

    .tt-hero__facts li {
      min-height: 42px;
      display: inline-flex;
      align-items: center;
      padding: 10px 14px;
      border-radius: 999px;
      border: 1px solid var(--tt-line);
      background: rgba(255, 255, 255, 0.03);
      color: var(--tt-muted);
      font-size: 14px;
      line-height: 1.3;
    }

    .tt-hero__button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 220px;
      min-height: 60px;
      padding: 16px 28px;
      border-radius: 18px;
      border: 0;
      background: linear-gradient(135deg, var(--tt-accent) 0%, #2459da 100%);
      color: #ffffff;
      font-size: 17px;
      font-weight: 700;
      line-height: 1;
      text-decoration: none;
      box-shadow: 0 16px 34px rgba(47, 107, 255, 0.34);
      transition: transform 0.25s ease, box-shadow 0.25s ease;
    }

    .tt-hero__button:hover {
      transform: translateY(-2px);
      box-shadow: 0 20px 40px rgba(47, 107, 255, 0.42);
    }

    .tt-hero__button:focus-visible {
      outline: 2px solid rgba(120, 166, 255, 0.9);
      outline-offset: 4px;
    }

    .tt-hero__media {
      position: relative;
    }

    .tt-hero__video-card {
      position: relative;
      border-radius: var(--tt-radius-xl);
      overflow: hidden;
      border: 1px solid rgba(47, 107, 255, 0.22);
      background:
        linear-gradient(180deg, rgba(20, 26, 39, 0.96) 0%, rgba(10, 13, 18, 0.98) 100%);
      box-shadow: var(--tt-shadow);
    }

    .tt-hero__video-card::before {
      content: "";
      position: absolute;
      inset: 0;
      background:
        linear-gradient(135deg, rgba(47, 107, 255, 0.10), transparent 40%),
        linear-gradient(180deg, transparent 60%, rgba(0, 0, 0, 0.25));
      pointer-events: none;
      z-index: 1;
    }

    .tt-hero__video-placeholder {
      position: relative;
      z-index: 0;
      aspect-ratio: 16 / 10;
      display: grid;
      place-items: center;
      padding: 28px;
      background:
        radial-gradient(circle at 50% 35%, rgba(120, 166, 255, 0.16), transparent 28%),
        linear-gradient(135deg, #111726 0%, #0b0e15 100%);
    }

    .tt-hero__video-placeholder-inner {
      width: 100%;
      height: 100%;
      min-height: 320px;
      border-radius: 24px;
      border: 1px dashed rgba(255, 255, 255, 0.16);
      background: rgba(255, 255, 255, 0.03);
      display: grid;
      place-items: center;
      padding: 28px;
      text-align: center;
    }

    .tt-hero__play {
      width: 84px;
      height: 84px;
      margin: 0 auto 20px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      background: linear-gradient(135deg, rgba(47, 107, 255, 0.95), rgba(120, 166, 255, 0.92));
      box-shadow: 0 18px 40px rgba(47, 107, 255, 0.26);
      position: relative;
    }

    .tt-hero__play::before {
      content: "";
      margin-left: 5px;
      border-style: solid;
      border-width: 12px 0 12px 18px;
      border-color: transparent transparent transparent #ffffff;
    }

    .tt-hero__video-title {
      margin: 0 0 10px;
      font-size: 24px;
      line-height: 1.12;
      font-weight: 800;
      letter-spacing: -0.03em;
      color: var(--tt-text);
    }

    .tt-hero__video-text {
      margin: 0;
      color: var(--tt-muted);
      font-size: 15px;
      line-height: 1.65;
      max-width: 420px;
    }

    .tt-hero__video-caption {
      padding: 16px 20px 20px;
      color: var(--tt-muted);
      font-size: 14px;
      line-height: 1.6;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }

    .tt-hero__video-caption strong {
      color: var(--tt-text);
      font-weight: 700;
    }

    .tt-hero__embed {
      position: relative;
      aspect-ratio: 16 / 10;
      background: #0d1118;
    }

    .tt-hero__embed iframe,
    .tt-hero__embed video {
      width: 100%;
      height: 100%;
      border: 0;
      display: block;
    }

    @media (max-width: 980px) {
      .tt-hero {
        padding: 20px 0 64px;
      }

      .tt-hero__grid {
        grid-template-columns: 1fr;
        gap: 26px;
      }

      .tt-hero__content {
        max-width: none;
        text-align: center;
      }

      .tt-hero__descr {
        margin-left: auto;
        margin-right: auto;
      }

      .tt-hero__facts {
        justify-content: center;
      }
    }

    @media (max-width: 640px) {
      .tt-hero__container {
        width: min(100% - 20px, 1180px);
      }

      .tt-hero__brand {
        width: 100%;
        justify-content: center;
        border-radius: 24px;
        padding: 14px 16px;
      }

      .tt-hero__brand-name {
        font-size: 20px;
      }

      .tt-hero__chip {
        width: 100%;
        justify-content: center;
        text-align: center;
        font-size: 13px;
        margin-bottom: 18px;
      }

      .tt-hero__descr {
        font-size: 17px;
      }

      .tt-hero__facts {
        display: grid;
        grid-template-columns: 1fr 1fr;
      }

      .tt-hero__facts li {
        justify-content: center;
        text-align: center;
        min-height: 52px;
      }

      .tt-hero__button {
        width: 100%;
      }

      .tt-hero__video-placeholder {
        padding: 18px;
      }

      .tt-hero__video-placeholder-inner {
        min-height: 240px;
        padding: 22px 18px;
      }

      .tt-hero__play {
        width: 68px;
        height: 68px;
        margin-bottom: 16px;
      }

      .tt-hero__video-title {
        font-size: 20px;
      }

      .tt-hero__video-caption {
        padding: 14px 16px 16px;
      }
    }

    @media (max-width: 420px) {
      .tt-hero__facts {
        grid-template-columns: 1fr;
      }
    }
  </style>

  <div class="tt-hero__glow" aria-hidden="true"></div>
  <div class="tt-hero__noise" aria-hidden="true"></div>

  <div class="tt-hero__container">
    <div class="tt-hero__topbar">
      <div class="tt-hero__brand">
        <!-- Замените этот блок на ваш логотип или img -->
        <div class="tt-hero__logo">Logo</div>

        <div class="tt-hero__brand-text">
          <p class="tt-hero__brand-label">Авторская программа</p>
          <!-- Меняйте название курса здесь -->
          <p class="tt-hero__brand-name">Полноценная программа тренировок и питания</p>
        </div>
      </div>
    </div>

    <div class="tt-hero__grid">
      <div class="tt-hero__content">
        <div class="tt-hero__chip">
          Для людей с полной рабочей занятостью, которым нужен понятный и устойчивый результат
        </div>

        <!-- Меняйте главный заголовок здесь -->
        <h1 class="tt-hero__title">
          Полноценная программа
          <span class="tt-hero__title-accent">тренировок и питания</span>
        </h1>

        <!-- Меняйте описание здесь -->
        <p class="tt-hero__descr">
          Для устойчивого изменения образа жизни, похудения и роста мышечной массы для людей с полной рабочей занятостью
        </p>

        <ul class="tt-hero__facts">
          <li>Подходит занятым людям</li>
          <li>Понятная система</li>
          <li>Фокус на результат</li>
          <li>Без лишнего усложнения</li>
        </ul>

        <!-- Кнопка ведет к следующему блоку. Поставьте такой же id на следующую секцию -->
        <a class="tt-hero__button" href="#program-details" data-scroll-target="#program-details">Узнать больше</a>
      </div>

      <div class="tt-hero__media">
        <div class="tt-hero__video-card">
          <!--
            ВАРИАНТ 1: если видео еще нет, оставьте placeholder как сейчас.
            ВАРИАНТ 2: если видео есть, замените блок .tt-hero__video-placeholder на блок ниже:

            <div class="tt-hero__embed">
              <iframe src="https://www.youtube.com/embed/ВАШ_ID" title="Видео о курсе" allowfullscreen></iframe>
            </div>
          -->
          <div class="tt-hero__video-placeholder">
            <div class="tt-hero__video-placeholder-inner">
              <div>
                <div class="tt-hero__play" aria-hidden="true"></div>
                <h2 class="tt-hero__video-title">Здесь будет видео-презентация</h2>
                <p class="tt-hero__video-text">
                  Вставьте сюда embed-код видео из YouTube, Vimeo или Tilda Video.
                  Блок уже подготовлен под аккуратное отображение на desktop и mobile.
                </p>
              </div>
            </div>
          </div>

          <div class="tt-hero__video-caption">
            <strong>Подсказка:</strong> этот блок можно заменить на iframe с видео без изменения остальной структуры первого экрана.
          </div>
        </div>
      </div>
    </div>
  </div>

  <script>
    (function () {
      var button = document.querySelector('.tt-hero [data-scroll-target]');
      if (!button) return;

      button.addEventListener('click', function (event) {
        var selector = button.getAttribute('data-scroll-target');
        var target = selector ? document.querySelector(selector) : null;
        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    })();
  </script>
</section>
```
