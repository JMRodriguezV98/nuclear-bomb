/**
 * GLOBAL VARS
 */
lastTime = Date.now();
cameras = {
    default: null,
    current: null
};
canvas = {
    element: null,
    container: null
}
labels = {}
cameraControl = null;
scene = null;
renderer = null

players = {
    p1: null,
    p2: null,
    p3: null,
    p4: null
}
collidableList = [];
collidableRomp = [];

/**
 * Function to start program running a
 * WebGL Application trouhg ThreeJS
 */
let webGLStart = () => {
    initScene();
    window.onresize = onWindowResize;
    lastTime = Date.now();
    animateScene();
    carga();

};

/**
 * Here we can setup all our scene noobsters
 */
function initScene() {
    //Selecting DOM Elements, the canvas and the parent element.
    canvas.container = document.querySelector("#app");
    canvas.element = canvas.container.querySelector("#appCanvas");

    /**
     * SETTING UP CORE THREEJS APP ELEMENTS (Scene, Cameras, Renderer)
     * */
    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({ canvas: canvas.element });
    renderer.setSize(canvas.container.clientWidth, canvas.container.clientHeight);
    renderer.setClearColor(0x000000, 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    canvas.container.appendChild(renderer.domElement);
    
    //positioning cameras
    cameras.default = new THREE.PerspectiveCamera(45, canvas.container.clientWidth / canvas.container.clientHeight, 0.1, 10000);
    cameras.default.position.set(2000,3800,2000);
    cameras.default.lookAt(new THREE.Vector3(0, 0, 0));

    //Setting up current default camera as current camera
    cameras.current = cameras.default;
    
    //Camera control Plugin
    cameraControl = new THREE.OrbitControls(cameras.current, renderer.domElement);

    lAmbiente = new THREE.AmbientLight(0xb5b5b5);
    scene.add(lAmbiente);

    //Luz Spotlight
	var spotLight = new THREE.SpotLight(0xff69b4,3.0, 1500.0, Math.PI/4,0.5,2.2);
	spotLight.position.set( 0, 600, 0 );
    spotLight.castShadow = true;
    spotLight.shadowDarkness = 1;
	scene.add(spotLight);
    scene.add(new THREE.PointLightHelper(spotLight, 1));

    //FPS monitor
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = stats.domElement.style.left = '10px';
	stats.domElement.style.zIndex = '100';
	document.body.appendChild(stats.domElement);

    //Init player with controls
    players.p1 = new Player("P1",null,new Control(),{label: false});
    spotLight.target = players.p1.element;

    players.p2 = new Player("P2",null,new Control("i","l","k","j","o","2"),{label: true});
    players.p2.play(scene);

   // players.p3 = new Player("P3",null,new Control("t","h","g","f"),{label: false});
   // players.p3.play(scene);

   
    initObjects();
}

/**
 * Function to add all objects and stuff to scene
 */
function initObjects(){

    fondotexture= new THREE.TextureLoader().load("./assets/images/appbackground.jpg",
    function(texturee){
        var img= texturee.image;
        bgWidth=img.width;
        bgHeight=img.height;
    }
        );
        scene.background=fondotexture;
        fondotexture.wrapS=THREE.MirroredRepeatWrapping;
        fondotexture.wrapT=THREE.MirroredRepeatWrapping;
        scene.add(fondotexture);
    sound1 = new Sound(["./assets/songs/1.mp3"],10,scene,{
        debug:true,
        position: {x:500,y:0,z:500}
    });

    sound2 = new Sound(["./assets/songs/2.mp3"],10,scene,{
        debug:true,
        position: {x:-500,y:0,z:-500}
    });
    
    //Planomuerte
    var planomuerte = new THREE.Mesh(
		new THREE.CubeGeometry(3000,1,3000),
		new THREE.MeshPhongMaterial( {color:0x6a6a6a})
    );
    planomuerte.position.set(0,-2000,0);
    planomuerte.visible = false;
    planomuerte.name = "muerte";
    scene.add(planomuerte);
    
    //-------------------------------------------------------------
    //Lista de objetos creados en el mapa con sus texturas
    //-------------------------------------------------------------
	//Suelo
	var plano = new THREE.Mesh(
		new THREE.CubeGeometry(3000,1,3000),
		new THREE.MeshPhongMaterial( {color:0x6a6a6a,map: new THREE.TextureLoader().load("assets/textures/textura3.png")})
    );
	plano.material.map.repeat.set(60,60);
	plano.material.map.wrapS = plano.material.map.wrapT = THREE.MirroredRepeatWrapping;
	plano.receiveShadow = true;
	plano.position.set(0,-1,0);
    scene.add(plano);

    //-------------------------------------------------------------
    //Cuadro
    //-------------------------------------------------------------
    var caja = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    caja.material.map.wrapS = caja.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja.receiveShadow = true;
    caja.position.set(1400,45,-1400);
    scene.add(caja);


    //--------------------------------------------------------------
    //
    //--------------------------------------------------------------
    var caja1 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    caja1.material.map.wrapS = caja1.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja1.receiveShadow = true;
    caja1.position.set(1400,45,1400);
    scene.add(caja1);

    //--------------------------------------------------------------
    //
    //--------------------------------------------------------------
    var caja2 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    caja2.material.map.wrapS = caja2.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja2.receiveShadow = true;
    caja2.position.set(-1400,45,1400);
    scene.add(caja2);

    //--------------------------------------------------------------
    //
    //--------------------------------------------------------------
    var caja3 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    caja3.material.map.wrapS = caja3.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja3.receiveShadow = true;
    caja3.position.set(-1400,45,-1400);
    scene.add(caja3);
    //--------------------------------------------------------------
    //CAJA SEGUNDO NIVEL
    //--------------------------------------------------------------
    // var caja4 = new THREE.Mesh(
    //     new THREE.BoxGeometry(50,50,50),
    //     new THREE.MeshBasicMaterial({
    //         map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    //     })
    // );
    // caja4.material.map.wrapS = caja4.material.map.wrapT = THREE.MirroredRepeatWrapping;
    // caja4.receiveShadow = true;
    // caja4.position.set(0,340,0);
    // scene.add(caja4);
    //--------------------------------------------------------------
    //CAJAS DE MADERA
    //--------------------------------------------------------------
    var caja5 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja5.material.map.wrapS = caja5.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja5.receiveShadow = true;
    caja5.position.set(1350,45,1350);
    scene.add(caja5);
    //--------------------------------------------------------------
    //
    //--------------------------------------------------------------
    var caja6 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja6.material.map.wrapS = caja6.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja6.receiveShadow = true;
    caja6.position.set(1400,45,1350);
    scene.add(caja6);
    //--------------------------------------------------------------
    //
    //--------------------------------------------------------------
    var caja7 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja7.material.map.wrapS = caja7.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja7.receiveShadow = true;
    caja7.position.set(1350,45,1300);
    scene.add(caja7);
    //--------------------------------------------------------------
    //
    //--------------------------------------------------------------
    var caja8 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja8.material.map.wrapS = caja8.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja8.receiveShadow = true;
    caja8.position.set(1300,45,1350);
    scene.add(caja8);
    //--------------------------------------------------------------
    //
    //--------------------------------------------------------------
    var caja9 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja9.material.map.wrapS = caja9.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja9.receiveShadow = true;
    caja9.position.set(1300,45,1300);
    scene.add(caja9);
    //--------------------------------------------------------------
    //
    //--------------------------------------------------------------
    var caja10 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja10.material.map.wrapS = caja10.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja10.receiveShadow = true;
    caja10.position.set(1300,45,1250);
    scene.add(caja10);
    //--------------------------------------------------------------
    //
    //--------------------------------------------------------------
    var caja11 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja11.material.map.wrapS = caja11.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja11.receiveShadow = true;
    caja11.position.set(1250,45,1350);
    scene.add(caja11);
    //--------------------------------------------------------------
    //
    //--------------------------------------------------------------
    var caja12 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja12.material.map.wrapS = caja12.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja12.receiveShadow = true;
    caja12.position.set(1250,45,1400);
    scene.add(caja12);
    //--------------------------------------------------------------
    //
    //--------------------------------------------------------------
    var caja13 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja13.material.map.wrapS = caja13.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja13.receiveShadow = true;
    caja13.position.set(1200,45,1400);
    scene.add(caja13);
    //--------------------------------------------------------------
    //
    //--------------------------------------------------------------
    var caja14 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja14.material.map.wrapS = caja14.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja14.receiveShadow = true;
    caja14.position.set(1200,45,1350);
    scene.add(caja14);
    //--------------------------------------------------------------
    //
    //--------------------------------------------------------------
    var caja15 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja15.material.map.wrapS = caja15.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja15.receiveShadow = true;
    caja15.position.set(1200,45,1450);
    scene.add(caja15);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja16 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja16.material.map.wrapS = caja16.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja16.receiveShadow = true;
    caja16.position.set(1250,45,1450);
    scene.add(caja16);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja17 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja17.material.map.wrapS = caja17.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja17.receiveShadow = true;
    caja17.position.set(1400,45,1250);
    scene.add(caja17);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja18 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja18.material.map.wrapS = caja18.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja18.receiveShadow = true;
    caja18.position.set(1400,45,1200);
    scene.add(caja18);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja19 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja19.material.map.wrapS = caja19.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja19.receiveShadow = true;
    caja19.position.set(1450,45,1200);
    scene.add(caja19);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja20 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja20.material.map.wrapS = caja20.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja20.receiveShadow = true;
    caja20.position.set(1450,45,1200);
    scene.add(caja20);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja21 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja21.material.map.wrapS = caja21.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja21.receiveShadow = true;
    caja21.position.set(1450,45,1200);
    scene.add(caja21);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja22 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja22.material.map.wrapS = caja22.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja22.receiveShadow = true;
    caja22.position.set(1450,45,1100);
    scene.add(caja22);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja23 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja23.material.map.wrapS = caja23.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja23.receiveShadow = true;
    caja23.position.set(1450,45,1050);
    scene.add(caja23);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja24 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja24.material.map.wrapS = caja24.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja24.receiveShadow = true;
    caja24.position.set(1100,45,1450);
    scene.add(caja24);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja25 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja25.material.map.wrapS = caja25.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja25.receiveShadow = true;
    caja25.position.set(1050,45,1450);
    scene.add(caja25);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja26 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja26.material.map.wrapS = caja26.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja26.receiveShadow = true;
    caja26.position.set(1200,45,1200);
    scene.add(caja26);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja27 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja27.material.map.wrapS = caja27.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja27.receiveShadow = true;
    caja27.position.set(1100,45,1100);
    scene.add(caja27);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja28 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja28.material.map.wrapS = caja28.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja28.receiveShadow = true;
    caja28.position.set(1050,45,1050);
    scene.add(caja28);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja29 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja29.material.map.wrapS = caja29.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja29.receiveShadow = true;
    caja29.position.set(900,45,900);
    scene.add(caja29);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja30 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja30.material.map.wrapS = caja30.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja30.receiveShadow = true;
    caja30.position.set(750,45,750);
    scene.add(caja30);
    //--------------------------------------------------------------
    //CAJAS DE MADERA
    //--------------------------------------------------------------
    var caja31 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja31.material.map.wrapS = caja31.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja31.receiveShadow = true;
    caja31.position.set(-1350,45,-1400);
    scene.add(caja31);
    //--------------------------------------------------------------
    //
    //--------------------------------------------------------------
    var caja32 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja32.material.map.wrapS = caja32.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja32.receiveShadow = true;
    caja32.position.set(-1300,45,-1350);
    scene.add(caja32);
    //--------------------------------------------------------------
    //
    //--------------------------------------------------------------
    var caja33 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja33.material.map.wrapS = caja33.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja33.receiveShadow = true;
    caja33.position.set(-1350,45,-1300);
    scene.add(caja33);
    //--------------------------------------------------------------
    //
    //--------------------------------------------------------------
    var caja34 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja34.material.map.wrapS = caja34.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja34.receiveShadow = true;
    caja34.position.set(-1300,45,-1350);
    scene.add(caja8);
    //--------------------------------------------------------------
    //
    //--------------------------------------------------------------
    var caja35 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja35.material.map.wrapS = caja35.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja35.receiveShadow = true;
    caja35.position.set(-1300,45,-1300);
    scene.add(caja35);
    //--------------------------------------------------------------
    //
    //--------------------------------------------------------------
    var caja36 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja36.material.map.wrapS = caja10.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja36.receiveShadow = true;
    caja36.position.set(-1300,45,-1250);
    scene.add(caja36);
    //--------------------------------------------------------------
    //
    //--------------------------------------------------------------
    var caja37 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja37.material.map.wrapS = caja37.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja37.receiveShadow = true;
    caja37.position.set(-1250,45,-1350);
    scene.add(caja37);
    //--------------------------------------------------------------
    //
    //--------------------------------------------------------------
    var caja38 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja38.material.map.wrapS = caja38.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja38.receiveShadow = true;
    caja38.position.set(-1250,45,-1400);
    scene.add(caja38);
    //--------------------------------------------------------------
    //
    //--------------------------------------------------------------
    var caja39 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja39.material.map.wrapS = caja39.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja39.receiveShadow = true;
    caja39.position.set(-1200,45,-1400);
    scene.add(caja39);
    //--------------------------------------------------------------
    //
    //--------------------------------------------------------------
    var caja40 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja40.material.map.wrapS = caja40.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja40.receiveShadow = true;
    caja40.position.set(-1200,45,-1350);
    scene.add(caja40);
    //--------------------------------------------------------------
    //
    //--------------------------------------------------------------
    var caja41 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja41.material.map.wrapS = caja41.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja41.receiveShadow = true;
    caja41.position.set(-1200,45,-1450);
    scene.add(caja41);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja42 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja42.material.map.wrapS = caja16.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja42.receiveShadow = true;
    caja42.position.set(-1250,45,-1450);
    scene.add(caja42);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja43 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja43.material.map.wrapS = caja43.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja43.receiveShadow = true;
    caja43.position.set(-1400,45,-1250);
    scene.add(caja43);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja44 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja44.material.map.wrapS = caja44.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja44.receiveShadow = true;
    caja44.position.set(-1400,45,-1200);
    scene.add(caja44);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja45 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja45.material.map.wrapS = caja45.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja45.receiveShadow = true;
    caja45.position.set(-1450,45,-1200);
    scene.add(caja45);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja46 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja46.material.map.wrapS = caja46.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja46.receiveShadow = true;
    caja46.position.set(-1450,45,-1200);
    scene.add(caja46);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja47 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja47.material.map.wrapS = caja47.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja47.receiveShadow = true;
    caja47.position.set(-1450,45,-1200);
    scene.add(caja47);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja48 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja48.material.map.wrapS = caja48.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja48.receiveShadow = true;
    caja48.position.set(-1450,45,-1100);
    scene.add(caja48);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja49 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja49.material.map.wrapS = caja49.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja49.receiveShadow = true;
    caja49.position.set(-1450,45,-1050);
    scene.add(caja49);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja50 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja50.material.map.wrapS = caja50.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja50.receiveShadow = true;
    caja50.position.set(-1100,45,-1450);
    scene.add(caja50);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja51 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja51.material.map.wrapS = caja51.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja51.receiveShadow = true;
    caja51.position.set(-1050,45,-1450);
    scene.add(caja51);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja52 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja52.material.map.wrapS = caja52.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja52.receiveShadow = true;
    caja52.position.set(-1200,45,-1200);
    scene.add(caja52);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja53 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja53.material.map.wrapS = caja53.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja53.receiveShadow = true;
    caja53.position.set(-1100,45,-1100);
    scene.add(caja53);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja54 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja54.material.map.wrapS = caja54.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja54.receiveShadow = true;
    caja54.position.set(-1050,45,-1050);
    scene.add(caja54);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja55 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja55.material.map.wrapS = caja29.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja55.receiveShadow = true;
    caja55.position.set(-900,45,-900);
    scene.add(caja55);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja56 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja56.material.map.wrapS = caja56.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja56.receiveShadow = true;
    caja56.position.set(-750,45,-750);
    caja56.name = "roto1"
    scene.add(caja56);
    //--------------------------------------------------------------
    //CAJAS DE MADERA
    //--------------------------------------------------------------
    var caja57 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja57.material.map.wrapS = caja57.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja57.receiveShadow = true;
    caja57.position.set(-1350,45,1350);
    scene.add(caja57);
    //--------------------------------------------------------------
    //
    //--------------------------------------------------------------
    var caja58 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja58.material.map.wrapS = caja58.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja58.receiveShadow = true;
    caja58.position.set(-1400,45,1350);
    scene.add(caja58);
    //--------------------------------------------------------------
    //
    //--------------------------------------------------------------
    var caja59 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja59.material.map.wrapS = caja59.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja59.receiveShadow = true;
    caja59.position.set(-1350,45,1300);
    scene.add(caja59);
    //--------------------------------------------------------------
    //
    //--------------------------------------------------------------
    var caja60 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja60.material.map.wrapS = caja60.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja60.receiveShadow = true;
    caja60.position.set(-1300,45,1350);
    scene.add(caja60);
    //--------------------------------------------------------------
    //
    //--------------------------------------------------------------
    var caja61 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja61.material.map.wrapS = caja61.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja61.receiveShadow = true;
    caja61.position.set(-1300,45,1300);
    scene.add(caja61);
    //--------------------------------------------------------------
    //
    //--------------------------------------------------------------
    var caja62 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja62.material.map.wrapS = caja62.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja62.receiveShadow = true;
    caja62.position.set(-1300,45,1250);
    scene.add(caja62);
    //--------------------------------------------------------------
    //
    //--------------------------------------------------------------
    var caja63 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja63.material.map.wrapS = caja63.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja63.receiveShadow = true;
    caja63.position.set(-1250,45,1350);
    scene.add(caja63);
    //--------------------------------------------------------------
    //
    //--------------------------------------------------------------
    var caja64 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja64.material.map.wrapS = caja64.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja64.receiveShadow = true;
    caja64.position.set(-1250,45,1400);
    scene.add(caja64);
    //--------------------------------------------------------------
    //
    //--------------------------------------------------------------
    var caja65 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja65.material.map.wrapS = caja65.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja65.receiveShadow = true;
    caja65.position.set(-1200,45,1400);
    scene.add(caja65);
    //--------------------------------------------------------------
    //
    //--------------------------------------------------------------
    var caja66 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja66.material.map.wrapS = caja66.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja66.receiveShadow = true;
    caja66.position.set(-1200,45,1350);
    scene.add(caja66);
    //--------------------------------------------------------------
    //
    //--------------------------------------------------------------
    var caja67 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja67.material.map.wrapS = caja67.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja67.receiveShadow = true;
    caja67.position.set(-1200,45,1450);
    scene.add(caja67);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja68 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja68.material.map.wrapS = caja68.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja68.receiveShadow = true;
    caja68.position.set(-1250,45,1450);
    scene.add(caja68);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja69 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja69.material.map.wrapS = caja69.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja69.receiveShadow = true;
    caja69.position.set(-1400,45,1250);
    scene.add(caja69);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja70 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja70.material.map.wrapS = caja70.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja70.receiveShadow = true;
    caja70.position.set(-1400,45,1200);
    scene.add(caja70);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja71 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja71.material.map.wrapS = caja71.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja71.receiveShadow = true;
    caja71.position.set(-1450,45,1200);
    scene.add(caja71);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja72 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja72.material.map.wrapS = caja72.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja72.receiveShadow = true;
    caja72.position.set(-1450,45,1200);
    scene.add(caja72);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja73 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja73.material.map.wrapS = caja73.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja73.receiveShadow = true;
    caja73.position.set(-1450,45,1200);
    scene.add(caja73);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja74 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja74.material.map.wrapS = caja74.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja74.receiveShadow = true;
    caja74.position.set(-1450,45,1100);
    scene.add(caja74);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja75 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja75.material.map.wrapS = caja75.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja75.receiveShadow = true;
    caja75.position.set(-1450,45,1050);
    scene.add(caja75);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja76 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja76.material.map.wrapS = caja76.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja76.receiveShadow = true;
    caja76.position.set(-1100,45,1450);
    scene.add(caja76);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja77 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja77.material.map.wrapS = caja77.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja77.receiveShadow = true;
    caja77.position.set(-1050,45,1450);
    scene.add(caja77);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja78 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja78.material.map.wrapS = caja78.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja78.receiveShadow = true;
    caja78.position.set(-1200,45,1200);
    scene.add(caja78);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja79 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja79.material.map.wrapS = caja79.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja79.receiveShadow = true;
    caja79.position.set(-1100,45,1100);
    scene.add(caja79);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja80 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja80.material.map.wrapS = caja80.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja80.receiveShadow = true;
    caja80.position.set(-1050,45,1050);
    scene.add(caja80);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja81 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja81.material.map.wrapS = caja81.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja81.receiveShadow = true;
    caja81.position.set(-900,45,900);
    scene.add(caja81);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja82 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja82.material.map.wrapS = caja82.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja82.receiveShadow = true;
    caja82.position.set(-750,45,750);
    scene.add(caja82);
    //--------------------------------------------------------------
    //CAJAS DE MADERA
    //--------------------------------------------------------------
    var caja83 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja83.material.map.wrapS = caja83.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja83.receiveShadow = true;
    caja83.position.set(1350,45,-1350);
    scene.add(caja83);
    //--------------------------------------------------------------
    //
    //--------------------------------------------------------------
    var caja84 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja84.material.map.wrapS = caja84.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja84.receiveShadow = true;
    caja84.position.set(1400,45,-1350);
    scene.add(caja84);
    //--------------------------------------------------------------
    //
    //--------------------------------------------------------------
    var caja85 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja85.material.map.wrapS = caja85.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja85.receiveShadow = true;
    caja85.position.set(1350,45,-1300);
    scene.add(caja85);
    //--------------------------------------------------------------
    //
    //--------------------------------------------------------------
    var caja86 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja86.material.map.wrapS = caja86.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja86.receiveShadow = true;
    caja86.position.set(1300,45,-1350);
    scene.add(caja86);
    //--------------------------------------------------------------
    //
    //--------------------------------------------------------------
    var caja87 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja87.material.map.wrapS = caja87.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja87.receiveShadow = true;
    caja87.position.set(1300,45,-1300);
    scene.add(caja87);
    //--------------------------------------------------------------
    //
    //--------------------------------------------------------------
    var caja88 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja88.material.map.wrapS = caja88.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja88.receiveShadow = true;
    caja88.position.set(1300,45,-1250);
    scene.add(caja88);
    //--------------------------------------------------------------
    //
    //--------------------------------------------------------------
    var caja89 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja89.material.map.wrapS = caja89.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja89.receiveShadow = true;
    caja89.position.set(1250,45,-1350);
    scene.add(caja89);
    //--------------------------------------------------------------
    //
    //--------------------------------------------------------------
    var caja90 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja90.material.map.wrapS = caja90.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja90.receiveShadow = true;
    caja90.position.set(1250,45,-1400);
    scene.add(caja90);
    //--------------------------------------------------------------
    //
    //--------------------------------------------------------------
    var caja91 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja91.material.map.wrapS = caja91.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja91.receiveShadow = true;
    caja91.position.set(1200,45,-1400);
    scene.add(caja91);
    //--------------------------------------------------------------
    //
    //--------------------------------------------------------------
    var caja92 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja92.material.map.wrapS = caja92.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja92.receiveShadow = true;
    caja92.position.set(1200,45,-1350);
    scene.add(caja92);
    //--------------------------------------------------------------
    //
    //--------------------------------------------------------------
    var caja93 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja93.material.map.wrapS = caja93.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja93.receiveShadow = true;
    caja93.position.set(1200,45,-1450);
    scene.add(caja93);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja94 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja94.material.map.wrapS = caja94.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja94.receiveShadow = true;
    caja94.position.set(1250,45,-1450);
    scene.add(caja94);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja95 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja95.material.map.wrapS = caja95.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja95.receiveShadow = true;
    caja95.position.set(-1400,45,1250);
    scene.add(caja95);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja96 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja96.material.map.wrapS = caja96.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja96.receiveShadow = true;
    caja96.position.set(1400,45,-1200);
    scene.add(caja96);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja97 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja97.material.map.wrapS = caja97.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja97.receiveShadow = true;
    caja97.position.set(1450,45,-1200);
    scene.add(caja97);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja98 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja98.material.map.wrapS = caja98.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja98.receiveShadow = true;
    caja98.position.set(1450,45,-1200);
    scene.add(caja98);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja99 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja99.material.map.wrapS = caja99.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja99.receiveShadow = true;
    caja99.position.set(1450,45,-1200);
    scene.add(caja99);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja100 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja100.material.map.wrapS = caja100.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja100.receiveShadow = true;
    caja100.position.set(1450,45,-1100);
    scene.add(caja100);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja101 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja101.material.map.wrapS = caja101.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja101.receiveShadow = true;
    caja101.position.set(1450,45,-1050);
    scene.add(caja101);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja102 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja102.material.map.wrapS = caja102.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja102.receiveShadow = true;
    caja102.position.set(1100,45,-1450);
    scene.add(caja102);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja103 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja103.material.map.wrapS = caja103.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja103.receiveShadow = true;
    caja103.position.set(1050,45,-1450);
    scene.add(caja103);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja104 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja104.material.map.wrapS = caja104.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja104.receiveShadow = true;
    caja104.position.set(1200,45,-1200);
    scene.add(caja104);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja105 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja105.material.map.wrapS = caja105.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja105.receiveShadow = true;
    caja105.position.set(1100,45,-1100);
    scene.add(caja105);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja106 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja106.material.map.wrapS = caja106.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja106.receiveShadow = true;
    caja106.position.set(1050,45,-1050);
    scene.add(caja106);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja107 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja107.material.map.wrapS = caja107.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja107.receiveShadow = true;
    caja107.position.set(900,45,-900);
    scene.add(caja107);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var caja108 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    caja108.material.map.wrapS = caja108.material.map.wrapT = THREE.MirroredRepeatWrapping;
    caja108.receiveShadow = true;
    caja108.position.set(750,45,-750);
    scene.add(caja108);
    //-----------------------------------------------------------
    //CREAR INRROMPIBLES
    //-----------------------------------------------------------
    var muro1 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    muro1.material.map.wrapS = muro1.material.map.wrapT = THREE.MirroredRepeatWrapping;
    muro1.receiveShadow = true;
    muro1.position.set(1300,45,1400);
    scene.add(muro1);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var muro2 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    muro2.material.map.wrapS = muro2.material.map.wrapT = THREE.MirroredRepeatWrapping;
    muro2.receiveShadow = true;
    muro2.position.set(1400,45,1300);
    scene.add(muro2);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var muro3 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    muro3.material.map.wrapS = muro3.material.map.wrapT = THREE.MirroredRepeatWrapping;
    muro3.receiveShadow = true;
    muro3.position.set(1250,45,1250);
    scene.add(muro3);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var muro4 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    muro4.material.map.wrapS = muro4.material.map.wrapT = THREE.MirroredRepeatWrapping;
    muro4.receiveShadow = true;
    muro4.position.set(1350,45,1250);
    scene.add(muro4);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var muro5 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    muro5.material.map.wrapS = muro5.material.map.wrapT = THREE.MirroredRepeatWrapping;
    muro5.receiveShadow = true;
    muro5.position.set(1450,45,1150);
    scene.add(muro5);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var muro6 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    muro6.material.map.wrapS = muro6.material.map.wrapT = THREE.MirroredRepeatWrapping;
    muro6.receiveShadow = true;
    muro6.position.set(1150,45,1450);
    scene.add(muro6);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var muro7 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    muro7.material.map.wrapS = muro7.material.map.wrapT = THREE.MirroredRepeatWrapping;
    muro7.receiveShadow = true;
    muro7.position.set(1250,45,1300);
    scene.add(muro7);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var muro8 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    muro8.material.map.wrapS = muro8.material.map.wrapT = THREE.MirroredRepeatWrapping;
    muro8.receiveShadow = true;
    muro8.position.set(1150,45,1150);
    scene.add(muro8);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var muro9 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    muro9.material.map.wrapS = muro9.material.map.wrapT = THREE.MirroredRepeatWrapping;
    muro9.receiveShadow = true;
    muro9.position.set(1000,45,1000);
    scene.add(muro9);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var muro10 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    muro10.material.map.wrapS = muro10.material.map.wrapT = THREE.MirroredRepeatWrapping;
    muro10.receiveShadow = true;
    muro10.position.set(950,45,950);
    scene.add(muro10);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var muro11 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    muro11.material.map.wrapS = muro11.material.map.wrapT = THREE.MirroredRepeatWrapping;
    muro11.receiveShadow = true;
    muro11.position.set(850,45,850);
    scene.add(muro11);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var muro12 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    muro12.material.map.wrapS = muro12.material.map.wrapT = THREE.MirroredRepeatWrapping;
    muro12.receiveShadow = true;
    muro12.position.set(800,45,800);
    scene.add(muro12);
    //-----------------------------------------------------------
    //CREAR INRROMPIBLES
    //-----------------------------------------------------------
    var muro13 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    muro13.material.map.wrapS = muro13.material.map.wrapT = THREE.MirroredRepeatWrapping;
    muro13.receiveShadow = true;
    muro13.position.set(-1300,45,-1400);
    scene.add(muro13);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var muro14 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    muro14.material.map.wrapS = muro14.material.map.wrapT = THREE.MirroredRepeatWrapping;
    muro14.receiveShadow = true;
    muro14.position.set(-1400,45,-1300);
    scene.add(muro14);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var muro15 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    muro15.material.map.wrapS = muro15.material.map.wrapT = THREE.MirroredRepeatWrapping;
    muro15.receiveShadow = true;
    muro15.position.set(-1250,45,-1250);
    scene.add(muro15);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var muro16 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    muro16.material.map.wrapS = muro16.material.map.wrapT = THREE.MirroredRepeatWrapping;
    muro16.receiveShadow = true;
    muro16.position.set(-1350,45,-1250);
    scene.add(muro16);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var muro17 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    muro17.material.map.wrapS = muro17.material.map.wrapT = THREE.MirroredRepeatWrapping;
    muro17.receiveShadow = true;
    muro17.position.set(-1450,45,-1150);
    scene.add(muro17);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var muro18 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    muro18.material.map.wrapS = muro18.material.map.wrapT = THREE.MirroredRepeatWrapping;
    muro18.receiveShadow = true;
    muro18.position.set(-1150,45,-1450);
    scene.add(muro18);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var muro19 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    muro19.material.map.wrapS = muro19.material.map.wrapT = THREE.MirroredRepeatWrapping;
    muro19.receiveShadow = true;
    muro19.position.set(-1250,45,-1300);
    scene.add(muro19);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var muro20 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    muro20.material.map.wrapS = muro20.material.map.wrapT = THREE.MirroredRepeatWrapping;
    muro20.receiveShadow = true;
    muro20.position.set(-1150,45,-1150);
    scene.add(muro20);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var muro21 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    muro21.material.map.wrapS = muro21.material.map.wrapT = THREE.MirroredRepeatWrapping;
    muro21.receiveShadow = true;
    muro21.position.set(-1000,45,-1000);
    scene.add(muro21);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var muro22 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    muro22.material.map.wrapS = muro22.material.map.wrapT = THREE.MirroredRepeatWrapping;
    muro22.receiveShadow = true;
    muro22.position.set(-950,45,-950);
    scene.add(muro22);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var muro23 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    muro23.material.map.wrapS = muro23.material.map.wrapT = THREE.MirroredRepeatWrapping;
    muro23.receiveShadow = true;
    muro23.position.set(-850,45,-850);
    scene.add(muro23);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var muro24 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    muro24.material.map.wrapS = muro24.material.map.wrapT = THREE.MirroredRepeatWrapping;
    muro24.receiveShadow = true;
    muro24.position.set(-800,45,-800);
    scene.add(muro24);

    //-----------------------------------------------------------
    //CREAR INRROMPIBLES
    //-----------------------------------------------------------
    var muro25 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    muro25.material.map.wrapS = muro25.material.map.wrapT = THREE.MirroredRepeatWrapping;
    muro25.receiveShadow = true;
    muro25.position.set(-1300,45,1400);
    scene.add(muro25);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var muro26 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    muro26.material.map.wrapS = muro26.material.map.wrapT = THREE.MirroredRepeatWrapping;
    muro26.receiveShadow = true;
    muro26.position.set(-1400,45,1300);
    scene.add(muro26);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var muro27 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    muro27.material.map.wrapS = muro27.material.map.wrapT = THREE.MirroredRepeatWrapping;
    muro27.receiveShadow = true;
    muro27.position.set(-1250,45,1250);
    scene.add(muro27);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var muro28 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    muro28.material.map.wrapS = muro28.material.map.wrapT = THREE.MirroredRepeatWrapping;
    muro28.receiveShadow = true;
    muro28.position.set(-1350,45,1250);
    scene.add(muro28);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var muro29 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    muro29.material.map.wrapS = muro29.material.map.wrapT = THREE.MirroredRepeatWrapping;
    muro29.receiveShadow = true;
    muro29.position.set(-1450,45,1150);
    scene.add(muro29);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var muro30 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    muro30.material.map.wrapS = muro30.material.map.wrapT = THREE.MirroredRepeatWrapping;
    muro30.receiveShadow = true;
    muro30.position.set(-1150,45,1450);
    scene.add(muro30);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var muro31 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    muro31.material.map.wrapS = muro31.material.map.wrapT = THREE.MirroredRepeatWrapping;
    muro31.receiveShadow = true;
    muro31.position.set(-1250,45,1300);
    scene.add(muro31);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var muro32 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    muro32.material.map.wrapS = muro32.material.map.wrapT = THREE.MirroredRepeatWrapping;
    muro32.receiveShadow = true;
    muro32.position.set(-1150,45,1150);
    scene.add(muro32);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var muro33 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    muro33.material.map.wrapS = muro33.material.map.wrapT = THREE.MirroredRepeatWrapping;
    muro33.receiveShadow = true;
    muro33.position.set(-1000,45,1000);
    scene.add(muro33);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var muro34 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    muro34.material.map.wrapS = muro34.material.map.wrapT = THREE.MirroredRepeatWrapping;
    muro34.receiveShadow = true;
    muro34.position.set(-950,45,950);
    scene.add(muro34);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var muro35 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    muro35.material.map.wrapS = muro35.material.map.wrapT = THREE.MirroredRepeatWrapping;
    muro35.receiveShadow = true;
    muro35.position.set(-850,45,850);
    scene.add(muro35);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var muro36 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    muro36.material.map.wrapS = muro36.material.map.wrapT = THREE.MirroredRepeatWrapping;
    muro36.receiveShadow = true;
    muro36.position.set(-800,45,800);
    scene.add(muro36);
    //-----------------------------------------------------------
    //CREAR INRROMPIBLES
    //-----------------------------------------------------------
    var muro37 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    muro37.material.map.wrapS = muro37.material.map.wrapT = THREE.MirroredRepeatWrapping;
    muro37.receiveShadow = true;
    muro37.position.set(1300,45,-1400);
    scene.add(muro37);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var muro38 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    muro38.material.map.wrapS = muro38.material.map.wrapT = THREE.MirroredRepeatWrapping;
    muro38.receiveShadow = true;
    muro38.position.set(1400,45,-1300);
    scene.add(muro38);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var muro39 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    muro39.material.map.wrapS = muro39.material.map.wrapT = THREE.MirroredRepeatWrapping;
    muro39.receiveShadow = true;
    muro39.position.set(1250,45,-1250);
    scene.add(muro39);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var muro40 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    muro40.material.map.wrapS = muro40.material.map.wrapT = THREE.MirroredRepeatWrapping;
    muro40.receiveShadow = true;
    muro40.position.set(1350,45,-1250);
    scene.add(muro40);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var muro41 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    muro41.material.map.wrapS = muro41.material.map.wrapT = THREE.MirroredRepeatWrapping;
    muro41.receiveShadow = true;
    muro41.position.set(1450,45,-1150);
    scene.add(muro41);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var muro42 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    muro42.material.map.wrapS = muro42.material.map.wrapT = THREE.MirroredRepeatWrapping;
    muro42.receiveShadow = true;
    muro42.position.set(1150,45,-1450);
    scene.add(muro42);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var muro43 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    muro43.material.map.wrapS = muro43.material.map.wrapT = THREE.MirroredRepeatWrapping;
    muro43.receiveShadow = true;
    muro43.position.set(1250,45,-1300);
    scene.add(muro43);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var muro44 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    muro44.material.map.wrapS = muro44.material.map.wrapT = THREE.MirroredRepeatWrapping;
    muro44.receiveShadow = true;
    muro44.position.set(1150,45,-1150);
    scene.add(muro44);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var muro45 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    muro45.material.map.wrapS = muro45.material.map.wrapT = THREE.MirroredRepeatWrapping;
    muro45.receiveShadow = true;
    muro45.position.set(1000,45,-1000);
    scene.add(muro45);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var muro46 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    muro46.material.map.wrapS = muro46.material.map.wrapT = THREE.MirroredRepeatWrapping;
    muro46.receiveShadow = true;
    muro46.position.set(950,45,-950);
    scene.add(muro46);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var muro47 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    muro47.material.map.wrapS = muro47.material.map.wrapT = THREE.MirroredRepeatWrapping;
    muro47.receiveShadow = true;
    muro47.position.set(850,45,-850);
    scene.add(muro47);
    //-----------------------------------------------------------
    //
    //-----------------------------------------------------------
    var muro48 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    muro48.material.map.wrapS = muro48.material.map.wrapT = THREE.MirroredRepeatWrapping;
    muro48.receiveShadow = true;
    muro48.position.set(800,45,-800);
    scene.add(muro48);
    
    //--------------------------------------------------------------
    //
    //--------------------------------------------------------------
    var cajas7 = new THREE.Mesh(
        new THREE.BoxGeometry(50,50,50),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
        })
    );
    cajas7.material.map.wrapS = cajas7.material.map.wrapT = THREE.MirroredRepeatWrapping;
    cajas7.receiveShadow = true;
    cajas7.position.set(1350,45,1400);
    scene.add(cajas7);
    
    //-------------------------------------------------------------
    //SEGUNDO NIVEL
    //-------------------------------------------------------------
    var olimpo = new THREE.Mesh(
        new THREE.BoxGeometry(1500,300,1500),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/textura223.png'),
        })
    );
    olimpo.material.map.repeat.set(0.45,0.45);
    // caja.material.map.wrapS = caja.material.map.wrapT = THREE.MirroredRepeatWrapping;
    // caja.receiveShadow = true;
    olimpo.position.set(0,160,0);
    scene.add(olimpo);

    //-------------------------------------------------------------
    //PARED ESQUINA
    //-------------------------------------------------------------
    var pared = new THREE.Mesh(
        new THREE.BoxGeometry(25,50,25),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg'),
            
        })
    );
    pared.position.set(1490,45,-1490);
    scene.add(pared);

    //-------------------------------------------------------------
    //PARED ESQUINA
    //-------------------------------------------------------------
    var pared2 = new THREE.Mesh(
        new THREE.BoxGeometry(25,50,25),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    pared2.position.set(1490,45,1490);
    scene.add(pared2);

    //-------------------------------------------------------------
    //PARED ESQUINA
    //-------------------------------------------------------------
    var pared3 = new THREE.Mesh(
        new THREE.BoxGeometry(25,50,25),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    pared3.position.set(-1490,45,-1490);
    scene.add(pared3);

    //-------------------------------------------------------------
    //PARED DE ESQUINA
    //-------------------------------------------------------------
    var pared4 = new THREE.Mesh(
        new THREE.BoxGeometry(25,50,25),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        })
    );
    pared4.position.set(-1490,45,1490);
    scene.add(pared4);
    

    //-------------------------------------------------------------
    //Ciclo para crear una varios cubos al tiempo
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(25, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionZ = 50;
    var x = 1489;
    var z = -1450;
    var y = 45;

    for (var i = 0; i < 59; i++) {
            var cubinhos = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    cubinhos.position.z = (positionZ * i) + z;
                    cubinhos.position.x = x;
                    cubinhos.position.y = y;
                    scene.add(cubinhos);
                    collidableList.push(cubinhos);
    }

    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 25);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionX = 50;
    var x = -1450;
    var z = -1490;
    var y = 45;

    for (var i = 0; i < 59; i++) {
            var cubinhos2 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    cubinhos2.position.x = (positionX * i) + x;
                    cubinhos2.position.z = z;
                    cubinhos2.position.y = y;
                    scene.add(cubinhos2);
                    collidableList.push(cubinhos2);
                    
    }
    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 70);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionZ = 50;
    var x = -720;
    var z = -150;
    var y = 360;

    for (var i = 0; i < 7; i++) {
            var cubinhos2 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    cubinhos2.position.z = (positionZ * i) + z;
                    cubinhos2.position.x = x;
                    cubinhos2.position.y = y;
                    scene.add(cubinhos2);
                    collidableList.push(cubinhos2);
                    
    }

    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(25, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionZ = 50;
    var x = -1490;
    var z = -1450;
    var y = 45;

    for (var i = 0; i < 59; i++) {
            var cubinhos3 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    cubinhos3.position.z = (positionZ * i) + z;
                    cubinhos3.position.x = x;
                    cubinhos3.position.y = y;
                    scene.add(cubinhos3);
                    collidableList.push(cubinhos3);
                    
    }

    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 25);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionX = 50;
    var x = -1450;
    var z = 1490;
    var y = 45;

    for (var i = 0; i < 59; i++) {
            var cubinhos4 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    cubinhos4.position.x = (positionX * i) + x;
                    cubinhos4.position.z = z;
                    cubinhos4.position.y = y;
                    scene.add(cubinhos4);
                    collidableList.push(cubinhos4);
    }
    //-------------------------------------------------------------
    //LADRILLOS FILAS
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionX = 50;
    var x = -150;
    var z = 800;
    var y = 45;

    for (var i = 0; i < 7; i++) {
            var l1 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    l1.position.x = (positionX * i) + x;
                    l1.position.z = z;
                    l1.position.y = y;
                    scene.add(l1);
                    collidableList.push(l1);
    }
    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionX = 50;
    var x = -100;
    var z = 1050;
    var y = 45;

    for (var i = 0; i < 5; i++) {
            var l2 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    l2.position.x = (positionX * i) + x;
                    l2.position.z = z;
                    l2.position.y = y;
                    scene.add(l2);
                    collidableList.push(l2);
    }
    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionX = 50;
    var x = -100;
    var z = 1150;
    var y = 45;

    for (var i = 0; i < 5; i++) {
            var l3 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    l3.position.x = (positionX * i) + x;
                    l3.position.z = z;
                    l3.position.y = y;
                    scene.add(l3);
                    collidableList.push(l3);
    }
    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionX = 50;
    var x = -100;
    var z = 1250;
    var y = 45;

    for (var i = 0; i < 5; i++) {
            var l4 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    l4.position.x = (positionX * i) + x;
                    l4.position.z = z;
                    l4.position.y = y;
                    scene.add(l4);
                    collidableList.push(l4);
    }
    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionX = 50;
    var x = -100;
    var z = 1400;
    var y = 45;

    for (var i = 0; i < 5; i++) {
            var l5 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    l5.position.x = (positionX * i) + x;
                    l5.position.z = z;
                    l5.position.y = y;
                    scene.add(l5);
                    collidableList.push(l5);
    }
    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionX = 50;
    var x = -100;
    var z = 1300;
    var y = 45;

    for (var i = 0; i < 5; i++) {
            var l6 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    l6.position.x = (positionX * i) + x;
                    l6.position.z = z;
                    l6.position.y = y;
                    scene.add(l6);
                    collidableList.push(l6);
    }
    //-------------------------------------------------------------
    //LADRILLOS FILAS 2
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionX = 50;
    var x = -150;
    var z = -800;
    var y = 45;

    for (var i = 0; i < 7; i++) {
            var l11 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    l11.position.x = (positionX * i) + x;
                    l11.position.z = z;
                    l11.position.y = y;
                    scene.add(l11);
                    collidableList.push(l11);
    }
    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionX = 50;
    var x = -100;
    var z = -1050;
    var y = 45;

    for (var i = 0; i < 5; i++) {
            var l21 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    l21.position.x = (positionX * i) + x;
                    l21.position.z = z;
                    l21.position.y = y;
                    scene.add(l21);
                    collidableList.push(l21);
    }
    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionX = 50;
    var x = -100;
    var z = -1150;
    var y = 45;

    for (var i = 0; i < 5; i++) {
            var l31 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    l31.position.x = (positionX * i) + x;
                    l31.position.z = z;
                    l31.position.y = y;
                    scene.add(l31);
                    collidableList.push(l31);
    }
    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionX = 50;
    var x = -100;
    var z = -1250;
    var y = 45;

    for (var i = 0; i < 5; i++) {
            var l41 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    l41.position.x = (positionX * i) + x;
                    l41.position.z = z;
                    l41.position.y = y;
                    scene.add(l41);
                    collidableList.push(l41);
    }
    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionX = 50;
    var x = -100;
    var z = -1400;
    var y = 45;

    for (var i = 0; i < 5; i++) {
            var l51 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    l51.position.x = (positionX * i) + x;
                    l51.position.z = z;
                    l51.position.y = y;
                    scene.add(l51);
                    collidableList.push(l51);
    }
    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionX = 50;
    var x = -100;
    var z = -1300;
    var y = 45;

    for (var i = 0; i < 5; i++) {
            var l61 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    l61.position.x = (positionX * i) + x;
                    l61.position.z = z;
                    l61.position.y = y;
                    scene.add(l61);
                    collidableList.push(l61);
    }
    //-------------------------------------------------------------
    //LADRILLOS FILAS 3
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionZ = 50;
    var x = 800;
    var z = -150;
    var y = 45;

    for (var i = 0; i < 7; i++) {
            var l12 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    l12.position.z = (positionZ * i) + z;
                    l12.position.x = x;
                    l12.position.y = y;
                    scene.add(l12);
                    collidableList.push(l12);
    }
    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionZ = 50;
    var x = 1050;
    var z = -100;
    var y = 45;

    for (var i = 0; i < 5; i++) {
            var l22 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    l22.position.z = (positionZ * i) + z;
                    l22.position.x = x;
                    l22.position.y = y;
                    scene.add(l22);
                    collidableList.push(l22);
    }
    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionZ = 50;
    var x = 1150;
    var z = -100;
    var y = 45;

    for (var i = 0; i < 5; i++) {
            var l32 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    l32.position.z = (positionZ * i) + z;
                    l32.position.x = x;
                    l32.position.y = y;
                    scene.add(l32);
                    collidableList.push(l32);
    }
    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionZ = 50;
    var x = 1250;
    var z = -100;
    var y = 45;

    for (var i = 0; i < 5; i++) {
            var l42 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    l42.position.z = (positionZ * i) + z;
                    l42.position.x = x;
                    l42.position.y = y;
                    scene.add(l42);
                    collidableList.push(l42);
    }
    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionX = 50;
    var x = 1400;
    var z = -100;
    var y = 45;

    for (var i = 0; i < 5; i++) {
            var l52 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    l52.position.z = (positionZ * i) + z;
                    l52.position.x = x;
                    l52.position.y = y;
                    scene.add(l52);
                    collidableList.push(l52);
    }
    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionZ = 50;
    var x = 1300;
    var z = -100;
    var y = 45;

    for (var i = 0; i < 5; i++) {
            var l62 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    l62.position.z = (positionZ * i) + z;
                    l62.position.x = x;
                    l62.position.y = y;
                    scene.add(l62);
                    collidableList.push(l62);
    }
    //-------------------------------------------------------------
    //LADRILLOS FILAS 3
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionZ = 50;
    var x = -800;
    var z = -150;
    var y = 45;

    for (var i = 0; i < 7; i++) {
            var l13 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    l13.position.z = (positionZ * i) + z;
                    l13.position.x = x;
                    l13.position.y = y;
                    scene.add(l13);
                    collidableList.push(l13);
    }
    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionZ = 50;
    var x = -1050;
    var z = -100;
    var y = 45;

    for (var i = 0; i < 5; i++) {
            var l23 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    l23.position.z = (positionZ * i) + z;
                    l23.position.x = x;
                    l23.position.y = y;
                    scene.add(l23);
                    collidableList.push(l23);
    }
    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionZ = 50;
    var x = -1150;
    var z = -100;
    var y = 45;

    for (var i = 0; i < 5; i++) {
            var l33 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    l33.position.z = (positionZ * i) + z;
                    l33.position.x = x;
                    l33.position.y = y;
                    scene.add(l33);
                    collidableList.push(l33);
    }
    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionZ = 50;
    var x = -1250;
    var z = -100;
    var y = 45;

    for (var i = 0; i < 5; i++) {
            var l43 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    l43.position.z = (positionZ * i) + z;
                    l43.position.x = x;
                    l43.position.y = y;
                    scene.add(l43);
                    collidableList.push(l43);
    }
    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionX = 50;
    var x = -1400;
    var z = -100;
    var y = 45;

    for (var i = 0; i < 5; i++) {
            var l53 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    l53.position.z = (positionZ * i) + z;
                    l53.position.x = x;
                    l53.position.y = y;
                    scene.add(l53);
                    collidableList.push(l53);
    }
    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionZ = 50;
    var x = -1300;
    var z = -100;
    var y = 45;

    for (var i = 0; i < 5; i++) {
            var l63 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    l63.position.z = (positionZ * i) + z;
                    l63.position.x = x;
                    l63.position.y = y;
                    scene.add(l63);
                    collidableList.push(l63);
    }
    //-------------------------------------------------------------
    //CAJAS FILAS 1
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionX = 50;
    var x = -100;
    var z = 850;
    var y = 45;

    for (var i = 0; i < 5; i++) {
            var c1 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    c1.position.x = (positionX * i) + x;
                    c1.position.z = z;
                    c1.position.y = y;
                    scene.add(c1);
                    collidableList.push(c1);
    }
    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionX = 50;
    var x = -100;
    var z = 900;
    var y = 45;

    for (var i = 0; i < 5; i++) {
            var ck = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    ck.position.x = (positionX * i) + x;
                    ck.position.z = z;
                    ck.position.y = y;
                    scene.add(ck);
                    collidableList.push(ck);
    }
    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionX = 50;
    var x = -100;
    var z = 950;
    var y = 45;

    for (var i = 0; i < 5; i++) {
            var c2 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    c2.position.x = (positionX * i) + x;
                    c2.position.z = z;
                    c2.position.y = y;
                    scene.add(c2);
                    collidableList.push(c2);
    }
    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionX = 50;
    var x = -150;
    var z = 1000;
    var y = 45;

    for (var i = 0; i < 7; i++) {
            var c3 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    c3.position.x = (positionX * i) + x;
                    c3.position.z = z;
                    c3.position.y = y;
                    scene.add(c3);
                    collidableList.push(c3);
    }
    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionX = 50;
    var x = -100;
    var z = 1100;
    var y = 45;

    for (var i = 0; i < 5; i++) {
            var c4 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    c4.position.x = (positionX * i) + x;
                    c4.position.z = z;
                    c4.position.y = y;
                    scene.add(c4);
                    collidableList.push(c4);
    }
    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionX = 50;
    var x = -100;
    var z = 1200;
    var y = 45;

    for (var i = 0; i < 5; i++) {
            var c5 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    c5.position.x = (positionX * i) + x;
                    c5.position.z = z;
                    c5.position.y = y;
                    scene.add(c5);
                    collidableList.push(c5);
    }
    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionX = 50;
    var x = -100;
    var z = 1350;
    var y = 45;

    for (var i = 0; i < 5; i++) {
            var c6 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    c6.position.x = (positionX * i) + x;
                    c6.position.z = z;
                    c6.position.y = y;
                    scene.add(c6);
                    collidableList.push(c6);
    }
    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionX = 50;
    var x = -100;
    var z = 1450;
    var y = 45;

    for (var i = 0; i < 5; i++) {
            var c7 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    c7.position.x = (positionX * i) + x;
                    c7.position.z = z;
                    c7.position.y = y;
                    scene.add(c7);
                    collidableList.push(c7);
    }
    //-------------------------------------------------------------
    //CAJAS FILAS 2
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionX = 50;
    var x = -100;
    var z = -850;
    var y = 45;

    for (var i = 0; i < 5; i++) {
            var c11 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    c11.position.x = (positionX * i) + x;
                    c11.position.z = z;
                    c11.position.y = y;
                    scene.add(c11);
                    collidableList.push(c11);
    }
    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionX = 50;
    var x = -100;
    var z = -500;
    var y = 45;

    for (var i = 0; i < 5; i++) {
            var ck1 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    ck1.position.x = (positionX * i) + x;
                    ck1.position.z = z;
                    ck1.position.y = y;
                    scene.add(ck1);
                    collidableList.push(ck1);
    }
    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionX = 50;
    var x = -100;
    var z = -950;
    var y = 45;

    for (var i = 0; i < 5; i++) {
            var c21 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    c21.position.x = (positionX * i) + x;
                    c21.position.z = z;
                    c21.position.y = y;
                    scene.add(c21);
                    collidableList.push(c21);
    }
    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionX = 50;
    var x = -150;
    var z = -1000;
    var y = 45;

    for (var i = 0; i < 7; i++) {
            var c31 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    c31.position.x = (positionX * i) + x;
                    c31.position.z = z;
                    c31.position.y = y;
                    scene.add(c31);
                    collidableList.push(c31);
    }
    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionX = 50;
    var x = -100;
    var z = -1100;
    var y = 45;

    for (var i = 0; i < 5; i++) {
            var c41 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    c41.position.x = (positionX * i) + x;
                    c41.position.z = z;
                    c41.position.y = y;
                    scene.add(c41);
                    collidableList.push(c41);
    }
    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionX = 50;
    var x = -100;
    var z = -1200;
    var y = 45;

    for (var i = 0; i < 5; i++) {
            var c51 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    c51.position.x = (positionX * i) + x;
                    c51.position.z = z;
                    c51.position.y = y;
                    scene.add(c51);
                    collidableList.push(c51);
    }
    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionX = 50;
    var x = -100;
    var z = -1350;
    var y = 45;

    for (var i = 0; i < 5; i++) {
            var c61 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    c61.position.x = (positionX * i) + x;
                    c61.position.z = z;
                    c61.position.y = y;
                    scene.add(c61);
                    collidableList.push(c61);
    }
    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionX = 50;
    var x = -100;
    var z = -1450;
    var y = 45;

    for (var i = 0; i < 5; i++) {
            var c71 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    c71.position.x = (positionX * i) + x;
                    c71.position.z = z;
                    c71.position.y = y;
                    scene.add(c71);
                    collidableList.push(c71);
    }
    //-------------------------------------------------------------
    //CAJAS FILAS 3
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionZ = 50;
    var x = 850;
    var z = -100;
    var y = 45;

    for (var i = 0; i < 5; i++) {
            var c13 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    c13.position.z = (positionZ * i) + z;
                    c13.position.x = x;
                    c13.position.y = y;
                    scene.add(c13);
                    collidableList.push(c13);
    }
    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionZ = 50;
    var x = 500;
    var z = -100;
    var y = 45;

    for (var i = 0; i < 5; i++) {
            var ck3 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    ck3.position.z = (positionZ * i) + z;
                    ck3.position.x = x;
                    ck3.position.y = y;
                    scene.add(ck3);
                    collidableList.push(ck3);
    }
    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionZ = 50;
    var x = 950;
    var z = -100;
    var y = 45;

    for (var i = 0; i < 5; i++) {
            var c23 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    c23.position.z = (positionZ * i) + z;
                    c23.position.x = x;
                    c23.position.y = y;
                    scene.add(c23);
                    collidableList.push(c23);
    }
    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionZ = 50;
    var x = 1000;
    var z = -150;
    var y = 45;

    for (var i = 0; i < 7; i++) {
            var c33 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    c33.position.z = (positionZ * i) + z;
                    c33.position.x = x;
                    c33.position.y = y;
                    scene.add(c33);
                    collidableList.push(c33);
    }
    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionZ = 50;
    var x = 1100;
    var z = -100;
    var y = 45;

    for (var i = 0; i < 5; i++) {
            var c43 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    c43.position.z = (positionZ * i) + z;
                    c43.position.x = x;
                    c43.position.y = y;
                    scene.add(c43);
                    collidableList.push(c43);
    }
    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionZ = 50;
    var x = 1200;
    var z = -100;
    var y = 45;

    for (var i = 0; i < 5; i++) {
            var c5 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    c5.position.z = (positionZ * i) + z;
                    c5.position.x = x;
                    c5.position.y = y;
                    scene.add(c5);
                    collidableList.push(c5);
    }
    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionZ = 50;
    var x = 1350;
    var z = -100;
    var y = 45;

    for (var i = 0; i < 5; i++) {
            var c63 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    c63.position.z = (positionZ * i) + z;
                    c63.position.x = x;
                    c63.position.y = y;
                    scene.add(c63);
                    collidableList.push(c63);
    }
    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionX = 50;
    var x = 1450;
    var z = -100;
    var y = 45;

    for (var i = 0; i < 5; i++) {
            var c73 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    c73.position.z = (positionZ * i) + z;
                    c73.position.x = x;
                    c73.position.y = y;
                    scene.add(c73);
                    collidableList.push(c73);
    }
    //-------------------------------------------------------------
    //CAJAS FILAS 3
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionZ = 50;
    var x = -850;
    var z = -100;
    var y = 45;

    for (var i = 0; i < 5; i++) {
            var c12 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    c12.position.z = (positionZ * i) + z;
                    c12.position.x = x;
                    c12.position.y = y;
                    scene.add(c12);
                    collidableList.push(c12);
    }
    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionZ = 50;
    var x = -900;
    var z = -100;
    var y = 45;

    for (var i = 0; i < 5; i++) {
            var ck2 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    ck2.position.z = (positionZ * i) + z;
                    ck2.position.x = x;
                    ck2.position.y = y;
                    scene.add(ck2);
                    collidableList.push(ck2);
    }
    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionZ = 50;
    var x = -950;
    var z = -100;
    var y = 45;

    for (var i = 0; i < 5; i++) {
            var c22 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    c22.position.z = (positionZ * i) + z;
                    c22.position.x = x;
                    c22.position.y = y;
                    scene.add(c22);
                    collidableList.push(c22);
    }
    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionZ = 50;
    var x = -1000;
    var z = -150;
    var y = 45;

    for (var i = 0; i < 7; i++) {
            var c32 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    c32.position.z = (positionZ * i) + z;
                    c32.position.x = x;
                    c32.position.y = y;
                    scene.add(c32);
                    collidableList.push(c32);
    }
    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionZ = 50;
    var x = -1100;
    var z = -100;
    var y = 45;

    for (var i = 0; i < 5; i++) {
            var c42 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    c42.position.z = (positionZ * i) + z;
                    c42.position.x = x;
                    c42.position.y = y;
                    scene.add(c42);
                    collidableList.push(c42);
    }
    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionZ = 50;
    var x = -1200;
    var z = -100;
    var y = 45;

    for (var i = 0; i < 5; i++) {
            var c52 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    c52.position.z = (positionZ * i) + z;
                    c52.position.x = x;
                    c52.position.y = y;
                    scene.add(c52);
                    collidableList.push(c52);
    }
    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionZ = 50;
    var x = -1350;
    var z = -100;
    var y = 45;

    for (var i = 0; i < 5; i++) {
            var c62 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    c62.position.z = (positionZ * i) + z;
                    c62.position.x = x;
                    c62.position.y = y;
                    scene.add(c62);
                    collidableList.push(c62);
    }
    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionX = 50;
    var x = -1450;
    var z = -100;
    var y = 45;

    for (var i = 0; i < 5; i++) {
            var c72 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    c72.position.z = (positionZ * i) + z;
                    c72.position.x = x;
                    c72.position.y = y;
                    scene.add(c72);
                    collidableList.push(c72);
    }

    //-------------------------------------------------------------
    //Lista de objetos colisionables
    //-------------------------------------------------------------
    collidableList.push(plano);
    collidableList.push(bomba);
    collidableList.push(caja);
    collidableList.push(olimpo);
    collidableList.push(pared);
    collidableList.push(pared2);
    collidableList.push(pared3);
    collidableList.push(pared4);
    collidableList.push(caja1);
    collidableList.push(caja2);
    collidableList.push(caja3);
    // collidableList.push(caja4);
    collidableList.push(caja5);
    collidableList.push(caja6);
    collidableList.push(caja7);
    collidableList.push(cajas7);
    collidableList.push(caja8);
    collidableList.push(caja9);
    collidableList.push(caja10);
    collidableList.push(caja11);
    collidableList.push(caja12);
    collidableList.push(caja13);
    collidableList.push(caja14);
    collidableList.push(caja15);
    collidableList.push(caja16);
    collidableList.push(caja17);
    collidableList.push(caja18);
    collidableList.push(caja19);
    collidableList.push(caja20);
    collidableList.push(caja21);
    collidableList.push(caja22);
    collidableList.push(caja23);
    collidableList.push(caja24);
    collidableList.push(caja25);
    collidableList.push(caja26);
    collidableList.push(caja27);
    collidableList.push(caja28);
    collidableList.push(caja29);
    collidableList.push(caja30);
    collidableList.push(caja31);
    collidableList.push(caja32);
    collidableList.push(caja33);
    collidableList.push(caja34);
    collidableList.push(caja35);
    collidableList.push(caja36);
    collidableList.push(caja37);
    collidableList.push(caja38);
    collidableList.push(caja39);
    collidableList.push(caja40);
    collidableList.push(caja41);
    collidableList.push(caja42);
    collidableList.push(caja43);
    collidableList.push(caja44);
    collidableList.push(caja45);
    collidableList.push(caja46);
    collidableList.push(caja47);
    collidableList.push(caja48);
    collidableList.push(caja49);
    collidableList.push(caja50);
    collidableList.push(caja51);
    collidableList.push(caja52);
    collidableList.push(caja53);
    collidableList.push(caja54);
    collidableList.push(caja55);
    collidableList.push(caja56);
    collidableList.push(caja57);
    collidableList.push(caja58);
    collidableList.push(caja59);
    collidableList.push(caja60);
    collidableList.push(caja61);
    collidableList.push(caja62);
    collidableList.push(caja63);
    collidableList.push(caja64);
    collidableList.push(caja65);
    collidableList.push(caja66);
    collidableList.push(caja67);
    collidableList.push(caja68);
    collidableList.push(caja69);
    collidableList.push(caja70);
    collidableList.push(caja71);
    collidableList.push(caja72);
    collidableList.push(caja73);
    collidableList.push(caja74);
    collidableList.push(caja75);
    collidableList.push(caja76);
    collidableList.push(caja77);
    collidableList.push(caja78);
    collidableList.push(caja79);
    collidableList.push(caja80);
    collidableList.push(caja81);
    collidableList.push(caja82);
    collidableList.push(caja83);
    collidableList.push(caja84);
    collidableList.push(caja85);
    collidableList.push(caja86);
    collidableList.push(caja87);
    collidableList.push(caja88);
    collidableList.push(caja89);
    collidableList.push(caja90);
    collidableList.push(caja91);
    collidableList.push(caja92);
    collidableList.push(caja93);
    collidableList.push(caja94);
    collidableList.push(caja95);
    collidableList.push(caja96);
    collidableList.push(caja97);
    collidableList.push(caja98);
    collidableList.push(caja99);
    collidableList.push(caja100);
    collidableList.push(caja101);
    collidableList.push(caja102);
    collidableList.push(caja103);
    collidableList.push(caja104);
    collidableList.push(caja105);
    collidableList.push(caja106);
    collidableList.push(caja107);
    collidableList.push(caja108);
    //----------------------------------------------------
    //
    //----------------------------------------------------
    collidableList.push(muro1);
    collidableList.push(muro2);
    collidableList.push(muro3);
    collidableList.push(muro4);
    collidableList.push(muro5);
    collidableList.push(muro6);
    collidableList.push(muro7);
    collidableList.push(muro8);
    collidableList.push(muro9);
    collidableList.push(muro10);
    collidableList.push(muro11);
    collidableList.push(muro12);
    collidableList.push(muro13);
    collidableList.push(muro14);
    collidableList.push(muro15);
    collidableList.push(muro16);
    collidableList.push(muro17);
    collidableList.push(muro18);
    collidableList.push(muro19);
    collidableList.push(muro20);
    collidableList.push(muro21);
    collidableList.push(muro22);
    collidableList.push(muro23);
    collidableList.push(muro24);
    collidableList.push(muro25);
    collidableList.push(muro26);
    collidableList.push(muro27);
    collidableList.push(muro28);
    collidableList.push(muro29);
    collidableList.push(muro30);
    collidableList.push(muro31);
    collidableList.push(muro32);
    collidableList.push(muro33);
    collidableList.push(muro34);
    collidableList.push(muro35);
    collidableList.push(muro36);
    collidableList.push(muro37);
    collidableList.push(muro38);
    collidableList.push(muro39);
    collidableList.push(muro40);
    collidableList.push(muro41);
    collidableList.push(muro42);
    collidableList.push(muro43);
    collidableList.push(muro44);
    collidableList.push(muro45);
    collidableList.push(muro46);
    collidableList.push(muro47);
    collidableList.push(muro48);
    

    //-------------------------------------------------------------
    //CREAR LAS PLATAFORMAS
    //-------------------------------------------------------------
    powerup2 = new THREE.Mesh(
        new THREE.BoxGeometry(200,50,200),
        new THREE.MeshBasicMaterial( {color: 0xff0000})
    );
    powerup2.position.set(-850,45,-300);
    powerup2.name="plataforma";
    powerup2.isInUse = false;
    scene.add(powerup2);

    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    powerup6 = new THREE.Mesh(
        new THREE.BoxGeometry(200,50,200),
        new THREE.MeshBasicMaterial( {color: 0xff0000})
    );
    powerup6.position.set(-850,45,300);
    powerup6.name="plataforma6";
    powerup6.isInUse = false;
    scene.add(powerup6);
    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    powerup7 = new THREE.Mesh(
        new THREE.BoxGeometry(200,50,200),
        new THREE.MeshBasicMaterial( {color: 0xff0000})
    );
    powerup7.position.set(300,45,-850);
    powerup7.name="plataforma7";
    powerup7.isInUse = false;
    scene.add(powerup7);

    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    powerup21 = new THREE.Mesh(
        new THREE.BoxGeometry(200,50,200),
        new THREE.MeshBasicMaterial( {color: 0xff0000})
        // new THREE.MeshBasicMaterial({
        //     map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        // })
    );
    powerup21.position.set(300,45,850);
    powerup21.name="plata";
    powerup21.isInUse = true;
    scene.add(powerup21);
    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    powerup3 = new THREE.Mesh(
        new THREE.BoxGeometry(200,50,200),
        new THREE.MeshBasicMaterial( {color: 0x642EFE})
    );
    powerup3.position.set(850,45,-300);
    powerup3.name="plataformasSola";
    powerup3.isInUse = true;
    scene.add(powerup3);

    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    powerup4 = new THREE.Mesh(
        new THREE.BoxGeometry(200,50,200),
        new THREE.MeshBasicMaterial( {color: 0x642EFE})
        // new THREE.MeshBasicMaterial({
        //     map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
        // })
    );
    powerup4.position.set(850,45,300);
    powerup4.name="solitaria";
    powerup4.isInUse = true;
    scene.add(powerup4);

    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    powerup5 = new THREE.Mesh(
        new THREE.BoxGeometry(200,50,200),
        new THREE.MeshBasicMaterial( {color: 0x642EFE})
    );
    powerup5.position.set(-300,45,850);
    powerup5.name="solidsnack";
    powerup5.isInUse = true;
    scene.add(powerup5);
    //-------------------------------------------------------------
    //
    //-------------------------------------------------------------
    powerup8 = new THREE.Mesh(
        new THREE.BoxGeometry(200,50,200),
        new THREE.MeshBasicMaterial( {color: 0x642EFE})
    );
    powerup8.position.set(-300,45,-850);
    powerup8.name="lili";
    powerup8.isInUse = true;
    scene.add(powerup8);
    
    collidableList.push(powerup2);
    collidableList.push(powerup3);
    collidableList.push(powerup4);
    collidableList.push(powerup21);
    collidableList.push(powerup5);
    collidableList.push(powerup6);
    collidableList.push(powerup7);
    collidableList.push(powerup8);
    


    players.p1.play(scene);

    //--------------------------------------------------------------------
    //CUADROS SEGUNDO NIVEL
    //--------------------------------------------------------------------
    
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionX = 50;
    var x = 100;
    var z = -100;
    var y = 360;

    for (var i = 0; i < 5; i++) {
            var s = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    s.position.z = (positionZ * i) + z;
                    s.position.x = x;
                    s.position.y = y;
                    scene.add(s);
                    collidableList.push(s);
    }
    //--------------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionX = 50;
    var x = -100;
    var z = -100;
    var y = 360;

    for (var i = 0; i < 5; i++) {
            var s1 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    s1.position.z = (positionZ * i) + z;
                    s1.position.x = x;
                    s1.position.y = y;
                    scene.add(s1);
                    collidableList.push(s1);
    }
    //--------------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionZ = 50;
    var x = -50;
    var z = -100;
    var y = 360;

    for (var i = 0; i < 3; i++) {
            var s2 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    s2.position.x = (positionX * i) + x;
                    s2.position.z = z;
                    s2.position.y = y;
                    scene.add(s2);
                    collidableList.push(s2);
    }
    //--------------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionZ = 50;
    var x = -50;
    var z = 100;
    var y = 360;

    for (var i = 0; i < 3; i++) {
            var s3 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    s3.position.x = (positionX * i) + x;
                    s3.position.z = z;
                    s3.position.y = y;
                    scene.add(s3);
                    collidableList.push(s3);
    }
    //--------------------------------------------------------------------
    //CUADROS SEGUNDO NIVEL
    //--------------------------------------------------------------------
    
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionX = 50;
    var x = 200;
    var z = -200;
    var y = 360;

    for (var i = 0; i < 9; i++) {
            var ss = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    ss.position.z = (positionZ * i) + z;
                    ss.position.x = x;
                    ss.position.y = y;
                    scene.add(ss);
                    collidableList.push(ss);
    }
    //--------------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionX = 50;
    var x = -200;
    var z = -200;
    var y = 360;

    for (var i = 0; i < 9; i++) {
            var s1s = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    s1s.position.z = (positionZ * i) + z;
                    s1s.position.x = x;
                    s1s.position.y = y;
                    scene.add(s1s);
                    collidableList.push(s1s);
    }
    //--------------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionZ = 50;
    var x = -150;
    var z = -200;
    var y = 360;

    for (var i = 0; i < 7; i++) {
            var s2s = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    s2s.position.x = (positionX * i) + x;
                    s2s.position.z = z;
                    s2s.position.y = y;
                    scene.add(s2s);
                    collidableList.push(s2s);
    }
    //--------------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionZ = 50;
    var x = -150;
    var z = 200;
    var y = 360;

    for (var i = 0; i < 7; i++) {
            var s3s = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    s3s.position.x = (positionX * i) + x;
                    s3s.position.z = z;
                    s3s.position.y = y;
                    scene.add(s3s);
                    collidableList.push(s3s);
    }
    //--------------------------------------------------------------------
    //CUADROS SEGUNDO NIVEL
    //--------------------------------------------------------------------
    
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionX = 50;
    var x = 300;
    var z = -300;
    var y = 360;

    for (var i = 0; i < 13; i++) {
            var sss = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    sss.position.z = (positionZ * i) + z;
                    sss.position.x = x;
                    sss.position.y = y;
                    scene.add(sss);
                    collidableList.push(sss);
    }
    //--------------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionX = 50;
    var x = -300;
    var z = -300;
    var y = 360;

    for (var i = 0; i < 13; i++) {
            var s1ss = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    s1ss.position.z = (positionZ * i) + z;
                    s1ss.position.x = x;
                    s1ss.position.y = y;
                    scene.add(s1ss);
                    collidableList.push(s1ss);
    }
    //--------------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionZ = 50;
    var x = -250;
    var z = -300;
    var y = 360;

    for (var i = 0; i < 11; i++) {
            var s2ss = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    s2ss.position.x = (positionX * i) + x;
                    s2ss.position.z = z;
                    s2ss.position.y = y;
                    scene.add(s2ss);
                    collidableList.push(s2ss);
    }
    //--------------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionZ = 50;
    var x = -250;
    var z = 300;
    var y = 360;

    for (var i = 0; i < 11; i++) {
            var s3ss = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    s3ss.position.x = (positionX * i) + x;
                    s3ss.position.z = z;
                    s3ss.position.y = y;
                    scene.add(s3ss);
                    collidableList.push(s3ss);
    }

    //--------------------------------------------------------------------
    //CUADROS SEGUNDO NIVEL
    //--------------------------------------------------------------------
    
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionX = 50;
    var x = 400;
    var z = -400;
    var y = 360;

    for (var i = 0; i < 17; i++) {
            var ssss = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    ssss.position.z = (positionZ * i) + z;
                    ssss.position.x = x;
                    ssss.position.y = y;
                    scene.add(ssss);
                    collidableList.push(ssss);
    }
    //--------------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionX = 50;
    var x = -400;
    var z = -400;
    var y = 360;

    for (var i = 0; i < 17; i++) {
            var s1ss1 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    s1ss1.position.z = (positionZ * i) + z;
                    s1ss1.position.x = x;
                    s1ss1.position.y = y;
                    scene.add(s1ss1);
                    collidableList.push(s1ss1);
    }
    //--------------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionZ = 50;
    var x = -350;
    var z = -400;
    var y = 360;

    for (var i = 0; i < 15; i++) {
            var s2ss1 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    s2ss1.position.x = (positionX * i) + x;
                    s2ss1.position.z = z;
                    s2ss1.position.y = y;
                    scene.add(s2ss1);
                    collidableList.push(s2ss1);
    }
    //--------------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionZ = 50;
    var x = -350;
    var z = 400;
    var y = 360;

    for (var i = 0; i < 15; i++) {
            var s3ss1 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    s3ss1.position.x = (positionX * i) + x;
                    s3ss1.position.z = z;
                    s3ss1.position.y = y;
                    scene.add(s3ss1);
                    collidableList.push(s3ss1);
    }

    //--------------------------------------------------------------------
    //CUADROS SEGUNDO NIVEL
    //--------------------------------------------------------------------
    
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionX = 50;
    var x = 500;
    var z = -500;
    var y = 360;

    for (var i = 0; i < 21; i++) {
            var sssss = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    sssss.position.z = (positionZ * i) + z;
                    sssss.position.x = x;
                    sssss.position.y = y;
                    scene.add(sssss);
                    collidableList.push(sssss);
    }
    //--------------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionX = 50;
    var x = -500;
    var z = -500;
    var y = 360;

    for (var i = 0; i < 21; i++) {
            var s1ss1s = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    s1ss1s.position.z = (positionZ * i) + z;
                    s1ss1s.position.x = x;
                    s1ss1s.position.y = y;
                    scene.add(s1ss1s);
                    collidableList.push(s1ss1s);
    }
    //--------------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionZ = 50;
    var x = -450;
    var z = -500;
    var y = 360;

    for (var i = 0; i < 19; i++) {
            var s2ss1s = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    s2ss1s.position.x = (positionX * i) + x;
                    s2ss1s.position.z = z;
                    s2ss1s.position.y = y;
                    scene.add(s2ss1s);
                    collidableList.push(s2ss1s);
    }
    //--------------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionZ = 50;
    var x = -450;
    var z = 500;
    var y = 360;

    for (var i = 0; i < 19; i++) {
            var s3ss1s = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    s3ss1s.position.x = (positionX * i) + x;
                    s3ss1s.position.z = z;
                    s3ss1s.position.y = y;
                    scene.add(s3ss1s);
                    collidableList.push(s3ss1s);
    }

    //-------------------------------------------------------------------
    //CUADROS DE RELLENO
    //-------------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionZ = 100;
    var x = 1350;
    var z = 200;
    var y = 45;

    for (var i = 0; i < 12; i++) {
            var relle = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    relle.position.z = (positionZ * i) + z;
                    relle.position.x = x;
                    relle.position.y = y;
                    scene.add(relle);
                    collidableList.push(relle);
    }
    //------------------------------------------------------------------
    //
    //-------------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionZ = 100;
    var x = 1350;
    var z = 150;
    var y = 45;

    for (var i = 0; i < 12; i++) {
            var rellen = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    rellen.position.z = (positionZ * i) + z;
                    rellen.position.x = x;
                    rellen.position.y = y;
                    scene.add(rellen);
                    collidableList.push(rellen);
    }
    //-------------------------------------------------------------------
    //CUADROS DE RELLENO
    //-------------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionZ = 100;
    var x = 1150;
    var z = 150;
    var y = 45;

    for (var i = 0; i < 10; i++) {
            var relle1 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    relle1.position.z = (positionZ * i) + z;
                    relle1.position.x = x;
                    relle1.position.y = y;
                    scene.add(relle1);
                    collidableList.push(relle1);
    }
    //------------------------------------------------------------------
    //
    //-------------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionZ = 100;
    var x = 1000;
    var z = 200;
    var y = 45;

    for (var i = 0; i < 9; i++) {
            var rellen1 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    rellen1.position.z = (positionZ * i) + z;
                    rellen1.position.x = x;
                    rellen1.position.y = y;
                    scene.add(rellen1);
                    collidableList.push(rellen1);
    }
    //-------------------------------------------------------------------
    //CUADROS DE RELLENO
    //-------------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionZ = 100;
    var x = 1000;
    var z = 250;
    var y = 45;

    for (var i = 0; i < 8; i++) {
            var relle2 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    relle2.position.z = (positionZ * i) + z;
                    relle2.position.x = x;
                    relle2.position.y = y;
                    scene.add(relle2);
                    collidableList.push(relle2);
    }
    //------------------------------------------------------------------
    //
    //-------------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionZ = 100;
    var x = 1150;
    var z = 200;
    var y = 45;

    for (var i = 0; i < 9; i++) {
            var rellen2 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    rellen2.position.z = (positionZ * i) + z;
                    rellen2.position.x = x;
                    rellen2.position.y = y;
                    scene.add(rellen2);
                    collidableList.push(rellen2);
    }

    //
    //-------------------------------------------------------------------
    //CUADROS DE RELLENO
    //-------------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionZ = 100;
    var x = -1350;
    var z = -1250;
    var y = 45;

    for (var i = 0; i < 12; i++) {
            var rellei = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    rellei.position.z = (positionZ * i) + z;
                    rellei.position.x = x;
                    rellei.position.y = y;
                    scene.add(rellei);
                    collidableList.push(rellei);
    }
    //------------------------------------------------------------------
    //
    //-------------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionZ = 100;
    var x = -1350;
    var z = -1300;
    var y = 45;

    for (var i = 0; i < 12; i++) {
            var relleni = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    relleni.position.z = (positionZ * i) + z;
                    relleni.position.x = x;
                    relleni.position.y = y;
                    scene.add(relleni);
                    collidableList.push(relleni);
    }
    //-------------------------------------------------------------------
    //CUADROS DE RELLENO
    //-------------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionZ = 100;
    var x = -1150;
    var z = -1050;
    var y = 45;

    for (var i = 0; i < 10; i++) {
            var relle1i = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    relle1i.position.z = (positionZ * i) + z;
                    relle1i.position.x = x;
                    relle1i.position.y = y;
                    scene.add(relle1i);
                    collidableList.push(relle1i);
    }
    //------------------------------------------------------------------
    //
    //-------------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionZ = 100;
    var x = -1150;
    var z = -1000;
    var y = 45;

    for (var i = 0; i < 9; i++) {
            var rellen1i = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    rellen1i.position.z = (positionZ * i) + z;
                    rellen1i.position.x = x;
                    rellen1i.position.y = y;
                    scene.add(rellen1i);
                    collidableList.push(rellen1i);
    }
    //-------------------------------------------------------------------
    //CUADROS DE RELLENO
    //-------------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionZ = 100;
    var x = -1000;
    var z = -950;
    var y = 45;

    for (var i = 0; i < 8; i++) {
            var relle2i = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    relle2i.position.z = (positionZ * i) + z;
                    relle2i.position.x = x;
                    relle2i.position.y = y;
                    scene.add(relle2i);
                    collidableList.push(relle2i);
    }
    //------------------------------------------------------------------
    //
    //-------------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionZ = 100;
    var x = -1000;
    var z = -1000;
    var y = 45;

    for (var i = 0; i < 9; i++) {
            var rellen2i = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    rellen2i.position.z = (positionZ * i) + z;
                    rellen2i.position.x = x;
                    rellen2i.position.y = y;
                    scene.add(rellen2i);
                    collidableList.push(rellen2i);
    }

    //
    //-------------------------------------------------------------------
    //CUADROS DE RELLENO
    //-------------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionZ = 100;
    var x = 1350;
    var z = -1250;
    var y = 45;

    for (var i = 0; i < 12; i++) {
            var relleim = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    relleim.position.z = (positionZ * i) + z;
                    relleim.position.x = x;
                    relleim.position.y = y;
                    scene.add(relleim);
                    collidableList.push(relleim);
    }
    //------------------------------------------------------------------
    //
    //-------------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionZ = 100;
    var x = 1350;
    var z = -1300;
    var y = 45;

    for (var i = 0; i < 12; i++) {
            var rellenim = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    rellenim.position.z = (positionZ * i) + z;
                    rellenim.position.x = x;
                    rellenim.position.y = y;
                    scene.add(rellenim);
                    collidableList.push(rellenim);
    }
    //-------------------------------------------------------------------
    //CUADROS DE RELLENO
    //-------------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionZ = 100;
    var x = 1150;
    var z = -1050;
    var y = 45;

    for (var i = 0; i < 10; i++) {
            var relle1im = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    relle1im.position.z = (positionZ * i) + z;
                    relle1im.position.x = x;
                    relle1im.position.y = y;
                    scene.add(relle1im);
                    collidableList.push(relle1im);
    }
    //------------------------------------------------------------------
    //
    //-------------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionZ = 100;
    var x = 1150;
    var z = -1000;
    var y = 45;

    for (var i = 0; i < 9; i++) {
            var rellen1im = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    rellen1im.position.z = (positionZ * i) + z;
                    rellen1im.position.x = x;
                    rellen1im.position.y = y;
                    scene.add(rellen1im);
                    collidableList.push(rellen1im);
    }
    //-------------------------------------------------------------------
    //CUADROS DE RELLENO
    //-------------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionZ = 100;
    var x = 1000;
    var z = -950;
    var y = 45;

    for (var i = 0; i < 8; i++) {
            var relle2im = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    relle2im.position.z = (positionZ * i) + z;
                    relle2im.position.x = x;
                    relle2im.position.y = y;
                    scene.add(relle2im);
                    collidableList.push(relle2im);
    }
    //------------------------------------------------------------------
    //
    //-------------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionZ = 100;
    var x = 1000;
    var z = -1000;
    var y = 45;

    for (var i = 0; i < 9; i++) {
            var rellen2im = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    rellen2im.position.z = (positionZ * i) + z;
                    rellen2im.position.x = x;
                    rellen2im.position.y = y;
                    scene.add(rellen2im);
                    collidableList.push(rellen2im);
    }

    //
    //-------------------------------------------------------------------
    //CUADROS DE RELLENO
    //-------------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionZ = 100;
    var x = -1350;
    var z = 200;
    var y = 45;

    for (var i = 0; i < 12; i++) {
            var relle3 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    relle3.position.z = (positionZ * i) + z;
                    relle3.position.x = x;
                    relle3.position.y = y;
                    scene.add(relle3);
                    collidableList.push(relle3);
    }
    //------------------------------------------------------------------
    //
    //-------------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionZ = 100;
    var x = -1350;
    var z = 150;
    var y = 45;

    for (var i = 0; i < 12; i++) {
            var rellen3 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    rellen3.position.z = (positionZ * i) + z;
                    rellen3.position.x = x;
                    rellen3.position.y = y;
                    scene.add(rellen3);
                    collidableList.push(rellen3);
    }
    //-------------------------------------------------------------------
    //CUADROS DE RELLENO
    //-------------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionZ = 100;
    var x = -1150;
    var z = 150;
    var y = 45;

    for (var i = 0; i < 10; i++) {
            var relle4 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    relle4.position.z = (positionZ * i) + z;
                    relle4.position.x = x;
                    relle4.position.y = y;
                    scene.add(relle4);
                    collidableList.push(relle4);
    }
    //------------------------------------------------------------------
    //
    //-------------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionZ = 100;
    var x = -1000;
    var z = 200;
    var y = 45;

    for (var i = 0; i < 9; i++) {
            var rellen5 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    rellen5.position.z = (positionZ * i) + z;
                    rellen5.position.x = x;
                    rellen5.position.y = y;
                    scene.add(rellen5);
                    collidableList.push(rellen5);
    }
    //-------------------------------------------------------------------
    //CUADROS DE RELLENO
    //-------------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionZ = 100;
    var x = -1000;
    var z = 250;
    var y = 45;

    for (var i = 0; i < 8; i++) {
            var relle5 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    relle5.position.z = (positionZ * i) + z;
                    relle5.position.x = x;
                    relle5.position.y = y;
                    scene.add(relle5);
                    collidableList.push(relle5);
    }
    //------------------------------------------------------------------
    //
    //-------------------------------------------------------------------
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionZ = 100;
    var x = -1150;
    var z = 200;
    var y = 45;

    for (var i = 0; i < 9; i++) {
            var rellen2 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    rellen2.position.z = (positionZ * i) + z;
                    rellen2.position.x = x;
                    rellen2.position.y = y;
                    scene.add(rellen2);
                    collidableList.push(rellen2);
    }

    //------------------------------------------------------------------.
    //
    //
    //
    //
    //---------------------------------------------------------------------

    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionX = 100;
    var x = -900;
    var z = -1000;
    var y = 45;

    for (var i = 0; i < 8; i++) {
            var rz = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    rz.position.x = (positionX * i) + x;
                    rz.position.z = z;
                    rz.position.y = y;
                    scene.add(rz);
                    collidableList.push(rz);
    }

    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionX = 100;
    var x = -1050;
    var z = -1000;
    var y = 45;

    for (var i = 0; i < 9; i++) {
            var rz1 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    rz1.position.x = (positionX * i) + x;
                    rz1.position.z = z;
                    rz1.position.y = y;
                    scene.add(rz1);
                    collidableList.push(rz1);
    }
    
    //------------------------------------------------------------------.
    //
    //
    //
    //
    //---------------------------------------------------------------------

    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionX = 100;
    var x = -1150;
    var z = -1150;
    var y = 45;

    for (var i = 0; i < 9; i++) {
            var rz2 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    rz2.position.x = (positionX * i) + x;
                    rz2.position.z = z;
                    rz2.position.y = y;
                    scene.add(rz2);
                    collidableList.push(rz2);
    }

    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionX = 100;
    var x = -1100;
    var z = -1150;
    var y = 45;

    for (var i = 0; i < 10; i++) {
            var rz3 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    rz3.position.x = (positionX * i) + x;
                    rz3.position.z = z;
                    rz3.position.y = y;
                    scene.add(rz3);
                    collidableList.push(rz3);
    }

    //------------------------------------------------------------------.
    //
    //
    //
    //
    //---------------------------------------------------------------------

    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionX = 100;
    var x = -1000;
    var z = -1350;
    var y = 45;

    for (var i = 0; i < 10; i++) {
            var rz2 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    rz2.position.x = (positionX * i) + x;
                    rz2.position.z = z;
                    rz2.position.y = y;
                    scene.add(rz2);
                    collidableList.push(rz2);
    }

    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionX = 100;
    var x = -1150;
    var z = -1350;
    var y = 45;

    for (var i = 0; i < 10; i++) {
            var rz3 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    rz3.position.x = (positionX * i) + x;
                    rz3.position.z = z;
                    rz3.position.y = y;
                    scene.add(rz3);
                    collidableList.push(rz3);
    }

    //------------------------------------------------------------------
    var positionX = 100;
    var x = 200;
    var z = 1350;
    var y = 45;

    for (var i = 0; i < 10; i++) {
            var mio = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    mio.position.x = (positionX * i) + x;
                    mio.position.z = z;
                    mio.position.y = y;
                    scene.add(mio);
                    collidableList.push(mio);
    }

    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionX = 100;
    var x = 150;
    var z = 1350;
    var y = 45;

    for (var i = 0; i < 10; i++) {
            var rz3 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    rz3.position.x = (positionX * i) + x;
                    rz3.position.z = z;
                    rz3.position.y = y;
                    scene.add(rz3);
                    collidableList.push(rz3);
    }


    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionX = 100;
    var x = 150;
    var z = 1200;
    var y = 45;

    for (var i = 0; i < 10; i++) {
            var mio3 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    mio3.position.x = (positionX * i) + x;
                    mio3.position.z = z;
                    mio3.position.y = y;
                    scene.add(mio3);
                    collidableList.push(mio3);
    }

    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionX = 100;
    var x = 200;
    var z = 1200;
    var y = 45;

    for (var i = 0; i < 10; i++) {
            var mio33 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    mio33.position.x = (positionX * i) + x;
                    mio33.position.z = z;
                    mio33.position.y = y;
                    scene.add(mio33);
                    collidableList.push(mio33);
    }

    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionX = 100;
    var x = 250;
    var z = 1000;
    var y = 45;

    for (var i = 0; i < 7; i++) {
            var mio33 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    mio33.position.x = (positionX * i) + x;
                    mio33.position.z = z;
                    mio33.position.y = y;
                    scene.add(mio33);
                    collidableList.push(mio33);
    }

    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionX = 100;
    var x = 200;
    var z = 1000;
    var y = 45;

    for (var i = 0; i < 8; i++) {
            var mio33 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    mio33.position.x = (positionX * i) + x;
                    mio33.position.z = z;
                    mio33.position.y = y;
                    scene.add(mio33);
                    collidableList.push(mio33);
    }
    
    //------------------------------------------------------------------
    
    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionX = 100;
    var x = -850;
    var z = 1000;
    var y = 45;

    for (var i = 0; i < 7; i++) {
            var lio = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    lio.position.x = (positionX * i) + x;
                    lio.position.z = z;
                    lio.position.y = y;
                    scene.add(lio);
                    collidableList.push(lio);
    }

    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionX = 100;
    var x = -900;
    var z = 1000;
    var y = 45;

    for (var i = 0; i < 7; i++) {
            var lio11 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    lio11.position.x = (positionX * i) + x;
                    lio11.position.z = z;
                    lio11.position.y = y;
                    scene.add(lio11);
                    collidableList.push(lio11);
    }

    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionX = 100;
    var x = -1050;
    var z = 1200;
    var y = 45;

    for (var i = 0; i < 10; i++) {
            var lio2 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    lio2.position.x = (positionX * i) + x;
                    lio2.position.z = z;
                    lio2.position.y = y;
                    scene.add(lio2);
                    collidableList.push(lio2);
    }

    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionX = 100;
    var x = -1000;
    var z = 1200;
    var y = 45;

    for (var i = 0; i < 9; i++) {
            var lio22 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    lio22.position.x = (positionX * i) + x;
                    lio22.position.z = z;
                    lio22.position.y = y;
                    scene.add(lio22);
                    collidableList.push(lio22);
    }


    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionX = 100;
    var x = -1100;
    var z = 1350;
    var y = 45;

    for (var i = 0; i < 10; i++) {
            var lio3 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    lio3.position.x = (positionX * i) + x;
                    lio3.position.z = z;
                    lio3.position.y = y;
                    scene.add(lio3);
                    collidableList.push(lio3);
    }

    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionX = 100;
    var x = -1050;
    var z = 1350;
    var y = 45;

    for (var i = 0; i < 9; i++) {
            var lio33 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    lio33.position.x = (positionX * i) + x;
                    lio33.position.z = z;
                    lio33.position.y = y;
                    scene.add(lio33);
                    collidableList.push(lio33);
    }
    
    //--------------------------------------------------------------------


    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionX = 100;
    var x = 200;
    var z = -1350;
    var y = 45;

    for (var i = 0; i < 10; i++) {
            var lio4 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    lio4.position.x = (positionX * i) + x;
                    lio4.position.z = z;
                    lio4.position.y = y;
                    scene.add(lio4);
                    collidableList.push(lio4);
    }

    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionX = 100;
    var x = 250;
    var z = -1350;
    var y = 45;

    for (var i = 0; i < 9; i++) {
            var lio44 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    lio44.position.x = (positionX * i) + x;
                    lio44.position.z = z;
                    lio44.position.y = y;
                    scene.add(lio44);
                    collidableList.push(lio44);
    }

    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionX = 100;
    var x = 150;
    var z = -1150;
    var y = 45;

    for (var i = 0; i < 10; i++) {
            var lio4 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    lio4.position.x = (positionX * i) + x;
                    lio4.position.z = z;
                    lio4.position.y = y;
                    scene.add(lio4);
                    collidableList.push(lio4);
    }

    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionX = 100;
    var x = 200;
    var z = -1150;
    var y = 45;

    for (var i = 0; i < 10; i++) {
            var lio55 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    lio55.position.x = (positionX * i) + x;
                    lio55.position.z = z;
                    lio55.position.y = y;
                    scene.add(lio55);
                    collidableList.push(lio55);
    }

    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/rock.jpg')
    });

    var positionX = 100;
    var x = 150;
    var z = -1000;
    var y = 45;

    for (var i = 0; i < 10; i++) {
            var lio6 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    lio6.position.x = (positionX * i) + x;
                    lio6.position.z = z;
                    lio6.position.y = y;
                    scene.add(lio6);
                    collidableList.push(lio6);
    }

    cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/textures/MADERA.jpg')
    });

    var positionX = 100;
    var x = 200;
    var z = -1000;
    var y = 45;

    for (var i = 0; i < 10; i++) {
            var lio66 = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    lio66.position.x = (positionX * i) + x;
                    lio66.position.z = z;
                    lio66.position.y = y;
                    scene.add(lio66);
                    collidableList.push(lio66);
    }
}

