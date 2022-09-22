const mix = require("laravel-mix");
/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

mix
  .webpackConfig({ stats: { children: false } })
  .js("src/frontend/js/frontend.js", "js")
  .react()
  .sourceMaps(false, "source-map")
  .disableSuccessNotifications();
