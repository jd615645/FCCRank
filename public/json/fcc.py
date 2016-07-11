#coding=utf-8

import requests
import re
from bs4 import BeautifulSoup
import lxml
import json


sheet_src = '1PCCnOeg4gbIFhPT5H2wuo6gWHnobt0hCdJSZLCyAXaA'
url = 'https://spreadsheets.google.com/feeds/list/' + sheet_src + '/1/public/values?alt=json'

username = []
realname = []
fcc_info = []
# username = ["jd615645", "jayhung97724", "lukechu1997"]
i = 0

inputdata = requests.get(url).json()
for name in inputdata['feed']['entry']:
  username.append(name['gsx$username']['$t'])
  realname.append({name['gsx$username']['$t']: name['gsx$name']['$t']})

for name in username:
  #送出GET請求到遠端伺服器，伺服器接受請求後回傳<Response [200]>，代表請求成功
  print(name)
  res = requests.get("https://www.freecodecamp.com/" + name)

  #經過BeautifulSoup內lxml編輯器解析的結果
  data = BeautifulSoup(res.text, 'lxml')

  #使用select選取特定元素
  source = data.select('h1.text-primary')[0].get_text()
  source = re.search('[0-9]+', source).group()
  img = data.select('.img-center')[0]['src']
  challenges = data.select('table tr')
  challenge = []
  for j in range(1, len(challenges)):
    select = challenges[j].select('td:nth-of-type(1)')[0].get_text()
    # print select
    challenge.append(select)
  fcc_info.append({'username': name, 'realname': realname[i][name], 'source': source, 'img': img, 'challenge': challenge})
  i+=1

# print json.dumps(fcc_info)
with open('/home/sakamoto/FCCrank/public/json/result.json', 'w') as f:
  json.dump(fcc_info, f)
