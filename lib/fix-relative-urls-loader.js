/*
 resolve-url-loader resolves url(...) incorrectly from within node_modules

 Which causes those errors:
 Can't resolve
 '../node_modules/bootstrap/node_modules/bootstrap/fonts/glyphicons-halflings-regular.eot'
 '../node_modules/slick-carousel/node_modules/slick-carousel/slick/ajax-loader.gif'

 This loader cut out the duplicated part: node_modules/... from the urls
 */
module.exports = (source) => source.replaceAll(/node_modules.+node_modules/g, 'node_modules');
