/* 附件清单契约：public/attachments/<学期>__<课程>.json 由 build-catalog 生成、随提交入库。
 * 已上线课程中，除算法课（资料随仓库自建、无 data/ 目录）外，其余 8 门必须有清单且结构合法。 */
import { describe, expect, it } from 'vitest';
import mathAtt from '../../public/attachments/大一上__高等数学.json';
import osAtt from '../../public/attachments/大三上__操作系统.json';
import netAtt from '../../public/attachments/大三上__计算机网络.json';
import patAtt from '../../public/attachments/大二上__程序设计艺术与方法.json';
import aiAtt from '../../public/attachments/大三上__人工智能原理.json';
import saAtt from '../../public/attachments/大三上__软件体系结构.json';
import physAtt from '../../public/attachments/大二上__大学物理.json';
import caAtt from '../../public/attachments/大三上__计算机体系结构.json';

interface AttNode {
  n: string;
  p: string;
  s?: number;
  c?: AttNode[];
}
interface AttManifest {
  semester: string;
  course: string;
  cats: { name: string; tree: AttNode[] }[];
}

const CATS = ['课件', '试题', '附件'];

const countFiles = (nodes: AttNode[]): number => nodes.reduce((a, x) => a + (x.c ? countFiles(x.c) : 1), 0);

const checkNodes = (nodes: AttNode[]) => {
  for (const node of nodes) {
    expect(node.n.length).toBeGreaterThan(0);
    expect(node.p).not.toContain('..');
    expect(node.p.startsWith('/')).toBe(false);
    if (node.c) {
      expect(node.s).toBeUndefined();
      checkNodes(node.c);
    } else {
      expect(node.s ?? -1).toBeGreaterThanOrEqual(0);
    }
  }
};

const manifests: Array<[string, AttManifest]> = [
  ['高等数学', mathAtt],
  ['操作系统', osAtt],
  ['计算机网络', netAtt],
  ['程序设计艺术与方法', patAtt],
  ['人工智能原理', aiAtt],
  ['软件体系结构', saAtt],
  ['大学物理', physAtt],
  ['计算机体系结构', caAtt],
];

describe('附件清单（public/attachments）', () => {
  for (const [name, m] of manifests) {
    it(`${name}：清单结构合法且非空`, () => {
      expect(m.cats.length).toBeGreaterThan(0);
      for (const cat of m.cats) {
        expect(CATS).toContain(cat.name);
        checkNodes(cat.tree);
      }
      expect(countFiles(m.cats.reduce<AttNode[]>((a, c) => a.concat(c.tree), []))).toBeGreaterThan(0);
    });
  }
});