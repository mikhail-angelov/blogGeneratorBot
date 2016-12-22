'use strict'

const users = require('./users')
const articles = require('./articles')
const staticSite = require('./staticSite')

const commands = {
	'/info': { state: [], handler: onInfo },
	'/reg': { state: ['enter Github token, if you donnt have one, create it here https://github.com/settings/tokens (add all `user` and `repo` permissions for this token)', 'enter new Github repo name for your blog'], handler: onReg },
	'/add': { state: ['enter new article subject', 'enter new article body'], handler: onAdd },
	'/update': { state: ['enter article id', 'type updated subject', 'type updated body'], handler: onUpdate },
	'/remove': { state: ['enter article id'], handler: onRemove },
	'/list': { state: [], handler: onList }
}
const unknownCommand = 'Unrecognized command. \n' +
	'Try those: \n' +
	'/info - to get account info \n' +
	'/reg - to register Girhub token \n' +
	'/list - to getlist of articles \n' +
	'/add - to add of article \n' +
	'/update - to update of article \n' +
	'/remove - to remove of articles \n'
const unregisteredError = 'You cannot use this command, please register your Github token/repo, then use it.'

function processMessage(telegram, msg) {
	users.getUser(msg.from.username)
		.then(user => {
			if (commands[msg.text]) {
				users.setActiveCommand(user, msg.text)
				commands[msg.text].handler(telegram, user, msg)
			} else if (users.getActiveCommand(user)) {
				commands[users.getActiveCommand(user)].handler(telegram, user, msg)
			} else {
				telegram.sendMessage(msg.chat.id, unknownCommand)
			}
			console.log('op', msg)
		})
}

function onInfo(telegram, user, msg) {
	var info = 'Hi ' +
		(!!user.name ? user.name : user.id) +
		(!!user.token ? '\n your github account is registered' : '\n your github account is not registered, you can use this command /reg to do it') +
		(!!user.repo ? '\n your site is generated at ' + user.repo + ' repo' : '')

	telegram.sendMessage(msg.chat.id, info)
}

function getGeneratedSiteUrl(user){
	return `https://${user.owner}.github.io/${user.repo}`
}

function onReg(telegram, user, msg) {
	const state = users.getCommandState(user);
	if (state == 0) {
		users.setCommandState(user, 1)
		if(!user.token){
			telegram.sendMessage(msg.chat.id, commands[users.getActiveCommand(user)].state[0])
		}else{
			telegram.sendMessage(msg.chat.id, commands[users.getActiveCommand(user)].state[1])
		}
	} else if (!user.token) {
		const token = msg.text
		registerGithubAccount(user, msg.text)
			.then(() => {
				telegram.sendMessage(msg.chat.id, commands[users.getActiveCommand(user)].state[1])
			})
			.catch(err => {
				users.setActiveCommand(user, null)
				telegram.sendMessage(msg.chat.id, 'registration error ' + err)
			})

	} else{
		const repo = msg.text
		users.setActiveCommand(user, null)
		createGithubRepo(user, repo)
			.then(() => telegram.sendMessage(msg.chat.id, 'new blog is created'))
			.catch(err => {
				telegram.sendMessage(msg.chat.id, 'github repository creation is failed ' + err)
			})
	} 
}

function registerGithubAccount(user, token) {
	return users.getGithubUser(token)
		.then(info => {
			user.token = token
			user.owner = info.login
			user.name = info.name
			user.email = info.email
			return users.updateUser(user)
		})
}

function createGithubRepo(user, repo) {
	return staticSite.createSite(user, repo)
		.then(() => {
			user.repo = repo
			return users.updateUser(user)
		})
}

function onAdd(telegram, user, msg) {
	const state = users.getCommandState(user);
	if (!users.isRegistered(user)) {
		telegram.sendMessage(msg.chat.id, unregisteredError)
	} else if (state == 0) {
		telegram.sendMessage(msg.chat.id, commands[users.getActiveCommand(user)].state[0])
		users.setCommandState(user, state + 1)
	} else if (state == 1) {
		users.setStateValue(user, msg.text)
		telegram.sendMessage(msg.chat.id, commands[users.getActiveCommand(user)].state[1])
		users.setCommandState(user, state + 1)
	} else if (state == 2) {
		users.setActiveCommand(user, null)
		const command = {
			user: user,
			subject: users.getStateValue(user, 1),
			body: msg.text
		}
		articles.add(command)
			.then(() => {
				telegram.sendMessage(msg.chat.id, 'article is added')
			})
			.catch(err => {
				telegram.sendMessage(msg.chat.id, 'article add error ' + err)
			})
	}
}
function onUpdate(telegram, user, msg) {
	const state = users.getCommandState(user);
	if (!users.isRegistered(user)) {
		telegram.sendMessage(msg.chat.id, unregisteredError)
	} else if (state == 0) {
		telegram.sendMessage(msg.chat.id, commands[users.getActiveCommand(user)].state[0])
		users.setCommandState(user, state + 1)
	} else if (state == 1) {
		users.setStateValue(user, msg.text)
		telegram.sendMessage(msg.chat.id, commands[users.getActiveCommand(user)].state[1])
		users.setCommandState(user, state + 1)
	} else if (state == 2) {
		users.setStateValue(user, msg.text)
		telegram.sendMessage(msg.chat.id, commands[users.getActiveCommand(user)].state[1])
		users.setCommandState(user, state + 1)
	} else if (state == 3) {
		users.setActiveCommand(user, null)
		const command = {
			user: user,
			id: users.getStateValue(user, 1),
			subject: users.getStateValue(user, 2),
			body: msg.text
		}
		articles.update(command)
			.then(() => telegram.sendMessage(msg.chat.id, 'article ' + command.id + ' is updated'))
			.catch(err => telegram.sendMessage(msg.chat.id, 'article update error ' + err))
	}
}
function onRemove(telegram, user, msg) {
	const state = users.getCommandState(user);
	if (!users.isRegistered(user)) {
		telegram.sendMessage(msg.chat.id, unregisteredError)
	} else if (state == 0) {
		telegram.sendMessage(msg.chat.id, commands[users.getActiveCommand(user)].state[0])
		users.setCommandState(user, state + 1)
	} else if (state == 1) {
		users.setActiveCommand(user, null)
		const command = {
			user: user,
			articleId: msg.text
		}
		articles.remove(command)
			.then(() => telegram.sendMessage(msg.chat.id, 'article ' + command.articleId + ' is removed'))
			.catch(err => telegram.sendMessage(msg.chat.id, 'article remove error ' + err))
	}
}
function onList(telegram, user, msg) {
	const state = users.getCommandState(user);
	if (!users.isRegistered(user)) {
		telegram.sendMessage(msg.chat.id, unregisteredError)
	} else {
		users.setActiveCommand(user, null)
		const command = {
			user: user,
		}
		articles.getList(command)
			.then((list) => telegram.sendMessage(msg.chat.id, list))
			.catch(err => {
				telegram.sendMessage(msg.chat.id, 'article list error ' + err)
			})
	}
}

module.exports = { processMessage };