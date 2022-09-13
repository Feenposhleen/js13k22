# Rise!

This game is a submission to the js13k competition, and lets you play as a buried skeleton that tries to dig its way up to the necromancer that awoke you. It's inspired by the classic horror trope of a zombie raising its hand through the dirt at a cemetary.

### Tech

The game renders vector sprites onto a 2D canvas. The sprite engine allows to connect behaviors to sprites (like an ultra light ECS). The most novel thing is the custom vector sprite format and the editor that allows you edit it (found in the /dev folder). The vector sprite format simply concatenates polygon point data and colors into a single array, to save space compared to using SVGs or similar.

### Bunding

Bundling and processing simply consists of concatenating all the .js files in `/src` (hence the naming of those), running the result through Closure Compiler, and then inserting the resulting code into the template file at the root of the project along with the CSS. The fina artifact is a single `index.html` that has everything built in. 
