/*
 resolve-url-loader result url(...) incorrectly in node_modules

 Which causes this error:
 Can't resolve
 '../node_modules/bootstrap/node_modules/bootstrap/fonts/glyphicons-halflings-regular.eot'

 This loader cut out the duplicated part: node_modules/... from the urls
 */
module.exports = (source) => source.replaceAll(/node_modules.+node_modules/g, 'node_modules');
