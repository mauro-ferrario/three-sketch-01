import * as THREE from "three";
import {TweenMax, Power2, TimelineLite} from "gsap/TweenMax";
import PopUpMesh from "./popUpMesh";
import cubicBezier from "../helpers/bezier";

export default class extends THREE.Group{
  constructor(){
    super();
    this.pointerPos = new THREE.Vector3();
    this.startColor = new THREE.Color(1, 1, 1);
    this.endColor = new THREE.Color(1, 1, 1);
    this.oldPos = new THREE.Vector3();
    this.targetPos = new THREE.Vector3();
    this.setupTypes();
    this.setFrequency(0.06);
    this.setSpread(50);
    this.setDistanceForPath(70);
    this.meshes = [];
    this.addPointer(-500);
    this.setMaxVisibleMesh(31);
  }

  setupTypes(){
    this.types = ["cube", "cylinder", "cone"];
    this.currentType = this.types[0];
  }

  setSpread(spread){
    this.spread = spread;
  }

  setFrequency(freq){
    this.meshFlowFrequency = freq;
  }

  setMaxVisibleMesh(maxMesh){
    this.maxMesh = maxMesh;
  }

  setDistanceForPath(distance){
    this.distanceForPath = distance;

  }
  movePointer(x, z, nextColor){
    this.setStartAndEndColor(nextColor);
    this.setTargetAndOldPos(x,z);
    this.percFromTarget = 0;
    this.setNewRandomType();
    this.setupAnimation(x,z);
    this.startAnimation();
  }

  setTargetAndOldPos(x,z){
    this.oldPos.x = this.pointerPos.x;
    this.oldPos.y = this.pointerPos.y;
    this.oldPos.z = this.pointerPos.z;
    this.targetPos.x = x;
    this.targetPos.y = 0;
    this.targetPos.z = z;
  }

  setStartAndEndColor(nextColor){
    this.startColor = this.endColor;
    this.endColor = nextColor;
  }

  setupAnimation(finalX = 500, finalZ = -500){
    this.animation = TweenMax.to(this.pointerPos, 1.5, { 
      delay: 0,
      ease: Power2.easeOut,
      x: finalX,
      z: finalZ, 
      onStart: this.onStart.bind(this),
      onComplete: this.onComplete.bind(this)
    });
    this.animation.pause();
    this.isMoving = false;
  }

  startAnimation(){
    this.animation.play();
  }

  update(){
    const percFromTarget = this.getPercFromTarget();
    this.currentColor = this.colourGradientor(percFromTarget, this.startColor,this.endColor);
    this.updatePointer();
    if(this.canAddNewMesh())
      this.addNewMeshAlongPath();
    this.updateMeshes();
  }

  getPercFromTarget(){
    const maxDistance = this.oldPos.distanceTo(this.targetPos);
    const currentDistance = this.pointerPos.distanceTo(this.targetPos);
    const distance = currentDistance/maxDistance;
    return Math.min(Math.max(distance, 0.0), 1.0);
  }

  updateMeshes(){
    const totMesh = this.meshes.length;
    for(let i = totMesh -1; i >= 0; i--){
      const mesh = this.meshes[i];
      if(this.needToRemoveMesh(mesh, i, totMesh))
        mesh.animateOut();
      mesh.update();
      if(mesh.canRemove)
        this.removeMesh(mesh, i);
    }  
  }

  colourGradientor(p, rgb_beginning, rgb_end){
    let w = p * 2 - 1;
    let w1 = (w + 1) / 2.0;
    let w2 = 1 - w1;
    const color = new THREE.Color();
    color.r = rgb_beginning.r * w1 + rgb_end.r * w2;
    color.g = rgb_beginning.g * w1 + rgb_end.g * w2;
    color.b = rgb_beginning.b * w1 + rgb_end.b * w2;
    return color;
  };

  removeMesh(mesh, meshIndex){
    this.remove(mesh);
    this.meshes.splice(meshIndex, 1);
  }

  needToRemoveMesh(mesh, meshIndex, totMesh){
    const distance = totMesh - meshIndex;
    return distance > this.maxMesh && !mesh.isAnimatingOutro;
  }

  canAddNewMesh(){
    return Math.random() > this.meshFlowFrequency && this.isMoving;
  }

  addNewMeshAlongPath(){
    const meshPos = this.getRandomPositionAlongPath();
    const tempMesh = new PopUpMesh(meshPos.x, meshPos.z, this.currentType, this.currentColor);
    this.meshes.push(tempMesh);
    this.add(tempMesh);
  }

  getRandomPositionAlongPath(){
    const negativeOrPositive = (Math.random() > 0.5) ? -1 : 1;
    const x = this.pointerPos.x + this.getRandomArbitrary(this.distanceForPath, this.spread) * negativeOrPositive;
    const z = this.pointerPos.z + this.getRandomArbitrary(this.distanceForPath, this.spread) * negativeOrPositive;
    return {x, z};
  }

  updatePointer(){
    this.pointer.position.set(this.pointerPos.x, 14, this.pointerPos.z);
  }

  setNewRandomType(){
    const randomMeshPos = parseInt(this.getRandomArbitrary(0,2));
    this.currentType = this.types[randomMeshPos];
  }

  getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  onStart(){
    this.isMoving = true;
  }

  onComplete(){
    this.isMoving = false;
  }

  addPointer(x = 0, z = 0){
    const mat = new THREE.MeshLambertMaterial({
        color: 0xff0000,
        flatShading: THREE.FlatShading,
    });
    this.pointer = new THREE.Mesh( this.getGeometry(), mat );
    this.pointer.castShadow = true;
    this.pointer.position.set(x, 1, z);
    this.add(this.pointer);
  }

  getGeometry(){
    const radius = 14;
    const widthSegments = 22;
    const heightSegments = 28;
    const geometry = new THREE.SphereBufferGeometry(radius, widthSegments, heightSegments);
    return geometry;
  }
}


