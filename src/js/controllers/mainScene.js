import ThreeBase, {SceneUI} from "../libs/mauroferrario/ThreeBase"
import * as THREE from "three";
import Path from "../components/path";

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

  onMouseClick(intersects){
    if(intersects[0].object == this.plane){
      let pos = intersects[0].point;
      this.path.movePointer(pos.x,pos.z);
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
    const geometry = new THREE.PlaneGeometry( 2250, 2250, 2 );
    const mat = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        flatShading: THREE.FlatShading,
    });
    this.plane = new THREE.Mesh( geometry, mat );
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
  } 
}