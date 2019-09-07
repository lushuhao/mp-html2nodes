# mp-html2nodes
小程序富文本解析，html从string转成array
基于[html2json](https://github.com/Jxck/html2json)改造，使支持支付宝小程序

## start
将lib目录拷入工作目录
```js
import mpParse from './lib/index'

mpParse('<p style="font-size:16px;color:#333333;line-height:30px">富文本解析</p>')
```