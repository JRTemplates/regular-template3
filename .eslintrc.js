module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true
  },
  // 继承 https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // 覆盖样式
  rules: {
    // 箭头函数用小括号括起来
    'arrow-parens': 0,
    // 忽略生成器的空格
    'generator-star-spacing': 0,
    // 可以使用debugger
    'no-debugger': 0,
    // 忽略缩进
    indent: 0,
    // 忽略函数前的空格
    'space-before-function-paren': 0,
    // 文件以单一的换行符结束
    'eol-last': 0,
    // 换行时运算符在行尾还是行首
    'operator-linebreak': [2, 'after'],
    // 函数名首行大写必须使用new方式调用，首行小写必须用不带new方式调用
    'new-cap': 0,
    // 允许在使用new构造一个实例后不赋值
    'no-new': 0,
    'no-dupe-keys': 0
  }
}
