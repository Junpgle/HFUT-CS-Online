/* 第九章 文件 —— 逐节转录自 课件/PPT/第九章 文件.ppt（23 页）；
   读写方式表、SEEK 常量表按课件原表转录。 */
import type { PdChapter } from './types';

const ch9: PdChapter = {
  id: 'ch9',
  no: '第9章',
  title: '文件',
  subtitle: '文件概念与指针 · 打开与关闭 · 读写函数 · 定位操作 · 错误检测',
  lede:
    '<p>文件是一组存储在外部设备上的数据的集合。程序处理的数据在程序结束后仍然需要保留，就要求助于文件——保存和交换数据、保存大容量数据。</p>',
  toc: [
    { id: 'sec-pd9-concept', text: '9.1 文件的概念', level: 2 },
    { id: 'sec-pd9-process', text: '9.2 文件的操作过程与文件指针', level: 2 },
    { id: 'sec-pd9-open', text: '9.3 文件的打开与关闭', level: 2 },
    { id: 'sec-pd9-rw', text: '9.4 文件的读写', level: 2 },
    { id: 'sec-pd9-pos', text: '9.5 文件的定位操作', level: 2 },
    { id: 'sec-pd9-err', text: '9.6 文件的错误检测', level: 2 },
  ],
  sections: [
    {
      id: 'sec-pd9-concept',
      heading: '9.1 文件的概念',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>文件概念</strong>：文件是一组存储在外部设备上的数据的集合。外设（如键盘）也可以以文件的形式进行处理，称为<strong>设备文件</strong>。</p>
            <p><strong>文件的优点</strong>：保存和交换数据；保存大容量数据。</p>
            <p><strong>文件的分类</strong>：</p>
            <ul>
              <li>按数据表示方式：<strong>二进制文件</strong>、<strong>文本文件（ASCII 文件）</strong>；</li>
              <li>按读写方式：<strong>顺序读写文件（流式）</strong>、<strong>随机读写文件</strong>；</li>
              <li>按处理方法：<strong>缓冲文件</strong>、<strong>非缓冲文件</strong>。</li>
            </ul>
            <p><em>课件图示：内存（内存缓冲区 Buffer）——与外设 Device 之间匹配主机速度，进行数据转换。</em></p>`,
        },
      ],
    },
    {
      id: 'sec-pd9-process',
      heading: '9.2 文件的操作过程与文件指针',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>⒈文件的操作过程</strong>——三步：①<strong>打开文件</strong>：建立一个文件和流的对应关系，在内存中建立一个保存文件信息的结构变量；②<strong>读写文件</strong>；③<strong>关闭文件</strong>：释放文件所占的资源。</p>
            <p><strong>⒉文件指针</strong>——在缓冲文件系统中，每个被使用的文件的信息（如文件名、位置、类型等）都保存在一个特殊定义的结构类型的变量中，该结构用户定义名为 <strong>FILE</strong>。可以定义一个指向 FILE 类型的结构指针，打开文件是让该指针指向文件对应的结构变量，通过该指针对文件进行操作：<code>FILE *fp;</code></p>`,
        },
      ],
    },
    {
      id: 'sec-pd9-open',
      heading: '9.3 文件的打开与关闭',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>⒈文件的打开 fopen( ) 函数</strong>——fopen 函数的原型在 stdio.h 文件中说明，该函数的作用是打开缓冲文件。使用方法：</p>
            <pre class="code"><code>FILE  *fp;
fp = fopen( filename , mode ) ;
/* filename：打开文件的文件名或设备名
   mode：文件的读写方式
   返回值：文件信息结构的指针 */</code></pre>
            <p>如 <code>fp=fopen("a:\\wang.dat","w+");</code> 说明：</p>
            <ul>
              <li>⑴如果 fopen 失败，则函数返回空指针 NULL；</li>
              <li>⑵当文件打开错误时，程序不应继续执行，一般以如下方式打开文件：</li>
            </ul>
            <pre class="code"><code>if (( fp=fopen( filename , mode )) == NULL )
{           printf ( "File Open Error! \n" ) ;
    exit (1) ;
}</code></pre>
            <p><strong>文件的读写方式说明</strong>：</p>
            <table class="tbl">
              <thead><tr><th>控制符</th><th>文件类型</th><th>读写方式</th></tr></thead>
              <tbody>
                <tr><td>"r"</td><td>文本</td><td>打开文件只读</td></tr>
                <tr><td>"w"</td><td>文本</td><td>打开文件只写</td></tr>
                <tr><td>"a"</td><td>文本</td><td>打开文件在尾部追加</td></tr>
                <tr><td>"rb"</td><td>二进制</td><td>打开文件只读</td></tr>
                <tr><td>"wb"</td><td>二进制</td><td>打开文件只写</td></tr>
                <tr><td>"ab"</td><td>二进制</td><td>打开文件在尾部追加</td></tr>
                <tr><td>"r+"</td><td>文本</td><td>打开文件可读写</td></tr>
                <tr><td>"w+"</td><td>文本</td><td>建立新文件可读写</td></tr>
                <tr><td>"a+"</td><td>文本</td><td>打开文件可读写</td></tr>
                <tr><td>"rb+"</td><td>二进制</td><td>打开文件可读写</td></tr>
                <tr><td>"wb+"</td><td>二进制</td><td>建立新文件可读写</td></tr>
                <tr><td>"ab+"</td><td>二进制</td><td>打开文件可读写</td></tr>
              </tbody>
            </table>
            <p><strong>⒉文件的关闭 fclose 函数</strong>——文件使用完必须关闭，关闭文件的目的是：①保证文件的数据不丢失，将 buffer 的数据回写文件；②释放 buffer。关闭文件函数的使用：</p>
            <pre class="code"><code>fclose(文件指针);
FILE  *fp;
fp = fopen("a:\\d.dat","w+");
/*  文件的读写 */
…
fclose(fp);</code></pre>
            <p>说明：如果关闭正确 fclose 返回 0；关闭失败 fclose 返回非 0。</p>
            <p><strong>文件读写的方式</strong>——文件按读写方式可以分为：顺序读写（顺序向后读写）、随机读写（给定位置读写）。</p>`,
        },
      ],
    },
    {
      id: 'sec-pd9-rw',
      heading: '9.4 文件的读写',
      blocks: [
        {
          type: 'html',
          html: `
            <p>文件的读写是由定义在 stdio.h 中的一组函数的集合所实现的。</p>
            <p><strong>⒈ fputc 函数和 fgetc 函数</strong></p>
            <p>⑴ fputc 函数——使用方法：<code>fputc(ch, fp);</code>。含义：将字符 ch 写入文件指针对应的文件的当前位置。返回值：写入正确返回 ch 的值；失败返回 EOF（在 stdio.h 中定义为 -1）。</p>
            <p>⑵ fgetc 函数——使用方法：<code>ch = fgetc(fp);</code>（ch 为字符型变量）。含义：从文件指针 fp 对应的可读文件的当前位置读一个字符返回赋值给 ch。</p>
            <p>⑶ feof 函数——使用方法：<code>i = feof(fp);</code>。含义：判断文件是否结束。返回值：1 代表文件结束；0 代表文件未结束。</p>
            <p>举例：将一个磁盘文件中的内容复制到另一个文件中：</p>
            <pre class="code"><code>#include &lt;stdio.h&gt;
#include &lt;STDLIB.H&gt;
void main ( int argc, char  *argv[ ])
{
    FILE  *in, *out;
    if (argc != 3)
    {          printf("Command format error!\n");
        exit(1);
    }
    if (( in = fopen (argv[1], "r" )) == NULL )
    {           printf ("cannot  open  the  source file \n");
           exit  (2);
    }
    if (( out = fopen (argv[2], "w" )) == NULL )
    {
            printf ("cannot  open  the  destination file \n");
            exit  (3);
    }
    // 读写
    fclose (in);
    fclose (out);
}</code></pre>
            <p><strong>⒉文件的字符串的输入和输出函数</strong></p>
            <p>⑴字符串输入函数——使用方法：<code>fgets(str, n, fp);</code>。含义：从 fp 所对应的文件的当前位置读 n-1 个字符到 str 所指向的内存单元，并在结束处加 '\\0' 表示字符串结束。<strong>三种情况可以使输入结束：输入完 n-1 个字符；输入时遇到 '\\n'；输入时遇到文件结束标志。</strong></p>
            <p>⑵字符串输出函数——使用方法：<code>fputs(str, fp);</code>。含义：将 str 指向的字符串输出到 fp 所对应的文件中，并忽略输出字符串结束标志 '\\0'。</p>
            <p>举例：从文件中输入字符串，并打印其内容：</p>
            <pre class="code"><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#define   SIZE 256
void  main(void)
{        char  buff[SIZE], szFileName[80];
    FILE  *fpIn, *fpStdout, *fpOut;
    fpStdout = stdout;                /* 文件指针指向设备：stdprn 打印机；stdaux 串口；stdin、stdout */
    printf("请输入文件名：");
    gets(szFileName);
    // Open files….
    while (fgets (buff, SIZE, fpIn) != NULL )
    {                                  fputs(buff, fpStdout);
        fputs(buff, fpOut);
    }
    fclose(fpIn);
    fclose(fpOut);
}</code></pre>
            <p><strong>⒊文件的格式化输入和输出函数</strong></p>
            <p>⑴格式化输入函数 fscanf——使用方法：<code>fscanf(fp, format, &amp;arg1, &amp;arg2, … &amp;argn);</code>（fp 文件指针；format 格式说明字符串，取 %d、%x、%f、%c 等，说明输入转化的格式；&amp;arg1…&amp;argn 接收输入变量的地址列表）。含义：从 fp 对应的文件的当前位置，顺序读入一个字符序列，按 format 说明的格式和类型进行转换并存放到对应变量单元。</p>
            <p>例：从 f1.txt 中读字符串和一个十进制数，输出到显示器（CHAP9EX3）：</p>
            <pre class="code"><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
void main (void)
{        char  s[80];
    int   a, i;
    FILE  *fp;

    if ((fp = fopen ( "f1.txt", "r" )) == NULL)
    {
        printf ("cannot  open  file");
        exit (1);
        }
       for (i = 0; i &lt; 10; i++)
       {
            fscanf ( fp , "%s%d" , s, &amp;a);
             printf ( "%s\t%d\n", s, a );
    }
}</code></pre>
            <p>⑵格式化输出函数 fprintf——使用方法：<code>fprintf(fp, format, arg1, ……argn);</code>（fp 文件指针；format 格式说明字符串；arg1…argn 输出量列表）。含义：以指定的格式（format），将 arg1…argn 的值转换为字符序列，写入 fp 文件的当前位置。</p>
            <pre class="code"><code>FILE  *fp;
fp = fopen("s.dat","w");
…
fprintf(fp,"%d%c",123,'c');
fclose(fp);</code></pre>
            <p><strong>⒋文件的数据块输入输出函数</strong></p>
            <p>⑴ <strong>fread( ) 函数</strong>——使用方法：<code>fread(buf, size, count, fp);</code>（buf 空类型指针，接收数据的地址；size 整型，一次读取数据的字节数；count 整型，读取次数；fp 对应输入文件的文件指针）。含义：从 fp 指向的文件的当前位置，每次读取 size 个字节，共读 count 次读入数据，存放到 buf 指向的内存处。返回值：调用正确返回输入的项数；调用错误返回 -1（EOF）。</p>
            <pre class="code"><code>FILE  *fp;
char   str[80];
fp = fopen("s.dat","r");
fread(str, 20, 3, fp);</code></pre>
            <p>⑵ <strong>fwrite 函数</strong>——使用方法：<code>fwrite(buf, size, count, fp);</code>（buf 空类型指针，数据的地址；size 整型，一次输出数据的字节数；count 整型，输出次数；fp 对应输出文件的文件指针）。含义：从 buf 开始，分 count 次、每次 size 个字节，向 fp 对应文件的当前位置写数据。返回值：调用正确时返回 count；调用错误时返回 -1（EOF）。</p>
            <p>举例（CHAP9EX4）：</p>
            <pre class="code"><code>#include &lt;string.h&gt;
#include &lt;stdio.h&gt;
void main(void)
{   FILE *stream;
    char msg[ ] = "This is a test", buf[20];
    stream = fopen("TEST1.DAT", "w+");     /* 打开文件 */

    fwrite(msg, strlen(msg)+1, 1, stream); /* 写数据到文件 */

    fseek(stream, SEEK_SET, 0);            /* 重新定位到文件头 */

    fread(buf, strlen(msg)+1, 1, stream);
    printf("%s\n", buf);
    fclose(stream);
}</code></pre>`,
        },
      ],
    },
    {
      id: 'sec-pd9-pos',
      heading: '9.5 文件的定位操作',
      blocks: [
        {
          type: 'html',
          html: `
            <p>以上的所有文件的读写都是顺序的，完成一次读写操作后，文件的记录位置自动指向下一位置，因而称为顺序的流式文件。用户想使用任意的读写位置，可以通过定位函数实现。</p>
            <p><strong>⒈取文件当前位置 ftell 函数</strong>：</p>
            <pre class="code"><code>long  n;
…
n = ftell(fp);</code></pre>
            <p>含义：取文件的当前的读写位置（从文件头到当前的字节数）。返回值（long）：调用正确，返回当前位置与文件头相差的字节数；调用错误，返回 -1L。</p>
            <p><strong>⒉改变文件指针的当前位置 fseek 函数</strong>——使用方法：<code>fseek(fp, offset, from);</code>（fp 文件指针；offset 为 long int，以 from 为起点移动的偏移量；from 为移动的起始位置）。from 在 stdio.h 中定义了如下常量：</p>
            <table class="tbl">
              <thead><tr><th>值</th><th>常量符号</th><th>位置</th></tr></thead>
              <tbody>
                <tr><td>0</td><td>SEEK_SET</td><td>文件头</td></tr>
                <tr><td>1</td><td>SEEK_CUR</td><td>当前位置</td></tr>
                <tr><td>2</td><td>SEEK_END</td><td>文件尾</td></tr>
              </tbody>
            </table>
            <p>如 <code>fseek(fp, 50L, SEEK_SET)</code>——fp 对应文件的当前位置移到文件头 50 字节处。</p>
            <p><strong>⒊置文件于开头位置 rewind( ) 函数</strong>——使用方法：<code>rewind(fp);</code></p>
            <p>举例：输入数据存入文件显示并查找（CHAP9EXB）：</p>
            <pre class="code"><code>#include&lt;stdio.h&gt;
#include&lt;stdlib.h&gt;
#define  N  3
struct  student
{
    char  szName[10] ;
    long  lID ;
    int iScore ;
};

void  main (void)
{        int  i, iNum;
    FILE  *fpSource;
    struct  student stud[N], stTmp;
    fpSource = fopen("std.lst", "wb+");
    // 处理
    fclose(fpSource) ;
}</code></pre>`,
        },
      ],
    },
    {
      id: 'sec-pd9-err',
      heading: '9.6 文件的错误检测',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>⒈文件读写错误检测函数 ferror</strong>——使用方法：<code>ferror(fp);</code>。含义：检测文件读写错误。如果返回值为 0，表示无错误；如果返回值非 0，表示有错误。<strong>该标志一旦置位，必须通过清除函数清除！</strong></p>
            <p><strong>⒉清除文件错误标志函数 clearerr</strong>——使用方法：<code>clearerr(fp);</code>。含义：清除文件读写错误标志。</p>
            <p>举例（CHAP9EX5）：</p>
            <pre class="code"><code>#include &lt;stdio.h&gt;
void main(void)
{   FILE *stream;
    stream = fopen("DUMMY.FIL", "w");
    (void) getc(stream);
    if (ferror(stream))
    {        printf("Error reading from DUMMY.FIL\n");
        clearerr(stream);
    }
    fclose(stream);
}</code></pre>`,
        },
      ],
    },
  ],
};

export default ch9;
