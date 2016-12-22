'use strict'

const expect = require('chai').expect


describe('github', function () {
	this.timeout(10000)
	const github = require('./github')

	xit('should do CRUD file operation', () => {
		const auth = {
			token: process.env.TEST_GH_TOKEN,
			branch: 'master',
			owner: 'mikhail-angelov',
			repo: 'blog'
		}
		const FILE_NAME = 'test.txt';
		const CONTENT = 'test';

		return github.createFile(auth, FILE_NAME, '--')
			.then(() => {
				expect(true).to.equal(true);
				return github.updateFile(auth, FILE_NAME, CONTENT)
			})
			.then(() => {
				expect(true).to.equal(true);
				return github.getFile(auth, FILE_NAME)
			})
			.then(text =>{
				expect(text).to.equal(CONTENT);
				return github.removeFile(auth, FILE_NAME)
			})
			.then(() => {
				expect(true).to.equal(true);
			})
			.catch(err=>{
				console.log('crud error', err)
				expect(true).to.equal(false);
			})
	})

	xit('should get user info',()=>{

		return github.getUser(process.env.TEST_GH_TOKEN)
		.then(info=>{
			expect(info.type).to.equal('User')
		})
	})

	it('should create repo',()=>{
		const auth = {
			token: process.env.TEST_GH_TOKEN,
			branch: 'master',
			owner: 'mikhail-angelov',
			repo: 'blog'
		}
		return github.createRepo(auth, auth.repo)
		.then(info=>{
			expect(info).to.equal('test is failed')
		})
		.catch(err=>{
			expect(err).to.equal('exist')
		})
	})

})