const GitHubApi = require("github");

const github = new GitHubApi({
    // optional
    debug: true,
    timeout: 5000
});

const service = {
    createFile,
    removeFile,
    updateFile,
    getFile,
    renderMarkDown,
    getUser,

    //private
    github,
    authenticate,
    toBase64,
    fromBase64,
}


function authenticate(token) {
    github.authenticate({
        type: "token",
        token: token,
    });
}

function createFile(auth, fileName, content) {
    authenticate(auth.token)
    return github.repos.createFile({
        owner: auth.owner,
        repo: auth.repo,
        path: fileName,
        branch: auth.branch,
        message: "bot",
        content: toBase64(content)
    })
}

function removeFile(auth, fileName) {
    authenticate(auth.token)
    return github.repos.getContent({
        owner: auth.owner,
        repo: auth.repo,
        path: fileName,
        ref: auth.branch
    }).then(response => github.repos.deleteFile({
        owner: auth.owner,
        repo: auth.repo,
        path: fileName,
        message: "bot",
        sha: response.sha,
        branch: auth.branch
    }))
}
function updateFile(auth, fileName, content) {
    
    authenticate(auth.token)
    return github.repos.getContent({
        owner: auth.owner,
        repo: auth.repo,
        path: fileName,
        ref: auth.branch
    }).then(response => github.repos.updateFile({
        owner: auth.owner,
        repo: auth.repo,
        path: fileName,
        message: "bot",
        content: toBase64(content),
        sha: response.sha,
        branch: auth.branch
    }))
}

function getFile(auth, fileName) {
    authenticate(auth.token)
    return github.repos.getContent({
        owner: auth.owner,
        repo: auth.repo,
        path: fileName,
        ref: auth.branch
    }).then(response=>fromBase64(response.content))
}

function getUser(token) {
    authenticate(token)
    return github.users.get({})
}

function renderMarkDown(auth, md) {
    authenticate(auth.token)
    return github.misc.renderMarkdown({
        "text": md
    }).then(response => response.data)
}

function toBase64(text) {
    return new Buffer(text).toString('base64')
}

function fromBase64(base64) {
    return new Buffer(base64, 'base64').toString('ascii')
}


module.exports = service;