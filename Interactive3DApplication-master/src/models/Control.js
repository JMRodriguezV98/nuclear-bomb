var contBomb = 0;

function reproducir(){
    var listener = new THREE.AudioListener();
    scene.add(listener);
    var sound = new THREE.Audio(listener);
var audioLoader = new THREE.AudioLoader();
audioLoader.load('./assets/songs/Jumping.wav',function( buffer ){
    sound.setBuffer( buffer );
    sound.setVolume( 0.3 );
    sound.play();
});
}

class Control {
    //myControl = new Control("w","d","s","a");
    constructor(up, right, down, left, jump, bomb) {
        this.initControls();
        this.up = up || "w";
        this.right = right || "d";
        this.down = down || "s";
        this.left = left || "a";
        this.jump = jump || " ";
        this.bomb = bomb || "1";
        
        this.isInAir, this.isFalling, this.isJumping = false;

        this.element = null;

        this.initListeners();
    }

    set up(key) {
        this._up.key = key;
    }

    get up() {
        return this._up.key;
    }

    set right(key) {
        this._right.key = key;
    }

    get right() {
        return this._right.key;
    }

    set down(key) {
        this._down.key = key;
    }

    get down() {
        return this._down.key;
    }

    set left(key) {
        this._left.key = key;
    }

    get left() {
        return this._left.key;
    }

    set jump(key) {
        this._jump.key = key;
    }

    get jump() {
        return this._jump.key;
    }
    set bomb(key) {
        this._bomb.key = key;
    }

    get bomb() {
        return this._bomb.key;
    }

    initControls() {
        this._up = { key: "", isPressed: false };
        this._right = { key: "", isPressed: false };
        this._down = { key: "", isPressed: false };
        this._left = { key: "", isPressed: false };
        this._jump = { key: "", isPressed: false };
        this._bomb = { key: "", isPressed: false };
    }

    initListeners() {


    }
    
    update(vx,vy,m,jf) {
        this.vx = vx;
        this.vy = vy;
        this.m = m;
        this.jumpForce = jf;

        if (this._up.isPressed) {
            this.element.position.z += this.vx;
        }
        if (this._right.isPressed) {
            this.element.position.x -= this.vx;
        }
        if (this._down.isPressed) {
            this.element.position.z -= this.vx;
        }
        if (this._left.isPressed) {
            this.element.position.x += this.vx;
        }
    }
    

    pressUp() {
        this._up.isPressed = true;
    }
    pressRight() {
        this._right.isPressed = true;
    }
    pressDown() {
        this._down.isPressed = true;
    }
    pressLeft() {
        this._left.isPressed = true;
    }
    pressJump() {
        this._jump.isPressed = true;
        if(this.element.visible == true){
            if (this._jump.isPressed) {
                if(!this.isJumping && !this.isInAir){
                    this.isJumping = true;
                    this.element.position.y += this.jumpForce;
                    reproducir();
                }
            }
        }
    }
    pressBomb() {
        this._bomb.isPressed = true;
        let classBomb = new Bomb();  
        if(this.element.visible == true){
            classBomb.teclaBomba(this.bomb);
        }
    }
    
    
    releaseUp() {
        this._up.isPressed = false;
    }
    releaseRight() {
        this._right.isPressed = false;
    }
    releaseDown() {
        this._down.isPressed = false;
    }
    releaseLeft() {
        this._left.isPressed = false;
    }
    releaseJump() {
        this._jump.isPressed = false;
    }
    releaseBomb() {
        this._bomb.isPressed = false;
    }

}


document.onkeydown = (e) => {
    sound1.play();

    for (let i = 0; i < Object.keys(players).length; i++) {
        let key = Object.keys(players)[i];
        if (players[key] == null) { return false; }
        let elControl = players[key]["control"];
       // console.log(`Tecla presionada: ${e.key} Tecla space de este jugador ${elControl.space}`)
        switch (e.key) {
            case elControl.up:
                elControl.pressUp();
                break;
            case elControl.right:
                elControl.pressRight();
                break;
            case elControl.down:
                elControl.pressDown();
                break;
            case elControl.left:
                elControl.pressLeft();
                break;
            case elControl.jump:
                elControl.pressJump();
                break;
            case elControl.bomb:
                elControl.pressBomb();
                break;
        }

    }
}

document.onkeyup = (e) => {
    //console.log(Object.keys(players));
    for (let i = 0; i < Object.keys(players).length; i++) {

        let key = Object.keys(players)[i];
        if (players[key] == null) { return false; }
        let elControl = players[key]["control"];

        switch (e.key) {
            case elControl.up:
                elControl.releaseUp();
                break;
            case elControl.right:
                elControl.releaseRight();
                break;
            case elControl.down:
                elControl.releaseDown();
                break;
            case elControl.left:
                elControl.releaseLeft();
                break;
            case elControl.jump:
                elControl.releaseJump();
                break;
            case elControl.bomb:
                elControl.releaseBomb();
                break;
        }
    }
}