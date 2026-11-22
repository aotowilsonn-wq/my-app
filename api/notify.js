export default async function handler(req, res) {
  const token = process.env.BOT_TOKEN;
  const chatId = process.env.MY_CHAT_ID;
  const appUrl = 'https://aotowilsonn-wq.github.io/my-app/';

  if (!token || !chatId) {
    return res.status(400).json({ error: 'Missing BOT_TOKEN or MY_CHAT_ID' });
  }

  const minskHour = (new Date().getUTCHours() + 3) % 24;
  let text = '';
  let btnText = '⚡ ОТКРЫТЬ ТЕРМИНАЛ';

  if (minskHour >= 6 && minskHour < 12) {
    text = '☀️ *VIPERR OS // НОВЫЙ ЦИКЛ ОТКРЫТ*\n\nЗабери Daily Supply Drop и проверь Контракт дня.';
    btnText = '🎁 ЗАБРАТЬ ДРОП';
  } else if (minskHour >= 12 && minskHour < 17) {
    text = '⚡ *VIPERR OS // ДНЕВНОЙ ЧЕК-ПОИНТ*\n\nСделай подход на турнике или запусти 25 минут Deep Isolation.';
    btnText = '⏱ ЗАПУСТИТЬ ФОКУС';
  } else if (minskHour >= 17 && minskHour < 21) {
    text = '💀 *VIPERR OS // КОНТРОЛЬ ПРОГРЕССА*\n\nНе оставляй всё на ночь — закрой пару контрактов сейчас.';
    btnText = '📋 ПРОВЕРИТЬ КОНТРАКТЫ';
  } else {
    text = '🚨 *VIPERR OS // ДО ОБНУЛЕНИЯ ОСТАЛОСЬ МЕНЬШЕ 2 ЧАСОВ*\n\nЕсли в 00:00 останутся пустые клетки — стрик сгорит и включится PENALTY LOCK.';
    btnText = '🔥 ЗАКРЫТЬ ДЕНЬ';
  }

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [[{ text: btnText, web_app: { url: appUrl } }]]
      }
    })
  });

  return res.status(200).json({ ok: true, hour: minskHour });
}
