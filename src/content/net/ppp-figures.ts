/** PPP 教学插图：独立于正文维护，嵌入已有 HtmlContent svg.fig/lightbox 体系。 */
const c = {
  ink: 'var(--ink)', subtle: 'var(--ink-3)', accent: 'var(--deck-accent)',
  panel: 'var(--panel-2)', edge: 'var(--hairline)', muted: 'var(--ink-2)',
};
const xml = (str: string) => str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const box = (x: number, y: number, w: number, h: number, fill = c.panel, stroke = c.edge, r = 10) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" />`;
const txt = (x: number, y: number, value: string, size = 14, color = c.ink, weight = 500, anchor = 'start') =>
  `<text x="${x}" y="${y}" fill="${color}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}" font-family="var(--font)"><tspan>${xml(value)}</tspan></text>`;
const mono = (x: number, y: number, value: string, size = 17, color = c.ink, anchor = 'middle') =>
  `<text x="${x}" y="${y}" fill="${color}" text-anchor="${anchor}" font-family="var(--font-mono), monospace" font-size="${size}" font-weight="650">${xml(value)}</text>`;
const path = (d: string, id: string, color = c.subtle) =>
  `<path d="${d}" stroke="${color}" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" marker-end="url(#${id}-arrow)"/>`;
const header = (name: string, h: number, description: string, title: string, shapes: string, caption: string) =>
  `<svg class="fig ppp-figure" viewBox="0 0 760 ${h}" role="img" aria-labelledby="${name}-title ${name}-desc" xmlns="http://www.w3.org/2000/svg">
    <title id="${name}-title">${xml(title)}</title><desc id="${name}-desc">${xml(description)}</desc>
    <defs><marker id="${name}-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0 0 L6 3 L0 6 Z" fill="${c.subtle}"/></marker></defs>
    ${shapes}
  </svg><p class="fig-cap">${xml(caption)}</p>`;

const stuffing = 'ppp-stuffing';
export const pppStuffingFigure = header(stuffing, 380,
  '上半部分演示同步比特填充：原始 01111110 在五个连续 1 后插入 0，成为 011111010，接收端去掉填充位。下半部分演示异步字节填充：7E 转为 7D 5E，7D 转为 7D 5D，04 转为 7D 24。',
  'PPP 透明传输：同步比特填充与异步字符填充',
  [
    txt(26, 31, '① 同步链路 · 零比特填充', 17, c.ink, 700),
    box(26, 54, 205, 87),
    txt(42, 77, '信息字段（原始）', 12, c.muted),
    mono(128, 116, '01111110', 20),
    path('M 239 98 H 273', stuffing),
    box(281, 54, 231, 87),
    txt(297, 77, '发送时插入 0', 12, c.muted),
    `<text x="394" y="116" text-anchor="middle" font-family="var(--font-mono), monospace" font-size="20" font-weight="650" fill="${c.ink}">011111<tspan fill="${c.accent}" text-decoration="underline">0</tspan>10</text>`,
    path('M 519 98 H 555', stuffing),
    box(563, 54, 171, 87),
    txt(579, 77, '接收后还原', 12, c.muted),
    mono(648, 116, '01111110', 20),
    txt(29, 161, '连续 5 个 1 → 发送方插入 0 → 接收方删除该 0（帧标志本身不填充）', 12, c.subtle),
    `<path d="M 28 185 H 732" stroke="${c.edge}" stroke-dasharray="5 5" />`,
    txt(26, 214, '② 异步链路 · 字符（字节）填充', 17, c.ink, 700),
    txt(47, 241, '原始数据字节', 12, c.muted),
    txt(338, 241, '链路上发送的字节序列', 12, c.muted),
    txt(646, 241, '含义', 12, c.muted),
    ...[
      { y: 251, src: '0x7E', dest: '0x7D  0x5E', note: '帧标志转义' },
      { y: 291, src: '0x7D', dest: '0x7D  0x5D', note: '转义符转义' },
      { y: 331, src: '0x04', dest: '0x7D  0x24', note: '控制字节转义' },
    ].flatMap(({y,src,dest,note})=>[
      box(26,y,177,34), mono(114,y+23,src,15),
      path(`M 212 ${y+17} H 282`,stuffing),
      box(292,y,264,34), mono(424,y+23,dest,15,c.accent),
      txt(618,y+23,note,13,c.muted),
    ]),
  ].join('\n'),
  '图 4-PPP-1　透明传输：连续五个 1 插入 0；特殊字节使用 0x7D 转义');

