function $(s) {
    return document.querySelector(s);
}




var mv = new Musicvisualizer({
	size: 128,
	draw: draw
});


function draw(arr){

}


$("#load-file").onchange = function(){
	var file = this.files[0];
	var fr = new FileReader();

	fr.onload = function(e) {
        console.log(e);
		mv.play(e.target.result);
	}
	fr.readAsArrayBuffer(file);
}
