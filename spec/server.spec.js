var request = require('request')

describe('get messages', () => {
    it('should return 200 OK', (done) => {
        request.get('http://localhost:3000/messages', (err, res) => {
            console.log(res)
            expect(res.statusCode).toEqual(200)
            done()
        })
    })
    it('should return a list not empty', (done) => {
        request.get('http://localhost:3000/messages', (err, res) => {
            expect(res.body.length).toBeGreaterThan(0)
            done()
        })
    })
})
