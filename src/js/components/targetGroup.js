import * as THREE from "three";
import PopUpMesh from "./popUpMesh";

export default class extends PopUpMesh{
  constructor(x, z, type, color){
    super(x, z, type, color);
  }
}