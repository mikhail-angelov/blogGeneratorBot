
function processMessage(telegram,msg){

	telegram.sendMessage(msg.chat.id, msg.text)
	console.log('op',msg)
}


module.exports = {processMessage};