const phases = 'ppp-phases';
const stage = (x: number, y: number, num: string, name: string, hint: string, highlight = false) =>
  box(x,y,209,64,c.panel,highlight?c.accent:c.edge) +
  txt(x+14,y+25,num+'  '+name,16,c.ink,700) + txt(x+14,y+47,hint,12,c.muted);
export const pppPhasesFigure = header(phases, 268,
  '链路不可用到 LCP 协商，再可选认证，然后进行 NCP 协商，进入数据传输阶段，终止后回到链路不可用；认证可以跳过。',
  'PPP 生命周期六阶段示意',
  [
    txt(26,29,'PPP 会话生命周期',17,c.ink,700),
    stage(26,48,'01','链路不可用','等待物理链路就绪'),
    path('M 238 81 H 264',phases),
    stage(274,48,'02','LCP 建立','协商链路参数',true),
    path('M 486 81 H 514',phases),
    stage(524,48,'03','认证（可选）','PAP / CHAP'),
    path('M 629 116 V 150',phases),
    stage(524,163,'04','NCP 协商','配置网络层协议',true),
    path('M 517 195 H 493',phases),
    stage(274,163,'05','链路开放','传输 IP 等数据'),
    path('M 267 195 H 242',phases),
    stage(26,163,'06','终止会话','LCP 关闭后回到静止'),
    txt(26,250,'未启用认证时，LCP 完成后直接进入 NCP 配置阶段。',12,c.subtle),
  ].join('\n'),
  '图 4-PPP-2　六阶段流程；认证是可选步骤，链路终止后回到不可用状态');

const format = 'ppp-lcp';
const field = (x: number,w: number,name: string,sub: string,highlight=false) =>
  box(x,68,w,80,c.panel,highlight?c.accent:c.edge,7)+txt(x+w/2,99,name,15,c.ink,700,'middle')+txt(x+w/2,128,sub,12,c.subtle,500,'middle');
export const pppLcpFigure = header(format, 256,
  'PPP 帧协议字段 0xC021 指示 LCP。LCP 报文包含 Code 一字节、Identifier 一字节、Length 两字节、Data 可变长；以配置请求为例 Data 中可放多个 TLV 选项。',
  'LCP 报文结构与 TLV 配置选项',
  [
    txt(26,31,'PPP 协议字段 0xC021',14,c.accent,700),
    path('M 230 28 H 284',format),
    txt(297,32,'PPP 信息字段 = LCP 报文',14,c.ink,650),
    field(26,137,'Code','1 字节'),
    field(164,160,'Identifier','1 字节'),
    field(325,137,'Length','2 字节'),
    field(463,271,'LCP Data','变长',true),
    txt(28,184,'配置类 LCP 报文的 Data 可携带若干个 TLV 选项：',13,c.muted),
    box(26,198,185,38),box(213,198,185,38),box(400,198,334,38),
    txt(118,223,'Type',14,c.ink,700,'middle'),
    txt(304,223,'Length',14,c.ink,700,'middle'),
    txt(566,223,'Value（可变长）',14,c.accent,700,'middle'),
  ].join('\n'),
  '图 4-PPP-3　LCP 报文头部与配置选项的 TLV 编码');

const config = 'ppp-config';
export const pppConfigFigure = header(config, 312,
  '发起端发送 Configure-Request，对端检查选项后回复 Ack（全部接受）、Nak（建议更换值）、Reject（拒绝不可识别或不可协商的选项），后两者需要调整后重新请求。',
  'LCP Configure-Request 和三种应答',
  [
    txt(24,30,'LCP 配置请求—响应',17,c.ink,700),
    box(26,116,233,79),
    txt(142,145,'Configure-Request',16,c.ink,700,'middle'),
    txt(142,174,'MRU / ACCM / 认证选项…',12,c.muted,500,'middle'),
    path('M 266 155 H 293',config),
    box(300,123,151,65,c.panel,c.accent),
    txt(375,149,'对端检查',16,c.ink,700,'middle'),
    txt(375,171,'选项与取值',13,c.muted,500,'middle'),
    `<path d="M 455 155 H 465 M 465 68 V 241" stroke="${c.subtle}" stroke-width="2" fill="none"/>`,
    ...[
      { y: 40, title: 'Configure-Ack', note: '识别并接受全部选项' },
      { y: 128, title: 'Configure-Nak', note: '认可选项，但建议调整取值' },
      { y: 216, title: 'Configure-Reject', note: '不认识或不允许协商的选项' },
    ].flatMap(({y,title,note})=>[
      path(`M 465 ${y+28} H 492`,config),
      box(501,y,233,65),
      txt(618,y+26,title,15,c.ink,700,'middle'),
      txt(618,y+49,note,11,c.muted,500,'middle'),
    ]),
    txt(26,297,'收到 Nak / Reject → 调整请求 → 重新协商；Ack 表示该方向的选项获同意。',12,c.subtle),
  ].join('\n'),
  '图 4-PPP-4　LCP 的 Ack / Nak / Reject：接受、建议修改或拒绝不支持的选项');

