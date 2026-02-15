import React, { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

export default function Npc(props) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/models/NPC.glb");
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions && actions["Idle"]) {
      actions["Idle"].reset().fadeIn(0.3).play();
    }

    return () => {
      if (actions && actions["Idle"]) {
        actions["Idle"].fadeOut(0.3);
      }
    };
  }, [actions]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <skinnedMesh
            geometry={nodes.Ch31_Body.geometry}
            material={materials["Ch31_body.001"]}
            skeleton={nodes.Ch31_Body.skeleton}
          />
          <skinnedMesh
            geometry={nodes.Ch31_Collar.geometry}
            material={materials["Ch31_body.001"]}
            skeleton={nodes.Ch31_Collar.skeleton}
          />
          <skinnedMesh
            geometry={nodes.Ch31_Eyelashes.geometry}
            material={materials["Ch31_hair.001"]}
            skeleton={nodes.Ch31_Eyelashes.skeleton}
          />
          <skinnedMesh
            geometry={nodes.Ch31_Hair.geometry}
            material={materials["Ch31_hair.001"]}
            skeleton={nodes.Ch31_Hair.skeleton}
          />
          <skinnedMesh
            geometry={nodes.Ch31_Pants.geometry}
            material={materials["Ch31_body.001"]}
            skeleton={nodes.Ch31_Pants.skeleton}
          />
          <skinnedMesh
            geometry={nodes.Ch31_Shoes.geometry}
            material={materials["Ch31_body.001"]}
            skeleton={nodes.Ch31_Shoes.skeleton}
          />
          <skinnedMesh
            geometry={nodes.Ch31_Sweater.geometry}
            material={materials["Ch31_body.001"]}
            skeleton={nodes.Ch31_Sweater.skeleton}
          />
          <primitive object={nodes.mixamorig9Hips} />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/models/NPC.glb");
