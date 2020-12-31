import { NowRequest, NowResponse } from "@now/node";
import { Bot } from "../lib/bot";
import { Processor } from "../lib/processor";

const BOT_TOKEN = process.env.MOD_BOT_TOKEN;
const processor = new Processor();
const bot = new Bot(BOT_TOKEN, processor);

// to run bot locally,
if (!process.env.IS_WEB) {
  bot.runLocal();
  console.info("Start bot local");
}

export default async function handle(req: NowRequest, res: NowResponse) {
  console.log("Server has initialized bot with: ", !!bot, req.body);
  if (!req.body) {
    console.error("invalid request", !!bot, !req.body);
    res.status(200).json({ text: "ok" });
    return;
  }

  const message = await bot.handleUpdate(req.body);
  if (!message) {
    res.status(200).json({ text: "ok" });
    return;
  }
  res.status(200).json(message);
}
