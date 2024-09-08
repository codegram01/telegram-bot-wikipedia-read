import Bot from "./bot.js";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === env.WEBHOOK_PATH) {
      if (request.headers.get("X-Telegram-Bot-Api-Secret-Token") !== env.WEBHOOK_SECRET) {
        return new Response("Unauthorized", { status: 403 });
      }
      
      const update = await request.json();

      const bot = new Bot(env)
      ctx.waitUntil(bot.onUpdate(update));

      return new Response("Ok");
    }

    return new Response('Ok');
  },
};
