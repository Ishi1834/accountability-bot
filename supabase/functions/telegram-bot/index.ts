console.log(`Function "telegram-bot" up and running!`);
import {
  Bot,
  webhookCallback,
} from "https://deno.land/x/grammy@v1.35.0/mod.ts";

const bot = new Bot(Deno.env.get("BOT_TOKEN") || "");

bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));

bot.command("ping", (ctx) => ctx.reply(`Pong! ${new Date()} ${Date.now()}`));

// Reply to messages from users
bot.on(
  "message:text",
  (ctx) =>
    ctx.reply(
      `From ${ctx.message.from.first_name}(ID=${ctx.message.from.id}) Message: ${ctx.message.text}`,
    ),
);

// Send a message to myself when the bot starts
bot.api.sendMessage("786953375", "Hello to Ismail from Supabase Functions!");

const handleUpdate = webhookCallback(bot, "std/http");

Deno.serve(async (req) => {
  try {
    const url = new URL(req.url);
    if (url.searchParams.get("secret") !== Deno.env.get("FUNCTION_SECRET")) {
      return new Response("not allowed", { status: 405 });
    }

    return await handleUpdate(req);
  } catch (err) {
    console.error(err);
    return new Response("internal server error", { status: 500 });
  }
});
