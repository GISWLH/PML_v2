var pkgs = {};

pkgs.aggGLDAS = function(imagecollection, start, end){
  // calculate days
  var days = end.difference(start,'days');
  //print(days, 'num of day')
  // calcualte image number by divide 8-days
  //var days8 = days.divide(8).round()
  //print(days, 'num of 8-day')
  var day8_list = ee.List.sequence(0, days, 8);
  //print(day8_list, '8-day list')
  // define the day advance function
  function make_8day_list(n){
    return start.advance(n, 'day');
  }
  var date_points = day8_list.map(make_8day_list);
  //print(date_points)
  
  // (2) 
  var aggGldas = function(date){
    var image = imagecollection.filter(ee.Filter.date(ee.Date(date), ee.Date(date).advance(8, 'day')))
    var Pa = image.select('Pa').mean().multiply(0.001)
    var Prcp = image.select('Prcp').mean().multiply(86400)
    var Rln = image.select('Rln').mean()
    var Rs = image.select('Rs').mean()
    var Tavg = image.select('T').mean().subtract(273.15)
    var Tmax = image.select('T').max().subtract(273.15)
    var Tmin = image.select('T').min().subtract(273.15)
    var U2 = image.select('U2').mean()
    var q = image.select('q').mean()
    return ee.Image([Pa,Prcp,Rln,Rs,Tavg,Tmax,Tmin,U2,q])
    .rename(['Pa','Prcp','Rln','Rs','Tavg','Tmax','Tmin','U2','q'])
    .set("system:time_start", image.first().get("system:time_start"))
    .set("time", date)
  }
  var new_gldas = date_points.map(aggGldas)
  var new_gldas = ee.ImageCollection(new_gldas)
  return new_gldas
}

pkgs.aggAlbedo = function(imagecollection, start, end){

  // calculate days
  var days = end.difference(start,'days');
  //print(days, 'num of day')
  // calcualte image number by divide 8-days
  //var days8 = days.divide(8).round()
  //print(days, 'num of 8-day')
  var day8_list = ee.List.sequence(0, days, 8);
  //print(day8_list, '8-day list')
  // define the day advance function
  function make_8day_list(n){
    return start.advance(n, 'day');
  }
  var date_points = day8_list.map(make_8day_list);
  //print(date_points)
  
  // (2) 
  var aggAlbedo = function(date){
    var image = imagecollection.filter(ee.Filter.date(ee.Date(date), ee.Date(date).advance(8, 'day')))
    var Albedo = image.select('Albedo').mean()
    var qc = image.select('qc').mean()
    return ee.Image([Albedo,qc])
    .rename(['Albedo','qc'])
    .set("system:time_start", image.first().get("system:time_start"))
    .set("time", date)
  }
  var new_Albedo = date_points.map(aggAlbedo)
  var new_Albedo = ee.ImageCollection(new_Albedo)
  return new_Albedo 
}

pkgs.aggLAI = function(imagecollection, start, end){

  // calculate days
  var days = end.difference(start,'days');
  var day8_list = ee.List.sequence(0, days, 8);
  // define the day advance function
  function make_8day_list(n){
    return start.advance(n, 'day');
  }
  var date_points = day8_list.map(make_8day_list);
  
  // (2) 
  var aggLAI = function(date){
    var image = imagecollection.filter(ee.Filter.date(ee.Date(date), ee.Date(date).advance(9, 'day')))
    var image1 = image.first()
    var LAI = image.select('Lai').mean()
    return LAI
//    .copyProperties(image1, image1.propertyNames())
    .set("system:time_start", date)
    .set("time", date)
  }
  var new_LAI = date_points.map(aggLAI)
  var new_LAI = ee.ImageCollection(new_LAI)
  return new_LAI 
}
exports = pkgs;