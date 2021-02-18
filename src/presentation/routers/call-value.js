const { MissingParamError } = require('../errors')
const HttpResponse = require('../helpers/http-response')

module.exports = class CallValue {
  constructor ({ calcTaxUseCase } = {}) {
    this.calcTaxUseCase = calcTaxUseCase
  }

  async calc (httpRequest) {
    try {
      const { plan, estimatedTime, callOrigin, callDestine } = httpRequest.body
      if (!plan) {
        return HttpResponse.badRequest(new MissingParamError('plan'))
      }
      if (!estimatedTime) {
        return HttpResponse.badRequest(new MissingParamError('estimatedTime'))
      }
      if (!callOrigin) {
        return HttpResponse.badRequest(new MissingParamError('callOrigin'))
      }
      if (!callDestine) {
        return HttpResponse.badRequest(new MissingParamError('callDestine'))
      }
      const value = await this.calcTaxUseCase.load({ plan, estimatedTime, callOrigin, callDestine })
      return HttpResponse.ok({ value })
    } catch (error) {
      return HttpResponse.serverError()
    }
  }
}
