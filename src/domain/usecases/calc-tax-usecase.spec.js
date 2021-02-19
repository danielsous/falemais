const { MissingParamError } = require('../../presentation/errors')
const CalcTaxUseCase = require('./calc-tax-usecase')

const makeSut = () => {
  const loadPlanByIDRepositorySpy = makeLoadPlanByIDRepository()
  const loadTaxByCallOriginRepositorySpy = makeLoadTaxByCallOriginRepository()
  const calcTaxUseCaseSpy = makeCalcTaxUseCase()
  const sut = new CalcTaxUseCase({
    loadPlanByIDRepository: loadPlanByIDRepositorySpy,
    loadTaxByCallOriginRepository: loadTaxByCallOriginRepositorySpy
  })

  return {
    sut,
    loadPlanByIDRepositorySpy,
    loadTaxByCallOriginRepositorySpy,
    calcTaxUseCaseSpy
  }
}

const makeCalcTaxUseCase = () => {
  class CalcTaxUseCaseSpy {
    constructor ({ loadPlanByIDRepository, loadTaxByCallOriginRepository } = {}) {
      this.loadPlanByIDRepository = loadPlanByIDRepository
      this.loadTaxByCallOriginRepository = loadTaxByCallOriginRepository
    }

    async load (plan, estimatedTime, callOrigin, callDestine) {
      this.plan = plan
      this.estimatedTime = estimatedTime
      this.callOrigin = callOrigin
      this.callDestine = callDestine
      return (this.valuePlan, this.valueOff)
    }
  }
  return new CalcTaxUseCaseSpy()
}

const makeLoadPlanByIDRepository = () => {
  class LoadPlanByIDRepositorySpy {
    async load (id) {
      this.id = id
      return this.minutePlan
    }
  }
  return new LoadPlanByIDRepositorySpy()
}

const makeLoadTaxByCallOriginRepository = () => {
  class LoadTaxByCallOriginRepositorySpy {
    async load (callOrigin, callDestine) {
      this.callOrigin = callOrigin
      this.callDestine = callDestine
      return this.tax
    }
  }
  return new LoadTaxByCallOriginRepositorySpy()
}

describe('CalcTax UseCase', () => {
  test('Should throw if no plan is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.load()
    expect(promise).rejects.toThrow(new MissingParamError('plan'))
  })

  test('Should throw if no estimatedTime is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.load('any_plan')
    expect(promise).rejects.toThrow(new MissingParamError('estimatedTime'))
  })

  test('Should throw if no callOrigin is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.load('any_plan', 'any_estimatedTime')
    expect(promise).rejects.toThrow(new MissingParamError('callOrigin'))
  })

  test('Should throw if no callDestine is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.load('any_plan', 'any_estimatedTime', 'any_callOrigin')
    expect(promise).rejects.toThrow(new MissingParamError('callDestine'))
  })

  test('Should call LoadPlanByIDRepository with correct id', async () => {
    const { sut, loadPlanByIDRepositorySpy } = makeSut()
    await sut.load('any_plan', 'any_estimatedTime', 'any_callOrigin', 'any_callDestine')
    expect(loadPlanByIDRepositorySpy.id).toBe('any_plan')
  })

  test('Should call LoadTaxByCallOriginRepository with correct id', async () => {
    const { sut, loadTaxByCallOriginRepositorySpy } = makeSut()
    await sut.load('any_plan', 'any_estimatedTime', 'any_callOrigin', 'any_callDestine')
    expect(loadTaxByCallOriginRepositorySpy.callOrigin).toBe('any_callOrigin')
  })

  test('Should return null if an invalid plan is provided', async () => {
    const { sut, loadPlanByIDRepositorySpy } = makeSut()
    loadPlanByIDRepositorySpy.minutePlan = null
    const minute = await sut.load('invalid_plan', 'any_estimatedTime', 'any_callOrigin', 'any_callDestine')
    expect(minute).toBeNull()
  })

  test('Should return null if an invalid callOrigin is provided', async () => {
    const { sut, loadTaxByCallOriginRepositorySpy } = makeSut()
    loadTaxByCallOriginRepositorySpy.tax = null
    const tax = await sut.load('any_plan', 'any_estimatedTime', 'invalid_callOrigin', 'any_callDestine')
    expect(tax).toBeNull()
  })

  test('Should return null if an invalid callDestine is provided', async () => {
    const { sut, loadTaxByCallOriginRepositorySpy } = makeSut()
    loadTaxByCallOriginRepositorySpy.tax = null
    const tax = await sut.load('any_plan', 'any_estimatedTime', 'any_callOrigin', 'invalid_callDestine')
    expect(tax).toBeNull()
  })
})