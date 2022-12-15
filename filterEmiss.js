var pkg_sta = require('users/wanglonghao/pkgs:pkg_sta')
var imgcol_emiss = ee.ImageCollection("projects/pml_evapotranspiration/PML_INPUTS/MODIS/Emiss_interp_8d")


var latter_emiss = ee.ImageCollection('MODIS/006/MOD11A2')
        .filter(ee.Filter.date('2021-06-02','2022-11-18'))
        .select(['Emis_31', 'Emis_32'])
        .map(function (img) {
            return img
                .copyProperties(img, ['system:time_start', 'system:id']);
        }).map(function (img) {
            var emiss = img.select(0).expression('b() * 0.002 + 0.49'); //.toFloat(); //.toUint8()
            return img.addBands(emiss);
        }).select([0, 0], ['Emiss', 'qc']);

var collectEmiss = imgcol_emiss.merge(latter_emiss)

exports.Emiss = collectEmiss