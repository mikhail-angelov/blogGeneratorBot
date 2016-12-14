const github = require('./github')
const users = {

}

function getUser(id) {
    if (users[id]) {
        return users[id]
    } else {
        const user = { id: id, branch:'gh-pages' }
        users[id] = user
        return user
    }
}

function getGithubUser(token) {
    return github.getUser(token)
}

function updateUser(user) {
    const id = user.id
    users[id] = user
    return user
}

function removeUser(id) {
    users[id] = null
}

function setStateValue(user, value) {
    const state = user.commandState || 0
    user.stateValue = user.stateValue || {}
    user.stateValue[state] = value
}

function getStateValue(user, state) {
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



module.exports = {
    getUser,
    updateUser,
    getGithubUser,
    removeUser,
    isRegistered,
    setStateValue,
    getStateValue,
    getActiveCommand,
    setActiveCommand,
    getCommandState,
    setCommandState
}