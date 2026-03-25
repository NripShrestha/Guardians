import { useState } from "react";
import { useMission } from "../../missions/MissionContext";

export default function DesktopSimulation() {
  const { mission, setMission } = useMission();
  const [desktopState, setDesktopState] = useState("desktop"); // desktop, chrome, search_results, purchase
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLink, setSelectedLink] = useState(null);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [systemAlert, setSystemAlert] = useState(null);

  if (mission.stage !== "TASK3_DESKTOP_SIMULATION") return null;

  const handleAppClick = (appName) => {
    if (appName === "chrome") setDesktopState("chrome");
    else setSystemAlert("This app is not needed for this task.");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim().toLowerCase() === "blue toy car") {
      setDesktopState("search_results");
    } else {
      setSystemAlert("Please search for 'blue toy car' as instructed.");
    }
  };

  const handleLinkClick = (link) => {
    setSelectedLink(link);
    setDesktopState("purchase");
  };

  // New function to handle the autofill
  const handlePasteBossDetails = () => {
    setCardNumber("4005 5500 0008 1019");
    setCardExpiry("05/27");
    setCardCVV("965");
  };

  const handlePurchase = (e) => {
    e.preventDefault();
    if (!cardNumber || !cardExpiry || !cardCVV) {
      setSystemAlert("Please fill in all card details.");
      return;
    }
    const result = selectedLink === "https" ? "PASS" : "FAIL";
    // alert("Purchase Successful!");
    setMission({
      ...mission,
      stage: "TASK3_RETURN_TO_MANAGER",
      result: result,
      selectedUrl:
        selectedLink === "https"
          ? "https://amazon.com/blue-toy-car"
          : "http://amazon.com/blue-toy-car",
    });
  };

  return (
    <div className="fixed inset-0  z-[950] flex items-center justify-center p-4 font-sans ">
      {/* Physical Monitor Frame */}
      <div className="relative w-[70%] h-[90vh] bg-[#0c0c0c] rounded-xl p-8 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] border-b-[12px] border-x-[12px] border-t-[12px] border-[#222] ">
        {/* Screen Content */}
        <div className="relative w-full h-full bg-[#0078D7] overflow-hidden flex flex-col shadow-inner">
          {/* Windows Desktop Background */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent pointer-events-none"></div>

          <div className="flex-1 relative p-4">
            {/* Desktop Icons */}
            <div className="flex flex-col gap-6 w-24">
              <DesktopIcon
                icon="🌐"
                label="Google Chrome"
                onClick={() => handleAppClick("chrome")}
              />
              <DesktopIcon
                icon="📂"
                label="This PC"
                onClick={() => handleAppClick("files")}
              />
              <DesktopIcon
                icon="🗑️"
                label="Recycle Bin"
                onClick={() => handleAppClick("trash")}
              />
              <DesktopIcon
                icon="⚙️"
                label="Settings"
                onClick={() => handleAppClick("settings")}
              />
            </div>

            {/* Window Management: Chrome */}
            {desktopState !== "desktop" && (
              <div className="absolute inset-2 bg-[#f1f3f4] flex flex-col shadow-2xl rounded-t-lg overflow-hidden border border-gray-400">
                {/* Chrome Title Bar / Tabs */}
                <div className="bg-[#dee1e6] h-10 flex items-end px-2 gap-1">
                  <div className="bg-[#f1f3f4] h-8 px-4 flex items-center gap-2 rounded-t-lg text-xs w-48 border-r border-gray-300">
                    <span className="text-blue-600">🌐</span>
                    <span className="truncate text-gray-700">
                      {desktopState === "chrome"
                        ? "New Tab"
                        : desktopState === "search_results"
                          ? "blue toy car - Google"
                          : "Amazon.com: Checkout"}
                    </span>
                    <button className="ml-auto hover:bg-gray-300 rounded-full w-4 h-4 text-[10px]">
                      ✕
                    </button>
                  </div>
                  <button className="mb-1 p-1 hover:bg-gray-300 rounded-full text-lg leading-none">
                    +
                  </button>
                  <div className="ml-auto mb-1 flex gap-4 px-2 text-gray-600">
                    <span>—</span>
                    <span>▢</span>
                    <button
                      onClick={() => setDesktopState("desktop")}
                      className="hover:text-red-500"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Chrome Address Bar Area */}
                <div className="bg-[#f1f3f4] border-b border-gray-300 p-2 flex items-center gap-3">
                  <div className="flex gap-3 text-gray-500 px-2">
                    <span className="cursor-pointer hover:text-black">←</span>
                    <span className="cursor-pointer hover:text-black">→</span>
                    <span className="cursor-pointer hover:text-black">↻</span>
                  </div>
                  <div className="flex-1 bg-white rounded-full border border-gray-200 px-4 py-1 flex items-center gap-2 text-sm">
                    {desktopState === "purchase" ? (
                      selectedLink === "https" ? (
                        <span className="text-green-600">🔒</span>
                      ) : (
                        <span className="text-gray-400">ⓘ</span>
                      )
                    ) : (
                      <span className="text-gray-400">🔍</span>
                    )}
                    <span className="text-gray-800 flex-1">
                      {desktopState === "purchase"
                        ? `${selectedLink}://amazon.com/checkout/payment`
                        : "google.com"}
                    </span>
                  </div>
                  <div className="text-gray-500 px-2">⋮</div>
                </div>

                {/* Browser Content Space */}
                <div className="flex-1 bg-white overflow-auto">
                  {desktopState === "chrome" && (
                    <div className="h-full flex flex-col items-center justify-center -mt-20">
                      <h1 className="text-7xl font-bold mb-8">
                        <span className="text-blue-500">G</span>
                        <span className="text-red-500">o</span>
                        <span className="text-yellow-500">o</span>
                        <span className="text-blue-500">g</span>
                        <span className="text-green-500">l</span>
                        <span className="text-red-500">e</span>
                      </h1>
                      <form
                        onSubmit={handleSearch}
                        className="w-full max-w-xl px-4"
                      >
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full border border-gray-200 rounded-full px-6 py-3 shadow-sm hover:shadow-md focus:outline-none"
                          placeholder="Search Google or type a URL"
                        />
                        <div className="flex justify-center gap-3 mt-8">
                          <button
                            type="submit"
                            className="bg-[#f8f9fa] border border-transparent hover:border-gray-300 px-4 py-2 text-sm rounded text-gray-800"
                          >
                            Google Search
                          </button>
                          <button
                            type="button"
                            className="bg-[#f8f9fa] border border-transparent hover:border-gray-300 px-4 py-2 text-sm rounded text-gray-800"
                          >
                            I'm Feeling Lucky
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {desktopState === "search_results" && (
                    <div className="p-8 max-w-3xl">
                      <p className="text-sm text-gray-500 mb-6">
                        About 1,240,000 results (0.32 seconds)
                      </p>
                      <SearchResult
                        url="http://amazon.com/blue-toy-car"
                        title="Blue Toy Car - Amazon.com"
                        desc="Cheap blue toy cars for sale. High speed, plastic wheels, great for kids."
                        onClick={() => handleLinkClick("http")}
                      />
                      <SearchResult
                        url="https://amazon.com/blue-toy-car"
                        title="Blue Toy Car - Amazon Official Store"
                        desc="Browse our collection of premium die-cast blue toy cars. Secure payment and fast shipping."
                        onClick={() => handleLinkClick("https")}
                      />
                    </div>
                  )}

                  {desktopState === "purchase" && (
                    <div className="bg-gray-50 h-full p-8">
                      <div className="max-w-md mx-auto bg-white border border-gray-300 p-6 shadow-sm">
                        <div className="flex justify-between items-center border-b pb-4 mb-4">
                          <h2 className="text-xl font-bold">Secure Checkout</h2>
                          <span className="text-blue-600 font-bold text-lg italic">
                            amazon
                          </span>
                        </div>
                        <div className="flex gap-4 mb-6">
                          <div className="w-20 h-20 bg-gray-100 flex items-center justify-center text-4xl">
                            🚗
                          </div>
                          <div>
                            <p className="font-bold">
                              Blue Toy Car (Collector Edition)
                            </p>
                            <p className="text-sm text-gray-600">Qty: 1</p>
                            <p className="text-lg font-bold text-red-700">
                              $29.99
                            </p>
                          </div>
                        </div>
                        <form onSubmit={handlePurchase} className="space-y-4">
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="Card Number"
                            className="w-full border p-2 text-sm"
                          />
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              placeholder="MM/YY"
                              className="w-1/2 border p-2 text-sm"
                            />
                            <input
                              type="text"
                              value={cardCVV}
                              onChange={(e) => setCardCVV(e.target.value)}
                              placeholder="CVV"
                              className="w-1/2 border p-2 text-sm"
                            />
                          </div>
                          {/* Paste Boss' Details Button Added Below */}
                          <button
                            type="button"
                            onClick={handlePasteBossDetails}
                            className="w-full bg-gray-200 hover:bg-gray-300 border border-gray-400 py-1 rounded text-xs font-semibold text-gray-700 transition-colors"
                          >
                            Paste boss credit card details
                          </button>
                          <button className="w-full bg-[#f0c14b] border border-[#a88734] py-2 rounded shadow-sm text-sm font-medium">
                            Place your order
                          </button>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Custom System Alert */}
          {systemAlert && (
            <div className="absolute inset-0 z-[200] bg-black/40 flex items-center justify-center">
              <div className="bg-[#f0f0f0] border border-gray-400 shadow-2xl p-0 w-80 text-sm font-sans flex flex-col">
                <div className="bg-white px-3 py-2 flex justify-between items-center border-b">
                  <span className="font-semibold text-xs text-gray-700">System Alert</span>
                  <button onClick={() => setSystemAlert(null)} className="hover:bg-red-500 hover:text-white px-2 py-0.5 text-xs transition-colors">✕</button>
                </div>
                <div className="p-6 flex gap-4 items-center bg-white">
                  <span className="text-3xl text-blue-500">ℹ️</span>
                  <p className="text-gray-800">{systemAlert}</p>
                </div>
                <div className="bg-[#f0f0f0] px-4 py-3 flex justify-end border-t border-gray-300">
                  <button onClick={() => setSystemAlert(null)} className="px-6 py-1 bg-white hover:bg-gray-50 border border-gray-400 rounded text-xs shadow-sm">OK</button>
                </div>
              </div>
            </div>
          )}

          {/* Windows Taskbar */}
          <div className="h-10 bg-[#000000cc] backdrop-blur-md border-t border-white/10 flex items-center px-1 gap-1 z-50">
            <div className="w-10 h-10 flex items-center justify-center hover:bg-white/10 text-xl cursor-default text-blue-400">
              ⊞
            </div>
            <div className="w-10 h-10 flex items-center justify-center hover:bg-white/10 text-white/80 cursor-default">
              🔍
            </div>

            <div className="ml-auto flex items-center h-full px-2 gap-3 text-white/90 text-xs">
              <span className="cursor-default hover:bg-white/10 px-2 py-1">
                ENG
              </span>
              <div className="text-right cursor-default leading-tight">
                <div>10:24 PM</div>
                <div>2/16/2026</div>
              </div>
              <div className="w-1 border-l border-white/20 h-full"></div>
            </div>
          </div>
        </div>

        {/* Monitor Branding/Stand Decoration */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-32 md:w-48 h-[50vh] bg-gradient-to-b from-[#111] to-[#050505] border-x-[12px] border-[#222] -z-10 shadow-[inset_0_30px_30px_rgba(0,0,0,0.8)]">
          <div className="w-full h-full flex justify-center">
            <div className="w-12 border-x border-[#1a1a1a] h-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DesktopIcon({ icon, label, onClick }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center group w-20">
      <div className="text-4xl drop-shadow-md mb-1 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className="text-[11px] text-white text-center font-medium leading-tight px-1 group-hover:bg-blue-600/50 rounded-sm">
        {label}
      </span>
    </button>
  );
}

function SearchResult({ url, title, desc, onClick }) {
  return (
    <div className="mb-8 group">
      <p className="text-sm text-gray-900 mb-1">{url}</p>
      <h3
        className="text-xl text-[#1a0dab] cursor-pointer group-hover:underline mb-1"
        onClick={onClick}
      >
        {title}
      </h3>
      <p className="text-sm text-gray-600 leading-snug">{desc}</p>
    </div>
  );
}
