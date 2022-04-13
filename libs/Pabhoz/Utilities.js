class Utilities {

    /*****************************
     * Labels and Canvas Textures
    ******************************/

    /**
     * @param {string} t Text the texture will have i.e "Example" 
     * @param {int} ts Text size 
     * @param {string} fw Font weight i.e "Bold"
     * @param {string} fs Font size i.e "48px" 
     * @param {string} ff Font family i.e "Arial" 
     * @param {string} c String rgba color i.e "0,0,0,1"
     * @param {int} x X position
     * @param {int} y Y position
     * 
     * @returns {THREE map} Texture Map
     */
    static textTure(t, ts, fw, fs, ff, c, x, y) {

        var canvas = document.createElement('canvas');
        canvas.width = canvas.height = ts;
        var context = canvas.getContext('2d');
        context.font = `${fw} ${fs} ${ff}`;
        context.fillStyle = `rgba("${c}")`;
        context.fillText(t, x, y);

        // canvas contents will be used for a texture
        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;

        return texture;
    }

    /**
     * 
     * @param {THREE.Vector3} position 
     * @param {THREE map} map 
     */
    static label(position,map){
        var label = new THREE.Mesh(new THREE.PlaneGeometry(10,10),
            new THREE.MeshBasicMaterial({
                map: map,
                side:THREE.DoubleSide,
                transparent: true
            })
        );
        label.position.copy(position);
        return label;
    }

    static randomHexColor(){
        return '#'+Math.floor(Math.random()*16777215).toString(16);
    }
    
    /***************
     * 3D Vectors
    ****************/

    /**
     * 
     * @param {THREE.Vector3} a 
     * @param {THREE.Vector3} b 
     */
    static twoPointsDistance(a,b){//d = b-a
        return new THREE.Vector3(b.x-a.x,b.y-a.y,b.z-a.z);
    }

    /**
     * 
     * @param {THREE.Vector3} a 
     */
    static module(a){
        return Math.sqrt( (a.x*a.x) + (a.y*a.y) + (a.z*a.z) );
    }

    /**
     * 
     * @param {THREE.Vector3} a 
     */
    static unitary(a){
        var m = Utilities.module(a);
        return new THREE.Vector3((a.x/m) , (a.y/m) , (a.z/m));
    }

    /**********
     * Promts
    ***********/

    /**
     * 
     * @param {string} theString String to parse, usually from an user prompt
     * @param {string} flag String pattern used as flag to separate inputs 
     */
    static parsePromtParams(theString,flag){
        var value = theString.split(flag);
        for (var i = 0; i < value.length; i++) {
            if(i != value.length-1) value[i] = parseFloat(value[i]);
        };
        return value;
    }
    
    /**
     * 
     * @param {array} arr Vertex array 
     */
    static toVector3(arr){
        for (let i = 0; i < arr.length; i++) {
            arr[i] = new THREE.Vector3(arr[i][0], arr[i][1], arr[i][2])
        }
        return arr;
    }

    /**
     * 
     * @param {array} p0 Initial point must be the diamond base (center) point i.e. [0,0,0]
     * @param {int} hd horizontal distance 
     * @param {int} vd vertical distance
     * @param {int} zd depth distance
     * @param {int} n Diamonds to create i.e 7
     * @param {THREE.Vector3} direction Direction to move reference point i.e. [0,1,0] is up
     */
    static getDiamonds(p0,hd,vd,zd,n,direction){
        let refXMov = (direction.x > 0) ? 1 : 0;
        let refYMov = (direction.y > 0) ? 1 : 0;
        let refZMov = (direction.z > 0) ? 1 : 0;
        
        let points = [p0];

        for (let i = 0; i < n; i++) {
            //Left
            let left = [p0[0] - hd, p0[0] + vd, p0[2] + zd];
            //Right
            let right = [p0[0] + hd, p0[0] + vd, p0[2] + zd];
            //Top
            let top = [p0[0], p0[0] + vd * 2, p0[2]];
            points.push(left);
            points.push(right);
            points.push(top);
            p0 = top;
        }

        return points;
    }
}
