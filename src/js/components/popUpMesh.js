import * as THREE from "three";
import {TweenMax, Power2, TimelineLite, Bounce} from "gsap/TweenMax";

export default class extends THREE.Group{
  constructor(x, z, type, color){
    super();
    this.setupMesh(type, color);
    this.meshPosition = {x: x, y: -this.height, z: z};
    this.isAnimatingOutro = false;
    this.canRemove = false;
    this.startAnimation();
  }

  startAnimation(){
    this.animation = TweenMax.to(this.meshPosition, 2.15, {
      ease: Elastic.easeOut, y: 1,
      onComplete: this.onComplete.bind(this)
    });
  }

  animateOut(){
    this.isAnimatingOutro = true;
    this.animation = TweenMax.to(this.meshPosition, 2.15, { 
      ease: Elastic.easeOut, y: -this.height - 10,
      onComplete: this.onComplete.bind(this)
    });
  }

  update(){
    this.mesh.position.set(this.meshPosition.x, this.meshPosition.y, this.meshPosition.z);
  }

  onCompleteOutro(){
    this.canRemove = true;
  }

  onComplete(){
    if(this.isAnimatingOutro){
      this.onCompleteOutro();
    }
  }

  setupMesh(type, color){
    const mat = new THREE.MeshPhongMaterial({
        color: color,
        flatShading: THREE.FlatShading,
    });
    this.mesh = new THREE.Mesh( this.getGeometry(type), mat );
    this.mesh.castShadow = true;
    this.add(this.mesh);
  }

  getGeometry(type){
    let geometry;
    let height;
    switch(type){
      case "cube":
        const width = Math.random()*48;
        height = Math.random()*148;
        const depth = Math.random()*48;
        this.height = height;
        geometry = new THREE.BoxBufferGeometry(width, height, depth);
        break;
      case "cone":
        const radius = Math.random()*48;
        height = Math.random()*148;
        const segments = 16;
        geometry = new THREE.ConeBufferGeometry(radius, height, segments);
        break;
      case "cylinder":
        const radiusTop =  Math.random()*48;;
        const radiusBottom =  Math.random()*48;;
        height =  Math.random()*148;
        const radialSegments = 12;
        geometry = new THREE.CylinderBufferGeometry(radiusTop, radiusBottom, height, radialSegments);
        break;
    }
    this.height = height;
    return geometry;
  }
}