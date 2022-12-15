var LAI_whik = ee.ImageCollection("projects/pml_evapotranspiration/PML_INPUTS/MODIS/LAI_whit_4d");
//var imgList = imageCollection.first()
//print(imgList.bandNames().size().subtract(1))
//print(imgList.select([0,1,2]))
//print(ee.ImageCollection([]).merge(imageCollection))
//var pkg_sta = require('users/wanglonghao/pkgs:pkg_sta')
var pkg_agg = require('users/wanglonghao/PML:pkg_agg')
var imagelist = LAI_whik.iterate(band2col, ee.List([0]))

function band2col(image, initcol){
  var mylist = ee.List.sequence(0, image.bandNames().size().subtract(1))
  var imagelist = mylist.map(function(number){
    var single_image = image.select(ee.Number(number))
    return single_image
    })
  return ee.List([initcol]).add(imagelist)
}
var newLAI = ee.List(imagelist).flatten().remove(0)
var newLAI = ee.ImageCollection(newLAI)
// print(newLAI, 'newLAI')
var newLAI = newLAI.map(function(image){
  var bandname = image.bandNames().getString(0).slice(1,11)
  var start = ee.Date.parse('YYYY_MM_dd', bandname)
  var end = start.advance(4, 'day')
  var imagemulti = image.setMulti({
  'system:time_start':start.difference('1970-01-01', 'day').multiply(86400000),
  'system:end':end.difference('1970-01-01', 'day').multiply(86400000),
  'system:id': start.format('YYYY-MM-dd'),
  'system:index':start.format('YYYY-MM-dd')
});
  return imagemulti
  })
  
var newLAI = newLAI.map(function(image){
  var image1 = image.select(image.bandNames(), ['Lai']);
  return image1
  })
//print(newLAI)
/*var oneLAI = newLAI.first()
var bandname = oneLAI.bandNames()
var str = bandname.getString(0)
var str_list = str.slice(1,11)
print(ee.Date.parse('YYYY_MM_dd', str_list))*/
/*var imgcol_lai = ee.ImageCollection('MODIS/006/MCD15A3H').select('Lai')
        .filter(ee.Filter.date('2000-07-04', '2019-09-03'))
        .map(function (img) { return img.multiply(0.1).
        copyProperties(img, img.propertyNames()); }); //scale factor 0.1
print(imgcol_lai, 'imgcol_lai')
print(ee.Date(1025740800000))
print(ee.Date(1026086400000))*/

var filterLAI = function(img){
  var newimg = img.copyProperties(img, img.propertyNames());
  return newimg
}
var latter_lai = ee.ImageCollection('MODIS/006/MCD15A3H').select('Lai').filter(ee.Filter.date('2019-09-06', '2022-11-21')).map(filterLAI)
var collectLAI = newLAI.merge(latter_lai)
exports.LAI = collectLAI
// var scale = newLAI.first().select('Lai').projection().nominalScale()
// print(scale)

/*var n = 300
var colList = newLAI.toList(n);
for (var i = 0; i < n; i++) {
  var img = ee.Image(colList.get(i))
  var id = img.get('system:index');
    
  Export.image.toAsset({
    image: img,
    description: id,
    assetId: 'projects/pml_evapotranspiration/PML_INPUTS/MODIS/LAI_whit19_wang',
    scale: 500,
    maxPixels: 1e13})
}*/
// print(newLAI.first().get('system:index'))