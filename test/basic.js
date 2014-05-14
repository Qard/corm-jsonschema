const should = require('should')
const corm = require('corm')
const validates = require('..')

describe('validate', function () {
  // Create a corm connection
  const model = corm('localhost/test')
  const User = model('users')
  User.prototype.validate = validates({
    type: 'object',
    properties: {
      name: { type: 'string' },
      email: { type: 'string', required: true }
    }
  })


  // Clear all users after each test
  afterEach(function* () {
    yield User.remove({})
  })

  it('should not throw on valid input', function* () {
    yield User.create({
      name: 'me',
      email: 'me@example.com'
    })
  })

  it('should throw on invalid input', function* () {
    var user = new User({
      name: 'me'
    })

    var err
    try {
      yield user.save()
    } catch (e) {
      err = e
    }

    should.exist(err)
    err.should.be.an.instanceof(Error)
    err.should.have.property('message', 'validation failed')
  })

  it('should store a list of all errors on the instance and validation error', function* () {
    var user = new User({
      name: 1
    })

    var err
    try {
      yield user.save()
    } catch (e) {
      err = e
    }

    should.exist(err)

    var things = [err, user]
    things.forEach(function (thing) {
      thing.should.have.property('errors').with.lengthOf(2)
      thing.errors[0].should.have.property('property', 'name')
      thing.errors[0].should.have.property('message', 'is not of a type(s) string')
      thing.errors[1].should.have.property('property', 'email')
      thing.errors[1].should.have.property('message', 'is required')
    })
  })
})
