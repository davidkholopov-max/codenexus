// Dynamic import so build doesn't fail if nodemailer isn't resolved yet
async function getTransporter() {
  const nodemailer = await import('nodemailer')
  return nodemailer.default.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })
}

const FROM = `CodeNexus <${process.env.GMAIL_USER}>`
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export async function sendPasswordResetEmail(email: string, token: string, locale = 'ru') {
  const link = `${BASE_URL}/${locale}/reset-password?token=${token}`
  const isRu = locale === 'ru'
  const transporter = await getTransporter()

  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: isRu ? 'Сброс пароля — CodeNexus' : 'Reset your password — CodeNexus',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#0f1117;color:#e2e8f0;border-radius:12px">
        <div style="text-align:center;margin-bottom:32px">
          <div style="display:inline-flex;align-items:center;gap:8px;font-size:20px;font-weight:700">
            <span style="background:#0DA2E7;border-radius:8px;padding:6px 10px;font-size:14px;color:#fff">&lt;/&gt;</span>
            CodeNexus
          </div>
        </div>
        <h2 style="font-size:22px;font-weight:700;margin:0 0 12px">
          ${isRu ? 'Сброс пароля' : 'Password Reset'}
        </h2>
        <p style="color:#94a3b8;line-height:1.6;margin:0 0 24px">
          ${isRu
            ? 'Мы получили запрос на сброс пароля. Нажми кнопку ниже — ссылка действует 1 час.'
            : 'We received a request to reset your password. The link expires in 1 hour.'}
        </p>
        <a href="${link}" style="display:block;text-align:center;background:#0DA2E7;color:#fff;padding:14px 24px;border-radius:10px;font-weight:600;font-size:15px;text-decoration:none;margin-bottom:24px">
          ${isRu ? 'Сбросить пароль' : 'Reset Password'}
        </a>
        <p style="color:#64748b;font-size:13px;line-height:1.6;margin:0">
          ${isRu
            ? 'Если ты не запрашивал сброс — просто проигнори это письмо.'
            : "If you didn't request this, you can safely ignore this email."}
        </p>
      </div>
    `,
  })
}

export async function sendWelcomeEmail(email: string, name: string, locale = 'ru') {
  const isRu = locale === 'ru'
  const dashboardLink = `${BASE_URL}/${locale}/dashboard`
  const coursesLink = `${BASE_URL}/${locale}/courses`
  const transporter = await getTransporter()

  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: isRu ? '✅ Email подтверждён — добро пожаловать в CodeNexus!' : '✅ Email confirmed — welcome to CodeNexus!',
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#0f1117;border-radius:16px;overflow:hidden;color:#e2e8f0">

        <!-- Hero banner -->
        <div style="background:linear-gradient(135deg,#0DA2E7 0%,#6366f1 100%);padding:40px 32px;text-align:center">
          <div style="display:inline-flex;align-items:center;gap:10px;font-size:22px;font-weight:800;color:#fff;margin-bottom:16px">
            <span style="background:rgba(255,255,255,0.2);border-radius:10px;padding:6px 12px;font-size:16px">&lt;/&gt;</span>
            CodeNexus
          </div>
          <div style="font-size:48px;margin-bottom:8px">🎉</div>
          <h1 style="color:#fff;font-size:26px;font-weight:800;margin:0 0 8px">
            ${isRu ? 'Email подтверждён!' : 'Email Confirmed!'}
          </h1>
          <p style="color:rgba(255,255,255,0.85);font-size:15px;margin:0">
            ${isRu ? `Привет, ${name}! Добро пожаловать в CodeNexus.` : `Hey ${name}! Welcome to CodeNexus.`}
          </p>
        </div>

        <!-- Body -->
        <div style="padding:32px 32px 24px">

          <!-- Success badge -->
          <div style="background:#0DA2E7/10;border:1px solid #0DA2E720;border-radius:12px;padding:16px 20px;margin-bottom:24px;display:flex;align-items:center;gap:12px">
            <span style="font-size:24px">✅</span>
            <div>
              <div style="font-weight:700;font-size:15px;margin-bottom:2px">
                ${isRu ? 'Твой аккаунт активирован' : 'Your account is now active'}
              </div>
              <div style="color:#94a3b8;font-size:13px">
                ${isRu ? 'Теперь ты можешь учиться и отслеживать прогресс' : 'You can now learn and track your progress'}
              </div>
            </div>
          </div>

          <p style="color:#94a3b8;line-height:1.7;font-size:14px;margin:0 0 24px">
            ${isRu
              ? 'Мы рады видеть тебя здесь! На CodeNexus ты найдёшь интерактивные курсы по Python, JavaScript, Go, Java, C++, SQL и HTML/CSS. Пиши настоящий код прямо в браузере и следи за своим прогрессом.'
              : 'We\'re excited to have you here! CodeNexus offers interactive courses in Python, JavaScript, Go, Java, C++, SQL and HTML/CSS. Write real code right in the browser and track your progress.'}
          </p>

          <!-- What awaits -->
          <div style="margin-bottom:28px">
            <div style="font-weight:700;font-size:13px;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:12px">
              ${isRu ? 'Что тебя ждёт' : 'What awaits you'}
            </div>
            <div style="display:flex;flex-direction:column;gap:10px">
              ${[
                isRu ? ['🎯', 'Интерактивные уроки с живым выполнением кода'] : ['🎯', 'Interactive lessons with live code execution'],
                isRu ? ['🏆', 'XP, достижения и стрики за каждый день занятий'] : ['🏆', 'XP, achievements and streaks for every day of learning'],
                isRu ? ['📈', 'Отслеживание прогресса по каждому курсу'] : ['📈', 'Progress tracking across all courses'],
                isRu ? ['🌍', 'Курсы на русском и английском языках'] : ['🌍', 'Courses in Russian and English'],
              ].map(([icon, text]) => `
                <div style="display:flex;align-items:center;gap:12px;background:#1e1e2e;border-radius:10px;padding:12px 16px">
                  <span style="font-size:20px">${icon}</span>
                  <span style="font-size:14px;color:#cbd5e1">${text}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- CTA buttons -->
          <a href="${dashboardLink}" style="display:block;text-align:center;background:linear-gradient(135deg,#0DA2E7,#6366f1);color:#fff;padding:15px 24px;border-radius:12px;font-weight:700;font-size:15px;text-decoration:none;margin-bottom:12px">
            ${isRu ? '🚀 Перейти в дашборд' : '🚀 Go to Dashboard'}
          </a>
          <a href="${coursesLink}" style="display:block;text-align:center;background:#1e1e2e;color:#94a3b8;padding:13px 24px;border-radius:12px;font-weight:600;font-size:14px;text-decoration:none;border:1px solid #2a2a3e">
            ${isRu ? 'Посмотреть все курсы →' : 'Browse all courses →'}
          </a>
        </div>

        <!-- Footer -->
        <div style="padding:20px 32px;border-top:1px solid #1e1e2e;text-align:center">
          <p style="color:#475569;font-size:12px;margin:0;line-height:1.6">
            ${isRu
              ? 'Это письмо отправлено автоматически. Если ты не регистрировался на CodeNexus — просто проигнори его.'
              : "This email was sent automatically. If you didn't sign up for CodeNexus, you can safely ignore it."}
          </p>
        </div>

      </div>
    `,
  })
}

export async function sendVerificationEmail(email: string, token: string, locale = 'ru') {
  const link = `${BASE_URL}/api/auth/verify-email?token=${token}&locale=${locale}`
  const isRu = locale === 'ru'
  const transporter = await getTransporter()

  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: isRu ? 'Подтверди email — CodeNexus' : 'Verify your email — CodeNexus',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#0f1117;color:#e2e8f0;border-radius:12px">
        <div style="text-align:center;margin-bottom:32px">
          <div style="display:inline-flex;align-items:center;gap:8px;font-size:20px;font-weight:700">
            <span style="background:#0DA2E7;border-radius:8px;padding:6px 10px;font-size:14px;color:#fff">&lt;/&gt;</span>
            CodeNexus
          </div>
        </div>
        <h2 style="font-size:22px;font-weight:700;margin:0 0 12px">
          ${isRu ? 'Подтверди свой email' : 'Verify your email'}
        </h2>
        <p style="color:#94a3b8;line-height:1.6;margin:0 0 24px">
          ${isRu
            ? 'Спасибо за регистрацию в CodeNexus! Нажми кнопку чтобы подтвердить email.'
            : 'Thanks for signing up to CodeNexus! Click below to verify your email.'}
        </p>
        <a href="${link}" style="display:block;text-align:center;background:#0DA2E7;color:#fff;padding:14px 24px;border-radius:10px;font-weight:600;font-size:15px;text-decoration:none;margin-bottom:24px">
          ${isRu ? 'Подтвердить email' : 'Verify Email'}
        </a>
        <p style="color:#64748b;font-size:13px;line-height:1.6;margin:0">
          ${isRu ? 'Ссылка действует 24 часа.' : 'The link expires in 24 hours.'}
        </p>
      </div>
    `,
  })
}
