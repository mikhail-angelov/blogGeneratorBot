const expect = require('chai').expect


describe('site generator', function () {
	const siteGenerator = require('./siteGenerator')

	it('should format html', () => {
		const data = [{ "id": "123", "subject": "test", "body": "this is test description" }, { "id": "111", "subject": "one more", "body": "some info" }]
		const template = '{{#each data}}<h3>{{subject}}</h3><p>{{body}}</p>{{/each}}'
		const result = siteGenerator.generate(data,template)
		expect(result).to.equal('<h3>test</h3><p>this is test description</p><h3>one more</h3><p>some info</p>')
	});
})