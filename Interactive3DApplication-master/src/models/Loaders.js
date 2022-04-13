function loadJSON(model,onloadCallback) {

    var loader = new THREE.ObjectLoader();

    loader.load(model, onloadCallback,
        // onProgress callback
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },

        // onError callback
        function (err) {
            console.error('An error happened');
        }
    );
}
function loadOBJ(model,onloadCallback) {

    var loader = new THREE.OBJLoader();

    loader.load(model, onloadCallback,
        // onProgress callback
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },

        // onError callback
        function (err) {
            console.error('An error happened');
        }
    );
}