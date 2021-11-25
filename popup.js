
let the_button = document.getElementById('get_all_sci_urls')
the_button.onclick = () => {
chrome.windows.getAll({populate:true}, getAllOpenWindows);
function getAllOpenWindows(winData) {
    const rbs = document.querySelectorAll('input[name="choice"]');
    let selectedValue = [];
            for (const rb of rbs) {
                if (rb.checked) {
                    selectedValue.push(document.getElementById(rb.id).value.toLowerCase());
                }
            }

//Filter out the links based on user selection
  var filtered_tabs = {}
  for (var i in winData) {
        var winTabs = winData[i].tabs;
        var totTabs = winTabs.length;
        for (var j=0; j<totTabs;j++) {
          s1 = winTabs[j].url.toLowerCase();
          selectedValue.forEach(element=>{
             if (s1.indexOf(element) != -1){
                filtered_tabs[(winTabs[j].title)]=(winTabs[j].url)
             }
            })
        }
    }
   filtered_tabs = JSON.stringify(filtered_tabs)
   download(filtered_tabs, 'filtered.json', 'text/plain')
}
}

// download all the availiable links
let all_button = document.getElementById('get_all_urls')
all_button.onclick = () => {
    chrome.windows.getAll({populate:true}, getAllOpenWindows);
    function getAllOpenWindows(winData) {
        const rbs = document.querySelectorAll('input[name="choice"]');
        let selectedValue = [];
                for (const rb of rbs) {
                    if (rb.checked) {
                        selectedValue.push(document.getElementById(rb.id).value.toLowerCase());
                    }
                }

      var all_tabs = [];
      for (var i in winData) {
        var winTabs = winData[i].tabs;
        var totTabs = winTabs.length;

        for (var j=0; j<totTabs;j++) {

            var link_ob = {}
            link_ob['title'] =winTabs[j].title
            link_ob['link'] = winTabs[j].url
            all_tabs.push(link_ob)
        }
    }
  //     all_tabs = JSON.stringify(all_tabs)
       all_tabs_csv = convertToCSV(all_tabs)
       download(all_tabs_csv, 'test.csv', 'text/plain')
       download(all_tabs, 'all.json', 'text/plain')
    }
}

////////////////////////////////////////////////////////////////////////////////// 
function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href)
}


function convertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;

    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    return str;
}

function convertToCSV(arr) {
    const array = [Object.keys(arr[0])].concat(arr)
  
    return array.map(it => {
      return Object.values(it).toString()
    }).join('\n')
  }
  