const ServerError = require('../errors/server-error')
const CallValue = require('./call-value')

const makeSut = () => {
  const sut = new CallValue()

  return {
    sut
  }
}

describe('Call Value', () => {
  test('Should return value if params are provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        plan: 'any_plan',
        estimated_time: 10,
        call_origin: 'any_ddd_origin',
        call_destine: 'any_ddd_destine'
      }
    }
    const httpResponse = await sut.calc(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toBe('any_value')
  })

  test('Should return 500 if no httpRequest is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.calc()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new ServerError().message)
  })

  test('Should return 500 if httpRequest has no body', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.calc({})
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new ServerError().message)
  })
})
