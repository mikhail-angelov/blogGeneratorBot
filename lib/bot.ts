import { Processor } from "./processor";
import { Update, SendMessage, BotCommand } from "./telegram/telegram";
import { Agent } from "https";
import request from "./request";

interface UpdateResponse {
  ok: boolean;
  result: Update[];
}
interface CommandResponse {
  ok: boolean;
  result: BotCommand[];
}

const options = {
  apiRoot: "https://api.telegram.org",
  webhookReply: true,
  agent: new Agent({
    keepAlive: true,
    keepAliveMsecs: 10000,
  }),
};

export class Bot {
  private lastUpdateId: number = 0;
  private processing: boolean = false;
  constructor(readonly token: string, readonly processor: Processor) {}

  runLocal() {
    setInterval(() => this.getUpdates(30, 1), 1000);
  }

  async handleUpdate(update: Update): Promise<any | null> {
    //todo: handle race issues
    console.log("webhook", update, JSON.stringify(update.message.entities));

    const commandsResp = (await this.request(
      "getMyCommands"
    )) as CommandResponse;
    console.log("commandsResp", commandsResp);
    let last = "";
    if (commandsResp.ok && commandsResp.result.length > 0) {
      last = commandsResp.result[0].description;
    }
    const [message, command] = await this.processor.process(update, last);
    await this.request("setMyCommands", {
      commands: command ? [{ command: "last", description: command }] : [],
    });
    this.lastUpdateId = update.update_id;
    const commandsResp1 = (await this.request(
      "getMyCommands"
    )) as CommandResponse;
    console.log("commandsResp--", commandsResp1, message, command);
    return message;
  }

  async getUpdates(timeout, limit) {
    const method = `getUpdates?offset=${
      this.lastUpdateId + 1
    }&limit=${limit}&timeout=${timeout}`;
    const data = (await this.request(method)) as UpdateResponse;
    if (!data || !data.ok) {
      return;
    }

    data.result.forEach(async (update) => {
      const message = await this.handleUpdate(update);
      if (message) {
        this.send(message);
      }
    });
  }

  async send(message: SendMessage) {
    await this.request("sendMessage", message);
  }

  async request(method: string, payload: any = {}) {
    const apiUrl = `${options.apiRoot}/bot${this.token}/${method}`;
    const config = {
      agent: options.agent,
      method: "POST",
      compress: true,
      headers: { "content-type": "application/json", connection: "keep-alive" },
      url: apiUrl,
      body: payload,
    };
    try {
      if (!this.processing) {
        this.processing = true;
        const data = await request(config);
        this.processing = false;
        return data;
      }
    } catch (e) {
      console.log("-error", e);
      this.processing = false;
    }
    return null;
  }
}
