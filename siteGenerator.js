const handlebars = require('handlebars')
const github = require('./github')

const DATA_FILE = 'data.json'
const TEMPLATE_FILE = 'template.html'
const INDEX_HTML = 'index.html'

function addArticle(command) {
    var data;
    return loadDataAndTemplate(command.user)
        .then(responses => {
            data = addRecord(responses.data, command)
            return updateDataAndIndex(command.user, data, responses.template)
        })
        .then(()=>data[0])
}

function updateArticle(command) {
    return loadDataAndTemplate(command.user)
        .then(responses => {
            const data = responses.data.map(item => {
                if (item.id == command.id) {
                    item.subject = command.subject || item.subject
                    item.body = command.body || item.body
                }
                return item;
            })
            return updateDataAndIndex(command.user, data, responses.template)
        })
}

function removeArticle(command) {
    return loadDataAndTemplate(command.user)
        .then(responses => {
            const data = responses.data.map(item => item.id != command.id)
            return updateDataAndIndex(command.user, data, responses.template)
        })
}

function getArticleList(command) {
    return github.getFile(command.user, DATA_FILE)
        .then(response => {
            const data = JSON.parse(response)
            const result = data.reduce((acc, item)=>{
                acc = acc + item.id + '\n' + item.subject + '\n'+'------------\n'
                return acc
            },'')
            return result
    })
}

function generateUID() {
    return Math.random().toString(36).substring(2, 15);
}

function generate(data, template) {
    const hbr = handlebars.compile(template);
    return hbr({ data: data });
}

function addRecord(articles, command) {
    return [{
        id: generateUID(),
        subject: command.subject,
        body: command.body //todo: format it    
    }].concat(articles)
}

function loadDataAndTemplate(user) {
    return Promise.all([
        github.getFile(user, DATA_FILE),
        github.getFile(user, TEMPLATE_FILE)
    ]).then(responses => ({
        data: JSON.parse(responses[0]),
        template: responses[1]
    }))
}

function updateDataAndIndex(user, data, template) {
    const html = generate(data, template)
    return github.updateFile(user, DATA_FILE, JSON.stringify(data))
        .then(()=>github.updateFile(user, INDEX_HTML, html))
        
}

module.exports = {
    addArticle,
    updateArticle,
    removeArticle,
    getArticleList,

    //private
    generate
}
