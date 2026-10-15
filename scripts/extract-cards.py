"""Extract the supplied 1536x1024 sheet. Requires Pillow; no generated illustrations.
Usage: python scripts/extract-cards.py
The card back at x997..1138 is intentionally excluded.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import os
import json
root=Path(__file__).resolve().parents[1]
source=Image.open(root/'public/cards/source/tichu-sheet.png').convert('RGB')
assert source.size==(1536,1024)
xs=[(16,126),(132,246),(251,361),(367,481),(487,598),(603,713),(719,829),(834,946),(951,1060),(1065,1176),(1182,1294),(1299,1411),(1416,1526)]
ys=[(8,195),(201,393),(399,594),(599,796)]
ranks=['2','3','4','5','6','7','8','9','10','J','Q','K','A']
suits=['sword','crescent','star','house']
entries=[]
for suit,(top,bottom) in zip(suits,ys):
 for rank,(left,right) in zip(ranks,xs):entries.append((f'{suit}/{rank}',(left,top,right,bottom)))
for name,box in [('mahjong',(401,804,539,1005)),('dragon',(551,804,690,1005)),('dog',(700,804,836,1005)),('phoenix',(845,804,984,1005))]:entries.append((f'special/{name}',box))
# Reuse source suit artwork, but explicitly lay out 2–10 for exact central pip counts.
pip_boxes=[(176,44,212,84),(63,254,92,283),(61,444,91,475),(60,640,93,676)]
pips={suit:source.crop(box) for suit,box in zip(suits,pip_boxes)}
font_path=os.environ.get('CARD_FONT','/System/Library/Fonts/Supplemental/Arial Narrow Bold.ttf')
font=ImageFont.truetype(font_path,38)
colors=['#111111','#005838','#ff421c','#073f6b']
patterns={
 2:[(112,108),(112,278)],3:[(112,100),(112,192),(112,284)],
 4:[(x,y) for x in [70,154] for y in [105,278]],
 5:[(x,y) for x in [70,154] for y in [105,278]]+[(112,192)],
 6:[(x,y) for x in [70,154] for y in [105,192,278]],
 7:[(x,y) for x in [70,154] for y in [105,192,278]]+[(112,148)],
 8:[(x,y) for x in [70,154] for y in [105,192,278]]+[(112,148),(112,235)],
 9:[(x,y) for x in [62,112,162] for y in [105,192,278]],
 10:[(x,y) for x in [70,154] for y in [90,155,220,285]]+[(112,122),(112,252)]
}
for number,positions in patterns.items():assert len(positions)==number
symbol_dir=root/'public/cards/symbols';symbol_dir.mkdir(exist_ok=True)
for suit,pip in pips.items():pip.save(symbol_dir/f'{suit}.png')
def numeric_card(suit,rank):
 card=Image.new('RGB',(224,384),'white');draw=ImageDraw.Draw(card)
 pip=pips[suit].copy(); scale=min(44/pip.width,48/pip.height); pip=pip.resize((round(pip.width*scale),round(pip.height*scale)),Image.Resampling.LANCZOS)
 for x,y in patterns[int(rank)]:card.paste(pip,(x-pip.width//2,y-pip.height//2))
 corner=Image.new('RGB',(42,68),'white');d=ImageDraw.Draw(corner)
 d.text((3,-2),rank,font=font,fill=colors[suits.index(suit)])
 small=pips[suit].copy();small.thumbnail((17,19),Image.Resampling.LANCZOS);corner.paste(small,(4,43))
 card.paste(corner,(13,10));card.paste(corner.rotate(180),(169,306))
 return card
thumbs=[]
for name,box in entries:
 # Remove only the source's thin frame; retain all corner numerals and artwork.
 l,t,r,b=box
 art=source.crop((l+3,t+3,r-3,b-3))
 art.thumbnail((216,376),Image.Resampling.LANCZOS)
 # Keep source resolution: proportional enlargement for a consistent display canvas.
 scale=min(216/art.width,376/art.height)
 art=art.resize((round(art.width*scale),round(art.height*scale)),Image.Resampling.LANCZOS)
 card=Image.new('RGB',(224,384),'white')
 card.paste(art,((224-art.width)//2,(384-art.height)//2))
 if name.split('/')[0] in suits and name.split('/')[1].isdigit():
  card=numeric_card(*name.split('/'))
 ImageDraw.Draw(card).rounded_rectangle((0,0,223,383),radius=8,outline='#B8B8B8',width=1)
 out=root/'public/cards'/f'{name}.png';out.parent.mkdir(parents=True,exist_ok=True);card.save(out,optimize=True)
 thumbs.append(card)
assert len(entries)==56
(root/'public/cards/manifest.json').write_text(json.dumps([{'path':f'/cards/{name}.png','sourceBox':box,'centralPips': int(name.split('/')[1]) if name.split('/')[1].isdigit() else None,'width':224,'height':384} for name,box in entries],indent=2))
contact=Image.new('RGB',(13*112,5*208),'#eeeeee')
for i,((name,_),im) in enumerate(zip(entries,thumbs)):
 x=(i%13)*112;y=(i//13)*208
 contact.paste(im.resize((105,180)),(x,y));ImageDraw.Draw(contact).text((x+2,y+183),name,fill='black')
contact.save('/private/tmp/tichu-card-contact.png')
print('Extracted 52 normal cards + 4 special cards; card back excluded.')
