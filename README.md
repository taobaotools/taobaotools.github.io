## Taobao Mobile to Desktop Link Converter
Does what the title says. Use at your own risk and good luck copping some 1:1s. Feel free to contribute to this repo! :)

### How it works:
1. Read all the links in the text area into an array
2. Go through each element in the array
  1. If the link is a valid Taobao link, we convert it based on its type and push it to the valid links array
  2. Otherwise we push it to the invalid links array
3. Go through the elements in the valid and invalid links array and format them in HTML and push them to the DOM

### Information:
- `app.js` contains the code for converting checking and converting links
- `preparer.js` contains the code for reading in the textarea contents and writing objects out to the DOM
- `style.css` contains the material design styles with some responsive queries
