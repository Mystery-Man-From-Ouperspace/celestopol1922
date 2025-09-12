import { CEL1922 } from "./config.js";

export function registerHandlebarsHelpers() {

  Handlebars.registerHelper('select', function (selected, options) { 
    const escapedValue = RegExp.escape(Handlebars.escapeExpression(selected));
    const rgx = new RegExp(' value=[\"\']' + escapedValue + '[\"\']');
    const html = options.fn(this);
    return html.replace(rgx, "$& selected");    
  });

  Handlebars.registerHelper("times", function (n, block) {
    let accum = ""
    for (let i = 1; i <= n; ++i) {
      block.data.index = i
      block.data.first = i === 0
      block.data.last = i === n - 1
      accum += block.fn(this)
    }
    return accum
  })

}