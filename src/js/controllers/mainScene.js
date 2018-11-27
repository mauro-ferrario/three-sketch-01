import ThreeBase, {SceneUI} from "../libs/mauroferrario/ThreeBase"
import * as THREE from "three";
import Path from "../components/path";
import DynamicTexture from '../components/dynamicTexture';

const CustomUI = class extends SceneUI{
  constructor(threeBase){
      super(threeBase);
  }

  addParameters(){
      super.addParameters();
      this.maxVisibleMesh = 40;
      this.meshFrequency = 0.7;
      this.meshSpread = 50;
      this.distanceForPath = 70;
  }
}
  
export default class extends ThreeBase{
  constructor(){
    super();
    this.onMouseClickFunction = this.onMouseClick.bind(this);
    this.onMouseMoveFunction = this.onMouseMove;
    this.mousePos={x:0, y:0};
  }

  setupDynamicTexture(){
    this.planeTexture = new DynamicTexture(1024, 1024);
    this.textureMaterial = new THREE.Texture(this.planeTexture.canvas);
    this.textureMaterial.anisotropy = 4;
  }

  onMouseClick(intersects){
    if(intersects[0].object == this.plane){
      let pos = intersects[0].point;
      this.path.movePointer(pos.x,pos.z);
      const trailColorFromPath = this.path.currentColor;
      this.planeTexture.setTrailColor(trailColorFromPath);
    }
  }

  setupGUI(){
    super.setupGUI(CustomUI, true);
    const maxVisibleMeshController = this.gui.add(this.ui, 'maxVisibleMesh', 1, 100);
    const meshFrequencyController = this.gui.add(this.ui, 'meshFrequency', 0, 1);
    const meshSpreadController = this.gui.add(this.ui, 'meshSpread', 0, 200);
    const distanceForPathController = this.gui.add(this.ui, 'distanceForPath', 0, 100);
    maxVisibleMeshController.onChange((value) => {
      this.path.setMaxVisibleMesh(value);
    });
    meshFrequencyController.onChange((value) => {
      this.path.setFrequency(1.0 - value);
    });
    meshSpreadController.onChange((value) => {
      this.path.setSpread(value);
    });
    distanceForPathController.onChange((value) => {
      this.path.setDistanceForPath(value);
    });
  }

  setupScene() {
    super.setupScene();
    this.path = new Path();
    this.scene.add(this.path);
    this.addPlane();
  }

  setupCamera() {
    super.setupCamera({useOrbit: true, near: .1, far: 10000});
    this.camera.position.x = 0;
    this.camera.position.z = 271.1486856706307;
    this.camera.position.y = 249.84133241701113;
  }
  
  setupRender() {
    super.setupRender({enableShadow: true});
  }
  
  setup() {
    super.setup();
  }

  addPlane(){
    this.setupDynamicTexture();
    this.planeSize = {x: 2250, y: 2250};
    const geometry = new THREE.PlaneGeometry( this.planeSize.x, this.planeSize.y, 2 );
    const material = new THREE.MeshPhongMaterial({ 
      map: this.textureMaterial,
      flatShading: THREE.FlatShading
     });
    this.plane = new THREE.Mesh( geometry, material );
    this.plane.position.set(0, 0, 0);
    this.plane.rotateX(-Math.PI / 2);
    this.plane.receiveShadow = true;
    this.plane.name = "plane";
    this.scene.add(this.plane);
    this.addInteractiveObject(this.plane);
  }

  setupLight() {
    super.setupLight();
  }

  updateDataFromUI(){
    super.updateDataFromUI();
  }

  updateScene(timestamp){
    if(this.path){
      this.path.update();
    }
    if(this.planeTexture){
      this.textureMaterial.needsUpdate = true;
      const posTrail = {
        x: this.path.pointerPos.x/this.planeSize.x, 
        y: this.path.pointerPos.z/this.planeSize.y
      };
      this.planeTexture.update(posTrail.x, posTrail.y);
    }
  } 
}