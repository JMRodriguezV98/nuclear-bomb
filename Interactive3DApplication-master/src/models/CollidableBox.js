var fg = 0.4;

function sonidoCaida(){
    var listener = new THREE.AudioListener();
    scene.add(listener);
    var sound = new THREE.Audio( listener );
    var audioLoader = new THREE.AudioLoader();
    audioLoader.load( './assets/songs/caida.mp3', function( buffer ) {
    sound.setBuffer( buffer );
    sound.setVolume( 0.3 );
    sound.play();
});
}

class CollidableBox {
    constructor(mesh, boundingRadius) {
        this.mesh = mesh;
        this.collidableRadius = boundingRadius;
        this.isFalling = { state: false, acc: 0 };
    }

    collide(normal, callback, verticalColliding = false) {
        let collidableRay = new THREE.Raycaster();
        collidableRay.ray.direction.set(normal.x, normal.y, normal.z);

        let origin = this.mesh.position.clone();
        collidableRay.ray.origin.copy(origin);

        let intersections = collidableRay.intersectObjects(collidableList);

        if(verticalColliding){
            if (intersections.length > 0) {
                callback(intersections);
            }else{
                this.isFalling.state = true;
                this.isFalling.acc += 1;
                this.mesh.position.y -= 1 * this.isFalling.acc;
            }
        }else{
            if (intersections.length > 0) {
                let distance = intersections[0].distance;
                if (distance <= this.collidableRadius - 10) {
                    callback();
                }
            }
        }
        
    }
    collideFront(controls) {
        let callback = () => {
            //console.log("colliding front");
            this.mesh.position.x += controls.vx;
			for (let i = 0; i < collidableList.length; i++) {
                if(collidableList[i].name == "fuego"){
                    scene.remove(this.mesh);
                    this.mesh.visible = false;
                }
            }
        }
        this.collide({ x: -1, y: 0, z: 0 }, callback);
    }

    collideBack(controls) {
        let callback = () => {
            //console.log("colliding back");
            this.mesh.position.x -= controls.vx;
			for (let i = 0; i < collidableList.length; i++) {
                if(collidableList[i].name == "fuego"){
                    scene.remove(this.mesh);
                    this.mesh.visible = false;
                }
            }
        }
        this.collide({ x: 1, y: 0, z: 0 }, callback);
    }

    collideLeft(controls) {
        let callback = () => {
            this.mesh.position.z -= controls.vx;
			for (let i = 0; i < collidableList.length; i++) {
                if(collidableList[i].name == "fuego"){
                    scene.remove(this.mesh);
                    this.mesh.visible = false;
                }
            }
        }
        this.collide({ x: 0, y: 0, z: 1 }, callback);
    }

    collideRight(controls) {
        let callback = () => {
            this.mesh.position.z += controls.vx;
			for (let i = 0; i < collidableList.length; i++) {
                if(collidableList[i].name == "fuego"){
                    scene.remove(this.mesh);
                    this.mesh.visible = false;
                }
            }
        }
        this.collide({ x: 0, y: 0, z: -1 }, callback);
    }

    collideBottom(control) {

        let callback = (intersections) => {
            let distance = intersections[0].distance;
            //console.log(`distance: ${distance} CR: ${this.collidableRadius}`)
            if (distance > this.collidableRadius) { //inAir
                this.isFalling.state = true;
                this.isFalling.acc += 1;
                this.mesh.position.y -= 1 * this.isFalling.acc;
                control.isInAir = true;
                
            }
            if (distance <= this.collidableRadius + 1 ) { //over the floor
                //console.log("over the floor")
                control.isJumping = false;
                control.isInAir = false;
                this.isFalling.state = false;
                this.isFalling.acc = 0;
                if(distance <= this.collidableRadius){
                    this.mesh.position.y +=1;
                }
                switch (intersections[0].object.name) {
                    case "taforma":
                            powerup2.isInUse = true;
                            powerup2.position.y += 1;
                        break;
                    //     case "thanos":
                    //    this.mesh.material.color = new THREE.Color("0xffffff")
                    // break;
                    case "plata":
                            powerup21.isInUse = true;
                            powerup21.position.y += 1;
                            // scene.remove(powerup21);
                            // collidableList.pop();
                        break;
                    case "plataforma6":
                            powerup6.isInUse = true;
                            powerup6.position.y += 1;
                        break;
                    case "plataforma7":
                            powerup7.isInUse = true;
                            powerup7.position.y += 1;
                        break;
					case "fuego":  
                            scene.remove(this.mesh);
                            this.mesh.visible = false;
                        break;
                    case "muerte":  
                            scene.remove(this.mesh);
                            this.sonidoCaida();
                            this.mesh.visible = false;
                        break;
                }
            }else{
                powerup2.isInUse = false;
                powerup21.isInUse = false;
                powerup6.isInUse = false;
                powerup7.isInUse = false;
            }

        }
        this.collide({ x: 0, y: -1, z: 0 }, callback, true);
    }

    update(controls) {
        this.collideFront(controls);
        this.collideBack(controls);
        this.collideLeft(controls);
        this.collideRight(controls);
        this.collideBottom(controls);
    }
}