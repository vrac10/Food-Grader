import pathlib
import textwrap
import PIL.Image

import google.generativeai as genai

from IPython.display import display
from IPython.display import Markdown

# Or use `os.getenv('GOOGLE_API_KEY')` to fetch an environment variable.
GOOGLE_API_KEY='AIzaSyAEMC69txfkq_jTjClRwk7KXHYplgzvpPg'

genai.configure(api_key=GOOGLE_API_KEY)

def generateText(filename):
    model = genai.GenerativeModel('gemini-pro-vision')

    img = PIL.Image.open(filename)

    response = model.generate_content(["read the nutritional information given in the table  which content amount per serving i only need this  and separate every row with spaces and values in row with ','  as i have to read the data and clean it  ", img], stream=True)
    response.resolve()

    data = response.text
    lines = data.split('\n')
    cleaned_data = {}
    for line in lines:
        items = line.split(',')
        key = items[0]
        value = items[1]
        if value == '':
            value = None
        if key=='Sodium':
          if 'g'==value.split()[-1]:
            t=value.split()
            t[0]=float(t[0])*1000
            t[-1]='mg'
            cleaned_data[key] = ''.join(map(str,t))
            continue
        if key == 'energy':
           if value.split()[-1]!='kcal':
              continue
        cleaned_data[key] = ''.join(map(str,value.split()))
    return(cleaned_data)