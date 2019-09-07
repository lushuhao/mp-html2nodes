const HTMLParser = require('./htmlParser')

function removeDOCTYPE(html) {
  return html
    .replace(/<\?xml.*\?>\n/, '')
    .replace(/<!doctype.*\>\n/, '')
    .replace(/<!DOCTYPE.*\>\n/, '');
}

function logger(...args) {
  // console.log(...args)
}

function html2json(html) {
  html = removeDOCTYPE(html);
  const bufArray = [];
  const results = {
    node: 'root',
    children: [],
  };
  HTMLParser(html, {
    start: function (tag, attrs, unary) {
      logger(tag, attrs, unary);
      // node for this element
      const node = {
        name: tag,
      };
      if (attrs.length !== 0) {
        node.attr = attrs.reduce(function (pre, attr) {
          const name = attr.name;
          let value = attr.value;

          // has multi attibutes
          // make it array of attribute
          if (value.match(/ /)) {
            value = value.split(' ');
          }

          // if attr already exists
          // merge it
          if (pre[name]) {
            if (Array.isArray(pre[name])) {
              // already array, push to last
              pre[name].push(value);
            } else {
              // single value, make it array
              pre[name] = [pre[name], value];
            }
          } else {
            // not exist, put it
            pre[name] = value;
          }

          return pre;
        }, {});
      }
      if (unary) {
        // if this tag dosen't have end tag
        // like <img src="hoge.png"/>
        // add to parents
        const parent = bufArray[0] || results;
        if (parent.children === undefined) {
          parent.children = [];
        }
        parent.children.push(node);
      } else {
        bufArray.unshift(node);
      }
    },
    end: function (tag) {
      logger(tag);
      // merge into parent tag
      const node = bufArray.shift();
      if (node.tag !== tag) logger('invalid state: mismatch end tag');

      if (bufArray.length === 0) {
        results.children.push(node);
      } else {
        const parent = bufArray[0];
        if (parent.children === undefined) {
          parent.children = [];
        }
        parent.children.push(node);
      }
    },
    chars: function (text) {
      logger(text);
      const node = {
        type: 'text',
        text: text,
      };
      if (bufArray.length === 0) {
        results.children.push(node);
      } else {
        const parent = bufArray[0];
        if (parent.children === undefined) {
          parent.children = [];
        }
        parent.children.push(node);
      }
    },
    comment: function (text) {
      logger(text);
      const node = {
        type: 'text',
        text: text,
      };
      const parent = bufArray[0];
      if (parent.children === undefined) {
        parent.children = [];
      }
      parent.children.push(node);
    },
  });
  return results;
}

export default html2json
