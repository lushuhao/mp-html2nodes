// Regular Expressions for parsing tags and attributes
const startTagStr = `<([-A-Za-z0-9_]+)((?:\\s+[a-zA-Z_:][-a-zA-Z0-9_:.]*(?:\\s*=\\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\\s]+))?)*)\\s*(\\/?)>`,
  endTagStr = `<\/([-A-Za-z0-9_]+)[^>]*>`,
  tagStr = `(${startTagStr})|(${endTagStr})`;
const startTag = new RegExp(startTagStr),
  endTag = new RegExp(endTagStr),
  tag = new RegExp(tagStr),
  attr = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;

// Empty Elements - HTML 5
const empty = makeMap('area,base,basefont,br,col,frame,hr,img,input,link,meta,param,embed,command,keygen,source,track,wbr');

// Block Elements - HTML 5
const block = makeMap('a,address,article,applet,aside,audio,blockquote,button,canvas,center,dd,del,dir,div,dl,dt,fieldset,figcaption,figure,footer,form,frameset,h1,h2,h3,h4,h5,h6,header,hgroup,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,output,p,pre,section,script,table,tbody,td,tfoot,th,thead,tr,ul,video');

// Inline Elements - HTML 5
const inline = makeMap('abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,const');

// Elements that you can, intentionally, leave open
// (and which close themselves)
const closeSelf = makeMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr');

// Attributes that have their values filled in disabled="disabled"
const fillAttrs = makeMap('checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected');

// Special Elements (can contain anything)
const special = makeMap('script,style');

const supportTagName = makeMap('a,abbr,b,blockquote,br,code,col,colgroup,dd,del,div,dl,dt,em,fieldset,h1,h2,h3,h4,h5,h6,hr,i,img,ins,label,legend,li,ol,p,q,span,strong,sub,sup,table,tbody,td,tfoot,th,thead,tr,ul');

const supportAllAttr = makeMap('class,style');

const supportTagAttr = {
  col: makeMap('span,width'),
  colgroup: makeMap('span,width'),
  img: makeMap('alt,src,height,width'),
  ol: makeMap('start,type'),
  table: makeMap('width'),
  td: makeMap('colspan,height,rowspan,width'),
  th: makeMap('colspan,height,rowspan,width'),
};

const nonsupportEscape = /&quot;|&amp;|&#039;|&lt;|&gt;|&nbsp;|&iexcl;|&cent;|&pound;|&curren;|&yen;|&brvbar;|&sect;|&uml;|&copy;|&ordf;|&laquo;|&not;|&shy;|&reg;|&macr;|&deg;|&plusmn;|&sup2;|&sup3;|&acute;|&micro;|&para;|&middot;|&cedil;|&sup1;|&ordm;|&raquo;|&frac14;|&frac12;|&frac34;|&iquest;|&Agrave;|&Aacute;|&Acirc;|&Atilde;|&Auml;|&Aring;|&AElig;|&Ccedil;|&Egrave;|&Eacute;|&Ecirc;|&Euml;|&Igrave;|&Iacute;|&Icirc;|&Iuml;|&ETH;|&Ntilde;|&Ograve;|&Oacute;|&Ocirc;|&Otilde;|&Ouml;|&times;|&Oslash;|&Ugrave;|&Uacute;|&Ucirc;|&Uuml;|&Yacute;|&THORN;|&szlig;|&agrave;|&aacute;|&acirc;|&atilde;|&auml;|&aring;|&aelig;|&ccedil;|&egrave;|&eacute;|&ecirc;|&euml;|&igrave;|&iacute;|&icirc;|&iuml;|&eth;|&ntilde;|&ograve;|&oacute;|&ocirc;|&otilde;|&ouml;|&divide;|&oslash;|&ugrave;|&uacute;|&ucirc;|&uuml;|&yacute;|&thorn;|&yuml;|&OElig;|&oelig;|&Scaron;|&scaron;|&Yuml;|&fnof;|&circ;|&tilde;|&Alpha;|&Beta;|&Gamma;|&Delta;|&Epsilon;|&Zeta;|&Eta;|&Theta;|&Iota;|&Kappa;|&Lambda;|&Mu;|&Nu;|&Xi;|&Omicron;|&Pi;|&Rho;|&Sigma;|&Tau;|&Upsilon;|&Phi;|&Chi;|&Psi;|&Omega;|&alpha;|&beta;|&gamma;|&delta;|&epsilon;|&zeta;|&eta;|&theta;|&iota;|&kappa;|&lambda;|&mu;|&nu;|&xi;|&omicron;|&pi;|&rho;|&sigmaf;|&sigma;|&tau;|&upsilon;|&phi;|&chi;|&psi;|&omega;|&upsih;|&piv;|&ensp;|&emsp;|&thinsp;|&zwnj;|&zwj;|&lrm;|&rlm;|&ndash;|&mdash;|&lsquo;|&rsquo;|&sbquo;|&ldquo;|&rdquo;|&bdquo;|&dagger;|&Dagger;|&bull;|&hellip;|&permil;|&prime;|&Prime;|&lsaquo;|&rsaquo;|&oline;|&frasl;|&euro;|&image;|&weierp;|&real;|&trade;|&alefsym;|&larr;|&uarr;|&rarr;|&darr;|&harr;|&crarr;|&lArr;|&uArr;|&rArr;|&dArr;|&hArr;|&forall;|&part;|&exist;|&empty;|&nabla;|&isin;|&notin;|&ni;|&prod;|&sum;|&minus;|&lowast;|&radic;|&prop;|&infin;|&ang;|&and;|&or;|&cap;|&cup;|&int;|&there4;|&sim;|&cong;|&asymp;|&ne;|&equiv;|&le;|&ge;|&sub;|&sup;|&nsub;|&sube;|&supe;|&oplus;|&otimes;|&perp;|&sdot;|&lceil;|&rceil;|&lfloor;|&rfloor;|&lang;|&rang;|&loz;|&spades;|&clubs;|&hearts;|&diams;/g;

