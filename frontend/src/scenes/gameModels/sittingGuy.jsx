import React, { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

export default function SittingGuy(props) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/models/Sitting_guy.glb");
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions && actions["Sitting"]) {
      actions["Sitting"].reset().fadeIn(0.5).play();
    }
  }, [actions]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <skinnedMesh
            name="Ch23_Belt"
            geometry={nodes.Ch23_Belt.geometry}
            material={materials.Ch23_body}
            skeleton={nodes.Ch23_Belt.skeleton}
          />
          <skinnedMesh
            name="Ch23_Body"
            geometry={nodes.Ch23_Body.geometry}
            material={materials.Ch23_body}
            skeleton={nodes.Ch23_Body.skeleton}
          />
          <skinnedMesh
            name="Ch23_Eyelashes"
            geometry={nodes.Ch23_Eyelashes.geometry}
            material={materials.Ch23_hair}
            skeleton={nodes.Ch23_Eyelashes.skeleton}
          />
          <skinnedMesh
            name="Ch23_Hair"
            geometry={nodes.Ch23_Hair.geometry}
            material={materials.Ch23_hair}
            skeleton={nodes.Ch23_Hair.skeleton}
          />
          <skinnedMesh
            name="Ch23_Pants"
            geometry={nodes.Ch23_Pants.geometry}
            material={materials.Ch23_body}
            skeleton={nodes.Ch23_Pants.skeleton}
          />
          <skinnedMesh
            name="Ch23_Shirt"
            geometry={nodes.Ch23_Shirt.geometry}
            material={materials.Ch23_body}
            skeleton={nodes.Ch23_Shirt.skeleton}
          />
          <skinnedMesh
            name="Ch23_Shoes"
            geometry={nodes.Ch23_Shoes.geometry}
            material={materials.Ch23_body}
            skeleton={nodes.Ch23_Shoes.skeleton}
          />
          <skinnedMesh
            name="Ch23_Suit"
            geometry={nodes.Ch23_Suit.geometry}
            material={materials.Ch23_body}
            skeleton={nodes.Ch23_Suit.skeleton}
          />
          <primitive object={nodes.mixamorigHips} />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/models/Sitting_guy.glb");
