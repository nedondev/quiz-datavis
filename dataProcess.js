function convertToCSV(time, value) {
  var str = 'time,value\r\n';
  var line = '';
  for (var i = 0; i < time.length; i++) {
    line += time[i] + ',' + value[i];
    str += line + '\r\n';
    line = '';
  }
  return str;
}
function convertToARR(time, value) {
  var arr = []
  var row = []
  for (var i = 0; i < time.length; i++) {
    row.push(time[i]);
    row.push(value[i]);
    arr.push(row);
    row = []
    //console.log(time[i].substring(0,5))
  }
  return arr;
}
function arrDatas(time, value) {
  this.time = time;
  this.value = value;
}
function convertToJSON(arrData) {
  var temp = [];
  for (var i = 0; i < arrData.length; i++) {
    temp[i] = new arrDatas(arrData[i][0], arrData[i][1]);
  }
  var myObj = new Object;
  myObj.arrData = temp;
  var objJSON = JSON.stringify(myObj)
  return objJSON
}

function subHex(stringIn) {
  var str = stringIn.substring(2, 4);
  return str;
}