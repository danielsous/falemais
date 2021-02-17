class CallValue {
  async calc (httpRequest) {
    return {
      statusCode: 200,
      body: 'any_value'
    }
  }
}

describe('Call Value', () => {
  test('Should return value if params are provided', async () => {
    const sut = new CallValue()
    const httpRequest = {
      plan: 'any_plan',
      estimated_time: 10,
      call_origin: 'any_ddd_origin',
      call_destine: 'any_ddd_destine'
    }
    const httpResponse = await sut.calc(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toBe('any_value')
  })
})
