import moduleAlias from 'module-alias'

moduleAlias.addAliases({
  '@root': `${__dirname}`,
  '@config': `${__dirname}/config`,
  '@routes': `${__dirname}/routes`,
  '@interfaces': `${__dirname}/interfaces`,
  '@services': `${__dirname}/services`,
  '@utils': `${__dirname}/utils`,
  '@models': `${__dirname}/db/models`,
  '@db': `${__dirname}/db`,
  '@middlewares': `${__dirname}/middlewares`,
})
