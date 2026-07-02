import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Link2,
  ExternalLink,
  Star,
  Monitor,
  X,
  Edit3,
  Trash2,
  Eye,
  FolderOpen,
  Sparkles,
  SlidersHorizontal,
  RefreshCw
} from "lucide-react";

const categories = ["All", "Web Application", "Web Service(API)", "Dashboard"];

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Card({ className = "", children }) {
  return (
    <div className={cn("rounded-[2.5rem] border border-white/50 bg-white/20 p-6 shadow-xl backdrop-blur-3xl", className)}>
      {children}
    </div>
  );
}

function normalizeUrl(url) {
  if (!url) return "";
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function getNowText() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const mi = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

function DevicePreview({ project, onFullscreen }) {
  const iframeKey = project?.url ? `${project.id}-${project.url}` : "empty";

  return (
    <div className="w-full py-4">
      {/* macOS Safari window controls */}
      <div className="relative rounded-[2.5rem] border border-white/50 bg-white/25 p-3 shadow-2xl backdrop-blur-3xl shadow-slate-900/10">
        <div className="mb-4 flex items-center justify-between gap-3 px-3">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57] shadow-inner" />
            <span className="h-3 w-3 rounded-full bg-[#ffbd2e] shadow-inner" />
            <span 
              onClick={onFullscreen} 
              className="h-3 w-3 rounded-full bg-[#28c840] shadow-inner cursor-pointer hover:scale-115 active:scale-90 transition" 
              title="ขยายเต็มจอชั่วคราว (Maximize)" 
            />
          </div>
          
          {/* Safari Address Bar */}
          <div className="flex-1 max-w-md mx-auto flex items-center justify-between gap-1.5 rounded-xl border border-white/20 bg-white/35 py-1.5 px-3 text-[11px] text-slate-700 shadow-inner">
            <div className="flex items-center gap-1 text-slate-400">
              <span>🔒</span>
              <span className="truncate max-w-[200px] md:max-w-[320px] font-medium tracking-tight">
                {project?.url ? new URL(normalizeUrl(project.url)).hostname : "your-work-link.com"}
              </span>
            </div>
            <RefreshCw className="h-3 w-3 text-slate-400 cursor-pointer hover:rotate-45 transition-transform" />
          </div>
          
          <button 
            onClick={onFullscreen}
            className="text-slate-500 hover:text-slate-800 p-1.5 rounded-lg hover:bg-white/40 active:scale-90 transition cursor-pointer"
            title="ขยายหน้าต่างพรีวิว"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Device viewport frame */}
        <div className="h-[540px] w-full overflow-hidden rounded-[1.6rem] border border-white/30 bg-slate-950/90 shadow-inner">
          {project?.url ? (
            <iframe
              key={iframeKey}
              title={`Preview ${project.title}`}
              src={normalizeUrl(project.url)}
              className="h-full w-full bg-white transition-all duration-300"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-white/50 text-sm">
              <div className="rounded-full bg-white/10 p-4 shadow-lg backdrop-blur-md">
                <FolderOpen className="h-8 w-8 stroke-1 text-white/70 animate-pulse" />
              </div>
              <span className="font-medium tracking-wide">เลือกผลงานเพื่อเปิดดูตัวอย่างเว็บ</span>
            </div>
          )}
        </div>
        
        <p className="mt-3 text-center text-[10px] leading-relaxed text-slate-500 font-medium">
          💡 เว็บไซต์ที่รองรับจะแสดงตัวอย่างโดยตรง บางเว็บอาจติด Security Header (X-Frame-Options)
        </p>
      </div>
    </div>
  );
}

function AddProjectModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ title: "", url: "", category: "Dashboard", description: "", tags: "" });

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.url.trim()) return;
    onAdd({
      title: form.title.trim(),
      url: normalizeUrl(form.url.trim()),
      category: form.category,
      description: form.description.trim() || "ยังไม่มีรายละเอียด",
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 15 }}
        transition={{ type: "spring", stiffness: 350, damping: 26 }}
        className="w-full max-w-lg rounded-[2.5rem] border border-white/50 bg-white/80 p-6 shadow-2xl backdrop-blur-3xl text-slate-900"
      >
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="text-xl font-bold flex items-center gap-2 tracking-tight text-slate-800">
            <Sparkles className="h-5 w-5 text-indigo-600 animate-pulse" /> เพิ่มผลงานใหม่เข้าคลัง
          </h3>
          <button onClick={onClose} className="rounded-full p-2 bg-slate-200/50 hover:bg-slate-200/80 active:scale-95 text-slate-700 transition cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={submit} className="grid gap-4">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/60 shadow-inner grid gap-px">
            <div className="bg-white/80 px-4 py-3">
              <label className="block text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-0.5">ชื่องาน / Project name</label>
              <input
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="ชื่องาน / Project name"
                className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 font-medium"
              />
            </div>
            
            <div className="bg-white/80 px-4 py-3 border-t border-slate-100">
              <label className="block text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-0.5">Link URL</label>
              <input
                value={form.url}
                onChange={(e) => update("url", e.target.value)}
                placeholder="Link URL เช่น https://..."
                className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 border-t border-slate-100">
              <div className="bg-white/80 px-4 py-3 border-r border-slate-100">
                <label className="block text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-0.5">หมวดหมู่</label>
                <select
                  value={form.category}
                  onChange={(e) => update("category", e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-800 outline-none font-semibold cursor-pointer"
                >
                  {categories.filter((c) => c !== "All").map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              
              <div className="bg-white/80 px-4 py-3">
                <label className="block text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-0.5">Tags (Commaคั่น)</label>
                <input
                  value={form.tags}
                  onChange={(e) => update("tags", e.target.value)}
                  placeholder="PHP, Oracle, API"
                  className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 font-medium"
                />
              </div>
            </div>

            <div className="bg-white/80 px-4 py-3 border-t border-slate-100">
              <label className="block text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-0.5">รายละเอียดงาน</label>
              <textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="รายละเอียดเพิ่มเติมของผลงานชิ้นนี้..."
                rows={3}
                className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 resize-none leading-relaxed font-medium"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end mt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 hover:bg-slate-50 text-sm font-semibold text-slate-700 transition active:scale-97 shadow-sm cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="rounded-2xl bg-indigo-600 px-5 py-3 text-white text-sm font-semibold hover:bg-indigo-700 active:scale-97 transition shadow-md shadow-indigo-600/10 cursor-pointer"
            >
              เพิ่มผลงานเข้าคลัง
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function EditProjectModal({ project, onClose, onSave }) {
  const [form, setForm] = useState({
    title: project.title || "",
    url: project.url || "",
    category: project.category || "Dashboard",
    description: project.description || "",
    tags: (project.tags || []).join(", "),
  });

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.url.trim()) return;
    onSave({
      id: project.id,
      title: form.title.trim(),
      url: normalizeUrl(form.url.trim()),
      category: form.category,
      description: form.description.trim() || "ยังไม่มีรายละเอียด",
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 15 }}
        transition={{ type: "spring", stiffness: 350, damping: 26 }}
        className="w-full max-w-lg rounded-[2.5rem] border border-white/50 bg-white/80 p-6 shadow-2xl backdrop-blur-3xl text-slate-900"
      >
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="text-xl font-bold flex items-center gap-2 tracking-tight text-slate-800">
            <Edit3 className="h-5 w-5 text-indigo-600" /> แก้ไขข้อมูลงาน
          </h3>
          <button onClick={onClose} className="rounded-full p-2 bg-slate-200/50 hover:bg-slate-200/80 active:scale-95 text-slate-700 transition cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={submit} className="grid gap-4">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/60 shadow-inner grid gap-px">
            <div className="bg-white/80 px-4 py-3">
              <label className="block text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-0.5">ชื่องาน / Project name</label>
              <input
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="ชื่องาน / Project name"
                className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 font-medium"
              />
            </div>
            
            <div className="bg-white/80 px-4 py-3 border-t border-slate-100">
              <label className="block text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-0.5">Link URL</label>
              <input
                value={form.url}
                onChange={(e) => update("url", e.target.value)}
                placeholder="Link URL เช่น https://..."
                className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 border-t border-slate-100">
              <div className="bg-white/80 px-4 py-3 border-r border-slate-100">
                <label className="block text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-0.5">หมวดหมู่</label>
                <select
                  value={form.category}
                  onChange={(e) => update("category", e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-800 outline-none font-semibold cursor-pointer"
                >
                  {categories.filter((c) => c !== "All").map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              
              <div className="bg-white/80 px-4 py-3">
                <label className="block text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-0.5">Tags (Commaคั่น)</label>
                <input
                  value={form.tags}
                  onChange={(e) => update("tags", e.target.value)}
                  placeholder="PHP, Oracle, API"
                  className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 font-medium"
                />
              </div>
            </div>

            <div className="bg-white/80 px-4 py-3 border-t border-slate-100">
              <label className="block text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-0.5">รายละเอียดงาน</label>
              <textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="รายละเอียดเพิ่มเติมของผลงานชิ้นนี้..."
                rows={3}
                className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 resize-none leading-relaxed font-medium"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end mt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 hover:bg-slate-50 text-sm font-semibold text-slate-700 transition active:scale-97 shadow-sm cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="rounded-2xl bg-indigo-600 px-5 py-3 text-white text-sm font-semibold hover:bg-indigo-700 active:scale-97 transition shadow-md shadow-indigo-600/10 cursor-pointer"
            >
              บันทึกการแก้ไข
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function WorkGalleryLiquidGlass() {
  const [projects, setProjects] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [notification, setNotification] = useState(null);

  const triggerNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    async function loadProjects() {
      try {
        const apiResponse = await fetch("/api/projects");
        if (apiResponse.ok) {
          const data = await apiResponse.json();
          setProjects(data);
          setSelected(data[0] || null);
          setIsLoaded(true);
          return;
        }
      } catch (error) {
        console.warn("Backend API not available, trying static file or localStorage:", error);
      }

      try {
        const saved = localStorage.getItem("work-gallery-projects");
        if (saved) {
          const parsed = JSON.parse(saved);
          setProjects(parsed);
          setSelected(parsed[0] || null);
        } else {
          const response = await fetch("/config/work-gallery.json");
          const data = await response.json();
          setProjects(data);
          setSelected(data[0] || null);
          localStorage.setItem("work-gallery-projects", JSON.stringify(data));
        }
      } catch (error) {
        console.error("Load projects fallback error:", error);
        setProjects([]);
        setSelected(null);
      } finally {
        setIsLoaded(true);
      }
    }

    loadProjects();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("work-gallery-projects", JSON.stringify(projects));
  }, [projects, isLoaded]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return projects
      .filter((p) => category === "All" || p.category === category)
      .filter((p) => !q || [p.title, p.url, p.category, p.description, ...(p.tags || [])].join(" ").toLowerCase().includes(q))
      .sort((a, b) => Number(b.favorite) - Number(a.favorite));
  }, [projects, query, category]);

  const handleAddProject = async (newItem) => {
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      if (response.ok) {
        const addedItem = await response.json();
        setProjects((prev) => [addedItem, ...prev]);
        setSelected(addedItem);
        triggerNotification("✨ เพิ่มผลงานใหม่ลงไฟล์สำเร็จ!");
      } else {
        const localItem = {
          ...newItem,
          id: Date.now(),
          favorite: false,
          createdAt: getNowText(),
          updatedAt: getNowText(),
        };
        setProjects((prev) => [localItem, ...prev]);
        setSelected(localItem);
        triggerNotification("💾 บันทึกลงเครื่องแบบ Local เรียบร้อย");
      }
    } catch (err) {
      console.error("Add project error:", err);
      const localItem = {
        ...newItem,
        id: Date.now(),
        favorite: false,
        createdAt: getNowText(),
        updatedAt: getNowText(),
      };
      setProjects((prev) => [localItem, ...prev]);
      setSelected(localItem);
      triggerNotification("💾 บันทึกลงเครื่องแบบ Local เรียบร้อย");
    }
  };

  const handleUpdateProject = async (updatedItem) => {
    setEditingProject(null);
    // Optimistic update
    setProjects((prev) => prev.map((p) => p.id === updatedItem.id ? { ...p, ...updatedItem } : p));
    if (selected?.id === updatedItem.id) setSelected((prev) => ({ ...prev, ...updatedItem }));

    try {
      const response = await fetch(`/api/projects/${updatedItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedItem),
      });
      if (response.ok) {
        triggerNotification("📝 แก้ไขข้อมูลและบันทึกลงไฟล์สำเร็จ!");
      } else {
        triggerNotification("⚠️ เซิร์ฟเวอร์มีปัญหา (บันทึกเฉพาะในเครื่องชั่วคราว)");
      }
    } catch (err) {
      console.error("Update project API error:", err);
      triggerNotification("❌ เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ (บันทึกเฉพาะในเครื่องชั่วคราว)");
    }
  };

  const toggleFavorite = async (id) => {
    const project = projects.find((p) => p.id === id);
    if (!project) return;
    
    const nextFavorite = !project.favorite;
    setProjects((prev) => prev.map((p) => p.id === id ? { ...p, favorite: nextFavorite } : p));
    if (selected?.id === id) setSelected((prev) => ({ ...prev, favorite: nextFavorite }));

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favorite: nextFavorite }),
      });
      if (response.ok) {
        triggerNotification(nextFavorite ? "⭐ เพิ่มเข้ารายการโปรดสำเร็จ!" : "🤍 นำออกจากรายการโปรดสำเร็จ!");
      } else {
        triggerNotification("⭐ บันทึกรายการโปรดเฉพาะในเบราว์เซอร์");
      }
    } catch (err) {
      console.error("Toggle favorite API error:", err);
      triggerNotification("❌ เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ (เซฟเฉพาะในเครื่อง)");
    }
  };

  const removeProject = async (id) => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบผลงานนี้ออกจากระบบ?")) return;
    
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (selected?.id === id) setSelected(projects.find((p) => p.id !== id) || null);

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        triggerNotification("🗑️ ลบผลงานออกจากไฟล์เรียบร้อย!");
      } else {
        triggerNotification("🗑️ ลบผลงานเฉพาะในเบราว์เซอร์");
      }
    } catch (err) {
      console.error("Delete API error:", err);
      triggerNotification("❌ เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ (ลบเฉพาะในเครื่อง)");
    }
  };

  const stats = [
    { label: "ผลงานทั้งหมด", value: projects.length, icon: FolderOpen, color: "text-indigo-600 bg-indigo-500/10" },
    { label: "รายการโปรด", value: projects.filter((p) => p.favorite).length, icon: Star, color: "text-amber-500 bg-amber-500/10" },
    { label: "หมวดหมู่แยก", value: new Set(projects.map((p) => p.category)).size, icon: SlidersHorizontal, color: "text-emerald-600 bg-emerald-500/10" },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_15%_15%,rgba(199,210,254,0.65),transparent_35%),radial-gradient(circle_at_85%_15%,rgba(216,180,254,0.6),transparent_35%),radial-gradient(circle_at_50%_80%,rgba(167,243,208,0.45),transparent_40%),linear-gradient(135deg,#f0f4fa,#fafcff_45%,#fff9fd)] p-4 md:p-6 text-slate-800">
      
      {/* Dynamic Background Mesh */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <motion.div
          animate={{
            x: [0, 60, -40, 0],
            y: [0, -70, 50, 0],
            scale: [1, 1.15, 0.95, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[10%] h-[320px] w-[320px] rounded-full bg-sky-200/35 blur-[80px]"
        />
        <motion.div
          animate={{
            x: [0, -80, 50, 0],
            y: [0, 60, -70, 0],
            scale: [1, 0.95, 1.1, 1],
          }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[35%] right-[15%] h-[360px] w-[360px] rounded-full bg-purple-200/30 blur-[90px]"
        />
      </div>

      {/* Grid line overlay */}
      <div className="pointer-events-none fixed inset-0 opacity-20 z-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)", backgroundSize: "50px 50px" }} />

      {/* Dynamic Island Notification Banner */}
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -45, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -25, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 420, damping: 26 }}
              className="pointer-events-auto flex items-center gap-3 px-5 py-3 rounded-full border border-slate-800/10 bg-slate-900/90 text-white shadow-xl backdrop-blur-md text-[11px] font-semibold tracking-tight"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{notification}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <main className="relative mx-auto max-w-[96%] xl:max-w-[1550px] 2xl:max-w-[1720px] z-10 space-y-6">
        
        {/* iOS Styled Header */}
        <motion.header 
          initial={{ opacity: 0, y: -15 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="rounded-[2.5rem] border border-white/50 bg-white/25 p-6 shadow-2xl backdrop-blur-3xl flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/40 px-3 py-1 text-[10px] font-bold text-slate-700 shadow-sm tracking-widest uppercase">
              <Sparkles className="h-3 w-3 text-indigo-600 animate-spin-slow" /> System Gallery v2.7
            </div>
            <h1 className="text-2xl font-black tracking-tight md:text-4xl bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 bg-clip-text text-transparent">
              คลังรวบรวมผลงาน & Link Preview
            </h1>
            <p className="text-xs text-slate-500 font-medium">รวบรวมระบบสารสนเทศพร้อมจำลองภาพการแสดงผลสไตล์ Desktop แบบ Realtime</p>
          </div>

          {/* Control Center Style Widgets */}
          <div className="grid grid-cols-3 gap-3 min-w-[280px] sm:min-w-[340px]">
            {stats.map((s) => (
              <div 
                key={s.label} 
                className="rounded-3xl border border-white/45 bg-white/40 p-3 flex flex-col justify-between shadow-lg backdrop-blur-2xl transition hover:bg-white/60 hover:scale-102 duration-200 cursor-default"
              >
                <div className="flex items-center justify-between">
                  <div className={cn("rounded-xl p-1.5", s.color)}>
                    <s.icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-xl font-extrabold tracking-tight text-slate-800">{s.value}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight leading-none mt-1">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.header>

        {/* Dashboard Grid */}
        <section className="grid gap-6 lg:grid-cols-[400px_1fr] items-stretch">
          
          {/* Sidebar - Works list & Add Form */}
          <aside className="h-full flex flex-col">
            <Card className="rounded-[2.5rem] flex-1 flex flex-col h-full">
              <div className="mb-5 flex items-center justify-between px-1">
                <h2 className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-slate-800">
                  <FolderOpen className="h-5 w-5 text-indigo-600" /> รายการผลงาน
                </h2>
                
                {/* Plus button to open modal */}
                <button 
                  onClick={() => setShowAddModal(true)} 
                  className="rounded-full p-2.5 bg-white/65 hover:bg-white border border-white/50 text-slate-700 shadow-slate-500/5 transition active:scale-90 shadow-md cursor-pointer"
                  title="เพิ่มผลงานใหม่"
                >
                  <Plus className="h-4 w-4 stroke-[3.5]" />
                </button>
              </div>

              {/* iOS Spotlight Search input */}
              <div className="mb-4 flex items-center gap-2.5 rounded-2xl border border-white/30 bg-white/40 px-3.5 py-2.5 backdrop-blur-xl shadow-inner group focus-within:bg-white focus-within:border-indigo-500/35 transition-all duration-200">
                <Search className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition" />
                <input 
                  value={query} 
                  onChange={(e) => setQuery(e.target.value)} 
                  placeholder="ค้นหาชื่อ, แท็ก, หรือลิงก์..." 
                  className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 font-medium" 
                />
              </div>

              {/* iOS Segmented Control slider for Categories */}
              <div className="mb-4 overflow-x-auto no-scrollbar py-0.5">
                <div className="flex gap-1.5 p-1 rounded-2xl border border-white/20 bg-white/20 backdrop-blur-2xl w-max">
                  {categories.map((c) => {
                    const isSelected = category === c;
                    return (
                      <button 
                        key={c} 
                        onClick={() => setCategory(c)} 
                        className={cn(
                          "relative z-10 rounded-xl px-3 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors duration-200 whitespace-nowrap cursor-pointer",
                          isSelected ? "text-slate-950 font-extrabold" : "text-slate-500 hover:text-slate-800"
                        )}
                      >
                        {isSelected && (
                          <motion.div
                            layoutId="activeCategory"
                            className="absolute inset-0 z-[-1] rounded-[10px] bg-white border border-white/50 shadow-sm"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>



              {/* Scrollable list card grid */}
              <div className="flex-1 flex flex-col gap-3.5 overflow-y-auto pr-1.5 no-scrollbar min-h-[450px] lg:max-h-[640px]">
                <AnimatePresence mode="popLayout">
                  {filtered.length > 0 ? (
                    filtered.map((p) => (
                      <motion.div 
                        key={p.id} 
                        layout 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 350, damping: 28 }}
                        onClick={() => setSelected(p)} 
                        whileHover={{ y: -3, scale: 1.012 }}
                        className={cn(
                          "cursor-pointer rounded-3xl border p-4.5 transition-all duration-200", 
                          selected?.id === p.id 
                            ? "border-slate-800/10 bg-white/70 shadow-xl shadow-slate-900/5 ring-1 ring-white/40" 
                            : "border-white/30 bg-white/20 hover:bg-white/40 hover:shadow-md"
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 space-y-1">
                            <h3 className="truncate text-[15px] font-extrabold tracking-tight text-slate-800">{p.title}</h3>
                            <p className="line-clamp-2 text-xs leading-relaxed text-slate-500 font-medium">{p.description}</p>
                          </div>
                          <button 
                            onClick={(e) => { e.stopPropagation(); toggleFavorite(p.id); }} 
                            className="rounded-full bg-white/45 p-2 border border-white/40 shadow-sm hover:scale-110 hover:bg-white active:scale-95 transition cursor-pointer"
                          >
                            <Star className={cn("h-3.5 w-3.5 transition", p.favorite ? "fill-amber-400 text-amber-500" : "text-slate-400")} />
                          </button>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">{p.category}</span>
                          {(p.tags || []).map((t) => (
                            <span key={t} className="rounded-full bg-white/50 border border-white/50 px-2 py-0.5 text-[9px] font-bold text-slate-500">#{t}</span>
                          ))}
                        </div>
                        <div className="mt-3.5 flex items-center gap-1.5 truncate text-[10px] font-semibold text-slate-400 tracking-tight border-t border-slate-900/5 pt-3">
                          <Link2 className="h-3 w-3 stroke-[2.5]" /> 
                          <span className="truncate">{p.url}</span>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-slate-400 gap-2">
                      <Search className="h-8 w-8 stroke-1 text-slate-300" />
                      <span className="text-xs font-semibold">ไม่พบข้อมูลงานที่ค้นหา</span>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </Card>
          </aside>

          {/* Device Mockup & Safari controls */}
          <section className="h-full flex flex-col">
            <Card className="rounded-[2.5rem] flex-1 flex flex-col h-full justify-between">
              <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-1">
                <div className="min-w-0">
                  <h2 className="truncate text-xl font-extrabold tracking-tight text-slate-800">{selected?.title || "โปรดเลือกผลงาน"}</h2>
                  <p className="mt-1 text-xs text-slate-500 font-semibold">{selected?.description || "เลือกงานจากเมนูด้านซ้ายเพื่อเริ่มต้นเปิดดูข้อมูลเว็บ"}</p>
                </div>
                
                {/* Desktop View Indicator */}
                <div className="flex items-center gap-2 rounded-2xl border border-slate-800/10 bg-white/40 px-4 py-2.5 text-xs font-extrabold text-slate-700 shadow-sm backdrop-blur-xl">
                  <Monitor className="h-4 w-4 text-indigo-600 animate-pulse" />
                  Desktop Preview Mode
                </div>
              </div>

              {/* Mock Screen IFrame Viewer */}
              <DevicePreview 
                project={selected} 
                onFullscreen={() => selected && setIsFullscreen(true)} 
              />

              {/* Action Tools */}
              <div className="mt-4 flex flex-wrap gap-2.5 pt-2">
                <a 
                  href={selected?.url || "#"} 
                  target="_blank" 
                  rel="noreferrer"
                  className={cn(
                    "rounded-2xl font-bold text-xs py-3 px-5 shadow-lg active:scale-97 transition duration-200 flex items-center gap-1.5 cursor-pointer",
                    selected?.url 
                      ? "bg-slate-950 text-white hover:bg-slate-800 shadow-slate-950/10" 
                      : "bg-slate-200/50 text-slate-400 cursor-not-allowed"
                  )}
                  onClick={(e) => !selected?.url && e.preventDefault()}
                >
                  <ExternalLink className="h-3.5 w-3.5 stroke-[2.5]" /> เปิดลิงก์ใหม่
                </a>
                
                <button 
                  onClick={() => selected && setIsFullscreen(true)}
                  disabled={!selected}
                  className="rounded-2xl bg-white/40 border border-white/50 hover:bg-white hover:shadow-md text-slate-700 active:scale-97 transition font-bold text-xs py-3 px-5 flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5 text-indigo-500" /> ขยายเต็มจอชั่วคราว
                </button>

                <button 
                  onClick={() => selected && toggleFavorite(selected.id)} 
                  disabled={!selected}
                  className="rounded-2xl bg-white/40 border border-white/50 hover:bg-white hover:shadow-md text-slate-700 active:scale-97 transition font-bold text-xs py-3 px-5 flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Star className={cn("h-3.5 w-3.5", selected?.favorite ? "fill-amber-400 text-amber-500" : "text-slate-400")} /> Favorite
                </button>
                
                <button 
                  onClick={() => selected && setEditingProject(selected)} 
                  disabled={!selected}
                  className="rounded-2xl bg-white/40 border border-white/50 hover:bg-white hover:shadow-md text-slate-700 active:scale-97 transition font-bold text-xs py-3 px-5 flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Edit3 className="h-3.5 w-3.5 text-indigo-500" /> แก้ไขข้อมูล
                </button>
                
                <button 
                  onClick={() => selected && removeProject(selected.id)} 
                  disabled={!selected}
                  className="rounded-2xl bg-red-500/10 border border-red-500/10 text-red-600 hover:bg-red-500/15 active:scale-97 transition font-bold text-xs py-3 px-5 flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed ml-auto cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" /> ลบงาน
                </button>
              </div>
            </Card>
          </section>
        </section>
      </main>

      {/* Pop-up Modals for Edits */}
      <AnimatePresence>
        {editingProject && (
          <EditProjectModal
            project={editingProject}
            onClose={() => setEditingProject(null)}
            onSave={handleUpdateProject}
          />
        )}
      </AnimatePresence>

      {/* Pop-up Modals for Adding */}
      <AnimatePresence>
        {showAddModal && (
          <AddProjectModal
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddProject}
          />
        )}
      </AnimatePresence>

      {/* Fullscreen Preview Modal */}
      <AnimatePresence>
        {isFullscreen && selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xl p-4 md:p-8 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="w-full h-full max-w-[96vw] max-h-[94vh] flex flex-col rounded-[2.5rem] border border-white/50 bg-white/20 p-4 shadow-2xl backdrop-blur-3xl"
            >
              {/* Safari Header */}
              <div className="mb-4 flex items-center justify-between gap-3 px-3">
                <div className="flex items-center gap-1.5">
                  <span 
                    onClick={() => setIsFullscreen(false)} 
                    className="h-3.5 w-3.5 rounded-full bg-[#ff5f57] shadow-inner cursor-pointer hover:scale-105 transition flex items-center justify-center text-[8px] text-red-900 font-bold" 
                    title="ปิดพรีวิวเต็มจอ"
                  >
                    ✕
                  </span>
                  <span className="h-3.5 w-3.5 rounded-full bg-[#ffbd2e] shadow-inner" />
                  <span 
                    onClick={() => setIsFullscreen(false)} 
                    className="h-3.5 w-3.5 rounded-full bg-[#28c840] shadow-inner cursor-pointer hover:scale-105 transition flex items-center justify-center text-[8px] text-green-900 font-bold" 
                    title="ย่อหน้าต่างกลับ"
                  >
                    ⤢
                  </span>
                </div>
                
                {/* Safari Address Bar */}
                <div className="flex-1 max-w-2xl mx-auto flex items-center justify-between gap-1.5 rounded-2xl border border-white/20 bg-white/35 py-2 px-4 text-xs text-slate-700 shadow-inner">
                  <div className="flex items-center gap-1.5 text-slate-500 min-w-0">
                    <span>🔒</span>
                    <span className="font-semibold tracking-tight truncate">
                      {selected.url ? new URL(normalizeUrl(selected.url)).hostname : ""}
                    </span>
                    <span className="text-slate-400/70 truncate hidden sm:inline max-w-xs">{selected.url}</span>
                  </div>
                  <RefreshCw className="h-3.5 w-3.5 text-slate-400 cursor-pointer hover:rotate-45 transition-transform" />
                </div>

                <button
                  onClick={() => setIsFullscreen(false)}
                  className="rounded-full p-2 bg-slate-200/50 hover:bg-slate-200 active:scale-95 text-slate-700 transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Iframe View */}
              <div className="flex-1 w-full overflow-hidden rounded-[1.8rem] border border-white/30 bg-slate-950/90 shadow-inner">
                <iframe
                  title={`Fullscreen Preview ${selected.title}`}
                  src={normalizeUrl(selected.url)}
                  className="h-full w-full bg-white"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
