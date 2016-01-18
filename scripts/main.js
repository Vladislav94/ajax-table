(function(){
  var table = document.getElementsByClassName('table'),
      datesArr = [],
      parsedData;

  loadData();
    
  function loadData() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/stats.csv');

    xhr.send();


    xhr.onreadystatechange = function() {
      if (xhr.readyState != 4) {
        return;
      }
      if (xhr.status != 200) {
      } else {
        convertData(xhr.responseText);
        uniqueData(parsedData);
        createDateRow(getUniqueArr(datesArr))

        var dateRow = document.getElementsByClassName('table-date'),
            countryRow,
            itemRow;

        for(var i = 0; i < dateRow.length; i++) {
          dateRow[i].addEventListener('click', function(){
            var that = this,
                thatIndex = that.getAttribute('data-index'),
                thatDate = that.querySelector('.date-col').innerHTML,
                thatDateCountryes = createCountryRow(parsedData, thatIndex, thatDate);

            countryRow = document.getElementsByClassName('table-country');
            for(var i = 0; i < countryRow.length; i++) {
              if (countryRow[i].getAttribute('data-date') == thatDate) {
                countryRow[i].hidden = !countryRow[i].hidden;
                console.log(countryRow[i].hidden);
              };
            }
            if (this.classList.contains('created-country')) {
              return
            };

            for(var i = thatDateCountryes.length; i > 0; --i) {
                  var next = that.nextSibling;
                  table[0].insertBefore(thatDateCountryes[i-1], next);
            }
            that.className += ' created-country';
            itemsEvent();
          });
        }

        function itemsEvent() {
          for(var i = 0; i < countryRow.length; i++) {
            countryRow[i].addEventListener('click', function(){
              var that = this,
                  thatDate = that.getAttribute('data-date'),
                  thatName = that.querySelector('.country-name').innerHTML,
                  thatCountryItem = createItemRow(parsedData, thatName, thatDate);

              itemRow = document.getElementsByClassName('table-item');
                for(var i = 0; i < itemRow.length; i++) {
                  if (itemRow[i].getAttribute('data-country') == thatName && itemRow[i].getAttribute('data-date') == thatDate) {
                    itemRow[i].hidden = !itemRow[i].hidden;
                  };
                }
              if (this.classList.contains('created-items')) {
                return
              };

              for(var i = thatCountryItem.length; i > 0; --i) {
                    var next = that.nextSibling;
                    table[0].insertBefore(thatCountryItem[i-1], next);
              }
              that.className += ' created-items';
            });
          }
        }

      }
    }
  }

  function convertData(data) {
    var json = CSV2JSON(data);

    parsedData = JSON.parse(json);
    console.log(parsedData);
  }

  function uniqueData(arr) {
    for (var i = 0; i < arr.length; i++) {
      datesArr.push(arr[i].date);
    };
  }

  function getUniqueArr(arr) {
    var result = [];
    nextInput:
    for (var i = 0; i < arr.length; i++) {
      var str = arr[i];
      for(var j = 0; j < result.length; j++) {
        if (result[j] == str) continue nextInput;
      }
      result.push(str);
    };
    return result;
  }


  function dateViewSum(arr, date) {
    var sum = 0;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].date != date) {
        continue
      };
      sum += +arr[i].views;
    };

    return sum;
  }
  

  function createDateRow(dateArr) {
    for (var i = 0; i < dateArr.length-1; i++) {
      var dateTr = document.createElement('tr');
      dateTr.className = 'table-date';
      dateTr.setAttribute('data-index', i);
      var dateTd = '<td class="table-date__item date-col" colspan="3">'+dateArr[i]+'</td><td class="table-date__item">'+dateViewSum(parsedData,dateArr[i])+'</td><td class="table-date__item"></td><td class="table-date__item"></td><td class="table-date__item"></td><td class="table-date__item"></td>';
      dateTr.innerHTML = dateTd;
      table[0].appendChild(dateTr);
    }
  }

  function createCountryRow(arr, index, date) {
    var countryes = [],
        countryesObj = [];
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].date != date) {
        continue
      };

      countryes.push(arr[i].country);
    }
    for (var i = 0; i < getUniqueArr(countryes).length; i++) {
      var countryTr = document.createElement('tr');
      countryTr.className = 'table-country';
      countryTr.setAttribute('data-date', date);
      var countryTd = '<td></td><td class="table-country__item country-name" colspan="2">'+getUniqueArr(countryes)[i]+'</td><td class="table-country__item"></td><td class="table-country__item"></td><td class="table-country__item"></td><td class="table-country__item"></td><td class="table-country__item"></td>';
      countryTr.innerHTML = countryTd
      countryesObj.push(countryTr);
    }
    return countryesObj;
  }

  function createItemRow(arr, country, date) {
    var mobiles = [];

    for (var i = 0; i < arr.length; i++) {
      if (arr[i].country != country) {
        continue
      };
      var itemTr = document.createElement('tr');
      itemTr.className = 'table-item';
      itemTr.setAttribute('data-date', date);
      itemTr.setAttribute('data-country', country);
      var itemTd = '<td></td><td></td><td class="mobile-name">'+arr[i].device+'</td><td>'+arr[i].views+'</td><td>'+arr[i].bcpm+'</td><td>'+arr[i].sent+'</td><td>'+arr[i].earned+'</td><td>'+arr[i].leads+'</td>';
      itemTr.innerHTML = itemTd
      mobiles.push(itemTr);
    }
    return mobiles;
  }


  function CSVToArray(strData, strDelimiter) {
      strDelimiter = (strDelimiter || ",");
      var objPattern = new RegExp((
      "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
      "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
      "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
      var arrData = [[]];
      var arrMatches = null;
      while (arrMatches = objPattern.exec(strData)) {
          var strMatchedDelimiter = arrMatches[1];
          if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
              arrData.push([]);
          }
          if (arrMatches[2]) {
              var strMatchedValue = arrMatches[2].replace(
              new RegExp("\"\"", "g"), "\"");
          } else {
              var strMatchedValue = arrMatches[3];
          }
          arrData[arrData.length - 1].push(strMatchedValue);
      }
      return (arrData);
  }

  function CSV2JSON(csv) {
      var array = CSVToArray(csv);
      var objArray = [];
      for (var i = 1; i < array.length; i++) {
          objArray[i - 1] = {};
          for (var k = 0; k < array[0].length && k < array[i].length; k++) {
              var key = array[0][k];
              objArray[i - 1][key] = array[i][k]
          }
      }

      var json = JSON.stringify(objArray);
      var str = json.replace(/},/g, "},\r\n");

      return str;
  }

})();
