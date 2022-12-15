var geometry = 
    /* color: #98ff00 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-110.44901807308197, 41.78018660595136],
          [-110.44901807308197, 40.72297553551569],
          [-109.13065869808197, 40.72297553551569],
          [-109.13065869808197, 41.78018660595136]]], null, false);
    
var pkg_sta = require('users/wanglonghao/pkgs:pkg_sta')
var pkg_agg = require('users/wanglonghao/PML:pkg_agg')
var ImgCol_gldas = ee.ImageCollection("projects/pml_evapotranspiration/PML_INPUTS/GLDAS_V21_8day_V2")
/*var gldas = ImgCol_gldas.toList(3000)
var last_image = ee.Image(gldas.get(-1))*/
//print(ImgCol_gldas)

var newgldas = ee.ImageCollection("NASA/GLDAS/V021/NOAH/G025/T3H").filter(ee.Filter.date('2021-05-06','2022-11-10'))
.select(['Psurf_f_inst','Rainf_f_tavg','LWdown_f_tavg','SWdown_f_tavg','Tair_f_inst','Wind_f_inst','Qair_f_inst'], 
['Pa','Prcp','Rln','Rs','T','U2','q'])
//print(newgldas.first())

//print(pkg_sta.Median(last_image, geometry, 27830))
//print(pkg_sta.Median(newgldas.first(), geometry, 27830))

// 8-day aggregate to GLDAS
// (1) get the date list
var date_start = ee.Date('2021-05-09');
var date_mid = ee.Date('2022-01-01');
var date_end = ee.Date('2022-11-10');
var GLDAS2021 = pkg_agg.aggGLDAS(newgldas, date_start, date_mid)
var GLDAS2022 = pkg_agg.aggGLDAS(newgldas, date_mid, date_end)


var gldas = ImgCol_gldas.merge(GLDAS2021).merge(GLDAS2022)

exports.GLDAS = gldas