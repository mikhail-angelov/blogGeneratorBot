
const users = require('./users')
const siteGenerator = require('./siteGenerator')
const commands = {
	'/reg': { state: ['enter Github token', 'enter Github repo'], handler: onReg },
	'/add': { state: ['enter new blog subject', 'enter new blog artice/link'], handler: onAdd },
	'/update': { state: ['enter article id', 'type updated subject', 'type updated content'], handler: onUpdate },
	'/remove': { state: ['enter article id'], handler: onRemove },
	'/list': { state: [], handler: onList }
}
const unknownCommand = 'Unrecognized command. \n' +
	'Try those: \n' +
	'/reg - to register Girhub token \n' +
	'/list - to getlist of articles \n' +
	'/add - to add of article \n' +
	'/update - to update of article \n' +
	'/remove - to remove of articles \n'
const unregisteredError = 'You cannot use this command, please register your Github token/repo, then use it.'

function processMessage(telegram, msg) {
	const user = users.getUser(msg.from.username) || users.addTempUser(msg.from.username);

	if (commands[msg.text]) {
		users.setActiveCommand(user, msg.text)
		commands[msg.text].handler(telegram, user, msg)
	} else if (users.getActiveCommand(user)) {
		commands[users.getActiveCommand(user)].handler(telegram, user, msg)
	} else {
		telegram.sendMessage(msg.chat.id, unknownCommand)
	}
	console.log('op', msg)
}

function onReg(telegram, user, msg) {
	const state = users.getCommandState(user);
	if (state == 0) {
		telegram.sendMessage(msg.chat.id, commands[users.getActiveCommand(user)].state[0])
		users.setCommandState(user, state + 1)
	} else if (state == 1) {
		users.setStateValue(user, msg.text)
		telegram.sendMessage(msg.chat.id, commands[users.getActiveCommand(user)].state[1])
		users.setCommandState(user, state + 1)
	} else if (state == 2) {
		users.setActiveCommand(user, null)
		user.token = users.getStateValue(user, 1)
		user.repo = msg.text
		users.addUser(user)
			.then(() => telegram.sendMessage(msg.chat.id, 'user ' + user.id + ' is registered'))
			.catch(err => telegram.sendMessage(msg.chat.id, 'registration error ' + err))
	}
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
		siteGenerator.addArticle(command)
			.then((article) =>{
				 telegram.sendMessage(msg.chat.id, 'article ' + article.id + ' is added')
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
		siteGenerator.updateArticle(command)
			.then(() => telegram.sendMessage(msg.chat.id, 'article ' + command.articleId + ' is updated'))
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
		siteGenerator.removeArticle(command)
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
		siteGenerator.getArticleList(command)
			.then((list) => telegram.sendMessage(msg.chat.id, list))
			.catch(err => {
				telegram.sendMessage(msg.chat.id, 'article list error ' + err)
			})
	}
}

module.exports = { processMessage };