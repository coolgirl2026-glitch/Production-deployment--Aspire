import { useState, useEffect } from "react";
import { ArrowRight, Clock3 } from "lucide-react";
import { getFormFields, TOOL_FORMS } from "../data/forms.js";

export function InputForm({ toolId, agent, loading, onSubmit, values = {}, onChange, onShowHistory }) {
  const form = TOOL_FORMS[toolId];
  const fields = getFormFields(toolId, agent);

  const [isRecording, setIsRecording] = useState(false);
  const [recognitionInstance, setRecognitionInstance] = useState(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-IN'; // Optimized for Indian English accents
      setRecognitionInstance(recognition);
    }
  }, []);

  const handleVoiceRecordingToggle = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported or enabled in this browser layout. Please use Google Chrome or Edge.");
      return;
    }

    // Initialize a fresh instance if it doesn't exist yet to avoid dead state bindings
    let recognition = recognitionInstance;
    if (!recognition) {
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-IN'; // Tailored for Indian English accents
      setRecognitionInstance(recognition);
    }

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
      console.log("🎙️ Voice transcription engine manually stopped.");
    } else {
      setIsRecording(true);
      console.log("🎙️ Requesting mic permissions and starting voice engine...");

      // Core Audio Event: Fired immediately when audio text fragments are successfully processed
      recognition.onresult = (event) => {
        const currentResultIndex = event.resultIndex;
        const transcriptText = event.results[currentResultIndex][0].transcript;
        console.log("📝 Decoded Text Fragment Captured:", transcriptText);

        // Instantly inject the text string straight into the meetingNotes form text area state box
        onChange(prev => ({
          ...prev,
          meetingNotes: prev.meetingNotes 
            ? `${prev.meetingNotes.trim()} ${transcriptText.trim()}` 
            : transcriptText.trim()
        }));
      };

      // Error Catcher: Logs permission blocks or silent stream drops
      recognition.onerror = (err) => {
        console.error("❌ Audio Recognition Error Event:", err.error, err.message);
        setIsRecording(false);
        if (err.error === 'not-allowed') {
          alert("Microphone access denied! Please click the camera/mic icon in your browser address bar to allow permissions for this site.");
        }
      };

      recognition.onend = () => {
        console.log("🎙️ Recording loop finalized clean.");
        setIsRecording(false);
      };

      try {
        recognition.start();
      } catch (e) {
        console.error("⚠️ Prevention catch triggered on active stream:", e);
      }
    }
  };

  const handleChange = (id, value) => {
    onChange((current) => ({ ...current, [id]: value }));
  };

  return (
    <form
      className="input-form"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({ ...values, forceNewWebSearch: false });
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
        <div>
          <h1>{form.title}</h1>
          <p>{form.description}</p>
        </div>
        {onShowHistory && (
          <button
            className="secondary-button"
            onClick={onShowHistory}
            type="button"
            title="View Recents"
            style={{ padding: "8px 12px", display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", whiteSpace: "nowrap" }}
          >
            <Clock3 size={15} />
            Recents
          </button>
        )}
      </div>

      <div className="field-grid">
        {fields.map((field) => (
          <label key={field.id} className={field.type === "textarea" ? "field wide" : "field"}>
            <span>{field.label}</span>
            {field.type === "select" ? (
              <select value={values[field.id] || ""} onChange={(event) => handleChange(field.id, event.target.value)}>
                <option value="">Select...</option>
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : field.type === "textarea" ? (
              <div style={{ position: "relative", width: "100%" }}>
                <textarea
                  value={values[field.id] || ""}
                  onChange={(event) => handleChange(field.id, event.target.value)}
                  placeholder={field.placeholder}
                  rows={field.id === "clientObjection" ? 6 : 4}
                  style={{ paddingRight: field.id === "meetingNotes" ? "40px" : undefined }}
                  className={field.id === "clientObjection" ? "w-full p-4 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500 min-h-[150px] resize-y" : ""}
                />
                {field.id === "meetingNotes" && (
                  <button
                    type="button"
                    onClick={handleVoiceRecordingToggle}
                    style={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      background: isRecording ? "rgba(239, 68, 68, 0.1)" : "rgba(241, 245, 249, 0.9)",
                      border: isRecording ? "1px solid rgba(239, 68, 68, 0.2)" : "1px solid #cbd5e1",
                      borderRadius: "6px",
                      padding: "4px 8px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "11px",
                      color: isRecording ? "#ef4444" : "#475569",
                      animation: isRecording ? "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" : "none",
                      boxShadow: isRecording ? "0 0 8px rgba(239, 68, 68, 0.4)" : "none",
                      transition: "all 0.2s ease"
                    }}
                    title={isRecording ? "Stop recording voice note" : "Record voice note"}
                  >
                    <span>🎙️</span>
                    {isRecording ? "🔴 Recording Voice Note... Click to stop" : "Record Voice Note"}
                  </button>
                )}
              </div>
            ) : (
              <input
                value={values[field.id] || ""}
                onChange={(event) => handleChange(field.id, event.target.value)}
                placeholder={field.placeholder}
                type="text"
              />
            )}
          </label>
        ))}
      </div>

      <div className="form-actions" style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <button className="primary-button" disabled={loading} type="submit">
          {loading ? "Generating..." : "Generate Analysis"}
          {!loading && <ArrowRight size={16} />}
        </button>
        <button
          className="secondary-button"
          disabled={loading}
          type="button"
          onClick={() => onSubmit({ ...values, forceNewWebSearch: true })}
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          {loading ? "Searching..." : "🔍 Live Search"}
        </button>
      </div>
    </form>
  );
}
