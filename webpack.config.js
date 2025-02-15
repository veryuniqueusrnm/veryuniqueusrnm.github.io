var path = require('path');

module.exports = {
    entry: {
        'includeTag.browser': '/assets/js/includeTag.browser.js',
        'includeTag.node': '/assets/js/includeTag.node.js'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: "[name].js"
    }
};