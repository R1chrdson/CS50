# Final project
## The Battleship Game with intelligent bot on Web
---
### Technology stack:

- HTML
- CSS
- JavaScript (jQuery, jQuery UI)
---
### Algorithm of bot
  The idea of algorithm inspired by this articles
  - https://habr.com/en/post/181151/
  - https://habr.com/en/post/82221/
  - https://habr.com/en/post/180995/
  
The most effective shots strategy is to destroy the biggest ship to open more empty cells.
<br>To find ship of length you need, fit this patterns or its inversion (horizontally, vertically) to whole field.
<br><img src="https://drive.google.com/uc?export=view&id=1VujqZKvGurcaBnvGo2vMvsRWrOz81qHx" width="350">
<br>For example we can find 4-th size ship at least in 24 turns
<br><img src="https://drive.google.com/uc?export=view&id=1QXlDdrDo9rD7O792jDb54gunJ5ovYhWd" width="400">
