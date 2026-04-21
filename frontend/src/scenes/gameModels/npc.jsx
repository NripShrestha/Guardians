import React, { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

const EXPLAINING_STAGES = new Set([
  "TALKING_TO_MANAGER",
  "DEBRIEFING",
  "TASK2_TALKING_TO_MANAGER",
  "TASK2_DEBRIEFING",
  "TASK3_TALKING_TO_MANAGER",
  "TASK3_DEBRIEFING",
  "TASK4_TALKING_TO_MANAGER",
  "TASK4_DEBRIEFING",
  "TASK5_TALKING_TO_MANAGER",
  "TASK5_ASKING_NPC_FOR_IT",
  "TASK5_DEBRIEFING",
  "TASK6_TALKING_TO_MANAGER",
  "TASK6_DEBRIEFING",
  "TASK7_TALKING_TO_MANAGER",
  "TASK7_DEBRIEFING",
  "TASK8_TALKING_TO_MANAGER",
  "TASK8_DEBRIEFING",
  "TASK9_DEBRIEFING_FAIL",
  "TASK9_DEBRIEFING_PASS",
  "TASK10_TALKING_TO_MANAGER"
]);

export default function Npc({ missionStage, ...props }) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/models/NPC.glb");
  const { actions } = useAnimations(animations, group);

  const isExplaining = EXPLAINING_STAGES.has(missionStage);

  useEffect(() => {
    if (!actions) return;

    const explainAction = actions["Explaining"];
    const idleAction = actions["Idle"];

    if (isExplaining && explainAction) {
      // Cross-fade from Idle → Explaining
      idleAction?.fadeOut(0.3);
      explainAction.reset().fadeIn(0.3).play();
    } else if (idleAction) {
      // Cross-fade from Explaining → Idle
      explainAction?.fadeOut(0.3);
      idleAction.reset().fadeIn(0.3).play();
    }

    const handleDialogueChange = () => {
      if (isExplaining && explainAction) {
        // Restart the Action from the beginning.
        // We omit fadeIn() because fading it in from 0 weight causes a T-pose pop.
        explainAction.reset().play();
      }
    };
    
    window.addEventListener("npc_dialogue_line_changed", handleDialogueChange);

    return () => {
      window.removeEventListener("npc_dialogue_line_changed", handleDialogueChange);
      explainAction?.fadeOut(0.1);
      idleAction?.fadeOut(0.1);
    };
  }, [actions, isExplaining]);

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
