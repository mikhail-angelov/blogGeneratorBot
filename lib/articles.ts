import github from "./github";
import staticSite from "./staticSite";
import conf from "./config";

async function add(command) {
  const data = await github.getFile(conf.dataFileName);
  const articles = JSON.parse(data);
  const updated = addRecord(articles, command);
  await github.updateFile(conf.dataFileName, JSON.stringify(updated));

  await staticSite.updateSite(updated);
}

function addRecord(articles, command) {
  return [
    {
      id: generateUID(),
      subject: command.subject,
      body: command.body, //todo: format it
    },
  ].concat(articles);
}

async function update(command) {
  const data = await github.getFile(conf.dataFileName);
  const articles = JSON.parse(data);
  const updated = articles.map((item) =>
    item.id === command.id
      ? { ...item, subject: command.subject, body: command.body }
      : item
  );
  await github.updateFile(conf.dataFileName, JSON.stringify(updated));

  await staticSite.updateSite(updated);
}

async function remove(command) {
  const data = await github.getFile(conf.dataFileName);
  const articles = JSON.parse(data);
  const updated = articles.filter((item) => item.id !== command.id);
  await github.updateFile(conf.dataFileName, JSON.stringify(updated));

  await staticSite.updateSite(updated);
}

function getList() {
  return github.getFile(conf.dataFileName).then((response) => {
    const data = JSON.parse(response);
    const result = data.reduce((acc, item) => {
      acc = acc + item.id + "\n" + item.subject + "\n" + "------------\n";
      return acc;
    }, "");
    return result;
  });
}

function generateUID() {
  return Math.random().toString(36).substring(2, 15);
}

export default {
  add,
  update,
  remove,
  getList,

  //private
};
