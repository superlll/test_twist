function genericGetRequest(URL, callback){
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (this.status == 200) {
            callback(JSON.parse(this.response));
        }
    };
    xhr.open("GET", URL);
    xhr.send();
};

var TextTwist = function() {
    var self = this;
    var words;
    var rack;
    var rackButtons;
    var guess;
    var wordsRemaining;
    var points=0;
    var earn = 0;
    var c_length;
    var lose_time = 10;
    
    this.showGuess = function() {
        document.getElementById('guess').textContent = this.guess;
    };
    
    this.finish = function() {
        document.getElementById('rack').innerHTML = '<h2 class = "you-won"> You won!</h2>';
        document.getElementById('div-guess').innerHTML = '';
    }
    
    this.lose = function(){
        document.getElementById('rack').innerHTML = '<h2 class ="you-lose"> You lost!</h2>';
        document.getElementById('div-guess').innerHTML = '';
    }
    
    this.reset = function() {
        this.guess = '';
        for (var i = 0; i < this.rackButtons.length; i++) {
            this.rackButtons[i].disabled = false;
        }
        this.showGuess();
    };
    
    this.check = function() {
        var length = this.words.length,
            found = false,
            msg;
           
        for (var i = 0; i < length; i++) {
            if (this.words[i] != null && this.guess == this.words[i]) {
                this.words[i] = null;
                found = true;
                c_length = this.guess.length;
                break;
            }
        }
        if (found) {
            
            if (c_length == 2) { earn = 1; points = points + earn;}
            if (c_length == 3) { earn = 3; points = points + earn;}
            if (c_length == 4) { earn = 5; points = points + earn;}
            if (c_length == 5) { earn = 8;points = points + earn;}
            if (c_length == 6) { earn = 11;points = points + earn;}
            if (c_length == 7) { earn = 15;points = points + earn;}
            msg = 'Genius! You Find A Word!';
            if (points >= 16) {
                this.finish();
                setTimeout(function(){
                    alert("Click here to replay the game");
                    window.history.go(0);
                },3000);
            }
            
            this.wordsRemaining--;
            document.getElementById('words-remaining').textContent = this.wordsRemaining;
        }
        else {
            msg = 'You Wrong! Try Again';
            lose_time --;
            if (lose_time == 0){
                this.lose();
                setTimeout(function(){
                    alert("Click here to replay the game");
                    window.history.go(0);
                },3000);
            }
            
        }
        document.getElementById('guess-result').textContent = msg;
        document.getElementById('get-points').textContent = points;
        this.reset();
    }
    
     this.play = function () {
        document.getElementById('div-guess').style.display = 'block';
        this.guess = '';
        for (var i = 0; i < this.rackButtons.length; i++) {
            this.rackButtons[i].addEventListener('click', function(){
                self.guess += this.getAttribute('data-letter');
                this.disabled = true;
                self.showGuess();
            });
        }
        document.getElementById('check-button').addEventListener('click', function(){
            self.check();
        });
    };
    
    this.processResult = function(res) {
        document.getElementById("start").style.display = 'none';
        self.words = res.words;
        self.wordsRemaining = res.words.length;
        document.getElementById('words-remaining').textContent = self.wordsRemaining;
        self.rack = res.letters;
        var letters = self.rack.split('');
        var html = '<h2 class = "your-rack">Your Rack:</h2>';
        for (var i = 0; i < letters.length; i++) {
            html += '<button class="rack-button" data-letter="' + letters[i] + '">' + letters[i] + '</button>';
        }
        document.getElementById("rack").innerHTML = html;
        self.rackButtons = document.querySelectorAll('.rack-button');
        self.play();
    };
    
     function init() {
        document.getElementById("start").addEventListener('click', function(){
            this.disabled = true;
            this.textContent = 'Loading...';
            genericGetRequest("Getword.php", self.processResult);
        });
    };
    
    init();
}

new TextTwist();