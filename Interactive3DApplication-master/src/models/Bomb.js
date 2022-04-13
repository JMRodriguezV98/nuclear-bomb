var mesh;
var isEnabled = false;

//Assets Bomba
var texture = new THREE.TextureLoader().load("assets/textures/zuniga.jpg");
var geometry = new THREE.SphereGeometry(50,50,50);
var material = new THREE.MeshPhongMaterial( {
    color:0x6a6a6a, 
    map: this.texture
});
var bomba = new THREE.Mesh( geometry, material);
var Colition = false;
var isRemoved = true;

//Assets Explosiones
var explG = new THREE.BoxGeometry( 100, 100, 100 );
var explM = new THREE.MeshPhongMaterial({
    //color: 0xffd700, 
    map: new THREE.TextureLoader().load("assets/textures/flames.jpg"), 
    transparent:true
});
var expC = new THREE.Mesh(explG,explM);
var expUp = new THREE.Mesh(explG,explM);
var expLeft = new THREE.Mesh(explG,explM);
var expRight = new THREE.Mesh(explG,explM);
var expDown = new THREE.Mesh(explG,explM);
var expUpP = new THREE.Mesh(explG,explM);
var expLeftP = new THREE.Mesh(explG,explM);
var expRightP = new THREE.Mesh(explG,explM);
var expDownP = new THREE.Mesh(explG,explM);
expC.name = "fuego";
expUp.name = "fuego";
expLeft.name = "fuego";
expRight.name = "fuego";
expDown.name = "fuego";
expUpP.name = "fuego";
expLeftP.name = "fuego";
expRightP.name = "fuego";
expDownP.name = "fuego";

class Bomb {

    teclaBomba(tecla){
        var x, y, z = 0;
        var contBomb = 0;
        switch(tecla){
            case "1":
                this.mesh = players.p1;
                x = this.mesh.element.position.x;
                y = this.mesh.element.position.y;
                z = this.mesh.element.position.z;
                if(contBomb == 0){
                    contBomb = 1;
                    this.crearBomba(x,y,z);
                    if(isRemoved == false){
                        setTimeout(function(){
                            let classBomb = new Bomb(); 
                            classBomb.eliminarBomba(); 
                            isRemoved = true;
                            contBomb = 0;
                        }, 2000);            
                    }
                }
            break;
            case "2":
                this.mesh = players.p2;
                x = this.mesh.element.position.x;
                y = this.mesh.element.position.y;
                z = this.mesh.element.position.z;
                if(contBomb == 0){
                    contBomb = 1;
                    this.crearBomba(x,y,z);
                    if(isRemoved == false){
                        setTimeout(function(){
                            let classBomb = new Bomb(); 
                            classBomb.eliminarBomba(); 
                            isRemoved = true;
                            contBomb = 0;
                        }, 2000);            
                    }
                }
            break;
            case "3":
                this.mesh = players.p3;
                x = this.mesh.element.position.x;
                y = this.mesh.element.position.y;
                z = this.mesh.element.position.z;
                this.crearBomba(x,y,z);
            break;
            case "4":
                this.mesh = players.p4;
                x = this.mesh.element.position.x;
                y = this.mesh.element.position.y;
                z = this.mesh.element.position.z;
                this.crearBomba(x,y,z);
            break;
            // case "5":
                // this.mesh = players.p5;
                // x = this.mesh.element.position.x;
                // y = this.mesh.element.position.y;
                // z = this.mesh.element.position.z;
                // this.crearBomba(x,y,z);
            // break;
            // case "6":
            //     this.mesh = players.p6;
            // x = this.mesh.element.position.x;
                // y = this.mesh.element.position.y;
                // z = this.mesh.element.position.z;
                // this.crearBomba(x,y,z);
            // break;
            // case "7":
            //     this.mesh = players.p7;
            // x = this.mesh.element.position.x;
                // y = this.mesh.element.position.y;
                // z = this.mesh.element.position.z;
                // this.crearBomba(x,y,z);
            // break;
            // case "8":
            //     this.mesh = players.p8;
            // x = this.mesh.element.position.x;
                // y = this.mesh.element.position.y;
                // z = this.mesh.element.position.z;
                // this.crearBomba(x,y,z);
            // break;
        }
    }

    crearBomba(posX,posY,posZ){
        collidableList.push(bomba);
        if(isRemoved == true){
            bomba.position.set(posX,posY,posZ);   
            scene.add(bomba);
            isRemoved = false;
        }else{
            console.log('La variable isRemoved esta seteada en ' + isRemoved);
        }
    }

    eliminarBomba(){
        scene.remove(bomba);
        collidableList.pop();
        this.radioExplosion();
        this.sonidoBomba();
    }

    radioExplosion(){
        Colition = true;
        collidableList.push(expC,expUp,expDown,expLeft,expRight,expUpP,expDownP,expLeftP,expRightP);
        //Posicion de explosiones
        expC.position.set(bomba.position.x,bomba.position.y,bomba.position.z);
        expUp.position.set(bomba.position.x-90,bomba.position.y,bomba.position.z);
        expUpP.position.set(bomba.position.x-180,bomba.position.y,bomba.position.z);
        expLeft.position.set(bomba.position.x,bomba.position.y,bomba.position.z+90);
        expLeftP.position.set(bomba.position.x,bomba.position.y,bomba.position.z+180);
        expRight.position.set(bomba.position.x,bomba.position.y,bomba.position.z-90);
        expRightP.position.set(bomba.position.x,bomba.position.y,bomba.position.z-180);
        expDown.position.set(bomba.position.x+90,bomba.position.y,bomba.position.z);
        expDownP.position.set(bomba.position.x+180,bomba.position.y,bomba.position.z);

        scene.add(expC,expUp,expLeft,expRight,expDown,expUpP,expDownP,expLeftP,expRightP);
        setTimeout(function(){
            scene.remove(expC,expUp,expLeft,expRight,expDown,expUpP,expDownP,expLeftP,expRightP);
            if(Colition == true ){
                for (let i = 0; i < 9; i++) {
                    setTimeout(function(){ collidableList.pop(); }, 1);
                    Colition = false;
                }
            } 
        }, 2000);
    }

    sonidoBomba(){
        var listener = new THREE.AudioListener();
        scene.add(listener);
        var sound = new THREE.Audio( listener );
        var audioLoader = new THREE.AudioLoader();
        audioLoader.load( './assets/songs/explode.mp3', function( buffer ) {
        sound.setBuffer( buffer );
        sound.setVolume( 0.3 );
        sound.play();
    });
    }
}