import HtmlToJson from './html2json.js';

/**
 * 主函数入口区
 **/
function mpParse(html = '<div class="color:red;">数据不能为空</div>') {
  const {children = []} = HtmlToJson(html) || {}
  return children
}

export default mpParse
