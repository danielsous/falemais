const Database = require('../../../config/database')
const { MissingParamError } = require('../../presentation/errors')

module.exports =
class LoadPlanByIDRepository {
  constructor () {
    this.model = Database.connectMainDB().plan
  }

  async load (id) {
    if (!id) {
      throw new MissingParamError('id')
    }
    const minutes = await this.model.findOne({
      where: { id: id },
      attributes: ['minutes']
    })
    return minutes.dataValues.minutes
  }
}
