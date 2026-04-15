import React, { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

export default function TalkingNPC(props) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/models/TalkingNPC.glb");
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions && actions["Talking"]) {
      actions["Talking"].reset().fadeIn(0.5).play();
    }
  }, [actions]);
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <skinnedMesh
            name="Ch01_Body"
            geometry={nodes.Ch01_Body.geometry}
            material={materials.Ch01_body}
            skeleton={nodes.Ch01_Body.skeleton}
          />
          <skinnedMesh
            name="Ch01_Eyelashes"
            geometry={nodes.Ch01_Eyelashes.geometry}
            material={materials.Ch01_hair}
            skeleton={nodes.Ch01_Eyelashes.skeleton}
          />
          <skinnedMesh
            name="Ch01_Pants"
            geometry={nodes.Ch01_Pants.geometry}
            material={materials.Ch01_body}
            skeleton={nodes.Ch01_Pants.skeleton}
          />
          <skinnedMesh
            name="Ch01_Shirt"
            geometry={nodes.Ch01_Shirt.geometry}
            material={materials.Ch01_body}
            skeleton={nodes.Ch01_Shirt.skeleton}
          />
          <skinnedMesh
            name="Ch01_Sneakers"
            geometry={nodes.Ch01_Sneakers.geometry}
            material={materials.Ch01_body}
            skeleton={nodes.Ch01_Sneakers.skeleton}
          />
          <primitive object={nodes.mixamorig12Hips} />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/models/TalkingNPC.glb");
