import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.GH_TOKEN,
});
const service = {
  createFile,
  removeFile,
  updateFile,
  getFile,
};

async function createFile(fileName, content) {
    let result = await octokit.repos.createOrUpdateFileContents({
    owner: process.env.GH_USER,
    repo: process.env.GH_REPO,
    branch: process.env.GH_BRANCH,
    path: fileName,
    message: "bot",
    content: toBase64(content),
    sha: "",
  });
  return result.data;
}

async function removeFile(fileName) {
  let result = await octokit.repos.getContent({
    owner: process.env.GH_USER,
    repo: process.env.GH_REPO,
    ref: process.env.GH_BRANCH,
    path: fileName,
  });

  let rresult = await octokit.repos.deleteFile({
    owner: process.env.GH_USER,
    repo: process.env.GH_REPO,
    branch: process.env.GH_BRANCH,
    path: fileName,
    message: "bot",
    sha: (result.data as any).sha,
  });

  return rresult.data;
}

async function updateFile(fileName, content) {
  let result = await octokit.repos.getContent({
    owner: process.env.GH_USER,
    repo: process.env.GH_REPO,
    ref: process.env.GH_BRANCH,
    path: fileName,
  });
  let uresult = await octokit.repos.createOrUpdateFileContents({
    owner: process.env.GH_USER,
    repo: process.env.GH_REPO,
    branch: process.env.GH_BRANCH,
    path: fileName,
    message: "bot",
    content: toBase64(content),
    sha: (result.data as any).sha,
  });
  return uresult.data
}

async function getFile(fileName) {
  let result = await octokit.repos.getContent({
    owner: process.env.GH_USER,
    repo: process.env.GH_REPO,
    ref: process.env.GH_BRANCH,
    path: fileName,
  });
  return fromBase64((result.data as any).content);
}

function toBase64(text) {
  return Buffer.from(text).toString("base64");
}

function fromBase64(base64) {
  return Buffer.from(base64, "base64").toString("utf8");
}

export default service;