const auth = 'ppp-auth';
export const pppAuthFigure = header(auth, 338,
  '上半部分 PAP 由被认证端向认证端发送明文用户名和口令，认证端返回结果；下半部分 CHAP 由认证端发 Challenge，被认证端计算响应摘要，认证端验证后返回成功或失败，不在链路上传输口令原文。',
  'PPP 认证对照：PAP 和 CHAP',
  [
    txt(22,29,'PAP · 口令直接传输',17,c.ink,700),
    txt(111,57,'被认证端',13,c.muted,600,'middle'),
    txt(647,57,'认证端',13,c.muted,600,'middle'),
    `<path d="M 112 66 V 148 M 646 66 V 148" stroke="${c.edge}" stroke-dasharray="4 5" />`,
    path('M 127 88 H 626',auth),
    txt(377,78,'Authenticate-Request：用户名 + 口令（明文）',13,c.ink,600,'middle'),
    path('M 626 130 H 127',auth),
    txt(377,121,'Authenticate-Ack / Nak',13,c.muted,500,'middle'),
    `<path d="M 25 163 H 735" stroke="${c.edge}" stroke-dasharray="5 5"/>`,
    txt(22,192,'CHAP · 挑战—响应（不传输口令原文）',17,c.ink,700),
    txt(111,215,'被认证端',13,c.muted,600,'middle'),
    txt(647,215,'认证端',13,c.muted,600,'middle'),
    `<path d="M 112 222 V 324 M 646 222 V 324" stroke="${c.edge}" stroke-dasharray="4 5" />`,
    path('M 626 239 H 127',auth),
    txt(377,232,'① Challenge（随机挑战值）',12,c.muted,500,'middle'),
    path('M 127 276 H 626',auth),
    txt(377,268,'② Response（根据共享密钥计算摘要）',12,c.accent,600,'middle'),
    path('M 626 312 H 127',auth),
    txt(377,304,'③ Success / Failure',12,c.muted,500,'middle'),
  ].join('\n'),
  '图 4-PPP-5　PAP 直接传口令；CHAP 使用挑战—响应机制');

const ncp = 'ppp-ncp';
export const pppNcpFigure = header(ncp, 292,
  'LCP 先建立 PPP 链路，认证可选；NCP 根据网络层协议分工：IPCP 协商 IPv4 的地址等参数，其他 NCP 处理其他网络层协议；完成配置后传输 IPv4 数据报。',
  'PPP 中 LCP、NCP、IPCP 的关系',
  [
    txt(27,30,'先建链，再配置网络层协议',17,c.ink,700),
    box(24,57,190,91),
    txt(119,91,'LCP',20,c.ink,700,'middle'),
    txt(119,120,'建立与维护链路',13,c.muted,500,'middle'),
    path('M 219 102 H 257',ncp),
    box(268,57,191,91,c.panel,c.accent),
    txt(363,91,'NCP 协议族',19,c.ink,700,'middle'),
    txt(363,120,'配置网络层协议',13,c.muted,500,'middle'),
    path('M 463 94 H 492',ncp),
    box(502,47,231,71),
    txt(617,73,'IPCP · 0x8021',16,c.ink,700,'middle'),
    txt(617,99,'IPv4 地址 / 压缩等',12,c.muted,500,'middle'),
    path('M 461 118 L 492 162',ncp),
    box(502,136,231,64),
    txt(617,161,'其他 NCP',16,c.ink,700,'middle'),
    txt(617,183,'如 IPXCP、ATCP',12,c.muted,500,'middle'),
    path('M 617 205 V 219',ncp),
    box(420,225,314,32),
    txt(577,246,'配置成功后传输对应网络层数据',13,c.ink,600,'middle'),
    txt(26,283,'认证（PAP / CHAP）可选；IPCP 是 NCP 的一个成员，不与 LCP 并列。',12,c.subtle),
  ].join('\n'),
  '图 4-PPP-6　LCP 管理链路，NCP 适配网络层；IPCP 属于 NCP');
