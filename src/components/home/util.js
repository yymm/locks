export default {
  formatDate: function (date) {
    let format = 'YYYY-MM-DD-hh-mm-ss'
    format = format.replace(/YYYY/g, date.getFullYear())
    format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2))
    format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2))
    format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2))
    format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2))
    format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2))
    return format
  },
  memorySizeOf: function(obj) {
    var bytes = 0;

    function sizeOf(obj) {
      if(obj !== null && obj !== undefined) {
        switch(typeof obj) {
        case 'number':
          bytes += 8;
          break;
        case 'string':
          bytes += obj.length * 2;
          break;
        case 'boolean':
          bytes += 4;
          break;
        case 'object':
          var objClass = Object.prototype.toString.call(obj).slice(8, -1);
          if(objClass === 'Object' || objClass === 'Array') {
            for(var key in obj) {
              if(!obj.hasOwnProperty(key)) continue;
              sizeOf(obj[key]);
            }
          } else bytes += obj.toString().length * 2;
          break;
        }
      }
      return bytes;
    };

    return sizeOf(obj);
  },
  formatByteSize: function(bytes) {
    if(bytes < 1024) return bytes + " bytes";
    else if(bytes < 1048576) return (bytes / 1024).toFixed(3) + " KB";
    else if(bytes < 1073741824) return (bytes / 1048576).toFixed(3) + " MB";
    else return (bytes / 1073741824).toFixed(3) + " GB";
  },
  formatMiByteSize: function(bytes) {
    return (bytes / 1048576).toFixed(3) + " MB";
  }
}
