require('dotenv/config')
const Sequelize = require('sequelize')
const fs = require('fs')
const path = require('path')
const basename = path.basename(__filename)
const db = {}

const dirMain = path.join(__dirname, '/../models')

class ConnectDatabase {
  readFile (database) {
    fs
      .readdirSync(dirMain)
      .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file !== basename) && (file.slice(-3) === '.js')
      })
      .forEach(file => {
        const model = require(path.join(dirMain, file))(database, Sequelize.DataTypes)
        db[model.name] = model
      })

    Object.keys(db).forEach(modelName => {
      if (db[modelName].associate) {
        db[modelName].associate(db)
      }
    })

    db.sequelize = database
    db.Sequelize = Sequelize

    return db
  }

  connectMainDB (env) {
    const database = new Sequelize(
      `falemais${env}`,
      'postgres',
      '572600',
      {
        host: '127.0.0.1',
        port: 5432,
        dialect: 'postgres',
        define: {
          freezeTableName: true
        }
      }
    )
    const db = this.readFile(database)
    return db
  }
}

module.exports = new ConnectDatabase()
