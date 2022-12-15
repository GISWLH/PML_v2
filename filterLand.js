var pkg_print = require('users/wanglonghao/pkgs:pkg_print')
var imgcol_land = ee.ImageCollection("MODIS/006/MCD12Q1")
var lastLand = pkg_print.Last(imgcol_land)
var land2021 = lastLand
.set('system:time_start', ee.Date(1577836800000).advance(1, 'year'))
.set('system:time_end', ee.Date(1577836800000).advance(1, 'year'))
var land2022 = lastLand
.set('system:time_start', ee.Date(ee.Date(1577836800000).advance(2, 'year')))
.set('system:time_end', ee.Date(1577836800000).advance(2, 'year'))

var Land = imgcol_land.merge(land2021).merge(land2022)


exports.Land = Land
