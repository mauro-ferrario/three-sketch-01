import TargetGroup from './targetGroup';
import { EventEmitter } from 'events';

export default class extends EventEmitter{
  constructor(planeSize, mainScene){
    super();
    this.scene = mainScene;
    this.planeSize = planeSize;
    this.targets = [];
  }

  showNewTarget(){
    const meshPos = this.getRandomPosition();
    const tempMesh = new TargetGroup(meshPos.x, meshPos.z, 'cube', Math.random()*0xffffff);
    this.scene.add(tempMesh);
    this.targets.push(tempMesh);
    this.emit('add-new-target', tempMesh);
  }
  
  update(){
    const totTargets = this.targets.length;
    for(let i = totTargets -1; i >= 0; i--){
      const target = this.targets[i];
      // if(this.needToRemoveMesh(mesh, i, totMesh))
      //   mesh.animateOut();
      target.update();
      // if(mesh.canRemove)
      //   this.removeMesh(mesh, i);
    }  
  }

  getRandomPosition(){
    return {
      x: this.planeSize.x * Math.random() - this.planeSize.x*0.5,
      z: this.planeSize.y * Math.random()- this.planeSize.y*0.5
    }
  }
}