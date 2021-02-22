const Database = require('../../../config/database')
const { MissingParamError } = require('../../presentation/errors')

module.exports =
class LoadTaxByCallOriginRepository {
  constructor () {
    this.model = Database.connectMainDB().tax
  }

  async load (callOrigin, callDestine) {
    if (!callOrigin) {
      throw new MissingParamError('callOrigin')
    }
    if (!callDestine) {
      throw new MissingParamError('callDestine')
    }
    const tax = await this.model.findOne({
      where: { origin: callOrigin, destine: callDestine },
      attributes: ['tax']
    })
    return tax.dataValues.tax
  }
}
