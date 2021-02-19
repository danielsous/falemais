const { MissingParamError } = require('../../presentation/errors')

module.exports =
class CalcTaxUseCase {
  constructor ({ loadPlanByIDRepository, loadTaxByCallOriginRepository } = {}) {
    this.loadPlanByIDRepository = loadPlanByIDRepository
    this.loadTaxByCallOriginRepository = loadTaxByCallOriginRepository
  }

  async load (plan, estimatedTime, callOrigin, callDestine) {
    if (!plan) {
      throw new MissingParamError('plan')
    }
    if (!estimatedTime) {
      throw new MissingParamError('estimatedTime')
    }
    if (!callOrigin) {
      throw new MissingParamError('callOrigin')
    }
    if (!callDestine) {
      throw new MissingParamError('callDestine')
    }
    const minutePlan = await this.loadPlanByIDRepository.load(plan)
    const tax = await this.loadTaxByCallOriginRepository.load(callOrigin, callDestine)
    let valuePlan = 0
    if (minutePlan && tax) {
      if (estimatedTime > minutePlan) {
        const number = ((estimatedTime - minutePlan) * tax)
        valuePlan = number + (number / 10)
      }
      const valueOff = estimatedTime * tax

      return { valuePlan, valueOff }
    }

    return null
  }
}
