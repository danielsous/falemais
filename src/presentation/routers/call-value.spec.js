const { ServerError, MissingParamError } = require('../errors')
const CallValue = require('./call-value')

const makeSut = () => {
  const calcTaxUseCaseSpy = makeCalcTaxUseCase()
  const sut = new CallValue({
    calcTaxUseCase: calcTaxUseCaseSpy
  })

  return {
    sut,
    calcTaxUseCaseSpy
  }
}

const makeCalcTaxUseCase = () => {
  class CalcTaxUseCaseSpy {
    async load (plan, estimatedTime, callOrigin, callDestine) {
      this.plan = plan
      this.estimatedTime = estimatedTime
      this.callOrigin = callOrigin
      this.callDestine = callDestine
      return this.value
    }
  }
  const calcTaxUseCaseSpy = new CalcTaxUseCaseSpy()
  calcTaxUseCaseSpy.value = {
    valuePlan: 'any_value',
    valueOff: 'any_value'
  }
  return calcTaxUseCaseSpy
}

const makeCalcTaxUseCaseWithError = () => {
  class CalcTaxUseCaseSpy {
    async load () {
      throw new Error()
    }
  }
  return new CalcTaxUseCaseSpy()
}

describe('Call Value', () => {
  test('Should return 200 if params are provided', async () => {
    const { sut, calcTaxUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        plan: 'any_plan',
        estimatedTime: 10,
        callOrigin: 'any_ddd_origin',
        callDestine: 'any_ddd_destine'
      }
    }
    const httpResponse = await sut.calc(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.valuePlan).toBe(calcTaxUseCaseSpy.value.valuePlan)
    expect(httpResponse.body.valueOff).toBe(calcTaxUseCaseSpy.value.valueOff)
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

  test('Should return 400 if no plan is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        estimatedTime: 10,
        callOrigin: 'any_ddd_origin',
        callDestine: 'any_ddd_destine'
      }
    }
    const httpResponse = await sut.calc(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(new MissingParamError('plan').message)
  })

  test('Should return 400 if no estimatedTime is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        plan: 'any_plan',
        callOrigin: 'any_ddd_origin',
        callDestine: 'any_ddd_destine'
      }
    }
    const httpResponse = await sut.calc(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(new MissingParamError('estimatedTime').message)
  })

  test('Should return 400 if no callOrigin is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        plan: 'any_plan',
        estimatedTime: 10,
        callDestine: 'any_ddd_destine'
      }
    }
    const httpResponse = await sut.calc(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(new MissingParamError('callOrigin').message)
  })

  test('Should return 400 if no callDestine is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        plan: 'any_plan',
        estimatedTime: 10,
        callOrigin: 'any_ddd_origin'
      }
    }
    const httpResponse = await sut.calc(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(new MissingParamError('callDestine').message)
  })

  test('Should throw if invalid dependencies are provided', async () => {
    const invalid = {}
    const suts = [].concat(
      new CallValue(),
      new CallValue({}),
      new CallValue({
        calcTaxUseCase: invalid
      })
    )
    for (const sut of suts) {
      const httpRequest = {
        body: {
          plan: 'any_plan',
          estimatedTime: 10,
          callOrigin: 'any_ddd_origin',
          callDestine: 'any_ddd_destine'
        }
      }
      const httpResponse = await sut.calc(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body.error).toBe(new ServerError().message)
    }
  })

  test('Should throw if any dependency throws', async () => {
    const suts = [].concat(
      new CallValue({
        calcTaxUseCase: makeCalcTaxUseCaseWithError()
      })
    )
    for (const sut of suts) {
      const httpRequest = {
        body: {
          plan: 'any_plan',
          estimatedTime: 10,
          callOrigin: 'any_ddd_origin',
          callDestine: 'any_ddd_destine'
        }
      }
      const httpResponse = await sut.calc(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body.error).toBe(new ServerError().message)
    }
  })
})
