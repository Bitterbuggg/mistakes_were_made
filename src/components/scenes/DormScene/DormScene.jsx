import React, { useState, useEffect, useRef, forwardRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import DormEnvironment from "./DormEnvironment";
import DormCamera from "./DormCamera";
import DormStudentBase from "./DormStudent";
import BossMinibotBase from "./BossMinibot";
import { dormScenarios } from "./scenarios";
import DormIntroCutscene from "./DormIntroCutscene";
import DormOutroCutscene from "./DormOutroCutscene";
import DormUI from "./DormUI";
import { motion as Motion, AnimatePresence } from "framer-motion";

// Forward refs for models
const DormStudent = forwardRef((props, ref) => (
  <DormStudentBase ref={ref} {...props} />
));

const BossMinibot = forwardRef((props, ref) => (
  <BossMinibotBase ref={ref} {...props} />
));

export default function DormScene({ onExit }) {
  const [phase, setPhase] = useState("intro"); // intro → quiz → outro → done
  const [index, setIndex] = useState(0);

  // Randomize questions on mount, ensuring Boss is always last
  const [scenarios] = useState(() => {
    const nonBoss = dormScenarios.filter((s) => !s.isBoss);
    const boss = dormScenarios.filter((s) => s.isBoss);

    // Shuffle non-boss
    for (let i = nonBoss.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nonBoss[i], nonBoss[j]] = [nonBoss[j], nonBoss[i]];
    }
    return [...nonBoss, ...boss];
  });

  const [cameraTarget, setCameraTarget] = useState("ernesto");

  const studentRef = useRef();
  const bossRef = useRef();

  // UI States
  const [dialogue, setDialogue] = useState({ text: "", speaker: "" });
  const [uiData, setUiData] = useState(null); // { question, choices, onSelect }
  const [modalData, setModalData] = useState(null); // { message, type }
  const [showExitPrompt, setShowExitPrompt] = useState(false);

  const scenario = scenarios[index] || {};

  const [studentAnim, setStudentAnim] = useState("Idle");
  const [bossAnim, setBossAnim] = useState("Idle.1");

  // When entering QUIZ mode
  useEffect(() => {
    if (phase === "quiz") {
      setUiData({
        question: scenario.question,
        choices: scenario.choices,
        onSelect: handleChoice,
      });

      setStudentAnim("typing");
      setBossAnim(scenario.isBoss ? "Idle.2" : "Idle.1");
    } else {
      setUiData(null);
    }
  }, [index, phase]);

  // Boss fly-away animation effect
  const playBossFlyAway = () => {
    const boss = bossRef.current;
    if (!boss) return;

    const startPos = boss.position.clone();
    const startRot = boss.rotation.y;

    const rotateTime = 1500;
    const flyTime = 2000;

    const rotStart = performance.now();

    const rotateStep = () => {
      const t = performance.now() - rotStart;

      if (t < rotateTime) {
        boss.rotation.y = startRot + Math.PI * 2 * (t / rotateTime);
        requestAnimationFrame(rotateStep);
      } else {
        const flyStart = performance.now();

        const flyStep = () => {
          const f = performance.now() - flyStart;

          if (f < flyTime) {
            boss.position.set(
              startPos.x,
              startPos.y + f * 0.008 * 10,
              startPos.z
            );
            requestAnimationFrame(flyStep);
          } else {
            boss.visible = false;
          }
        };

        requestAnimationFrame(flyStep);
      }
    };

    requestAnimationFrame(rotateStep);
  };

  // User selects an answer
  const handleChoice = (choice) => {
    if (choice.correct) {
      setStudentAnim("win");
      showModal(scenario.successMessage, "success");

      if (scenario.isBoss) playBossFlyAway();

      setTimeout(() => {
        setModalData(null); // Close modal
        if (index < scenarios.length - 1) {
          setIndex((i) => i + 1);
        } else {
          setUiData(null);
          setPhase("outro");
        }
      }, 2000); // increased delay to read message
    } else {
      setStudentAnim("fail");

      if (scenario.isBoss) setBossAnim("laughing");

      showModal(scenario.failMessage, "fail");

      setTimeout(() => {
        setModalData(null); // Close modal
        setStudentAnim("typing");
        if (scenario.isBoss) setBossAnim("Idle.1");
      }, 2000);
    }
  };

  const showModal = (message, type) => {
    setModalData({ message, type });
  };

  const showChapterComplete = (title, message) => {
    setModalData({ message: `${title}\n${message}`, type: 'success' });
  };

  return (
    <>
      <div className="w-full h-full fixed top-0 left-0">
        <Canvas
          shadows
          camera={{ fov: 50 }}
        >
          
          {/* Using DormCamera to control camera */}
          <DormCamera 
            active={cameraTarget}
          />

          <DormEnvironment />

          <DormStudent ref={studentRef} animation={studentAnim} />
          <BossMinibot
            ref={bossRef}
            visible={scenario.isBoss || phase === "intro" || phase === "outro"}
            animation={bossAnim}
          />

          {/* We keep orbit controls available but they might fight with DormCamera if not careful. 
              DormCamera sets position/lookAt every frame or effect. 
              If we want manual control, we should disable DormCamera.
              For now, DormCamera seems cinematic, so we might not need OrbitControls or we disable it.
           */}
          {/* <OrbitControls enableZoom={false} enablePan={false} /> */}
          
          {/* Logic Components */}
          {phase === "intro" && (
            <DormIntroCutscene
              studentRef={studentRef}
              bossRef={bossRef}
              setDialogue={setDialogue}
              setCamera={setCameraTarget}
              onFinish={() => {
                setDialogue({ text: "" });
                setPhase("quiz");
              }}
            />
          )}

          {phase === "outro" && (
            <DormOutroCutscene
              studentRef={studentRef}
              bossRef={bossRef}
              setDialogue={setDialogue}
              setCamera={setCameraTarget}
              onFinish={() => {
                setDialogue({ text: "" });
                setPhase("done");
                showChapterComplete(
                  "Chapter 1 Complete!",
                  "You have finished this part of the story. Well done!"
                );
              }}
            />
          )}
        </Canvas>
      </div>

      {/* === UI OVERLAYS === */}

      {/* Exit Button */}
      <div
        style={{
          position: "absolute",
          top: "1rem", // top-4
          left: "1rem", // left-4
          zIndex: 60,
        }}
      >
        <button
          onClick={() => setShowExitPrompt(true)}
          style={{
            backgroundColor: "#ef4444", // bg-red-500
            color: "white",
            padding: "0.5rem 1rem", // px-4 py-2
            borderRadius: "0.5rem", // rounded-lg
            fontWeight: "bold",
            transition: "background-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out", // transition shadow
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)", // shadow-lg
            border: "none",
            cursor: "pointer",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#dc2626"; // hover:bg-red-600
            e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)"; // shadow-xl
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#ef4444";
            e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)";
          }}
        >
          ← Exit Building
        </button>
      </div>

      {/* Dialogue Box */}
      <AnimatePresence>
        {dialogue && dialogue.text && (
          <Motion.div
            key="dialogue-box" // Key for AnimatePresence to handle exit animations
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
              position: "absolute",
              bottom: "32px",
              left: "0",
              right: "0",
              margin: "auto", // This will center it horizontally
              width: "91.666667%", // w-11/12
              maxWidth: "48rem", // max-w-3xl
              zIndex: 50,
            }}
          >
            <div
              style={{
                backgroundColor: "rgba(31, 41, 55, 0.9)", // bg-gray-800/90
                backdropFilter: "blur(12px)", // backdrop-blur-md
                border: `2px solid ${dialogue.speaker === "Ernesto" ? "#3b82f6" : (dialogue.speaker === "Lockdown" ? "#ef4444" : "#c9a3ff")}`,
                padding: "24px",
                borderRadius: "16px",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)", // shadow-xl
                display: "flex",
                flexDirection: "column",
                gap: "12px", // space-y-3
              }}
            >
              {dialogue.speaker && (
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "1.25rem",
                    color: dialogue.speaker === "Ernesto" ? "#3b82f6" : (dialogue.speaker === "Lockdown" ? "#ef4444" : "#c9a3ff"),
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  {dialogue.speaker === "Ernesto" ? "🧑‍🎓" : "🤖"} {dialogue.speaker}
                </div>
              )}
              <div
                style={{
                  color: "white",
                  fontSize: "1.125rem",
                  lineHeight: "1.625",
                }}
              >
                {dialogue.text}
              </div>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Quiz UI */}
      {phase === "quiz" && uiData && (
        <DormUI 
          question={uiData.question} 
          choices={uiData.choices} 
          onSelect={uiData.onSelect} 
        />
      )}

      {/* Message Modal (Success/Fail) */}
      <AnimatePresence>
        {modalData && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)", // bg-black/50
              backdropFilter: "blur(4px)", // backdrop-blur-sm
            }}
          >
            <Motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              style={{
                padding: "32px", // p-8
                borderRadius: "16px", // rounded-2xl
                maxWidth: "28rem", // max-w-md
                textAlign: "center",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)", // shadow-2xl
                border: "4px solid",
                backgroundColor: modalData.type === 'success' ? '#f0fdf4' : '#fef2f2', // bg-green-50 vs bg-red-50
                borderColor: modalData.type === 'success' ? '#22c55e' : '#ef4444', // border-green-500 vs border-red-500
                color: modalData.type === 'success' ? '#166534' : '#b91c1c', // text-green-900 vs text-red-900
              }}
            >
              <div
                style={{
                  fontSize: "3rem", // text-5xl
                  marginBottom: "1rem", // mb-4
                }}
              >
                {modalData.type === 'success' ? '🎉' : '⚠️'}
              </div>
              <div
                style={{
                  fontSize: "1.25rem", // text-xl
                  fontWeight: "bold",
                  whiteSpace: "pre-line",
                }}
              >
                {modalData.message}
              </div>
              {phase === "done" && (
                 <button
                   onClick={onExit}
                   style={{
                     marginTop: "1.5rem", // mt-6
                     padding: "0.75rem 1.5rem", // px-6 py-3
                     backgroundColor: "#10b981", // bg-green-600
                     color: "white",
                     borderRadius: "9999px", // rounded-full
                     fontWeight: "bold",
                     border: "none",
                     cursor: "pointer",
                     transition: "background-color 0.15s ease-in-out", // transition hover
                   }}
                   onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#059669"} // hover:bg-green-700
                   onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#10b981"}
                 >
                   Return to Campus
                 </button>
              )}
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Exit Confirmation */}
      {showExitPrompt && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.7)", // bg-black/70
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "32px", // p-8
              borderRadius: "16px", // rounded-xl
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)", // shadow-2xl
              textAlign: "center",
              maxWidth: "24rem", // max-w-sm
            }}
          >
            <h2
              style={{
                fontSize: "1.5rem", // text-2xl
                fontWeight: "bold",
                marginBottom: "1rem", // mb-4
                color: "#1e293b", // text-slate-800
              }}
            >
              Exit Building?
            </h2>
            <p
              style={{
                color: "#475569", // text-slate-600
                marginBottom: "1.5rem", // mb-6
              }}
            >
              Are you sure you want to leave? Your progress might be lost.
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "1rem", // gap-4
              }}
            >
              <button
                onClick={onExit}
                style={{
                  backgroundColor: "#ef4444", // bg-red-500
                  color: "white",
                  padding: "0.625rem 1.5rem", // px-6 py-2.5
                  borderRadius: "0.5rem", // rounded-lg
                  fontWeight: "bold",
                  border: "none",
                  cursor: "pointer",
                  transition: "background-color 0.15s ease-in-out",
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#dc2626"} // hover:bg-red-600
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#ef4444"}
              >
                Yes, Exit
              </button>
              <button
                onClick={() => setShowExitPrompt(false)}
                style={{
                  backgroundColor: "#e2e8f0", // bg-slate-200
                  color: "#1e293b", // text-slate-800
                  padding: "0.625rem 1.5rem", // px-6 py-2.5
                  borderRadius: "0.5rem", // rounded-lg
                  fontWeight: "bold",
                  border: "none",
                  cursor: "pointer",
                  transition: "background-color 0.15s ease-in-out",
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#cbd5e1"} // hover:bg-slate-300
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#e2e8f0"}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
