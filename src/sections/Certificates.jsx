import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePortfolio } from "../context/PortfolioContext";
import {
  FaAward,
  FaBuilding,
  FaArrowUpRightFromSquare,
  FaEye,
  FaXmark,
  FaCertificate,
  FaCircleCheck,
  FaCopy,
  FaCheck
} from "react-icons/fa6";

export default function Certificates() {
  const { data } = usePortfolio();
  const certificates = Array.isArray(data?.certificates) ? data.certificates : [];

  const [selectedCert, setSelectedCert] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedCert(null);
      }
    };
    if (selectedCert) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCert]);

  const handleCopyId = (e, credId) => {
    e.stopPropagation();
    if (!credId) return;
    navigator.clipboard.writeText(credId);
    setCopiedId(credId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section
      id="certificates"
      className="relative min-h-screen bg-black text-white py-24 px-4 sm:px-6 lg:px-12 overflow-hidden flex flex-col justify-center"
    >
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute top-1/4 -right-32 w-96 h-96 bg-[#1cd8d2]/10 rounded-full blur-[140px] animate-pulse" />
      <div className="pointer-events-none absolute bottom-1/4 -left-32 w-96 h-96 bg-[#00bf8f]/10 rounded-full blur-[140px] animate-pulse delay-700" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#302b63]/15 rounded-full blur-[160px]" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-wider text-[#1cd8d2] mb-4 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-[#1cd8d2] animate-ping" />
            <FaAward className="text-xs" />
            <span>Credentials & Honors</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-400"
          >
            Licenses & Certifications
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 text-xs sm:text-sm md:text-base mt-3 sm:mt-4 leading-relaxed px-2"
          >
            Industry-recognized credentials, specialized technical courses, and verified achievements.
          </motion.p>
        </div>

        {/* Empty State */}
        {certificates.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto p-8 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl text-center space-y-3"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#1cd8d2]/20 to-[#00bf8f]/20 border border-[#1cd8d2]/30 flex items-center justify-center mx-auto text-[#1cd8d2] text-2xl">
              <FaCertificate />
            </div>
            <h3 className="text-lg font-bold text-white">No Certifications Added Yet</h3>
            <p className="text-xs text-gray-400">
              Certifications added via the Admin Portal will be beautifully displayed here with verification links and preview credentials.
            </p>
          </motion.div>
        )}

        {/* Certificates Grid - Compact & Elegant Cards */}
        {certificates.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-5xl mx-auto">
            {certificates.map((cert, idx) => (
              <motion.div
                key={cert.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.4, delay: (idx % 3) * 0.08 }}
                whileHover={{ y: -4 }}
                className="group relative rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-[#1cd8d2]/50 backdrop-blur-xl overflow-hidden shadow-lg hover:shadow-[#1cd8d2]/10 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Top Certificate Thumbnail / Photo Banner */}
                <div
                  onClick={() => setSelectedCert(cert)}
                  className="relative w-full h-32 sm:h-36 overflow-hidden bg-neutral-950 cursor-pointer flex items-center justify-center border-b border-white/5"
                  title="Click to view certificate"
                >
                  {cert.image ? (
                    <>
                      <img
                        src={cert.image}
                        alt={cert.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                    </>
                  ) : (
                    /* Mini Authentic Digital Certificate Diploma Preview */
                    <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-[#0d1624] via-[#09101a] to-[#060a10] p-3 flex flex-col justify-between border border-white/5 select-none">
                      {/* Decorative corner borders */}
                      <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t border-l border-[#1cd8d2]/40" />
                      <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t border-r border-[#1cd8d2]/40" />
                      <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b border-l border-[#1cd8d2]/40" />
                      <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b border-r border-[#1cd8d2]/40" />

                      <div className="flex items-center justify-between z-10">
                        <span className="text-[9px] font-bold tracking-widest text-[#1cd8d2] uppercase font-mono">
                          CERTIFICATE OF COMPLETION
                        </span>
                        <FaAward className="text-[#00bf8f] text-xs" />
                      </div>

                      <div className="text-center z-10 my-0.5">
                        <p className="text-[10px] text-gray-400">Awarded to</p>
                        <h4 className="text-xs sm:text-sm font-extrabold text-white tracking-wide font-sans">
                          Kundan Kumar
                        </h4>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-gray-400 z-10 pt-1 border-t border-white/10">
                        <span className="truncate max-w-[140px] text-gray-300 font-medium">
                          {cert.issuer}
                        </span>
                        <span className="text-[#1cd8d2] font-semibold text-[9px] uppercase tracking-wider">
                          Verified
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Top-Right Preview Chip on Hover */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/80 backdrop-blur-md text-white border border-white/20 shadow-md">
                      <FaEye className="text-[#1cd8d2] text-[10px]" /> Preview
                    </span>
                  </div>

                  {/* Bottom-Left Verified Badge */}
                  <div className="absolute bottom-2 left-2 z-10 pointer-events-none">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/70 backdrop-blur-md text-emerald-400 border border-emerald-500/30 shadow-sm">
                      <FaCircleCheck className="text-[9px]" /> Verified
                    </span>
                  </div>

                  {/* Bottom-Right Issue Date */}
                  {cert.issueDate && (
                    <div className="absolute bottom-2 right-2 z-10 pointer-events-none">
                      <span className="text-[10px] font-medium text-gray-300 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10">
                        {cert.issueDate}
                      </span>
                    </div>
                  )}
                </div>

                {/* Compact Body Content */}
                <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between gap-3">
                  <div>
                    {/* Organization / Issuer */}
                    <div className="flex items-center gap-1.5 text-xs text-[#1cd8d2] font-semibold mb-1 truncate" title={cert.issuer}>
                      <FaBuilding className="text-[10px] shrink-0" />
                      <span className="truncate">{cert.issuer || "Certificate"}</span>
                    </div>

                    {/* Certificate Name / Title */}
                    <h3
                      onClick={() => setSelectedCert(cert)}
                      className="text-sm sm:text-base font-bold text-white group-hover:text-[#1cd8d2] transition-colors duration-200 line-clamp-2 cursor-pointer leading-snug"
                      title={cert.title}
                    >
                      {cert.title}
                    </h3>
                  </div>

                  {/* Compact Bottom Action Bar */}
                  <div className="pt-2.5 border-t border-white/10 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedCert(cert)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-200 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition cursor-pointer"
                    >
                      <FaEye className="text-[#1cd8d2] text-[11px]" />
                      <span>View</span>
                    </button>

                    {cert.credentialUrl ? (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-[#1cd8d2]/20 to-[#00bf8f]/20 hover:from-[#1cd8d2]/30 hover:to-[#00bf8f]/30 border border-[#1cd8d2]/40 hover:border-[#1cd8d2] transition cursor-pointer"
                      >
                        <span>Verify</span>
                        <FaArrowUpRightFromSquare className="text-[9px]" />
                      </a>
                    ) : cert.credentialId ? (
                      <button
                        onClick={(e) => handleCopyId(e, cert.credentialId)}
                        title="Copy Credential ID"
                        className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-mono text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 transition cursor-pointer truncate"
                      >
                        {copiedId === cert.credentialId ? (
                          <>
                            <FaCheck className="text-emerald-400 text-[10px]" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <FaCopy className="text-gray-400 text-[10px]" />
                            <span className="truncate">ID: {cert.credentialId}</span>
                          </>
                        )}
                      </button>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* High-Resolution Certificate Modal Lightbox */}
      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-3xl rounded-3xl bg-[#0b0f17] border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/10 bg-black/40">
                <div className="flex items-center gap-3 pr-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00bf8f] to-[#1cd8d2] flex items-center justify-center text-black font-bold text-lg shrink-0">
                    <FaAward />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base sm:text-lg leading-tight line-clamp-1">
                      {selectedCert.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {selectedCert.issuer} {selectedCert.issueDate ? `• Issued ${selectedCert.issueDate}` : ""}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCert(null)}
                  className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer shrink-0"
                  aria-label="Close Preview"
                >
                  <FaXmark className="text-xl" />
                </button>
              </div>

              {/* Modal Body / Image Viewer */}
              <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
                {selectedCert.image ? (
                  <div className="rounded-2xl overflow-hidden border border-white/10 bg-black flex items-center justify-center shadow-inner">
                    <img
                      src={selectedCert.image}
                      alt={selectedCert.title}
                      className="w-full max-h-[50vh] object-contain"
                    />
                  </div>
                ) : (
                  <div className="p-10 rounded-2xl bg-gradient-to-br from-[#0c1421] to-[#080d14] border border-white/10 text-center space-y-3">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#00bf8f] to-[#1cd8d2] flex items-center justify-center text-black text-3xl mx-auto shadow-xl shadow-[#00bf8f]/20">
                      <FaAward />
                    </div>
                    <h4 className="text-xl font-bold text-white">{selectedCert.title}</h4>
                    <p className="text-sm text-[#1cd8d2] font-semibold">{selectedCert.issuer}</p>
                    <p className="text-xs text-gray-400 max-w-md mx-auto">
                      Official credential certificate authenticated and issued to Kundan Kumar.
                    </p>
                  </div>
                )}

                {/* Additional Details */}
                <div className="space-y-3 bg-white/[0.02] p-4 rounded-2xl border border-white/5 text-xs text-gray-300">
                  {selectedCert.description && (
                    <div>
                      <span className="font-semibold text-white block mb-1">Details & Specialization:</span>
                      <p className="text-gray-400 leading-relaxed">{selectedCert.description}</p>
                    </div>
                  )}

                  {selectedCert.credentialId && (
                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                      <span className="font-semibold text-white">Credential ID:</span>
                      <span className="font-mono text-[#1cd8d2]">{selectedCert.credentialId}</span>
                      <button
                        onClick={(e) => handleCopyId(e, selectedCert.credentialId)}
                        className="p-1 text-gray-400 hover:text-white transition cursor-pointer"
                        title="Copy ID"
                      >
                        {copiedId === selectedCert.credentialId ? (
                          <FaCheck className="text-emerald-400" />
                        ) : (
                          <FaCopy />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-5 border-t border-white/10 bg-black/40 flex items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedCert(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                >
                  Close
                </button>
                {selectedCert.credentialUrl && (
                  <a
                    href={selectedCert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-[#00bf8f] to-[#1cd8d2] text-black hover:opacity-90 transition shadow-lg shadow-[#00bf8f]/20 cursor-pointer"
                  >
                    <span>Verify on Official Site</span>
                    <FaArrowUpRightFromSquare className="text-xs" />
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
