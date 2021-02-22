const Database = require('../../../config/database')
const { MissingParamError } = require('../../presentation/errors')
const LoadTaxByCallOriginRepository = require('./load-tax-by-callorigin-repository')

const makeSut = () => {
  const taxModel = Database.connectMainDB('test').tax
  const sut = new LoadTaxByCallOriginRepository()
  sut.model = Database.connectMainDB('test').tax

  return {
    sut,
    taxModel
  }
}

describe('LoadPlanByID Repository', () => {
  test('Should return null if no tax is found', async () => {
    const { sut } = makeSut()
    const tax = await sut.load('invalid_callOrigin', 'invalid_callDestine')
    expect(tax).toBeNull()
  })

  test('Should return tax if callOrigin and callDestine is found', async () => {
    const { sut, taxModel } = makeSut()
    await taxModel.destroy({ truncate: true })
    const fakerTax = await taxModel.create({
      origin: '011',
      destine: '017',
      tax: 1.90
    })
    const tax = await sut.load('011', '017')
    expect(tax.dataValues).toEqual({
      tax: fakerTax.tax
    })
  })

  test('Should throw  if no callOrigin is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.load()
    expect(promise).rejects.toThrow(new MissingParamError('callOrigin'))
  })

  test('Should throw  if no callDestine is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.load('any_callOrigin')
    expect(promise).rejects.toThrow(new MissingParamError('callDestine'))
  })
})
