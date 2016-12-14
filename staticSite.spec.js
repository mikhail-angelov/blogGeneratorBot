const expect = require('chai').expect


describe('site generator', function () {
	this.timeout(10000)
	const staticSite = require('./staticSite')
	const TEMP_REPO = 'temp'

	it('should format html', () => {
		const data = [{ "id": "123", "subject": "test", "body": "this is test description" }, { "id": "111", "subject": "one more", "body": "some info" }]
		const template = '{{#each data}}<h3>{{subject}}</h3><p>{{body}}</p>{{/each}}'
		const result = staticSite.generate(data, template)
		expect(result).to.equal('<h3>test</h3><p>this is test description</p><h3>one more</h3><p>some info</p>')
	});

	xit('should create/remove repo', () => {
		const user = {
			token: process.env.TEST_GH_TOKEN,
			branch: 'gh-pages',
			owner: 'mikhail-angelov'
		}

		return staticSite.createSite(user, TEMP_REPO)
			.then(() => {
				expect(user.repo).to.equal(TEMP_REPO)
			})
			.then(() => staticSite.removeSite(user, TEMP_REPO))
			.then(() => {
				expect(user.repo).to.equal(null)
			})
			.catch(err => {
				console.log(err)
			})
	})
})