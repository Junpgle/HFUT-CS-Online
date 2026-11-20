/* 软件体系结构 · 总目录 —— 汇总四章讲义（第4/5/7章 + RSA 专题）的章节脉络与要点 */
import type { SaChapter } from './types';

const home: SaChapter = {
  id: 'home',
  no: '',
  title: '软件体系结构 · 复习手册',
  subtitle: '依据课程组课件整理：第 4/5/7 章讲义 + IBM RSA 建模实例教程专题',
  lede:
    '<p>本课程依据课程组课件整理：现收录<strong>第 4 章 软件体系结构描述、第 5 章 软件体系结构设计、第 7 章 软件体系结构评估</strong>三份章节讲义，以及<strong>《IBM RSA UML2.0 建模实例教程》专题</strong>（曹衍龙、汪杰编著，人民邮电出版社）；试题暂未收录，在线练习板块暂为空。每章按课件页序逐节整理，紧扣课件内容。</p>',
  toc: [
    { id: 'sec-sa-map', text: '章节脉络', level: 2 },
    { id: 'sec-sa-map-h1', text: '各章要点与作业题', level: 2 },
  ],
  sections: [
    {
      id: 'sec-sa-map',
      heading: '章节脉络',
      blocks: [
        {
          type: 'html',
          html: `
            <p>课程按「描述 → 设计 → 评估」的主线推进，辅以 RSA/UML 建模工具专题：</p>
            <table class="tbl">
              <thead><tr><th>章</th><th>主题</th><th>在课程中的位置</th></tr></thead>
              <tbody>
                <tr><td>第 4 章</td><td>软件体系结构描述</td><td>描述方法、IEEE 1471 框架标准、Medvidovic 内容框架、ADL 与五种典型描述语言（ACME/Wright/UniCon/Darwin/C2）、UML</td></tr>
                <tr><td>第 5 章</td><td>软件体系结构设计</td><td>设计模式（GoF 23 与七个模式详解）、五种 SA 设计方法（领域模型/模式/用例/工件/属性驱动）、六阶段设计过程</td></tr>
                <tr><td>第 7 章</td><td>软件体系结构评估</td><td>质量属性与场景、三种评估方式（问卷/场景/度量）、ATAM 九步与 SAAM 六步</td></tr>
                <tr><td>专题</td><td>IBM RSA 与 UML 2.0 建模实例教程</td><td>UML 与面向对象基础、RSA 工具、EasyLibrary 贯穿实例（用例/分析/设计/实现模型）、RUP 与软件过程</td></tr>
              </tbody>
            </table>`,
        },
      ],
    },
    {
      id: 'sec-sa-map-h1',
      heading: '各章要点与作业题',
      blocks: [
        {
          type: 'html',
          html: `
            <table class="tbl">
              <thead><tr><th>章</th><th>重点（课件小结）</th><th>作业与思考题（课件原题）</th></tr></thead>
              <tbody>
                <tr><td>第 4 章</td><td>四种描述方法；IEEE 1471；ADL 三要素（构件/连接件/SA 配置）；ACME 七种实体与类型/模板/风格；Wright 的 role 与 glue（CSP 子集）；UniCon 构件与连接件类型；Darwin 的 ∏ 演算；C2 的 top/bottom 端口与消息风格；UML 九种图</td><td>体系结构描述有哪些方法？有哪些标准和规范？体系结构描述语言与程序设计语言有什么区别？选择一个规模适中的系统，使用 UML 为其建模。</td></tr>
                <tr><td>第 5 章</td><td>Alexander 的模式定义与 GoF 23；MVC；模式的四个基本成分与 13 项描述模板；模式分类（惯用法/设计模式/SA 模式，目的×范围）；抽象工厂/单件/外观/适配器/责任链/中介者/观察者；五种 SA 设计方法及其注意问题；体系结构需求/设计/文档化/复审/实现/演化</td><td>请把基于体系结构的软件开发模型与其他软件开发模型进行比较。请把基于体系结构的软件设计方法与其他软件设计方法进行比较。阐述模式驱动的软件体系结构的设计方法。阐述软件体系结构的设计过程。</td></tr>
                <tr><td>第 7 章</td><td>评估的原因与时机；九个质量属性（性能/可靠性/可用性/安全性/可修改性/功能性/可变性/可集成性/互操作性）；敏感点与权衡点；场景（刺激/环境/响应）；三种评估方式比较；ATAM 四组九步与四个阶段；SAAM 六步与 SAAMTool</td><td>为什么要评估软件体系结构？从哪些方面评估软件体系结构？ATAM 评估方法的基本步骤是什么？</td></tr>
                <tr><td>专题</td><td>UML 2.1 的 13 种图（结构图 6 + 行为图 7）；面向对象 = 对象+类+封装+继承+聚合+消息传递；六种事物关系；EasyLibrary 的用例/分析/设计/实现模型；RUP 四阶段九工作流</td><td>——</td></tr>
              </tbody>
            </table>`,
        },
      ],
    },
  ],
};

export default home;
