let css_js;
let prefix;
let jsOutput = '';
let cssOutput = 'style="';
let jsFormat = document.querySelector(".js");
let prefixEl = document.querySelector(".prefix");
let inlineFormat = document.querySelector(".internal");
let externalSheetFormat = document.querySelector(".external");

document.addEventListener('DOMContentLoaded', run);

async function run() {
  let response = await fetch('./cssjs.json');
  css_js = await response.json();
  externalToInline()
}

externalSheetFormat.addEventListener('input', externalToInline);
prefixEl.addEventListener('input', externalToInline)


function externalToInline() {

  let [content] = externalSheetFormat.value.match("[^\{]+(?=\})") || "";
  prefix = prefixEl.value || "document";
  if (content) {
    let arr = content.replaceAll(/([ ]{2,})|(\r?\n|\r)/g, '').split(';').filter(Boolean)
    // if(content)
    console.log(arr);
    let jsObj = jsFormatted(arr);

    cssObj = arr.reduce((str, el) => `${str}${el.replace(':', '=')};`, "")

    jsFormat.innerHTML = jsObj.join("");
    inlineFormat.innerHTML = `style="${cssObj}"`
    console.log(inlineFormat.innerHTML);
  } else {
    jsFormat.innerHTML = inlineFormat.innerHTML = "are the styles inside a { }?"
  }
}
function jsFormatted(arr) {
  return arr.reduce((finalArr, el) => {
    const newArr = el.split(':').reduce((key, value) => `${prefix}.${css_js[key]} = "${value.trim()}";\n`)
    return [...finalArr, newArr];
  }, [])
}
