from pathlib import Path
import re, csv, textwrap

ROOT = Path(__file__).resolve().parent
MD = ROOT / 'BITCOIN-TRANSACTION-DEMO-KIT.md'
CSV = ROOT / 'PACKING-LIST-8-TABLES.csv'
OUT = ROOT / 'BITCOIN-TRANSACTION-DEMO-KIT.pdf'

W,H = 612,792
M = 42
TOP = 742
BOTTOM = 44

class MiniPDF:
    def __init__(self):
        self.pages=[]; self.ops=[]; self.y=TOP; self.page_no=0
        self.new_page()
    def esc(self,s): return s.replace('\\','\\\\').replace('(','\\(').replace(')','\\)').replace('—','-').replace('–','-').replace('→','->').replace('×','x').replace('“','"').replace('”','"').replace('’',"'").replace('•','-')
    def op(self,s): self.ops.append(s)
    def text(self,x,y,s,size=10,font='F1'):
        self.op(f'BT /{font} {size} Tf {x:.1f} {y:.1f} Td ({self.esc(s)}) Tj ET')
    def rect(self,x,y,w,h,fill='0.95 0.95 0.95'):
        self.op(f'q {fill} rg {x:.1f} {y:.1f} {w:.1f} {h:.1f} re f Q')
    def line(self,x1,y1,x2,y2): self.op(f'{x1:.1f} {y1:.1f} m {x2:.1f} {y2:.1f} l S')
    def finish_page(self):
        self.text(W-95,22,f'Block 7 Physical Kit · page {self.page_no}',8,'F1')
        self.pages.append('\n'.join(self.ops))
    def new_page(self):
        if self.ops: self.finish_page()
        self.page_no+=1; self.ops=[]; self.y=TOP
        self.rect(0,762,W,30,'0.969 0.576 0.102')
        self.text(M,773,'Bitcoin Transaction Demo Kit',13,'F2')
    def ensure(self,need):
        if self.y-need < BOTTOM: self.new_page()
    def wrap(self,text,size=10,indent=0):
        # approximate Helvetica width; wider wrap for small text
        chars = int((W-2*M-indent) / (size*0.52))
        return textwrap.wrap(text, width=max(30,chars), break_long_words=False, replace_whitespace=False)
    def para(self,text,size=10.5,lead=14,font='F1',indent=0,pre=''):
        text = clean(text)
        if not text: self.y-=5; return
        lines = self.wrap(text,size,indent+12)
        self.ensure(len(lines)*lead+6)
        first=True
        for ln in lines:
            prefix = pre if first else ' '
            self.text(M+indent,self.y,prefix+ln,size,font)
            self.y-=lead; first=False
        self.y-=4
    def heading(self,text,level):
        text=clean(text.strip('# '))
        if level==1:
            self.ensure(42); self.text(M,self.y,text,20,'F2'); self.y-=28
        elif level==2:
            self.ensure(38); self.line(M,self.y,W-M,self.y); self.y-=17; self.text(M,self.y,text,15,'F2'); self.y-=22
        else:
            self.ensure(25); self.text(M,self.y,text,12.5,'F2'); self.y-=18
    def bullet(self,text):
        text=re.sub(r'^\s*(\d+\.|[-*])\s+','',text)
        self.para(text,10.2,13,'F1',14,'- ')
    def table(self,rows):
        if not rows: return
        col_count=len(rows[0])
        # render compact markdown-like rows; preserves all content without needing complex table layout
        for idx,row in enumerate(rows):
            joined=' | '.join(clean(c.strip()) for c in row)
            size=8.2 if col_count>3 else 9.2
            font='F2' if idx==0 else 'F1'
            prefix='' if idx==0 else '  '
            lines=self.wrap(joined,size,0)
            self.ensure(len(lines)*11+8)
            if idx==0:
                self.rect(M-3,self.y-3,W-2*M+6,14,'0.969 0.576 0.102')
            for ln in lines:
                self.text(M,self.y,prefix+ln,size,font); self.y-=11
            if idx==0: self.y-=3
        self.y-=8
    def write(self,path):
        if self.ops: self.finish_page(); self.ops=[]
        objs=[]
        def add(s): objs.append(s); return len(objs)
        font1=add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>')
        font2=add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>')
        page_ids=[]
        contents=[]
        for p in self.pages:
            stream=p.encode('latin-1','replace')
            cid=add(f'<< /Length {len(stream)} >>\nstream\n'+stream.decode('latin-1')+'\nendstream')
            contents.append(cid)
            page_ids.append(None)
        pages_id_placeholder=len(objs)+1+len(page_ids)
        for cid in contents:
            pid=add(f'<< /Type /Page /Parent {pages_id_placeholder} 0 R /MediaBox [0 0 {W} {H}] /Resources << /Font << /F1 {font1} 0 R /F2 {font2} 0 R >> >> /Contents {cid} 0 R >>')
            page_ids[contents.index(cid)]=pid
        kids=' '.join(f'{pid} 0 R' for pid in page_ids)
        pages_id=add(f'<< /Type /Pages /Kids [ {kids} ] /Count {len(page_ids)} >>')
        catalog_id=add(f'<< /Type /Catalog /Pages {pages_id} 0 R >>')
        assert pages_id==pages_id_placeholder
        out=['%PDF-1.4\n% MiniPDF\n']
        offsets=[]
        for i,obj in enumerate(objs,1):
            offsets.append(sum(len(x.encode('latin-1')) for x in out))
            out.append(f'{i} 0 obj\n{obj}\nendobj\n')
        xref=sum(len(x.encode('latin-1')) for x in out)
        out.append(f'xref\n0 {len(objs)+1}\n0000000000 65535 f \n')
        for off in offsets: out.append(f'{off:010d} 00000 n \n')
        out.append(f'trailer\n<< /Size {len(objs)+1} /Root {catalog_id} 0 R >>\nstartxref\n{xref}\n%%EOF\n')
        path.write_bytes(''.join(out).encode('latin-1','replace'))

def clean(s):
    s=s.replace('**','').replace('`','')
    s=re.sub(r'<br\s*/?>',' ',s)
    return s.strip()

pdf=MiniPDF()
lines=MD.read_text().splitlines(); i=0
while i < len(lines):
    line=lines[i].rstrip()
    if not line: pdf.y-=4; i+=1; continue
    if line.startswith('#'):
        pdf.heading(line, len(line)-len(line.lstrip('#'))); i+=1; continue
    if line.startswith('|'):
        rows=[]
        while i<len(lines) and lines[i].startswith('|'):
            parts=[p for p in lines[i].strip().strip('|').split('|')]
            if not all(re.fullmatch(r'\s*:?-{3,}:?\s*',p) for p in parts): rows.append(parts)
            i+=1
        pdf.table(rows); continue
    if re.match(r'^\s*(\d+\.|[-*])\s+',line): pdf.bullet(line); i+=1; continue
    if line.startswith('>'): pdf.para(line.lstrip('> ').strip(),11,15,'F2',10); i+=1; continue
    if line=='---': pdf.y-=6; i+=1; continue
    pdf.para(line); i+=1

pdf.new_page(); pdf.heading('Packing List: 8 Tables of 10',1)
with CSV.open() as f: pdf.table(list(csv.reader(f)))
pdf.write(OUT)
print(OUT)
