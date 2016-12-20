const fs = require('fs')
const handlebars = require('handlebars')
var github = require('./github')
const conf = require('./config')

const BASE = 'staticBlog/'
const STYLE1 = 'stylesheets/stylesheet.css'
const STYLE2 = 'stylesheets/github-dark.css'
const INIT_DATA = [{ id: "1", subject: "Cool news", body: "This blog is generated by Telegram Bot @blogGeneratorBot" }]

function createSite(user, repo) {
    return github.createRepo(user, repo)
        .then(() => user.repo = repo)
        .then(() => copyToRepo(user, conf.indexFileName, 'hello world'))
        .then(() => copyToRepo(user, STYLE1))
        .then(() => copyToRepo(user, STYLE2))
        .then(() => copyToRepo(user, conf.templateFileName))
        .then(() => copyToRepo(user, conf.dataFileName, JSON.stringify(INIT_DATA)))
}

function removeSite(user) {
    return github.removeRepo(user, user.repo)
        .then(() => {
            user.repo = null;
        })
}

function copyToRepo(user, fileName, data) {
    const content = data || fs.readFileSync(BASE + fileName, { encoding: 'utf8' })
    return github.createFile(user, fileName, content)
}

function updateSite(user, data) {
    return github.getFile(user, conf.templateFileName)
        .then(template => generate(data, template))
        .then(html => github.updateFile(user, conf.indexFileName, html))
}

function generate(data, template) {
    const hbr = handlebars.compile(template);
    return hbr({ data: data });
}


module.exports = {
    createSite,
    removeSite,
    updateSite,

    //private
    generate
}