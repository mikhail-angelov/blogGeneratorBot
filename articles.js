
const github = require('./github')
const staticSite = require('./staticSite')
const conf = require('./config')

function add(command) {
    return loadData(command.user)
        .then(data => addRecord(data, command))
        .then(data => saveData(command.user, data))
        .then(data => staticSite.updateSite(command.user, data))
}

function addRecord(articles, command) {
    return [{
        id: generateUID(),
        subject: command.subject,
        body: command.body //todo: format it    
    }].concat(articles)
}

function update(command) {
    return loadData(command.user)
        .then(data => data.map(item => {
            if (item.id == command.id) {
                item.subject = command.subject || item.subject
                item.body = command.body || item.body
            }
            return item
        }))
        .then(data => saveData(command.user, data))
        .then(data => staticSite.updateSite(command.user, data))
}

function remove(command) {
    return loadData(command.user)
        .then(data => data.map(item => item.id != command.id))
        .then(data => saveData(command.user, data))
        .then(data => staticSite.updateSite(command.user, data))
}

function getList(command) {
    return github.getFile(command.user, conf.dataFileName)
        .then(response => {
            const data = JSON.parse(response)
            const result = data.reduce((acc, item) => {
                acc = acc + item.id + '\n' + item.subject + '\n' + '------------\n'
                return acc
            }, '')
            return result
        })
}

function generateUID() {
    return Math.random().toString(36).substring(2, 15);
}

function saveData(user, data) {
    return github.updateFile(user, conf.dataFileName, JSON.stringify(data))
        .then(() => data)
}

function loadData(user) {
    return github.getFile(user, conf.dataFileName)
        .then(response => JSON.parse(response))
}


module.exports = {
    add,
    update,
    remove,
    getList,

    //private
}
