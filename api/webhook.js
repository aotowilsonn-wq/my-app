export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(200).send('VIPERR BOT ONLINE');

  const { message } = req.body || {};
  if (!message || !message.chat) return res.status(200).end();

  const chatId = message.chat.id;
  const text = message.text || '';
  const token = process.env.BOT_TOKEN;
  const appUrl = 'https://aotowilsonn-wq.github.io/my-app/';

  if (text.startsWith('/start')) {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: '⚡ *VIPERR OS // TERMINAL ACTIVE*\n\nНикаких оправданий. Закрывай контракты, качай атрибуты и держи стрик.',
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [[
            { text: '⚡ ОТКРЫТЬ ТЕРМИНАЛ', web_app: { url: appUrl } }
          ]]
        }
      })
    });
  }

  return res.status(200).json({ ok: true });
}
