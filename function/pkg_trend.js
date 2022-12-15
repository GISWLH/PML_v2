// var pkg_trend = require('users/kongdd/public:pkg_trend.js');
// var pkg_trend = {};
var pkg_trend = require('users/kongdd/pkgs:pkg_date.js');
var pkg_agg = require('users/kongdd/pkgs:pkg_agg.js');
pkg_trend = pkg_trend.merge_dict(pkg_trend, pkg_agg);
pkg_trend.showdata = function(ImgCol) {
    ImgCol.filter(filter_date).aside(print);
}
pkg_trend.linearTrend = function (ImgCol, robust) {
    // img should only have dependant band
    function createConstantBand(img) {
        // img = ee.Image(img);
        var year = ee.Image(ee.Number.parse(img.get('year'))).toInt16();
        return img.addBands(ee.Image([1, year]));
    }
    if (robust === undefined) { robust = false; }
    ImgCol = ImgCol.map(createConstantBand)
        .select([1, 2, 0], ['constant', 'year', 'y']);
    var FUN;
    if (robust) {
        FUN = ee.Reducer.robustLinearRegression(2, 1);
    } else {
        FUN = ee.Reducer.linearRegression(2, 1);
    }
    var n = ee.Number(ImgCol.size());
    var bandnames = ['offset', 'slope'];
    var regression = ImgCol.reduce(FUN);
    var coef = regression.select('coefficients').arrayProject([0]).arrayFlatten([bandnames]);
    // root mean square of the residuals of each dependent variable
    // actually, it is RMSE, not residuals
    var RMSE = regression.select('residuals').arrayFlatten([['RMSE']]);
    var offset = coef.select('offset');
    var slope = coef.select('slope');
    /** try to get the tval to juage regression significant level */
    var Sx = n.multiply(n.add(1)).multiply(n.subtract(1)).divide(12);
    var tval, formula = false;
    if (formula) {
        // solution1: statistical formula
        ImgCol = ImgCol.map(function (img) {
            var pred = img.select(['year']).multiply(slope).add(offset).rename('pred');
            var re = img.expression('pow(y - pred, 2)', { NDVI: img.select('y'), pred: pred }).rename('re');
            return img.addBands(pred).addBands(re);
        });
        var Sy = ImgCol.select('re').sum();
        tval = slope.expression('slope/sqrt(Sy/(Sx*(n-2)))', { slope: slope, Sx: Sx, Sy: Sy, n: n }).rename('tval');
    } else {
        // solution2: lazy method
        var adj = n.divide(n.subtract(2)).sqrt();
        tval = RMSE.expression('slope/(b()*adj)*sqrt(Sx)', { slope: slope, Sx: Sx, adj: adj }).rename('tval');
    }
    return coef.addBands(tval);
}
pkg_trend.imgcol_trend = function (imgcol, band, robust) {
    if (band === undefined) { band = 0; }
    if (robust === undefined) { robust = true; }
    // add seasonal variable
    imgcol = imgcol.select(band).map(function (img) { return pkg_trend.addSeasonProb(img); });
    var trend = pkg_trend.linearTrend(imgcol, robust); //ee.Image
    return trend;
}
exports = pkg_trend;