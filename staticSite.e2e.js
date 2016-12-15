const expect = require('chai').expect


describe('site generator', function () {
	this.timeout(10000)
	const staticSite = require('./staticSite')
	const TEMP_REPO = 'temp'

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