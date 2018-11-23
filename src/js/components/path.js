import * as THREE from "three";
import {TweenMax, Power2, TimelineLite} from "gsap/TweenMax";
import PopUpMesh from "./popUpMesh";
import cubicBezier from "../helpers/bezier";

export default class extends THREE.Group{
  constructor(){
    super();
    this.setupTypes();
    this.setFrequency(0.06);
    this.setSpread(50);
    this.setDistanceForPath(70);
    this.pointerPos = {x: -500, z: 0};
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
  movePointer(x, z){
    this.setNewRandomType();
    this.setupAnimation(x,z);
    this.startAnimation();
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
    this.updatePointer();
      if(this.canAddNewMesh())
        this.addNewMeshAlongPath();
      this.updateMeshes();
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
    this.currentColor = Math.random()*0xffffff;
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


