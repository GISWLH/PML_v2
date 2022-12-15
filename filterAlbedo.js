
var pkg_trend = require('users/xuzhenwu/public:Math/pkg_trend.js');
var pkg_sta = require('users/wanglonghao/pkgs:pkg_sta');
var pkg_print = require('users/wanglonghao/pkgs:pkg_print');
var pkg_agg = require('users/wanglonghao/PML:pkg_agg')

var imgcol_albedo = ee.ImageCollection("projects/pml_evapotranspiration/PML_INPUTS/MODIS/Albedo_interp_8d_v2")

var Albedo_raw = ee.ImageCollection('MODIS/006/MCD43A3').select(['Albedo_WSA_shortwave'])
        .filter(ee.Filter.date('2021-02-10','2022-11-23'))
        .map(function (img) { return img.select([0]); })
        .select([0, 0], ['Albedo', 'qc']);

var date_start = ee.Date('2021-02-10');
var date_mid = ee.Date('2022-01-01');
var date_end = ee.Date('2022-11-23');
var Alebdo2021 = pkg_agg.aggAlbedo(Albedo_raw, date_start, date_mid)
var Alebdo2022 = pkg_agg.aggAlbedo(Albedo_raw, date_mid, date_end)
//print(pkg_sta.Mean(imgcol_albedo.first(),geometry,500))
//print(pkg_sta.Mean(Albedo_raw.first(),geometry,500))
//var collectAlbedo = imgcol_albedo.merge()
//print(new_Albedo)
var Albedo = imgcol_albedo.merge(Alebdo2021).merge(Alebdo2022)
exports.Albedo = Albedo




