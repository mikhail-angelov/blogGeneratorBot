import { SendMessage, Update } from "./telegram/telegram";
import articles from "./articles";
const ADD_TITLE = "addTitle";
const ADD_BODY = "addBody";
const unregisteredError = "You cannot use this bot, it's owned by other user.";

const USER = {
  token: process.env.GH_TOKEN,
  branch: process.env.GH_BRANCH,
  owner: process.env.GH_USER,
  repo: process.env.GH_REPO,
};

export class Processor {
  private processor = {};
  constructor() {
    this.processor = {
      "/info": this.about.bind(this),
      "/yo": this.yo.bind(this),
      "/a": this.add.bind(this),
    };
  }

  unknown() {
    return ["неизвесная команда, попробуй /a, /info, /yo", ""];
  }
  about() {
    return ["доступные команды: /a, /info, /yo", ""];
  }
  yo() {
    return ["yo👍", ""];
  }
  add() {
    return ["Введите заголовок", ADD_TITLE];
  }
  addTitle(update) {
    return ["Введите статью", `${ADD_BODY}|${update.message.text}`];
  }
  async addBody(update, last) {
    const subject = last.split("|")[1];
    const body = update.message.text;
    await articles.add({
      user: USER,
      subject,
      body,
      id: update.message.message_id,
    });
    return ["done", ""];
  }
  async process(
    update: Update,
    last: string
  ): Promise<[msg: (SendMessage & { method: string }) | null, last: string]> {
    const msg = {
      chat_id: update.message.chat.id,
      method: "sendMessage",
    };
    if (!update.message.chat.id) {
      return [null, ""];
    }
    if (update.message.from.username !== "MikhailAngelov") {
      return [{ ...msg, text: unregisteredError }, ""];
    }
    const state = last.split("|")[0];
    let [text, command] = ["", ""];
    if (state === ADD_TITLE) {
      [text, command] = this.addTitle(update);
    } else if (state === ADD_BODY) {
      [text, command] = await this.addBody(update, last);
    } else {
      const processor = this.processor[update.message.text] || this.unknown;
      [text, command] = processor();
    }
    return [
      {
        chat_id: update.message.chat.id,
        method: "sendMessage",
        text,
      },
      command,
    ];
  }
}
