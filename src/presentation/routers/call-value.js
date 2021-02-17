const HttpResponse = require('../helpers/http-response')
module.exports = class CallValue {
  async calc (httpRequest) {
    try {
      const { plan, estimated_time, call_origin, call_destine } = httpRequest.body
      return HttpResponse.ok('any_value')
    } catch (error) {
      return HttpResponse.serverError()
    }
  }
}
