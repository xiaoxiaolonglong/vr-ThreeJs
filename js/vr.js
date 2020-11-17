/**
 * 网络图片
 */
// const PREFIX = 'https://vrlab-image.ljcdn.com/release/auto3dhd/e61cd08df96ab6a2dce7f8cd2aa83379/images/high_cube/0/df4325d6f15cdf18551f7f88cf4ba44c/';
// var imageArr = {
//   'up': '0_u.jpg.q_70.jpg',
//   'down': '0_d.jpg.q_70.jpg',
//   'left': '0_l.jpg.q_70.jpg',
//   'right': '0_r.jpg.q_70.jpg',
//   'front': '0_f.jpg.q_70.jpg',
//   'back': '0_b.jpg.q_70.jpg'
// };

/**
 * 本地图片
 */
var PREFIX = './imgs/';
var imageArr = {
  'up': '360VR案例01.t.jpg',
  'down': '360VR案例01.d.jpg',
  'left': '360VR案例01.l.jpg',
  'right': '360VR案例01.r.jpg',
  'front': '360VR案例01.f.jpg',
  'back': '360VR案例01.b.jpg'
};


class VRController {
  constructor() {
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.vrEvent = null;

    this.init();
    this.animate();
  }

  init() {
    // 渲染器
    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);


    // 照相机
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, .1, 1000);


    // 场景
    this.scene = new THREE.Scene();
    document.body.appendChild(this.renderer.domElement);


    this.setSceneBg();
    // this.test();
    this.drawShape();

    this.vrEvent = new VREvent(this.renderer, this.camera);
  }

  setSceneBg() {
    const urls = [];
    const posMap = {
      0: 'right',
      1: 'left',
      2: 'up',
      3: 'down',
      4: 'front',
      5: 'back'
    };

    for (var i = 0; i < 6; i++) {
      const pos = posMap[i];
      urls.push(imageArr[pos]);
    }

    const textureCube = new THREE.CubeTextureLoader()
      .setPath(PREFIX)
      .load(urls);

    this.scene.background = textureCube;
  }
  test(){

    var geometry = new THREE.BoxBufferGeometry( 20, 20, 20 );

    var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );

    object.position.x = 200;
    object.position.y = -100;
    object.position.z = 0;

    // object.rotation.x = Math.random() * 2 * Math.PI;
    // object.rotation.y = Math.random() * 2 * Math.PI;
    // object.rotation.z = Math.random() * 2 * Math.PI;

    // object.scale.x = Math.random() + 0.5;
    // object.scale.y = Math.random() + 0.5;
    // object.scale.z = Math.random() + 0.5;

    this.scene.add( object );
  }
  drawShape() {
    var _this = this;
    var light = new THREE.DirectionalLight( 0xffffff, 1 );
				light.position.set( 1, 1, 1 ).normalize();
        this.scene.add( light );
        
    var geometry = new THREE.SphereBufferGeometry( 5, 32, 32 );
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    var object = new THREE.Mesh( geometry, material );

    object.position.x = 200;
    object.position.y = -100;
    object.position.z = 0;
    
    this.scene.add(object);

    var clickObjects=[];
    clickObjects.push(object);
    initThreeClickEvent()
    function initThreeClickEvent() {
        //点击射线
        var raycaster = new THREE.Raycaster();
        var mouse = new THREE.Vector2();
        document.addEventListener('mousedown', onDocumentMouseDown, false);
        function onDocumentMouseDown(event) {
            event.preventDefault();
            mouse.x = (event.clientX / _this.renderer.domElement.clientWidth) * 2 - 1;
            mouse.y = -(event.clientY / _this.renderer.domElement.clientHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, _this.camera);

            //总结一下，这里必须装网格，mesh，装入组是没有效果的
            //所以我们将所有的盒子的网格放入对象就可以了
            // 需要被监听的对象要存储在clickObjects中。
            var intersects = raycaster.intersectObjects(clickObjects);

            // console.log(intersects)
            if(intersects.length > 0) {
                // 在这里填写点击代码
                console.log("dianji");
                console.log(intersects[0].object);

                PREFIX = 'https://vrlab-image.ljcdn.com/release/auto3dhd/e61cd08df96ab6a2dce7f8cd2aa83379/images/high_cube/0/df4325d6f15cdf18551f7f88cf4ba44c/';
                imageArr = {
                  'up': '0_u.jpg.q_70.jpg',
                  'down': '0_d.jpg.q_70.jpg',
                  'left': '0_l.jpg.q_70.jpg',
                  'right': '0_r.jpg.q_70.jpg',
                  'front': '0_f.jpg.q_70.jpg',
                  'back': '0_b.jpg.q_70.jpg'
                };
                _this.setSceneBg();
              }

        }
    }
  }
  animate() {
    requestAnimationFrame(() => this.animate());


    // -85 到 85 度之间
    const lat = Math.max(-85, Math.min(85, this.vrEvent.lat));

    // degToRad，角度转 PI
    const phi = THREE.Math.degToRad(lat);
    const theta = THREE.Math.degToRad(this.vrEvent.lon);

    this.camera.lookAt(new THREE.Vector3(
      1 * Math.cos(phi) * Math.cos(theta),
      1 * Math.sin(phi),
      1 * Math.cos(phi) * Math.sin(theta)
    ));
    this.renderer.render(this.scene, this.camera);
  }

}


class VREvent {
  constructor(renderer, camera) {
    this.renderer = renderer;
    this.camera = camera;

    this.onPointerDownPointerX = 0;
    this.onPointerDownPointerY = 0;
    this.onPointerDownLon = 0;
    this.onPointerDownLat = 0;

    this.lon = 0;
    this.lat = 0;

    this.onWindowResized = this.onWindowResized.bind(this);
    this.onDocumentMouseDown = this.onDocumentMouseDown.bind(this);
    this.onDocumentMouseWheel = this.onDocumentMouseWheel.bind(this);

    window.addEventListener('resize', this.onWindowResized, false);
    document.addEventListener('mousedown', this.onDocumentMouseDown, false);
    document.addEventListener('wheel', this.onDocumentMouseWheel, false);
  }

  onWindowResized(event) {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  onDocumentMouseDown(event) {
    event.preventDefault();
    this.onPointerDownPointerX = event.clientX;
    this.onPointerDownPointerY = event.clientY;
    this.onPointerDownLon = this.lon;
    this.onPointerDownLat = this.lat;

    this.onDocumentMouseMove = this.onDocumentMouseMove.bind(this);
    this.onDocumentMouseUp = this.onDocumentMouseUp.bind(this);
    document.addEventListener('mousemove', this.onDocumentMouseMove, false);
    document.addEventListener('mouseup', this.onDocumentMouseUp, false);
  }

  onDocumentMouseMove(event) {
    var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
    this.lon -= movementX * 0.1;
    this.lat += movementY * 0.1;
  }

  onDocumentMouseUp(event) {
    document.removeEventListener('mousemove', this.onDocumentMouseMove, false);
    document.removeEventListener('mouseup', this.onDocumentMouseUp, false);
  }

  onDocumentMouseWheel(event) {
    var fov = this.camera.fov + event.deltaY * 0.05;
    this.camera.fov = THREE.Math.clamp(fov, 10, 75);
    this.camera.updateProjectionMatrix();
  }
}
new VRController()