function HTMLParser(html, handler) {
  let index, chars, match, stack = [], last = html;
  stack.last = function() {
    return this[this.length - 1];
  };
  
  html = html.replace(nonsupportEscape, ' ');
  
  while (html) {
    chars = true;
    
    // Make sure we're not in a script or style element
    // content may be has <<<
    if (!stack.last() || !special[stack.last()] && html.indexOf('<<') !== 0) {
      
      // Comment
      if (html.indexOf('<!--') === 0) {
        index = html.indexOf('-->');
        
        if (index >= 0) {
          // if (handler.comment)
          //   handler.comment(html.substring(4, index));
          html = html.substring(index + 3);
          chars = false;
        }
        
        // // start tag | end tag
      } else if (html.indexOf('<') === 0) {
        const isStart = html.search(startTag) === 0;
        const isEnd = html.search(endTag) === 0;
        
        if (isStart || isEnd) {
          const tag = isStart ? startTag : endTag;
          const parse = isStart ? parseStartTag : parseEndTag;
          match = html.match(tag);
          html = html.substring(match[0].length);
          match[0].replace(tag, parse);
          chars = false;
        }
      }
      
      if (chars) {
        index = html.search(tag);
        
        const text = index < 0 ? html : html.substring(0, index);
        html = index < 0 ? '' : html.substring(index);
        
        if (handler.chars)
          handler.chars(text);
      }
      
    } else {
      html = html.replace(new RegExp('([\\s\\S]*?)<\/' + stack.last() + '[^>]*>'), function(all, text) {
        text = text.replace(/<!--([\s\S]*?)-->|<!\[CDATA\[([\s\S]*?)]]>/g, '$1$2');
        if (handler.chars)
          handler.chars(text);
        
        return '';
      });
      
      parseEndTag('', stack.last());
    }
    
    if (html === last)
      throw 'Parse Error: ' + html;
    last = html;
  }
  
  // Clean up any remaining tags
  parseEndTag();
  
  function parseStartTag(tag, tagName, rest, unary) {
    tagName = tagName.toLowerCase();
    
    if (!supportTagName[tagName]) {
      tagName = 'div';
      parseEndTag('', tagName);
    }
    
    if (block[tagName]) {
      while (stack.last() && inline[stack.last()]) {
        parseEndTag('', stack.last());
      }
    }
    
    if (closeSelf[tagName] && stack.last() === tagName) {
      parseEndTag('', tagName);
    }
    
    unary = empty[tagName] || !!unary;
    
    if (!unary)
      stack.push(tagName);
    
    if (handler.start) {
      const attrs = [];
      
      rest.replace(attr, function(match, name) {
        const value = arguments[2] ? arguments[2] :
          arguments[3] ? arguments[3] :
            arguments[4] ? arguments[4] :
              fillAttrs[name] ? name : '';
        
        if (supportAllAttr[name] || (supportTagAttr[tagName] && supportTagAttr[tagName][name])) {
          attrs.push({
            name: name,
            value: value,
          });
        }
      });
      
      if (handler.start)
        handler.start(tagName, attrs, unary);
    }
  }
  
  function parseEndTag(tag, tagName) {
    let pos;
    // If no tag name is provided, clean shop
    if (!tagName) {
      pos = 0;
    }
    
    // Find the closest opened tag of the same type
    else
      for (pos = stack.length - 1; pos >= 0; pos--)
        if (stack[pos] === tagName)
          break;
    
    if (pos >= 0) {
      // Close all the open elements, up the stack
      for (let i = stack.length - 1; i >= pos; i--)
        if (handler.end)
          handler.end(stack[i]);
      
      // Remove the open elements from the stack
      stack.length = pos;
    }
  }
};

function makeMap(str) {
  const obj = {}, items = str.split(',');
  for (let i = 0; i < items.length; i++)
    obj[items[i]] = true;
  return obj;
}

export default HTMLParser;
