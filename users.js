const github = require('./github')
const users = {
}

function getUser(id) {
    return users[id]
}

function removeUser(id) {
    users[id] = null
}

function addTempUser(id) {
    const user = {id:id}
    users[id] = user
    return user
}

function setStateValue(user, value){
    const state = user.commandState || 0
    user.stateValue = user.stateValue || {}
    user.stateValue[state] = value
}

function getStateValue(user, state){
    user.stateValue = user.stateValue || {}
    return user.stateValue[state]
}

function getActiveCommand(user) {
    return user.command;
}
function setActiveCommand(user, command) {
    user.command = command
    user.commandState = 0
}
function getCommandState(user) {
    return user.commandState
}
function setCommandState(user, state) {
    user.commandState = state
}

function isRegistered(user) {
    return user && user.id && user.token && user.repo
}

function addUser(user) {
    return new Promise((resolve, reject) => {
        if (user && user.id && user.token && user.repo) {
            github.getUser(user.token)
                .then(info => {
                    const rec = {
                        id: user.id,
                        token: user.token,
                        repo: user.repo,
                        branch: user.branch || 'master',
                        owner: info.login,
                        name: info.name,
                        email: info.email
                    }
                    users[user.id] = rec;
                    resolve(rec)
                })
                .catch(err => {
                    reject(err)
                })
        } else {
            reject('Please specify github token and repo')
        }
    })
}

module.exports = {
    getUser,
    addUser,
    removeUser,
    isRegistered,
    addTempUser,
    setStateValue,
    getStateValue,
    getActiveCommand,
    setActiveCommand,
    getCommandState,
    setCommandState
}