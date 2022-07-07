var debug = false;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, 1920 / 1080, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( 1920, 1080 );
document.body.appendChild( renderer.domElement );

const fontURL = "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_regular.typeface.json";

const planetRadius = 6.5;
const distanceToPlanet = 10;


function init() {

    // world

    renderer.setClearColor( 0x07020c, 1 ); // 0x021A28

    //  camera
    if (debug){
        camera.position.x = -20;
        camera.rotation.y = -Math.PI / 2; 
    }

    // from the side
    camera.position.z = 5;
    camera.position.y = 9

    // planet
    const geometry = new THREE.CircleGeometry( planetRadius, 64 );


    // gradient from 0xFD00A7 to 0xFF00FF from image
    const material = new THREE.MeshBasicMaterial(  { map: new THREE.TextureLoader().load( "texture.png" ) } );
    

   // const material = new THREE.MeshBasicMaterial( { color: 0xFD00A7 } );

    planet = new THREE.Mesh( geometry, material );

    planet.position.y = 2;
    scene.add( planet );

    // emotes
    group = new THREE.Group();
    scene.add( group );

}
var tick = 270;
function animate() {
    requestAnimationFrame( animate );

    tick++;

    // move group in a paravola
    //group.position.y = -Math.sin( tick/500 + 10 ) * distanceToPlanet;
    //group.position.z = Math.cos( tick/500 + 10 ) * distanceToPlanet; 

    // for every emote
    for (var i = 0; i < group.children.length; i++) {
        // move emote
        group.children[i].position.y = -Math.sin( tick/500 + i/10 ) * distanceToPlanet * (Math.sqrt(1-group.children[i].position.x**2/distanceToPlanet**2));
        group.children[i].position.z = Math.cos( tick/500 + i/10 )  * distanceToPlanet * (Math.sqrt(1-group.children[i].position.x**2/distanceToPlanet**2));
    
    }



    



    //steps += 1

    // distance between the group and the planet in x axies and y axies


    //group.position.y = (distanceToPlanet * Math.cos(2 * Math.PI * 2 / steps));
    //group.position.z = (distanceToPlanet * Math.sin(2 * Math.PI * 2 / steps));

    // move around the planet
    //group.rotation.x += 0.01;
    

   // group.position.z = distance * Math.sin(angle);

    //group.position.y = group.position.y + (Math.sin(angle * Math.PI/180.0))/30;
    //group.position.z = group.position.z + (Math.cos(angle * Math.PI/180.0))/30;


    if(debug){
        const points = [];

        points.push( new THREE.Vector3(  group.position.x, group.position.y, group.position.z ) );
        points.push( new THREE.Vector3(  planet.position.x, planet.position.y, planet.position.z ) );

        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );


        const line = new THREE.Line( geometry, material );
        scene.add( line );
    }

    renderer.render( scene, camera );
};

function createEmote(url) {
    // create a plane to hold the image texture of the emote
    const geometry = new THREE.PlaneGeometry( 0.1, 0.1 );
    const material = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( url ) } );
    const plane = new THREE.Mesh( geometry, material );

    plane.material.transparent = true;

    const x = Math.random() * 25 - 12.5
    const y = Math.random() * 2 - 2

    plane.position.x = x;
    plane.position.y = y;
    plane.position.z = 0;



    group.add( plane );

    // remove after 15 secounds
    setTimeout(function(){
        group.remove( plane );
    }, 30000);
}

init();
animate();

/*for(var i = 0; i < 17; i++){
    createEmote('https://cdn.frankerfacez.com/emote/210748/2')
}*/

const client = new tmi.Client({
	channels: [ 'dylanterolive' ]
});

client.connect();

let regex = new RegExp(/\${}\s/gm);


client.on('message', async (channel, tags, message, self) => {
    /// for every emote using foreach
     for (var i = 0; i < emotes.length; i++) {
        let emote = emotes[i];
        
        let regex = new RegExp(`(^|\s)${emote.emoteName}($| )`, "gm");
        let match = message.match(regex);
        // if there are emotes in the message
        if (match) {
            for (let i = 0; i < Math.floor(Math.random() * 10) + 10; i++) {
                setTimeout(() => {

                createEmote(emote.emoteURL);
                }, i * 100);
            }

        }

        //console.log(emoteName)
    }
})

// toggle debug mode with d
document.addEventListener('keydown', (event) => {
    /*if (event.keyCode === 68) {
        debug = !debug;

        if (debug){
            camera.position.x = -20;
            camera.rotation.y = -Math.PI / 2; 
        }else{
            camera.position.x = 0;
            camera.rotation.y = 0; 
        }
    }*/
})