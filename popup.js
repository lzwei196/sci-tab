
let the_button = document.getElementById('get_all_sci_urls')
the_button.onclick = () => {
chrome.windows.getAll({populate:true}, getAllOpenWindows);
function getAllOpenWindows(winData) {
    const rbs = document.querySelectorAll('input[name="choice"]');
    //check what filtering keywords has been chosen
    var myOpts = document.getElementById('filter_keywords_form')
    var filter_words = getSelectValues(myOpts)
    const cb = document.getElementById('custom_input_checkbox');
    if (cb.checked) {
        const custom_field = document.getElementById('custom_keyword_input').value
        let custom_keywords = custom_field.split(',')
        filter_words = filter_words.concat(custom_keywords)
    }
    console.log(filter_words)
//Filter out the links based on user selection
  var filtered_tabs = []
  for (var i in winData) {
        var winTabs = winData[i].tabs;
        var totTabs = winTabs.length;
        for (var j=0; j<totTabs;j++) {
          s1 = winTabs[j].url.toLowerCase();
          s2 = winTabs[j].title.toLowerCase();
          filter_words.forEach(element=>{
             if (s1.indexOf(element.toLowerCase()) != -1 
             ||  s2.indexOf(element.toLowerCase()) != -1){
                var link_ob = {}
                link_ob['title'] =winTabs[j].title
                link_ob['link'] = winTabs[j].url
                filtered_tabs.push(link_ob)
             }
            })
        }
    }
    console.log(filtered_tabs)
  // filtered_tabs = JSON.stringify(filtered_tabs)
  // console.log(filtered_tabs)
  // download(filtered_tabs, 'filtered.json', 'text/plain')
   filtered_tabs = getUniqueListBy(filtered_tabs, 'title')
   console.log(filtered_tabs)
   filtered_tabs = convertToCSV(filtered_tabs)
  // download(filtered_tabs, 'Sci_filtered.csv', 'text/plain')
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
//       download(all_tabs, 'all.json', 'text/plain')
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


function getSelectValues(select) {
    var result = [];
    var options = select && select.options;
    var opt;
  
    for (var i=0, iLen=options.length; i<iLen; i++) {
      opt = options[i];
  
      if (opt.selected) {
        result.push(opt.value || opt.text);
      }
    }
    return result;
  }

  function getUniqueListBy(arr, key) {
    return [...new Map(arr.map(item => [item[key], item])).values()]
}
