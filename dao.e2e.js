'use strict'

const expect = require('chai').expect

describe('dao', function () {
    this.timeout(10000)
    const dao = require('./dao')
    const opts = {
        dbUser: process.env.DB_USER,
        dbPassword: process.env.DB_PASSWORD,
        dbUrl: process.env.DB_URL
    }
    const USER = {
        id: '123456789',
        name: 'TEST'
    }
    const PROVERKA = 'PROVERKA'

    it('should do CRUD user operation', function () {
        this.timeout(10000)
        return dao.connect(opts)
            .then((db) => {
                expect(!!db).to.equal(true)
                return dao.createUser(USER)
            })
            .then((user) => {
                return dao.getUser(USER.id)
            })
            .then(user => {
                expect(user.id).to.equal(USER.id)
                expect(user.name).to.equal(USER.name)

                USER.name = PROVERKA
                return dao.updateUser(USER);
            })
            .then(() => dao.getUser(USER.id))
            .then(user => {
                expect(user.id).to.equal(USER.id)
                expect(user.name).to.equal(PROVERKA)
            })
            .then(() => dao.removeUser(USER.id))
            .then(() => dao.getUser(USER.id))
            .then(user => {
                expect(user).to.equal(null)
            })
            .then(()=>dao.disconnect())
            .catch(err => {
                expect(err).to.equal('test fails')
            })
    })
})