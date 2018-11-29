import * as THREE from "three";
import OrbitControls from "three-orbitcontrols";

import dat from "../dataarts/dat.gui.min";
import Stats from "../mrdoob/stats.js";

export class SceneUI {
  constructor(threeBase){
    this.threeBase = threeBase;
    this.addParameters();
  }

  addParameters(){
      this.shadowLightVisible = true;
      this.ambientLightVisible = true;
      this.shadowLightPosX = 150;
      this.shadowLightPosY = 350;
      this.shadowLightPosZ = 350;
  }
}

export default class ThreeBase{
    constructor(target, showGui = true){
      this.setup();
      this.setupScene();
      this.setupVariables();
      this.setupRender();
      this.setupCamera();
      this.setupLight();
      this.setupGUI(SceneUI, showGui);
      this.animate();
      target.appendChild( this.renderer.domElement );
      window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
      document.addEventListener( 'mousemove', this.onDocumentMouseMove.bind(this), false );
      document.addEventListener( 'click', this.onDocumentClick.bind(this), false );
      this.onWindowResize();
  }

  setup(){
    this.gui;
    this.mouse = new THREE.Vector2();
    this.onMouseClickFunction;
    this.onMouseMoveFunction;
    this.onMouseNotOverFunction;
    this.interactiveObjects = [];
    this.setRaycastChildren(false);
  }

  setupVariables(){

  }

  setupGUI(CustomUiClass, showGui = true){
    this.gui = new dat.GUI();
    this.ui = new CustomUiClass(this);
    const lights = this.gui.addFolder('Lights')
    const directionalLight = this.gui.addFolder('Directional light')
    lights.add(this.ui, "ambientLightVisible");
    directionalLight.add(this.ui, "shadowLightVisible");
    directionalLight.add(this.ui, "shadowLightPosX", -300, 300);
    directionalLight.add(this.ui, "shadowLightPosY", -300, 300);
    directionalLight.add(this.ui, "shadowLightPosZ", -300, 300);
    if(!showGui)
      this.gui.__proto__.constructor.toggleHide();
    else
     this.addStats();
  }

  setupScene()
  {
    if(!this.scene){
      this.scene = new THREE.Scene();
    }
  }

  setupCamera({useOrbit= false, fov= 50, near= .1, far= 1000} = {})
  { 
    this.camera = new THREE.PerspectiveCamera( this.cameraFov, window.innerWidth/window.innerHeight, near, far);
    this.camera.fov = fov;
    this.cameraFov = fov;
    this.camera.lookAt(0,0,0);
    if(useOrbit){
      this.setupOrbitControls();
    }
  }

  setupOrbitControls(){
    this.orbit = new OrbitControls( this.camera, this.renderer.domElement );
    this.orbit.enableDamping = true
    this.orbit.dampingFactor = 0.25
    this.orbit.enableZoom = true;
  }

  setupLight()
  {
    // A directional light shines from a specific direction.
    // It acts like the sun, that means that all the rays produced are parallel.
    this.shadowLight = new THREE.DirectionalLight(0xffffff, .9);
    // Set the direction of the light
    this.shadowLight.position.set(150, 350, 350);
    // Allow shadow casting
    this.shadowLight.castShadow = true;
    // define the visible area of the projected shadow
    this.shadowLight.shadow.camera.left = -400;
    this.shadowLight.shadow.camera.right = 400;
    this.shadowLight.shadow.camera.top = 400;
    this.shadowLight.shadow.camera.bottom = -400;
    this.shadowLight.shadow.camera.near = 1;
    this.shadowLight.shadow.camera.far = 1000;
    // define the resolution of the shadow; the higher the better,
    // but also the more expensive and less performant
    // this.shadowLight.shadow.mapSize.width = 1024;
    // this.shadowLight.shadow.mapSize.height = 1024;
    this.ambientLight = new THREE.AmbientLight(0xffffff, .5);
    // to activate the lights, just add them to the scene
    this.scene.add(this.shadowLight);
    this.scene.add(this.ambientLight);
  }

  setupRender({enableShadow= false} = {})
  {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    } );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.aspectRatio = window.innerWidth/window.innerHeight;
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.setClearColor( 0xffffff );
    if(enableShadow)
      this.renderer.shadowMap.enabled = true;
  }

  animate(timestamp)
  {
    if(this.ui)
      this.updateDataFromUI();
    if(this.stats)
      this.stats.begin();
    this.updateScene(timestamp);
    if(this.stats)
        this.stats.end(); 
    this.render();
    requestAnimationFrame( this.animate.bind(this) );
  }

  updateScene(timestamp){

  }

  updateDataFromUI(){
    this.shadowLight.visible = this.ui.shadowLightVisible;
    this.ambientLight.visible = this.ui.ambientLightVisible;
    this.shadowLight.position.set(this.ui.shadowLightPosX, this.ui.shadowLightPosY, this.ui.shadowLightPosZ);
  }

  render()
  {
    if(this.renderer)
      this.renderer.render( this.scene, this.camera);
  }

  onWindowResize()
  {
    this.resetCamera();
    this.render();
  }

  resetCamera(){
    var dist = this.camera.position.z;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
  }

  onDocumentMouseMove( event )
  {
    if(this.onMouseMoveFunction || this.onMouseOverFunction || this.onMouseClickFunction)
      this.saveMousePos(event);
    if(this.onMouseMoveFunction)
      this.checkOver(this.interactiveObjects);
  }

  saveMousePos(event){
    event.preventDefault();
    this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  }

  onDocumentClick( event )
  {
    event.preventDefault();
    if(this.onMouseClickFunction){
      this.checkOver(this.interactiveObjects, "click");
    }
  }

  addInteractiveObject(obj){
    this.interactiveObjects.push(obj);
  }

  setRaycastChildren(raycastChildren){
    this.raycastChildren = raycastChildren;
  }

  checkOver(toCheck, event)
  {
    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera( this.mouse, this.camera );
    // Add second parameter to true to check also the children of the object
    var intersects = raycaster.intersectObjects( toCheck, this.raycastChildren);
    if(intersects.length > 0){
      if(this.onMouseMoveFunction && !event)
        this.onMouseMoveFunction(intersects);
      if(this.onMouseClickFunction && event == "click")
        this.onMouseClickFunction(intersects);
    }
    else{
      this.onMouseNotOver();
    }
  }

  onMouseNotOver(){
    if(this.onMouseNotOverFunction){
      this.onMouseNotOverFunction();
    }
  }

  addStats(){
    this.stats = new Stats();
    this.stats.showPanel(0);
    document.body.appendChild( this.stats.dom );
  }

  showCamereInfo(){
    console.log(this.camera);
  }
}