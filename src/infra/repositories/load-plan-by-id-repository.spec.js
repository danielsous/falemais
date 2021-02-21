const Database = require('../../../config/database')
const { MissingParamError } = require('../../presentation/errors')
const LoadPlanByIDRepository = require('./load-plan-by-id-repository')

const makeSut = () => {
  const planModel = Database.connectMainDB('test').plan
  const sut = new LoadPlanByIDRepository()
  sut.model = Database.connectMainDB('test').plan

  return {
    sut,
    planModel
  }
}

describe('LoadPlanByID Repository', () => {
  test('Should return null if no plan is found', async () => {
    const { sut } = makeSut()
    const plan = await sut.load(10)
    expect(plan).toBeNull()
  })

  test('Should return minutes if plan is found', async () => {
    const { sut, planModel } = makeSut()
    await planModel.destroy({ truncate: true })
    const fakerPlan = await planModel.create({
      id: 1,
      plan: 'FaleMais 60',
      minutes: 60
    })
    const plan = await sut.load(1)
    expect(plan.dataValues).toEqual({
      minutes: fakerPlan.minutes
    })
  })

  test('Should throw  if no id is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.load()
    expect(promise).rejects.toThrow(new MissingParamError('id'))
  })
})
