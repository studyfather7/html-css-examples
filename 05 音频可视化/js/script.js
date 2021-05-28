function Musicvisualizer(obj){
	this.source = null;
	this.count = 0;

	this.analyser = Musicvisualizer.ac.createAnalyser();
	this.size = obj.size;
	this.analyser.fftSize = this.size * 2;

	// GainNode用来控制音频的音量
	this.gainNode = Musicvisualizer.ac[Musicvisualizer.ac.createGain?"createGain":"createGainNode"]();
	// 对象调用对象可以用obj.method，也可以obj[method]
	this.gainNode.connect(Musicvisualizer.ac.destination);

	this.analyser.connect(this.gainNode);

	this.xhr = new XMLHttpRequest();
	this.draw = obj.draw;
	this.visualize();
}

Musicvisualizer.ac = new (window.AudioContext || window.webkitAudioContext)();//共用的

Musicvisualizer.prototype.load = function(url, fun) {
    this.xhr.abort();
    this.xhr.open("GET", url);
    this.xhr.responseType = "arraybuffer";
    var self = this;
    this.xhr.onload = function() {
        fun(self.xhr.response);
    }
    this.xhr.send();
}

Musicvisualizer.prototype.decode = function(arraybuffer, fun) {
    Musicvisualizer.ac.decodeAudioData(arraybuffer, function(buffer) {
        fun(buffer);
    }, function(err) {
        console.log(err);
    })
}

Musicvisualizer.prototype.play = function(path) {
    var n = ++this.count;
    var self = this;
    self.source && self.source[self.source.stop ? "stop" : "noteOff"]();
    if (path instanceof ArrayBuffer) {
        self.decode(path, function(buffer) {
            if (n != self.count) return;
            var bufferSource = Musicvisualizer.ac.createBufferSource();
            bufferSource.buffer = buffer;
            bufferSource.loop = true;
            bufferSource.connect(self.analyser);
            bufferSource[bufferSource.start ? "start" : "noteOn"](0);
            self.source = bufferSource;

        });
    } else {
        self.load(path, function(arraybuffer) {
            if (n != self.count) return;
            self.decode(arraybuffer, function(buffer) {
                if (n != self.count) return;
                var bufferSource = Musicvisualizer.ac.createBufferSource();
                bufferSource.buffer = buffer;
                bufferSource.connect(self.analyser);
                bufferSource[bufferSource.start ? "start": "noteOn"](0);
                self.source = bufferSource;
            });
        });
    }
}



Musicvisualizer.prototype.changeVolumn = function(percent) {
    this.gainNode.gain.value = percent * percent;
}

Musicvisualizer.prototype.visualize = function() {
    var self = this;
    var arr = new Uint8Array(self.analyser.frequencyBinCount);
    requestAnimationFrame = window.requestAnimationFrame ||
                        window.webkitrequestAnimationFrame ||
                        window.mozrequestAnimationFrame;
    function fn() {
        self.analyser.getByteFrequencyData(arr);
        self.draw(arr);
        requestAnimationFrame(fn);
    }
    requestAnimationFrame(fn);
}