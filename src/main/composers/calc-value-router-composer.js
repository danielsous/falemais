const CalcValueRouter = require('../../presentation/routers/call-value')
const CalcTaxUseCase = require('../../domain/usecases/calc-tax-usecase')
const LoadPlanByIDRepository = require('../../infra/repositories/load-plan-by-id-repository')
const LoadTaxByCallOriginRepository = require('../../infra/repositories/load-tax-by-callorigin-repository')

module.exports = class CalcValueRouterComposer {
  static compose () {
    const loadPlanByIDRepository = new LoadPlanByIDRepository()
    const loadTaxByCallOriginRepository = new LoadTaxByCallOriginRepository()

    const calcTaxUseCase = new CalcTaxUseCase({
      loadPlanByIDRepository,
      loadTaxByCallOriginRepository
    })
    return new CalcValueRouter({
      calcTaxUseCase
    })
  }
}
