const { adapt } = require('../adapters/express-router-adapter')
const CalcValueRouterComposer = require('../composers/calc-value-router-composer')

module.exports = router => {
  router.post('/calc', adapt(CalcValueRouterComposer.compose()))
}
