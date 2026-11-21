/* 第1讲 中文分词系统 —— 逐节转录自 课件/提交/分词系统讲解ppt.pptx（10 页，全图为整页图片，已逐页读图转录；第 10 页为致谢页） */
import type { NluDeck } from './types';

const deck1: NluDeck = {
  id: 'nlu1',
  no: '第1讲',
  title: '中文分词系统：FMM 与 BMM',
  subtitle: '分词的重要性与挑战 · 正向/逆向最大匹配 · 算法对比 · 系统实现 · 案例分析 · 未来展望',
  lede:
    '<p>中文分词系统——利用 <strong>FMM 和 BMM 算法</strong>实现分词系统。课件按「摘要 → 挑战 → FMM → BMM → 算法对比 → 系统实现 → 案例分析 → 未来展望」展开，共 10 页（末页为致谢）。</p>',
  toc: [
    { id: 'sec-nlu1-summary', text: 'Executive Summary', level: 2 },
    { id: 'sec-nlu1-challenge', text: '中文分词的挑战', level: 2 },
    { id: 'sec-nlu1-fmm', text: '正向最大匹配（FMM）', level: 2 },
    { id: 'sec-nlu1-bmm', text: '逆向最大匹配（BMM）', level: 2 },
    { id: 'sec-nlu1-compare', text: 'FMM 与 BMM 对比', level: 2 },
    { id: 'sec-nlu1-impl', text: '分词系统的实现', level: 2 },
    { id: 'sec-nlu1-case', text: '案例分析', level: 2 },
    { id: 'sec-nlu1-future', text: '未来展望', level: 2 },
  ],
  sections: [
    {
      id: 'sec-nlu1-summary',
      heading: 'Executive Summary',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>中文分词的重要性</strong>：中文分词是中文自然语言处理的基础和关键步骤。由于中文的书写习惯不像英文那样有明显的单词间隔，准确地识别和切分出句子中的单词至关重要。分词的准确性直接影响到自然语言处理的各个领域，如机器翻译、情感分析、语音识别等。</p>
            <p><strong>分词系统在自然语言处理中的作用</strong>：分词系统作为文本预处理的一部分，帮助机器理解和处理自然语言。它通过将文本分割为有意义的单元（词语或短语），为后续的语义理解、语法分析等提供基础。</p>`,
        },
      ],
    },
    {
      id: 'sec-nlu1-challenge',
      heading: '中文分词的挑战',
      blocks: [
        {
          type: 'html',
          html: `
            <table class="tbl">
              <thead><tr><th>维度</th><th>内容</th></tr></thead>
              <tbody>
                <tr><td>中文语言的特点</td><td>中文没有像英文那样的词与词之间的明显分隔，使得分词成为一项挑战。词语的界定不明确，同一个字在不同上下文中可能属于不同的词。</td></tr>
                <tr><td>分词难点</td><td>多音字和歧义词的处理。长词和短词的平衡，以及嵌套词的识别。新词的发现和未登录词（字典外词）的处理。</td></tr>
                <tr><td>不同类型的分词算法</td><td>基于规则的分词：依赖语言学规则，但灵活性不足。基于统计的分词：利用大量语料库，但对新词敏感度较低。混合方法：结合规则和统计方法，以期达到更好的分词效果。</td></tr>
                <tr><td>FMM 和 BMM 算法的适用场景</td><td>FMM 适用于词长分布较均匀的文本。BMM 在处理以长词为主的文本时表现更好。</td></tr>
              </tbody>
            </table>`,
        },
      ],
    },
    {
      id: 'sec-nlu1-fmm',
      heading: '正向最大匹配（FMM）',
      blocks: [
        {
          type: 'html',
          html: `
            <p>正向最大匹配（Forward Maximum Matching，FMM）是一种<strong>从左到右匹配的贪心算法</strong>。算法从句子的左端开始匹配，每次尝试匹配尽可能长的词。一种贪心的字符串匹配算法，从左至右对句子进行扫描，尽可能匹配最长的词。适用于词典中词语长度分布较均匀的语料。</p>
            <p><strong>算法步骤</strong>：</p>
            <ol>
              <li>⑴从句子最左端开始取最长的可能词。</li>
              <li>⑵如果这个词在字典中，将其作为一个词分出。</li>
              <li>⑶否则，去掉这个词的最右一个字，重复步骤 2。</li>
              <li>⑷重复这个过程直到句子结束。</li>
            </ol>
            <ul>
              <li><strong>优点</strong>：简单快速，适合处理较短的文本。</li>
              <li><strong>局限性</strong>：对于歧义和未登录词处理不佳，容易产生过分分割。</li>
            </ul>`,
        },
      ],
    },
    {
      id: 'sec-nlu1-bmm',
      heading: '逆向最大匹配（BMM）',
      blocks: [
        {
          type: 'html',
          html: `
            <p>逆向最大匹配（Backward Maximum Matching，BMM），是一种<strong>从右到左匹配的贪心算法</strong>。算法从句子的最右端开始匹配，每次尝试匹配尽可能长的词。相比 FMM，通常在处理特定语料时更准确，尤其是在词典中长词比例较高时。</p>
            <p><strong>算法步骤</strong>：</p>
            <ol>
              <li>⑴从句子最右端开始取最长的可能词。</li>
              <li>⑵如果这个词在字典中，将其作为一个词分出。</li>
              <li>⑶否则，去掉这个词的最左一个字，重复步骤 2。</li>
              <li>⑷重复这个过程直到句子结束。</li>
            </ol>
            <ul>
              <li><strong>优点</strong>：在处理以长词为主的文本时，准确度通常比 FMM 更高。</li>
              <li><strong>局限性</strong>：同样容易产生过分分割，且对未登录词的处理能力有限。</li>
            </ul>`,
        },
      ],
    },
    {
      id: 'sec-nlu1-compare',
      heading: 'FMM 与 BMM 对比',
      blocks: [
        {
          type: 'html',
          html: `
            <table class="tbl">
              <thead><tr><th>对比维度</th><th>结论（课件原文）</th></tr></thead>
              <tbody>
                <tr><td>FMM 和 BMM 直接比较</td><td>FMM 从左到右匹配，BMM 从右到左匹配。FMM 适用于词长分布均匀的文本，BMM 在处理以长词为主的文本时表现更好。</td></tr>
                <tr><td>准确率和效率分析</td><td>FMM 通常速度更快，但在面对复杂句子时容易产生错误。BMM 虽然稍慢，但通常能更好地处理歧义和复杂结构。</td></tr>
                <tr><td>适用场景对比</td><td>FMM 适合于处理较短、结构简单的句子。BMM 更适用于长句子和专业领域的文本，其中长词更为常见。</td></tr>
              </tbody>
            </table>`,
        },
      ],
    },
    {
      id: 'sec-nlu1-impl',
      heading: '分词系统的实现',
      blocks: [
        {
          type: 'html',
          html: `
            <p>分词系统由<strong>三个主要部分构成：输入处理、分词处理和结果输出</strong>。</p>
            <ul>
              <li><strong>输入处理</strong>：系统接受用户输入的文本，可以是文本文件或在线输入。</li>
              <li><strong>分词处理</strong>：系统根据选择的算法（FMM 或 BMM）对文本进行分词。</li>
              <li><strong>结果输出</strong>：分词后的文本以可读格式呈现，例如列表或标注文本。</li>
            </ul>`,
        },
      ],
    },
    {
      id: 'sec-nlu1-case',
      heading: '案例分析',
      blocks: [
        {
          type: 'html',
          html: `
            <p>例句：<strong>『研究生命起源』</strong></p>
            <table class="tbl">
              <thead><tr><th>算法</th><th>分词结果</th><th>分析</th></tr></thead>
              <tbody>
                <tr><td>FMM</td><td>『研究生 / 命 / 起源』</td><td>FMM 算法从左至右匹配，首先识别出最长词「研究生」。</td></tr>
                <tr><td>BMM</td><td>『研究 / 生命 / 起源』</td><td>BMM 算法从右至左匹配，识别出「生命」而不是「研究生」。</td></tr>
              </tbody>
            </table>
            <p><strong>算法效果评估</strong>：</p>
            <ul>
              <li><strong>准确率</strong>：算法切分的词语中有多少是正确的，即与人工标注的分词结果相比较。</li>
              <li><strong>召回率</strong>：人工标注的所有词语中，算法成功切分出的比例。</li>
              <li><strong>F1 值</strong>：准确率和召回率的综合评价指标，可以表示算法的综合性能。</li>
            </ul>`,
        },
      ],
    },
    {
      id: 'sec-nlu1-future',
      heading: '未来展望',
      blocks: [
        {
          type: 'html',
          html: `
            <ol>
              <li><strong>分词技术的发展趋势</strong>：随着自然语言处理领域的不断发展，分词技术也将面临一系列新的挑战和机遇。未来，分词技术可能朝以下方向发展：深度学习的应用——随着深度学习技术的兴起，未来分词系统可能更多地采用深度学习模型，以提高对复杂语境和新词汇的处理能力；上下文感知——未来的分词系统可能更加注重上下文信息，以更好地处理歧义和提高分词准确性，尤其是在处理长文本和专业领域语境时。</li>
              <li><strong>FMM 和 BMM 算法的改进方向</strong>：FMM 和 BMM 算法作为经典的分词算法，未来可能通过以下方式进行改进：结合算法——考虑将 FMM 和 BMM 算法结合起来，通过集成多个切分结果，以提高整体的分词准确性和健壮性；自适应调整——引入自适应机制，使算法能够根据文本的特性动态调整切分策略，适应不同类型的语境。</li>
              <li><strong>分词系统在未来应用的可能性</strong>：分词系统在未来可能在各个领域发挥更为重要的作用：智能搜索——改进的分词系统可以提高搜索引擎的检索效果，使用户能够更准确地找到他们需要的信息；机器翻译——在机器翻译领域，先进的分词系统可以提高翻译的准确性，确保目标语言的表达更为自然；社交媒体分析——在社交媒体文本分析中，分词系统的改进有助于更准确地理解用户的言论，从而进行更精准的情感分析和主题挖掘。</li>
            </ol>`,
        },
      ],
    },
  ],
};

export default deck1;
