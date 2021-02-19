const { MissingParamError, ServerError } = require('../../presentation/errors')
const CalcTaxUseCase = require('./calc-tax-usecase')

const makeSut = () => {
  const loadPlanByIDRepositorySpy = makeLoadPlanByIDRepository()
  const loadTaxByCallOriginRepositorySpy = makeLoadTaxByCallOriginRepository()
  const sut = new CalcTaxUseCase({
    loadPlanByIDRepository: loadPlanByIDRepositorySpy,
    loadTaxByCallOriginRepository: loadTaxByCallOriginRepositorySpy
  })

  return {
    sut,
    loadPlanByIDRepositorySpy,
    loadTaxByCallOriginRepositorySpy
  }
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

const makeLoadPlanByIDRepositoryWithError = () => {
  class LoadPlanByIDRepositorySpy extends Error {
    async load () {
      throw new Error()
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

const makeLoadTaxByCallOriginRepositoryWithError = () => {
  class LoadTaxByCallOriginRepositorySpy extends Error {
    async load () {
      throw new Error()
    }
  }
  return new LoadTaxByCallOriginRepositorySpy()
}

describe('CalcTax UseCase', () => {
  test('Should throw if no plan is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.loadCalc()
    expect(promise).rejects.toThrow(new MissingParamError('plan'))
  })

  test('Should throw if no estimatedTime is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.loadCalc('any_plan')
    expect(promise).rejects.toThrow(new MissingParamError('estimatedTime'))
  })

  test('Should throw if no callOrigin is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.loadCalc('any_plan', 'any_estimatedTime')
    expect(promise).rejects.toThrow(new MissingParamError('callOrigin'))
  })

  test('Should throw if no callDestine is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.loadCalc('any_plan', 'any_estimatedTime', 'any_callOrigin')
    expect(promise).rejects.toThrow(new MissingParamError('callDestine'))
  })

  test('Should call LoadPlanByIDRepository with correct id', async () => {
    const { sut, loadPlanByIDRepositorySpy } = makeSut()
    await sut.loadCalc('any_plan', 'any_estimatedTime', 'any_callOrigin', 'any_callDestine')
    expect(loadPlanByIDRepositorySpy.id).toBe('any_plan')
  })

  test('Should call LoadTaxByCallOriginRepository with correct callOrigin', async () => {
    const { sut, loadTaxByCallOriginRepositorySpy } = makeSut()
    await sut.loadCalc('any_plan', 'any_estimatedTime', 'any_callOrigin', 'any_callDestine')
    expect(loadTaxByCallOriginRepositorySpy.callOrigin).toBe('any_callOrigin')
  })

  test('Should return null if an invalid plan is provided', async () => {
    const { sut, loadPlanByIDRepositorySpy } = makeSut()
    loadPlanByIDRepositorySpy.minutePlan = null
    const minute = await sut.loadCalc('invalid_plan', 'any_estimatedTime', 'any_callOrigin', 'any_callDestine')
    expect(minute).toBeNull()
  })

  test('Should return null if an invalid callOrigin is provided', async () => {
    const { sut, loadTaxByCallOriginRepositorySpy } = makeSut()
    loadTaxByCallOriginRepositorySpy.tax = null
    const tax = await sut.loadCalc('any_plan', 'any_estimatedTime', 'invalid_callOrigin', 'any_callDestine')
    expect(tax).toBeNull()
  })

  test('Should return null if an invalid callDestine is provided', async () => {
    const { sut, loadTaxByCallOriginRepositorySpy } = makeSut()
    loadTaxByCallOriginRepositorySpy.tax = null
    const tax = await sut.loadCalc('any_plan', 'any_estimatedTime', 'any_callOrigin', 'invalid_callDestine')
    expect(tax).toBeNull()
  })

  test('Should throw if invalid dependencies are provided', async () => {
    const invalid = {}
    const loadPlanByIDRepository = makeLoadPlanByIDRepository()
    const suts = [].concat(
      new CalcTaxUseCase(),
      new CalcTaxUseCase({}),
      new CalcTaxUseCase({
        loadPlanByIDRepository: invalid
      }),
      new CalcTaxUseCase({
        loadPlanByIDRepository,
        loadTaxByCallOriginRepository: invalid
      })
    )
    for (const sut of suts) {
      const promise = sut.loadCalc('any_plan', 'any_estimatedTime', 'any_ddd_origin', 'any_ddd_destine')
      expect(promise).rejects.toThrow()
    }
  })

  test('Should throw if any dependency throws', async () => {
    const loadPlanByIDRepository = makeLoadPlanByIDRepository()
    const suts = [].concat(
      new CalcTaxUseCase({
        loadPlanByIDRepository: makeLoadPlanByIDRepositoryWithError()
      }),
      new CalcTaxUseCase({
        loadPlanByIDRepository,
        loadTaxByCallOriginRepository: makeLoadTaxByCallOriginRepositoryWithError()
      })
    )
    for (const sut of suts) {
      const promise = sut.loadCalc('any_plan', 'any_estimatedTime', 'any_ddd_origin', 'any_ddd_destine')
      expect(promise).rejects.toThrow()
    }
  })
})
