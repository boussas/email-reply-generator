import { useState, useEffect } from "react";
import axios from "axios";

function App() {
    const [emailContent, setEmailContent] = useState("");
    const [tone, setTone] = useState("");
    const [generatedReply, setGeneratedReply] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);


    const [apiKey, setApiKey] = useState("");
    const [showApiKeyModal, setShowApiKeyModal] = useState(false);
    const [tempApiKey, setTempApiKey] = useState("");
    const [apiKeyStatus, setApiKeyStatus] = useState("");


    useEffect(() => {
        const savedKey = localStorage.getItem("gemini_api_key");
        if (savedKey) {
            setApiKey(savedKey);
        } else {
            setShowApiKeyModal(true);
        }
    }, []);

    const handleSaveApiKey = () => {
        if (!tempApiKey.trim()) {
            setApiKeyStatus("API key cannot be empty!");
            return;
        }


        if (!tempApiKey.startsWith("AI")) {
            setApiKeyStatus("Invalid API key format. Gemini keys usually start with 'AI'");
            return;
        }

        localStorage.setItem("gemini_api_key", tempApiKey);
        setApiKey(tempApiKey);
        setShowApiKeyModal(false);
        setApiKeyStatus("");
        setTempApiKey("");
    };

    const handleRemoveApiKey = () => {
        localStorage.removeItem("gemini_api_key");
        setApiKey("");
        setShowApiKeyModal(true);
    };

    const handleSubmit = async () => {
        if (!apiKey) {
            setError("Please set your Gemini API key first!");
            setShowApiKeyModal(true);
            return;
        }

        if (!emailContent || !emailContent.trim()) {
            setError("Email content must not be empty!");
            return;
        }

        setLoading(true);
        setError("");
        setGeneratedReply("");

        try {
            const response = await axios.post(
                "http://localhost:8145/api/email/generate",
                {
                    emailContent,
                    tone,
                    apiKey,
                }
            );

            setGeneratedReply(
                typeof response.data === "string"
                    ? response.data
                    : JSON.stringify(response.data, null, 2)
            );
        } catch (err) {
            if (err.response?.status === 401) {
                setError("Invalid API key. Please check your Gemini API key.");
                setShowApiKeyModal(true);
            } else {
                setError("Failed to generate email reply. Please try again.");
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedReply);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">

            {showApiKeyModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">
                            🔑 Gemini API Key Required
                        </h2>
                        <p className="text-gray-600 mb-4 text-sm">
                            This app uses your own Gemini API key. Your key is stored locally
                            and never sent to our servers except when generating replies.
                        </p>

                        <div className="mb-4">
                            <label className="block mb-2 font-medium text-gray-700">
                                Enter your Gemini API Key
                            </label>
                            <input
                                type="password"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="AIza..."
                                value={tempApiKey}
                                onChange={(e) => {
                                    setTempApiKey(e.target.value);
                                    setApiKeyStatus("");
                                }}
                            />
                        </div>

                        {apiKeyStatus && (
                            <div className="mb-4 text-red-600 text-sm">{apiKeyStatus}</div>
                        )}

                        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-gray-700">
                                📝 <strong>How to get your API key:</strong>
                            </p>
                            <ol className="text-sm text-gray-600 mt-2 ml-4 list-decimal">
                                <li>Visit <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google AI Studio</a></li>
                                <li>Sign in with your Google account</li>
                                <li>Click "Get API Key" and create a new key</li>
                                <li>Copy and paste it here</li>
                            </ol>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleSaveApiKey}
                                className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition cursor-pointer "
                            >
                                Save API Key
                            </button>
                            {apiKey && (
                                <button
                                    onClick={() => setShowApiKeyModal(false)}
                                    className="cursor-pointer  flex-1 border border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">

                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">
                        ✉️ Email Reply Generator
                    </h1>
                    <div className="flex items-center gap-2">
                        {apiKey ? (
                            <>
                <span className="text-sm text-green-600 font-medium">
                  ✓ API Key Set
                </span>
                                <button
                                    onClick={() => setShowApiKeyModal(true)}
                                    className="cursor-pointer text-sm text-blue-600 hover:underline"
                                >
                                    Change
                                </button>
                                <button
                                    onClick={handleRemoveApiKey}
                                    className="cursor-pointer text-sm text-red-600 hover:underline"
                                >
                                    Remove
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setShowApiKeyModal(true)}
                                className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                Set API Key
                            </button>
                        )}
                    </div>
                </div>

                <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="6"
                    placeholder="Enter the original email content..."
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                />

                <div className="mb-4">
                    <label className="block mb-1 font-medium text-gray-700">
                        Tone (optional)
                    </label>
                    <select
                        className="w-full p-3 border cursor-pointer  border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={tone}
                        onChange={(e) => setTone(e.target.value)}
                    >
                        <option value="">None</option>
                        <option value="professional">Professional</option>
                        <option value="casual">Casual</option>
                        <option value="friendly">Friendly</option>
                        <option value="apologetic">Apologetic</option>
                        <option value="enthusiastic">Enthusiastic</option>
                    </select>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={!emailContent || loading || !apiKey}
                    className={` cursor-pointer w-full bg-blue-600 text-white font-semibold py-3 rounded-lg transition duration-200 ${
                        loading || !apiKey
                            ? "opacity-70 cursor-not-allowed"
                            : "hover:bg-blue-700"
                    }`}
                >
                    {loading ? "Generating..." : "Generate Reply"}
                </button>

                {error && <div className="mt-4 text-red-600 font-medium">{error}</div>}

                {generatedReply && (
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold mb-2 text-gray-800">
                            Generated Reply:
                        </h2>
                        <textarea
                            className="w-full p-3 border border-gray-300 rounded-lg mb-3 resize-none bg-gray-50"
                            rows="6"
                            value={generatedReply}
                            readOnly
                        />
                        <button
                            onClick={handleCopy}
                            className="w-full border border-blue-600 text-blue-600 font-semibold py-2 rounded-lg hover:bg-blue-50 transition"
                        >
                            {copied ? "Copied! ✓" : "Copy to Clipboard"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;