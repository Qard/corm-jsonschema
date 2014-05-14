# corm-jsonschema

[![build status](https://secure.travis-ci.org/Qard/corm-jsonschema.png)](http://travis-ci.org/Qard/corm-jsonschema) [![Coverage Status](https://coveralls.io/repos/Qard/corm-jsonschema/badge.png)](https://coveralls.io/r/Qard/corm-jsonschema)

Add [JSON Schema](http://tools.ietf.org/html/draft-zyp-json-schema-03) validation to your [corm](https://github.com/Qard/corm) models.

## Usage

Just call the module with a schema definition and assign it to the `validate` method on the model prototype. Then, whenever corm tries to save a record, it'll validate it first.

```js
const corm = require('corm')
const validates = require('corm-jsonschema')

const model = corm('localhost/test')
const User = model('users')

User.prototype.validate = validates({
  type: 'object',
  properties: {
    name: { type: 'string' },
    email: { type: 'string', required: true }
  }
})
```

## Handling errors

Because of the yield mechanics of generators and their use in corm, this module will simply throw a ValidationError with a property error list whenever you try to save the model and you can catch it with a simple try/catch block. If you want to, for example, save a user in a koa request it might look like this;

```js
app.put('/users/:id', function* (next) {
  var user = User.findById(this.params.id)

  try {
    var body = yield parse.json(this)
    yield user.update(body)
  } catch (err) {
    this.status = 400
    this.body = err.errors
    return
  }

  this.body = user
})
```

---

### Copyright (c) 2013 Stephen Belanger
#### Licensed under MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
