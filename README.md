## Taobao Mobile to Desktop Link Converter
Does what the title says. Use at your own risk and good luck copping some 1:1s.

Feel free to contribute to this repo! :)

### Things to Do:
* Clean up all the JS code which is very messy
* Find a better way to detect valid URLs
* Improve the CSS, it's all over the place right now
* Make the website look more modern and cleaner

### How it works:
1. Read all the links in the text area into an array
2. Go through each element in the array
  i. If the link is a valid Taobao link, we convert it based on its type and push it to the valid links array
  ii. Otherwise we push it to the invalid links array
3. Go through the elements in the valid and invalid links array and format them in HTML and push them to the DOM