/**
 * Function to render application over
 * and over.
 */
function animateScene() {
    requestAnimationFrame(animateScene);
    renderer.render(scene, cameras.current);
    updateScene();
}
var cronometro;
    function deternese(){
        clearInterval(cronometro);
    }
    function carga(){
        contador_s=0;
        contador_m=0;
        s = document.getElementById("segundos");
        m = document.getElementById("minutos");
        cronometro = setInterval(
            function(){
                if(contador_s==60)
                {
                    contador_s=0;
                    contador_m++;0
                    if (contador_m == 1){
                        //initScene();
                        showHideGame();
                        //regresar();
                        //initObjects();
                        contador_m = 0;
                    }
                    m.innerHTML = contador_m;
                }
                s.innerHTML = contador_s;
                contador_s++;
            }
            ,1000);
    }

/**
 * Function to evaluate logic over and
 * over again.
 */

var step = 0;
function updateScene() {
    lastTime = Date.now();
    //--------------------------------------------------------
    //Hacer que la plataforma suba y baje
    //--------------------------------------------------------
    step +=0.002;
    powerup3.position.y = 2 + (400*Math.abs(Math.sin(step)))
    //--------------------------------------------------------
    //
    //--------------------------------------------------------
    powerup4.position.y = 2 + (400*Math.abs(Math.sin(step)))
    //--------------------------------------------------------
    //
    //--------------------------------------------------------
    powerup5.position.y = 2 + (400*Math.abs(Math.sin(step)))
    //--------------------------------------------------------
    //
    //--------------------------------------------------------
    powerup8.position.y = 2 + (400*Math.abs(Math.sin(step)))

    
    
    
    //Updating camera view by control inputs
    cameraControl.update();
    //Updating FPS monitor
    stats.update();
    //Sound Update
    sound1.update(players.p1.element);
    sound2.update(players.p1.element);

    //Players controls
    for (const player of Object.keys(players)) {
        if( players[player] != null ){
            players[player].updateControls();
            players[player].collidableBox.update(players[player].control);
        }
    }


    for (const label of Object.keys(labels)) {
        labels[label].lookAt(cameras.current.position);
        if(label == "p1"){
            labels[label].position.copy(players.p1.element.position);
        }
        if(label == "p2"){
            labels[label].position.copy(players.p2.element.position);
        }
    }

    if(powerup2.position.y > 45 && !powerup2.isInUse){
            powerup2.position.y -= 1;
    }
    if(powerup21.position.y > 45 && !powerup21.isInUse){
        powerup21.position.y -= 1;
}
    if(powerup6.position.y > 45 && !powerup6.isInUse){
    powerup6.position.y -= 1;
}
    if(powerup7.position.y > 45 && !powerup7.isInUse){
    powerup7.position.y -= 1;
}
    


}



function onWindowResize() {
    cameras.current.aspect = window.innerWidth / window.innerHeight;
    cameras.current.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

