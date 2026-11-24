import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

export default function IntroAnimation({ onFinish }) {
  const [visible, setVisible] = useState(true);
  const [stage, setStage] = useState("walking"); // "walking" | "namaste" | "welcome"
  const canvasRef = useRef(null);

  // Animation Timeline Controller
  useEffect(() => {
    // 1. Walk from left to center: 0.0s -> 1.55s
    const t1 = setTimeout(() => {
      setStage("namaste");
    }, 1550);

    // 2. Welcome text reveals: 2.2s
    const t2 = setTimeout(() => {
      setStage("welcome");
    }, 2200);

    // 3. Complete intro and slide up to reveal website: 4.5s
    const t3 = setTimeout(() => {
      setVisible(false);
    }, 4500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // 60FPS Realistic Skeletal Character Engine on HTML5 Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let startTime = null;

    // Handle high-DPI screens (Retina)
    const resizeCanvas = () => {
      const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
      const width = canvas.parentElement ? canvas.parentElement.clientWidth : 600;
      const height = canvas.parentElement ? canvas.parentElement.clientHeight : 440;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Realistic Anatomical Human Drawing Function
    const drawRealisticHuman = (ctx, x, groundY, time, currentStage) => {
      // Time calculations
      const walkDuration = 1.55;
      const isWalkingTime = time < walkDuration;
      const walkProgress = Math.min(1, time / walkDuration);

      // Namaste transition (1.55s to 2.2s)
      const namasteTime = Math.max(0, time - walkDuration);
      const namasteProgress = Math.min(1, namasteTime / 0.55);
      const namasteEase = 0.5 - 0.5 * Math.cos(namasteProgress * Math.PI); // smooth easeInOut

      // Head bow angle (gentle respectful nod when folding hands)
      let headBow = 0;
      if (time > 1.85 && time < 2.8) {
        headBow = Math.sin(Math.min(Math.PI, (time - 1.85) * 3.3)) * 0.08;
      }

      // Natural eye blink every ~3.2 seconds
      const isBlinking = (time % 3.2 > 2.95 && time % 3.2 < 3.1) || (time > 1.85 && time < 2.05);

      // Gait physics
      const walkSpeed = 10.5; // step rhythm
      const walkCycle = time * walkSpeed;

      // Vertical bobbing (human natural locomotion sine wave)
      let bobY = 0;
      if (isWalkingTime) {
        bobY = Math.abs(Math.sin(walkCycle)) * -6.5;
      } else {
        // Idle breathing when standing
        bobY = Math.sin((time - walkDuration) * 2.5) * -2;
      }

      // Ground shadow under feet
      const shadowWidth = 52 + (isWalkingTime ? Math.sin(walkCycle * 2) * 6 : 0);
      ctx.save();
      const shadowGrad = ctx.createRadialGradient(x, groundY, 4, x, groundY, shadowWidth);
      shadowGrad.addColorStop(0, "rgba(0, 0, 0, 0.75)");
      shadowGrad.addColorStop(0.6, "rgba(0, 0, 0, 0.35)");
      shadowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = shadowGrad;
      ctx.beginPath();
      ctx.ellipse(x, groundY + 1, shadowWidth, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Ambient rim glow behind character
      ctx.save();
      const auraGrad = ctx.createRadialGradient(x, groundY - 140, 10, x, groundY - 140, 120);
      auraGrad.addColorStop(0, "rgba(28, 216, 210, 0.14)");
      auraGrad.addColorStop(0.5, "rgba(0, 191, 143, 0.08)");
      auraGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(x, groundY - 140, 120, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // ----------------------------------------------------
      // SKELETAL ANCHORS (Realistic Adult Proportions ~ 1:7)
      // Total Height = ~270px (from ground to top of hair)
      // ----------------------------------------------------
      const hipCenterY = groundY - 138 + bobY;
      const chestCenterY = hipCenterY - 72;
      const shoulderCenterY = chestCenterY - 18;
      const neckY = shoulderCenterY - 14;
      const headCenterY = neckY - 26;

      // Leg Angles (Inverse Kinematics simulation)
      let thighL_Angle = 0;
      let kneeL_Angle = 0;
      let thighR_Angle = 0;
      let kneeR_Angle = 0;

      if (isWalkingTime) {
        // Forward/back thigh swing
        thighL_Angle = Math.sin(walkCycle) * 0.42;
        thighR_Angle = Math.sin(walkCycle + Math.PI) * 0.42;

        // Knee bends backwards during leg swing forward
        kneeL_Angle = Math.max(0, -Math.sin(walkCycle + 0.35) * 0.82);
        kneeR_Angle = Math.max(0, -Math.sin(walkCycle + Math.PI + 0.35) * 0.82);
      } else {
        // Smoothly settle into standing straight
        const settle = Math.max(0, 1 - (time - walkDuration) * 4);
        thighL_Angle *= settle;
        kneeL_Angle *= settle;
        thighR_Angle *= settle;
        kneeR_Angle *= settle;
      }

      // Helper function to draw a realistic limb (Thigh -> Knee -> Calf -> Shoe)
      const drawLeg = (isLeft, thighAngle, kneeAngle) => {
        ctx.save();
        const hipX = isLeft ? x - 12 : x + 12;
        const hipY = hipCenterY;

        ctx.translate(hipX, hipY);
        ctx.rotate(thighAngle);

        // Thigh (Suit Trousers / Jeans)
        const thighLen = 66;
        ctx.fillStyle = isLeft ? "#0d1b2a" : "#09131d"; // subtle depth lighting
        ctx.strokeStyle = "#1cd8d2";
        ctx.lineWidth = 0.5;

        ctx.beginPath();
        ctx.moveTo(-9, 0);
        ctx.lineTo(9, 0);
        ctx.lineTo(7, thighLen);
        ctx.lineTo(-7, thighLen);
        ctx.closePath();
        ctx.fill();

        // Knee Joint
        ctx.translate(0, thighLen);
        ctx.rotate(kneeAngle);

        // Calf / Lower Leg
        const calfLen = 66;
        ctx.fillStyle = isLeft ? "#0d1b2a" : "#09131d";
        ctx.beginPath();
        ctx.moveTo(-7, 0);
        ctx.lineTo(7, 0);
        ctx.lineTo(5.5, calfLen);
        ctx.lineTo(-5.5, calfLen);
        ctx.closePath();
        ctx.fill();

        // Shoe / Leather Dress Shoe with Cyan Sole
        ctx.translate(0, calfLen);
        ctx.fillStyle = "#050b12";
        ctx.beginPath();
        ctx.moveTo(-7, 0);
        ctx.lineTo(7, 0);
        ctx.lineTo(16, 7);
        ctx.quadraticCurveTo(18, 12, 10, 13);
        ctx.lineTo(-9, 13);
        ctx.quadraticCurveTo(-11, 7, -7, 0);
        ctx.closePath();
        ctx.fill();

        // Cyan Neon Sole Accent
        ctx.fillStyle = "#1cd8d2";
        ctx.fillRect(-9, 11, 26, 2.5);

        ctx.restore();
      };

      // Draw Rear Leg first
      drawLeg(false, thighR_Angle, kneeR_Angle);

      // ----------------------------------------------------
      // TORSO & SUIT / BLAZER
      // ----------------------------------------------------
      ctx.save();
      const torsoSway = isWalkingTime ? Math.sin(walkCycle) * 0.025 : 0;
      ctx.translate(x, hipCenterY);
      ctx.rotate(torsoSway + headBow * 0.4);

      // Suit Blazer Body
      const blazerGrad = ctx.createLinearGradient(-30, -90, 30, 0);
      blazerGrad.addColorStop(0, "#132338");
      blazerGrad.addColorStop(0.5, "#0d1726");
      blazerGrad.addColorStop(1, "#080e18");

      ctx.fillStyle = blazerGrad;
      ctx.beginPath();
      ctx.moveTo(-28, -88); // Left shoulder
      ctx.lineTo(28, -88); // Right shoulder
      ctx.lineTo(22, -10); // Right waist
      ctx.lineTo(-22, -10); // Left waist
      ctx.closePath();
      ctx.fill();

      // Cyan Inner Lining Glow
      ctx.strokeStyle = "rgba(28, 216, 210, 0.45)";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Crisp White Shirt V-Neck
      ctx.fillStyle = "#f8fafc";
      ctx.beginPath();
      ctx.moveTo(-10, -88);
      ctx.lineTo(10, -88);
      ctx.lineTo(0, -56);
      ctx.closePath();
      ctx.fill();

      // Silk Cyan Tie
      const tieGrad = ctx.createLinearGradient(-3, -88, 3, -40);
      tieGrad.addColorStop(0, "#1cd8d2");
      tieGrad.addColorStop(1, "#00bf8f");
      ctx.fillStyle = tieGrad;
      ctx.beginPath();
      ctx.moveTo(-3.5, -88);
      ctx.lineTo(3.5, -88);
      ctx.lineTo(4.5, -50);
      ctx.lineTo(0, -42);
      ctx.lineTo(-4.5, -50);
      ctx.closePath();
      ctx.fill();

      // Blazer Lapels
      ctx.fillStyle = "#070c14";
      ctx.beginPath();
      ctx.moveTo(-28, -88);
      ctx.lineTo(-10, -88);
      ctx.lineTo(-2, -54);
      ctx.lineTo(-18, -48);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(28, -88);
      ctx.lineTo(10, -88);
      ctx.lineTo(2, -54);
      ctx.lineTo(18, -48);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      // Draw Front Leg over torso bottom
      drawLeg(true, thighL_Angle, kneeL_Angle);

      // ----------------------------------------------------
      // ARMS & HANDS (Walking Swing -> Namaste 🙏)
      // ----------------------------------------------------
      const drawArm = (isLeft) => {
        ctx.save();
        const shoulderX = isLeft ? x - 26 : x + 26;
        const shoulderY = shoulderCenterY + bobY;

        ctx.translate(shoulderX, shoulderY);

        // If in Namaste gesture: smooth interpolation to folded hands
        if (namasteProgress > 0) {
          // Namaste joint targets
          const elbowTargetX = isLeft ? 12 : -12;
          const elbowTargetY = 28;
          const wristTargetX = isLeft ? 24 : -24;
          const wristTargetY = 2;

          // Upper Arm
          const armRot = isLeft ? 0.42 * namasteEase : -0.42 * namasteEase;
          ctx.rotate(armRot);

          ctx.fillStyle = isLeft ? "#132338" : "#0d1726";
          ctx.beginPath();
          ctx.moveTo(-6, 0);
          ctx.lineTo(6, 0);
          ctx.lineTo(isLeft ? 4 : -4, 42);
          ctx.lineTo(isLeft ? -7 : 7, 42);
          ctx.closePath();
          ctx.fill();

          // Forearm bending inward to center
          ctx.translate(isLeft ? -1 : 1, 42);
          const forearmRot = isLeft ? -1.18 * namasteEase : 1.18 * namasteEase;
          ctx.rotate(forearmRot);

          ctx.beginPath();
          ctx.moveTo(-5, 0);
          ctx.lineTo(5, 0);
          ctx.lineTo(4, 40);
          ctx.lineTo(-4, 40);
          ctx.closePath();
          ctx.fill();

          // Hand / Palm
          ctx.translate(0, 40);
          ctx.fillStyle = "#d99b77";
          ctx.beginPath();
          ctx.ellipse(0, 6, 4.5, 9, 0, 0, Math.PI * 2);
          ctx.fill();

        } else {
          // Regular Walking Arm Swing
          const armAngle = isLeft ? -thighL_Angle * 0.8 : -thighR_Angle * 0.8;
          ctx.rotate(armAngle);

          ctx.fillStyle = isLeft ? "#132338" : "#0d1726";
          ctx.beginPath();
          ctx.moveTo(-6, 0);
          ctx.lineTo(6, 0);
          ctx.lineTo(4.5, 45);
          ctx.lineTo(-4.5, 45);
          ctx.closePath();
          ctx.fill();

          // Forearm
          ctx.translate(0, 45);
          ctx.rotate(0.22); // natural slight elbow bend

          ctx.beginPath();
          ctx.moveTo(-4.5, 0);
          ctx.lineTo(4.5, 0);
          ctx.lineTo(3.8, 42);
          ctx.lineTo(-3.8, 42);
          ctx.closePath();
          ctx.fill();

          // Hand
          ctx.translate(0, 42);
          ctx.fillStyle = "#d99b77";
          ctx.beginPath();
          ctx.arc(0, 5, 5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      };

      drawArm(false); // Right arm
      drawArm(true); // Left arm

      // ----------------------------------------------------
      // JOINED FOLDED PALMS (NAMASTE PRAYER POSE 🙏)
      // ----------------------------------------------------
      if (namasteProgress > 0.4) {
        ctx.save();
        const chestX = x;
        const chestY = chestCenterY + bobY + 12;
        const palmScale = Math.min(1, (namasteProgress - 0.4) / 0.5);

        ctx.translate(chestX, chestY);
        ctx.scale(palmScale, palmScale);

        // Radiant Sparkle Flare Burst when hands join
        if (time > 1.95 && time < 2.9) {
          const burstAge = time - 1.95;
          const burstScale = Math.sin(Math.min(Math.PI, burstAge * 3.5)) * 1.6;
          const burstAlpha = Math.max(0, 1 - burstAge * 1.1);

          ctx.save();
          ctx.scale(burstScale, burstScale);
          ctx.fillStyle = `rgba(28, 216, 210, ${burstAlpha * 0.45})`;
          ctx.beginPath();
          ctx.arc(0, -6, 24, 0, Math.PI * 2);
          ctx.fill();

          // 8-Point Golden Light Star
          ctx.fillStyle = `rgba(255, 255, 255, ${burstAlpha})`;
          ctx.beginPath();
          ctx.moveTo(0, -28);
          ctx.lineTo(3, -10);
          ctx.lineTo(21, -6);
          ctx.lineTo(3, -2);
          ctx.lineTo(0, 16);
          ctx.lineTo(-3, -2);
          ctx.lineTo(-21, -6);
          ctx.lineTo(-3, -10);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }

        // Left Palm (Indian Skin Tone with subtle shade)
        ctx.fillStyle = "#e0a37e";
        ctx.beginPath();
        ctx.moveTo(-1, 8);
        ctx.lineTo(-1, -16);
        ctx.quadraticCurveTo(-1.5, -22, -3.5, -23);
        ctx.quadraticCurveTo(-6.5, -16, -6, 2);
        ctx.closePath();
        ctx.fill();

        // Right Palm (Mirror)
        ctx.fillStyle = "#c5835e";
        ctx.beginPath();
        ctx.moveTo(1, 8);
        ctx.lineTo(1, -16);
        ctx.quadraticCurveTo(1.5, -22, 3.5, -23);
        ctx.quadraticCurveTo(6.5, -16, 6, 2);
        ctx.closePath();
        ctx.fill();

        // Fingers Center Seam
        ctx.strokeStyle = "#8f502d";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(0, -22);
        ctx.lineTo(0, 8);
        ctx.stroke();

        ctx.restore();
      }

      // ----------------------------------------------------
      // HEAD, FACE, BEARD & HAIR (Realistic Handsome Features)
      // ----------------------------------------------------
      ctx.save();
      const headX = x;
      const headY = headCenterY + bobY;
      ctx.translate(headX, headY);
      ctx.rotate(headBow);

      // Neck
      ctx.fillStyle = "#b87652";
      ctx.fillRect(-7.5, 12, 15, 16);

      // Ears
      ctx.fillStyle = "#c5835e";
      ctx.beginPath();
      ctx.ellipse(-17.5, -2, 4.5, 8, 0, 0, Math.PI * 2);
      ctx.ellipse(17.5, -2, 4.5, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Face Base (Defined Male Jawline)
      const faceGrad = ctx.createLinearGradient(0, -25, 0, 20);
      faceGrad.addColorStop(0, "#e6ab88");
      faceGrad.addColorStop(1, "#c5835e");
      ctx.fillStyle = faceGrad;

      ctx.beginPath();
      ctx.moveTo(-16, -18);
      ctx.quadraticCurveTo(-16, 10, -7, 18);
      ctx.lineTo(0, 20); // Chin
      ctx.lineTo(7, 18);
      ctx.quadraticCurveTo(16, 10, 16, -18);
      ctx.quadraticCurveTo(0, -26, -16, -18);
      ctx.closePath();
      ctx.fill();

      // Groomed Beard & Mustache (Matching Kundan Kumar's look)
      ctx.fillStyle = "#1e1b24";
      // Mustache
      ctx.beginPath();
      ctx.moveTo(-7, 8);
      ctx.quadraticCurveTo(0, 6, 7, 8);
      ctx.quadraticCurveTo(0, 11, -7, 8);
      ctx.fill();

      // Jawline Beard
      ctx.beginPath();
      ctx.moveTo(-15, 2);
      ctx.quadraticCurveTo(-13, 14, -6, 19);
      ctx.lineTo(0, 20.5);
      ctx.lineTo(6, 19);
      ctx.quadraticCurveTo(13, 14, 15, 2);
      ctx.quadraticCurveTo(13, 11, 7, 16);
      ctx.lineTo(0, 17.5);
      ctx.lineTo(-7, 16);
      ctx.quadraticCurveTo(-13, 11, -15, 2);
      ctx.closePath();
      ctx.fill();

      // Eyes & Eyebrows
      ctx.fillStyle = "#16121f";
      // Eyebrows
      ctx.lineWidth = 2.4;
      ctx.strokeStyle = "#16121f";
      ctx.beginPath();
      ctx.moveTo(-13, -8);
      ctx.quadraticCurveTo(-8, -12, -3, -8);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(3, -8);
      ctx.quadraticCurveTo(8, -12, 13, -8);
      ctx.stroke();

      // Eyes (Blinking animation)
      if (isBlinking) {
        ctx.strokeStyle = "#16121f";
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(-11, -3);
        ctx.lineTo(-4, -3);
        ctx.moveTo(4, -3);
        ctx.lineTo(11, -3);
        ctx.stroke();
      } else {
        // Eye Whites
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.ellipse(-7.5, -3, 4.2, 2.8, 0, 0, Math.PI * 2);
        ctx.ellipse(7.5, -3, 4.2, 2.8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Dark Iris & Pupils
        ctx.fillStyle = "#1e1829";
        ctx.beginPath();
        ctx.arc(-7.5, -3, 2.2, 0, Math.PI * 2);
        ctx.arc(7.5, -3, 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Shiny Light Glint in Eyes
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(-8.2, -3.7, 0.9, 0, Math.PI * 2);
        ctx.arc(6.8, -3.7, 0.9, 0, Math.PI * 2);
        ctx.fill();
      }

      // Nose
      ctx.strokeStyle = "#a85f39";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, -6);
      ctx.lineTo(0.5, 3);
      ctx.lineTo(-2, 4);
      ctx.stroke();

      // Welcoming Smile
      ctx.strokeStyle = "#7c351f";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(-4.5, 12);
      ctx.quadraticCurveTo(0, 15, 4.5, 12);
      ctx.stroke();

      // Realistic Textured Hair (Volumetric Quiff with Sheen)
      const hairGrad = ctx.createLinearGradient(0, -38, 0, -12);
      hairGrad.addColorStop(0, "#2a2436");
      hairGrad.addColorStop(0.5, "#16121f");
      hairGrad.addColorStop(1, "#0d0a14");

      ctx.fillStyle = hairGrad;
      ctx.beginPath();
      ctx.moveTo(-17, -14);
      ctx.quadraticCurveTo(-18, -32, -6, -34);
      ctx.quadraticCurveTo(8, -36, 16, -26);
      ctx.quadraticCurveTo(20, -14, 17, -10);
      ctx.quadraticCurveTo(14, -20, 6, -24);
      ctx.quadraticCurveTo(-4, -24, -13, -18);
      ctx.closePath();
      ctx.fill();

      // Hair Highlight Sheen
      ctx.strokeStyle = "rgba(107, 95, 133, 0.45)";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(-10, -32);
      ctx.quadraticCurveTo(2, -34, 12, -26);
      ctx.stroke();

      ctx.restore();
    };

    // 60FPS Render Loop
    const render = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsedTime = (timestamp - startTime) / 1000;

      const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.clearRect(0, 0, width, height);

      // Floor ground level
      const groundY = height * 0.88;

      // Character Horizontal Position:
      // Walk smoothly from offscreen left (x = -80px) to center of canvas (x = width / 2)
      const walkDuration = 1.55;
      const startX = -80;
      const targetX = width / 2;

      let currentX;
      if (elapsedTime < walkDuration) {
        // Natural human acceleration and deceleration into stop
        const t = elapsedTime / walkDuration;
        const ease = 1 - Math.pow(1 - t, 2.4); // smooth deceleration
        currentX = startX + (targetX - startX) * ease;
      } else {
        currentX = targetX;
      }

      // Draw the realistic walking and greeting human
      drawRealisticHuman(ctx, currentX, groundY, elapsedTime, stage);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <AnimatePresence onExitComplete={onFinish}>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black text-white overflow-hidden select-none"
          initial={{ y: 0 }}
          exit={{
            y: "-100%",
            transition: {
              duration: 0.95,
              ease: [0.22, 1, 0.36, 1],
            },
          }}
        >
          {/* Ambient Glowing Background Atmosphere */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] sm:w-[650px] h-[450px] sm:h-[650px] rounded-full bg-gradient-to-tr from-[#1cd8d2]/15 via-[#00bf8f]/10 to-[#302b63]/25 blur-[140px] animate-pulse" />
            <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-[#1cd8d2]/10 blur-[110px]" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#00bf8f]/10 blur-[110px]" />

            {/* Glowing Ground Line */}
            <div className="absolute bottom-[12%] sm:bottom-[13%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#1cd8d2]/40 to-transparent" />
          </div>

          {/* Quick Skip Button */}
          <button
            onClick={() => setVisible(false)}
            className="absolute top-5 right-5 sm:top-7 sm:right-7 text-xs text-gray-400 hover:text-white px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer z-30 flex items-center gap-1.5 backdrop-blur-md"
            title="Skip Intro"
          >
            <span>Skip</span>
            <span className="text-[10px]">✕</span>
          </button>

          {/* Canvas & Typography Stage */}
          <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-2xl mx-auto h-full px-4">

            {/* REALISTIC 60FPS SKELETAL HUMAN WALKING CANVAS */}
            <div className="relative w-full h-[360px] sm:h-[400px] md:h-[430px] flex items-center justify-center">
              <canvas ref={canvasRef} className="w-full h-full block" />
            </div>

            {/* ANIMATED WELCOME TYPOGRAPHY (Reveals after Namaste) */}
            <div className="min-h-[110px] sm:min-h-[130px] flex flex-col items-center justify-start text-center -mt-4 sm:-mt-6 z-20">
              <AnimatePresence>
                {stage === "welcome" && (
                  <motion.div
                    className="flex flex-col items-center text-center space-y-2"
                    initial={{ opacity: 0, y: 22, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {/* Glowing Namaste Pill Badge */}
                    <motion.div
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#1cd8d2]/15 via-[#00bf8f]/15 to-[#302b63]/25 border border-[#1cd8d2]/40 text-xs text-[#1cd8d2] font-semibold tracking-wider uppercase shadow-lg shadow-[#1cd8d2]/15"
                    >
                      <span className="text-sm">🙏</span>
                      <span>Namaste</span>
                    </motion.div>

                    {/* High-Impact Glowing WELCOME Headline */}
                    <motion.h1
                      initial={{ letterSpacing: "0.08em", filter: "blur(6px)" }}
                      animate={{ letterSpacing: "0.18em", filter: "blur(0px)" }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="text-4xl sm:text-6xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#1cd8d2] via-[#00bf8f] to-white drop-shadow-[0_0_40px_rgba(28,216,210,0.65)] leading-tight tracking-wider"
                    >
                      WELCOME
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25, duration: 0.6 }}
                      className="text-xs sm:text-sm md:text-base text-gray-300 font-medium tracking-wide flex items-center gap-1.5"
                    >
                      <span>To Kundan Kumar's Portfolio</span>
                      <span className="inline-block text-[#1cd8d2] animate-pulse">✨</span>
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
