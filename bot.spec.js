const expect = require('chai').expect

describe('bot',()=>{
	const bot = require('./bot')

	xit('should process messages',done=>{
		const message = {
			chat:{id:'TEST'},
			text: 'TEST'
		}
		const telegramStub = {
			sendMessage: (chatId, msg)=>{
				expect(chatId).to.equal('TEST')
				expect(msg.trim()).to.equal('TEST')
				done()
			}
		}

		//test
		bot.processMessage(telegramStub, message)
	})
})