import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Navbar } from "../Components/Navbar";

const VideoCall = () => {
  const [searchParams] = useSearchParams();
  const navigateTo = useNavigate();
  const [apiReady, setApiReady] = useState(false);
  const jitsiContainerRef = useRef(null);
  const apiRef = useRef(null);

  const roomUrl = searchParams.get("room");
  const roomName = roomUrl ? roomUrl.replace("https://meet.jit.si/", "") : null;

  let displayName = "User";
  const doctorRaw = localStorage.getItem("doctor");
  const patientRaw = localStorage.getItem("patient");
  if (doctorRaw) {
    const d = JSON.parse(doctorRaw);
    displayName = `Dr. ${d.firstName} ${d.lastName}`;
  } else if (patientRaw) {
    const p = JSON.parse(patientRaw);
    displayName = `${p.firstName} ${p.lastName}`;
  }

  // Dynamically load Jitsi External API script
  useEffect(() => {
    if (!roomName) return;
    if (window.JitsiMeetExternalAPI) {
      setApiReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://meet.jit.si/external_api.js";
    script.async = true;
    script.onload = () => setApiReady(true);
    script.onerror = () => {
      // If script fails to load, still show iframe fallback
      setApiReady(false);
    };
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [roomName]);

  // Once API is ready, mount Jitsi via External API
  useEffect(() => {
    if (!apiReady || !roomName || !jitsiContainerRef.current) return;
    if (apiRef.current) return; // already mounted

    const domain = "meet.jit.si";
    const options = {
      roomName,
      width: "100%",
      height: "100%",
      parentNode: jitsiContainerRef.current,
      userInfo: { displayName },
      configOverwrite: {
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        enableWelcomePage: false,
        prejoinPageEnabled: false,
        disableModeratorIndicator: true,
      },
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_BRAND_WATERMARK: false,
      },
    };

    try {
      apiRef.current = new window.JitsiMeetExternalAPI(domain, options);
      apiRef.current.addEventListener("readyToClose", () => {
        navigateTo(-1);
      });
    } catch (e) {
      console.error("Jitsi init error", e);
    }

    return () => {
      if (apiRef.current) {
        apiRef.current.dispose();
        apiRef.current = null;
      }
    };
  }, [apiReady, roomName]);

  if (!roomName) {
    return (
      <div className="w-full h-screen bg-gray-200">
        <Navbar />
        <div className="flex items-center justify-center h-full">
          <div className="bg-white p-10 rounded-xl shadow-lg text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Invalid Video Call Link</h1>
            <p className="text-gray-600 mb-6">No room was specified for this call.</p>
            <button
              onClick={() => navigateTo(-1)}
              className="bg-[#FA7070] text-white px-6 py-2 rounded-full hover:bg-red-500 transition"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col bg-gray-900">
      <Navbar />
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-2 bg-gray-800 text-white mt-16 shrink-0">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
          <span className="font-semibold text-sm">Live Video Consultation</span>
        </div>
        <div className="text-xs text-gray-400 truncate max-w-xs hidden md:block">
          Room: {roomName}
        </div>
        <button
          onClick={() => navigateTo(-1)}
          className="bg-red-500 hover:bg-red-600 text-white text-xs px-4 py-1.5 rounded-full transition"
        >
          Leave & Go Back
        </button>
      </div>

      {/* Jitsi External API container */}
      {apiReady ? (
        <div ref={jitsiContainerRef} className="flex-1 w-full" style={{ minHeight: 0 }} />
      ) : (
        /* Iframe fallback — also bypasses prejoin/moderator screen via hash config */
        <iframe
          src={`https://meet.jit.si/${roomName}#config.prejoinPageEnabled=false&config.disableModeratorIndicator=true&config.startWithAudioMuted=false&userInfo.displayName=${encodeURIComponent(displayName)}`}
          allow="camera; microphone; fullscreen; display-capture; autoplay"
          className="flex-1 w-full border-0"
          style={{ minHeight: 0 }}
          title="Video Consultation"
        />
      )}
    </div>
  );
};

export default VideoCall;