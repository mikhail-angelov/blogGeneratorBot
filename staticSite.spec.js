'use strict'

const expect = require('chai').expect
const rewire = require('rewire')

describe('site generator', function () {
	const staticSite = rewire('./staticSite')

	it('should create site', () => {
		staticSite.__set__("github", {
			createRepo: () => Promise.resolve({}),
			createFile: () => Promise.resolve({})
		});
		return staticSite.createSite({}, 'TEST')
			.then(data => {
				expect(true).to.equal(true)
			})
	})

	it('should format html', () => {
		const data = [{ "id": "123", "subject": "test", "body": "this is test description" }, { "id": "111", "subject": "one more", "body": "some info" }]
		const template = '{{#each data}}<h3>{{subject}}</h3><p>{{body}}</p>{{/each}}'
		const result = staticSite.generate(data, template)
		expect(result).to.equal('<h3>test</h3><p>this is test description</p><h3>one more</h3><p>some info</p>')
	});


})