/* 程序设计基础 · 总目录 —— 汇总 11 章课件（第 1～9、11、12 章）的章节脉络与要点 */
import type { PdChapter } from './types';

const home: PdChapter = {
  id: 'home',
  no: '',
  title: '程序设计基础 · 复习手册',
  subtitle: '依据课程课件整理：第 1～9、11、12 章（C 语言 + C++ 基础）',
  lede:
    '<p>本课程为接触的第一门编程语言，依据课程组课件逐页整理：现收录<strong>第 1～9 章（C 语言）、第 11～12 章（C++ 基础与面向对象）</strong>共 11 份课件讲义，每章按课件页序逐节整理，紧扣课件内容。试题暂未收录，故不设在线练习板块。</p>',
  toc: [
    { id: 'sec-pd-map', text: '章节脉络', level: 2 },
    { id: 'sec-pd-map-h1', text: '各章要点与思考题', level: 2 },
  ],
  sections: [
    {
      id: 'sec-pd-map',
      heading: '章节脉络',
      blocks: [
        {
          type: 'html',
          html: `
            <p>课程按「概论 → 数据与运算 → 控制结构 → 构造类型 → 函数 → C++ 与面向对象」的主线推进：</p>
            <table class="tbl">
              <thead><tr><th>章</th><th>主题</th><th>主要内容</th></tr></thead>
              <tbody>
                <tr><td>第 1 章</td><td>C语言概论</td><td>高级语言的概念、C 语言的特点与基本程序结构、词法（保留字/标识符）、算法的概念与流程图、上机过程</td></tr>
                <tr><td>第 2 章</td><td>C语言基础</td><td>基本数据类型、常量与变量、基本运算与表达式（含优先级）、格式输入输出</td></tr>
                <tr><td>第 3 章</td><td>C语言的基本控制结构</td><td>三种控制结构、关系与逻辑运算、if/switch 分支、while/do-while/for 循环、枚举法与迭代法</td></tr>
                <tr><td>第 4 章</td><td>数组</td><td>一维/多维/字符数组、字符串函数、数组常用算法（极值、排序、查找）、数组与矩阵</td></tr>
                <tr><td>第 5 章</td><td>指针</td><td>指针概念与运算、指针与一维/二维数组、指针数组、指向指针的指针、void 指针</td></tr>
                <tr><td>第 6 章</td><td>函数</td><td>函数定义调用、变量的存储类型与作用域、传值/传地址、指向函数的指针、递归、编译预处理</td></tr>
                <tr><td>第 7 章</td><td>结构与联合</td><td>结构类型/结构数组/结构指针、动态内存分配、链表五操作、联合、枚举、typedef</td></tr>
                <tr><td>第 8 章</td><td>位运算</td><td>补码表示、位逻辑运算（~ &amp; | ^）、移位运算、位段（位域）</td></tr>
                <tr><td>第 9 章</td><td>文件</td><td>文件指针、fopen/fclose 与读写方式、字符/字符串/格式化/数据块读写、定位与错误检测</td></tr>
                <tr><td>第 11 章</td><td>C++语言基础</td><td>面向过程与面向对象、bool/const/引用/新型强制转换、cin/cout 与操纵符、函数重载与默认参数、new/delete、string 类</td></tr>
                <tr><td>第 12 章</td><td>面向对象程序设计基础</td><td>类与对象、构造/拷贝/析构函数、组合、静态成员、友元、this、继承与派生、多态与虚函数、运算符重载、模板</td></tr>
              </tbody>
            </table>`,
        },
      ],
    },
    {
      id: 'sec-pd-map-h1',
      heading: '各章要点与思考题',
      blocks: [
        {
          type: 'html',
          html: `
            <table class="tbl">
              <thead><tr><th>章</th><th>重点</th><th>思考题 / 作业（课件原题）</th></tr></thead>
              <tbody>
                <tr><td>第 1 章</td><td>主函数有且唯一；32 个系统保留字；标识符规则（字母/下划线开头、≤31 字符）；正确算法三条件与七特征；流程图符号；编辑→编译→连接运行</td><td>符号函数流程图；欧几里德算法框图；用伪语言与框图描述一件生活算法</td></tr>
                <tr><td>第 2 章</td><td>常量五种形式与转义字符；变量三特征与类型修饰；赋值/算术/自加自减/复合赋值；类型转换等级与优先级；printf/scanf 四条说明</td><td>求一元二次方程的根（b*b-4ac&lt;0 时引出第三章）</td></tr>
                <tr><td>第 3 章</td><td>三种控制结构共同特点；开放区间用或、闭合区间用与；15 级优先级总表；else 与最近 if 匹配；switch 与 break；三循环语句比较；break/continue；枚举法与迭代法三要素</td><td>素数/水仙花数/爱因斯坦阶梯；e^x、梯形积分、二分法、求 π；作业 9～30 题</td></tr>
                <tr><td>第 4 章</td><td>只能引用数组元素；内存顺序最后一个下标先变化；字符串 \\0 结尾；strcpy/strcat/strlen/strcmp；冒泡与选择排序；顺序查找与折半查找；矩阵转置</td><td>降序条件、联合排序、加密解密、杨辉三角形；小组作业 1～32 题</td></tr>
                <tr><td>第 5 章</td><td>指针=地址变量；&amp; 与 * 互补；p±n 加 sizeof(*p)；三种引用数组元素方法；二维数组两级管理与四种等价形式；指针数组与多字符串排序</td><td>八进制字符串转十进制；4 位十六进制串转十进制</td></tr>
                <tr><td>第 6 章</td><td>函数四要素；原型声明；auto/register/static/extern 四种存储类型；全局变量原则（内聚强、耦合弱）与副作用；传值 vs 传地址；指向函数的指针；递归两阶段；宏定义/文件包含/条件编译</td><td>N!、cosX 迭代、级数求和、排序与查找函数；作业 1～9 题</td></tr>
                <tr><td>第 7 章</td><td>结构三种说明方式与 . 引用；结构指针两种引用方式；malloc/free/calloc/realloc；引用自身的结构与链表五操作；联合共用内存；枚举取值规则</td><td>40 人两门课成绩统计（三个函数）；i 与 ch[2] 共用单元实例</td></tr>
                <tr><td>第 8 章</td><td>补码求法与两条性质；位运算对象限整型/字符型；清零用与、置 1 用或、取反用异或；逻辑右移与算术右移；位段划分</td><td>红绿灯控制；循环移位</td></tr>
                <tr><td>第 9 章</td><td>FILE 指针；fopen 12 种读写方式；fclose 回写缓冲；fputc/fgetc/feof、fgets/fputs、fscanf/fprintf、fread/fwrite；ftell/fseek/rewind；ferror/clearerr</td><td>文件复制、f1.txt 格式化读取、数据块读写实例</td></tr>
                <tr><td>第 11 章</td><td>面向对象三特点；bool/const/随时定义/引用/static_cast；cin/cout 与操纵符（setw 一次作用）；内联函数限制；重载与默认参数（从右向左省略）；new/delete；string 九种操作</td><td>矩形面积、swap 引用参数、GetArea 重载、任意阶方阵转置</td></tr>
                <tr><td>第 12 章</td><td>抽象封装继承多态；public/private/protected；构造/拷贝构造/析构调用时机；静态成员；友元破坏封装；this 指针；公有/私有派生；两种多态性比较；虚函数动态联编；运算符重载规则；函数/类模板</td><td>Clock 类、组合类构造顺序、虚函数 area() 实例</td></tr>
              </tbody>
            </table>`,
        },
      ],
    },
  ],
};

export default home;
