import handlebars from "handlebars";
import github from "./github";
import conf from "./config";



async function updateSite(data) {
  const template = await github.getFile(conf.templateFileName)
  const html = generate(data, template)
  
  return github.updateFile(conf.indexFileName, html);
}

function generate(data, template) {
  const hbr = handlebars.compile(template);
  return hbr({ data: data });
}

export default {
  updateSite,

  //private
  generate,
};
