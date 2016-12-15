const github = require('./github')
const dao = require('./dao')

const users = {
}

function getUser(id) {
    if (users[id]) {
        return Promise.resolve(users[id])
    } else {
        return dao.getUser(id)
            .then(user => {
                if (user) {
                    return user
                } else {
                    user = { id: id, branch: 'gh-pages' }
                    return dao.createUser(user)
                }
            })
            .then(user => {
                users[id] = user
                return user
            })
    }
}

function getGithubUser(token) {
    return github.getUser(token)
}

function updateUser(user) {
    const id = user.id
    users[id] = user
    return dao.updateUser(user)
}

function removeUser(id) {
    users[id] = null
    return dao.removeUser(id)
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