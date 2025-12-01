import React, { useState, useMemo } from "react";
import {
  LayoutDashboard,
  User,
  Plus,
  Trash2,
  Save,
  Calculator,
  Trophy,
  Cpu,
  HardDrive,
  MemoryStick,
  DollarSign,
  Monitor,
  ChevronDown,
  ChevronUp,
  Info,
  Lock,
  Edit,
  X,
  RefreshCw,
  Image as ImageIcon,
  Sun,
  Moon,
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility for Tailwind classes
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- DATA & CONSTANTS ---

const CRITERIA = [
  { id: "price", name: "Harga", type: "cost", label: "Harga (Rp)" },
  { id: "cpu", name: "CPU Cores", type: "benefit", label: "CPU (Cores)" },
  { id: "ram", name: "RAM", type: "benefit", label: "RAM (GB)" },
  {
    id: "storage",
    name: "Penyimpanan",
    type: "benefit",
    label: "Storage (GB)",
  },
  { id: "vram", name: "VRAM", type: "benefit", label: "VRAM (GB)" },
];

const MAJORS = [
  {
    id: "informatika",
    name: "Teknik Informatika",
    // Target: A4 (Gaming) - Balanced High Specs
    weights: { price: 0.2, cpu: 0.25, ram: 0.25, storage: 0.15, vram: 0.15 },
  },
  {
    id: "dkv",
    name: "Desain Komunikasi Visual",
    // Target: A5 (Render) - Extreme VRAM focus
    weights: { price: 0.05, cpu: 0.15, ram: 0.2, storage: 0.1, vram: 0.5 },
  },
  {
    id: "bisnis",
    name: "Bisnis Digital",
    // Target: A2 (Bisnis) - Storage & Price focus
    weights: { price: 0.5, cpu: 0.1, ram: 0.1, storage: 0.25, vram: 0.05 },
  },
  {
    id: "sastra",
    name: "Sastra Inggris",
    // Target: A1 (Office) - Extreme Price focus (Cheap)
    weights: { price: 0.75, cpu: 0.05, ram: 0.05, storage: 0.1, vram: 0.05 },
  },
  {
    id: "arsitektur",
    name: "Arsitektur",
    // Target: A3 (Desain) - CPU/RAM focus
    weights: { price: 0.15, cpu: 0.3, ram: 0.3, storage: 0.15, vram: 0.1 },
  },
  {
    id: "akuntansi",
    name: "Akuntansi",
    // Target: A2 (Bisnis) - Balanced/Office
    weights: { price: 0.3, cpu: 0.2, ram: 0.2, storage: 0.2, vram: 0.1 },
  },
  {
    id: "hukum",
    name: "Hukum",
    // Target: A1 (Office) - Text focus
    weights: { price: 0.4, cpu: 0.1, ram: 0.1, storage: 0.3, vram: 0.1 },
  },
  {
    id: "kedokteran",
    name: "Kedokteran",
    // Target: A2/A3 - Balanced/Storage focus
    weights: { price: 0.2, cpu: 0.2, ram: 0.2, storage: 0.3, vram: 0.1 },
  },
];

const INITIAL_LAPTOPS = [
  {
    id: 1,
    name: "Laptop Office",
    price: 5000000,
    cpu: 4,
    ram: 4,
    storage: 256,
    vram: 4,
    image:
      "https://media.dinomarket.com/docs/imgTD/2024-10/DM_8A66288AC870474204AD1F2865043881_141024161003_ll.jpg?w=600&q=80",
  },
  {
    id: 2,
    name: "Laptop Bisnis",
    price: 8000000,
    cpu: 6,
    ram: 8,
    storage: 512,
    vram: 4,
    image:
      "https://els.id/wp-content/uploads/2024/05/Acer-Swift-GO-OLED-SFG14-73-Blue-6.png?w=600&q=80",
  },
  {
    id: 3,
    name: "Laptop Desain",
    price: 12000000,
    cpu: 10,
    ram: 16,
    storage: 512,
    vram: 8,
    image:
      "https://els.id/wp-content/uploads/2024/12/Lenovo-LOQ-15IAX9E.png?w=600&q=80",
  },
  {
    id: 4,
    name: "Laptop Gaming",
    price: 16000000,
    cpu: 8,
    ram: 16,
    storage: 1000,
    vram: 16,
    image: "https://www.asus.com/media/Odin/Websites/global/Series/33.png",
  },
  {
    id: 5,
    name: "Laptop Render",
    price: 25000000,
    cpu: 16,
    ram: 32,
    storage: 2000,
    vram: 32,
    image: "https://m.media-amazon.com/images/I/61PSDa30RnL.jpg?w=600&q=80",
  },
];

// --- TOPSIS LOGIC ---

// Helper to convert raw values to 1-5 scale (Crisp Conversion)
const getCrispValue = (key, value) => {
  if (key === "price") {
    // C1 Price (Cost)
    if (value < 6000000) return 5; // Sangat Murah
    if (value <= 10000000) return 4; // 6jt - 10jt
    if (value <= 14000000) return 3; // 10jt - 14jt
    if (value <= 20000000) return 2; // 14jt - 20jt
    return 1; // > 20jt (Sangat Mahal)
  }
  if (key === "cpu") {
    // C2 CPU (Benefit)
    if (value >= 12) return 5;
    if (value >= 8) return 4; // 8 - 10 Core
    if (value === 6) return 3;
    if (value === 4) return 2;
    return 1; // 2 Core
  }
  if (key === "ram") {
    // C3 RAM (Benefit)
    if (value >= 32) return 5;
    if (value >= 16) return 4;
    if (value >= 8) return 3;
    if (value >= 4) return 2; // Starts at 2
    return 1; // Fallback
  }
  if (key === "storage") {
    // C4 Storage (Benefit)
    if (value >= 2000) return 4;
    if (value >= 1000) return 3;
    if (value >= 512) return 2;
    if (value >= 256) return 1;
    return 1;
  }
  if (key === "vram") {
    // C5 VRAM (Benefit)
    if (value >= 16) return 5; // A5's 32GB handled here
    if (value >= 8) return 4;
    if (value >= 6) return 3;
    if (value >= 4) return 2;
    return 1; // Integrated / 2 GB
  }
  return 1;
};

const calculateTOPSIS = (laptops, weights) => {
  if (!laptops.length || !weights) return null;

  // 1. Decision Matrix (X) & Crisp Conversion
  const decisionMatrix = laptops.map((laptop) => {
    const scores = {};
    CRITERIA.forEach((c) => {
      scores[c.id] = getCrispValue(c.id, laptop[c.id]);
    });
    return { ...laptop, scores };
  });

  // 2. Normalization (R)
  // Formula: r_ij = x_ij / sqrt(sum(x_kj^2))
  const normalizedMatrix = decisionMatrix.map((item) => ({
    ...item,
    normalized: {},
  }));

  CRITERIA.forEach((c) => {
    const sumSquares = decisionMatrix.reduce(
      (sum, item) => sum + Math.pow(item.scores[c.id], 2),
      0
    );
    const denominator = Math.sqrt(sumSquares);

    normalizedMatrix.forEach((item) => {
      item.normalized[c.id] = item.scores[c.id] / (denominator || 1);
    });
  });

  // 3. Weighted Normalization (Y)
  // Formula: y_ij = w_j * r_ij
  const weightedMatrix = normalizedMatrix.map((item) => {
    const weighted = {};
    CRITERIA.forEach((c) => {
      weighted[c.id] = item.normalized[c.id] * weights[c.id];
    });
    return { ...item, weighted };
  });

  // 4. Ideal Solutions (A+ and A-)
  const idealPositive = {};
  const idealNegative = {};

  CRITERIA.forEach((c) => {
    const values = weightedMatrix.map((item) => item.weighted[c.id]);
    if (c.type === "benefit") {
      idealPositive[c.id] = Math.max(...values);
      idealNegative[c.id] = Math.min(...values);
    } else {
      // cost
      idealPositive[c.id] = Math.min(...values);
      idealNegative[c.id] = Math.max(...values);
    }
  });

  // 5. Distance Calculation (D+ and D-) & Preference Value (V)
  const results = weightedMatrix.map((item) => {
    let distPos = 0;
    let distNeg = 0;

    CRITERIA.forEach((c) => {
      distPos += Math.pow(item.weighted[c.id] - idealPositive[c.id], 2);
      distNeg += Math.pow(item.weighted[c.id] - idealNegative[c.id], 2);
    });

    distPos = Math.sqrt(distPos);
    distNeg = Math.sqrt(distNeg);

    const preference = distNeg / (distPos + distNeg || 1);

    return {
      ...item,
      distPos,
      distNeg,
      preference,
    };
  });

  // Sort by preference descending
  return results.sort((a, b) => b.preference - a.preference);
};

// --- COMPONENTS ---

const Card = ({ children, className }) => (
  <div
    className={cn(
      "bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg p-6 transition-colors duration-300",
      className
    )}
  >
    {children}
  </div>
);

const Button = ({ children, variant = "primary", className, ...props }) => {
  const variants = {
    primary:
      "bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-500/20",
    secondary:
      "bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200",
    danger:
      "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/50",
    ghost:
      "hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200",
  };

  return (
    <button
      className={cn(
        "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ label, ...props }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
        {label}
      </label>
    )}
    <input
      className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
      {...props}
    />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
        {label}
      </label>
    )}
    <select
      className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all appearance-none"
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

// --- MAIN APP COMPONENT ---

export default function App() {
  const [view, setView] = useState("user"); // 'user' | 'admin'

  // Initialize from LocalStorage or use default
  const [laptops, setLaptops] = useState(() => {
    const saved = localStorage.getItem("spk_laptops_data");
    return saved ? JSON.parse(saved) : INITIAL_LAPTOPS;
  });

  // Theme State
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "dark";
    }
    return "dark";
  });

  // Apply Theme
  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Save to LocalStorage whenever laptops change
  React.useEffect(() => {
    localStorage.setItem("spk_laptops_data", JSON.stringify(laptops));
  }, [laptops]);

  const [userState, setUserState] = useState({ name: "", major: "" });
  const [submitted, setSubmitted] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  // Admin State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginPassword, setLoginPassword] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    cpu: "",
    ram: "",
    storage: "",
    vram: "",
    image: "",
  });

  // Derived State
  const selectedMajor = MAJORS.find((m) => m.id === userState.major);
  const topsisResults = useMemo(() => {
    if (!selectedMajor) return [];
    return calculateTOPSIS(laptops, selectedMajor.weights);
  }, [laptops, selectedMajor]);

  // Handlers
  const handleSubmit = () => {
    if (userState.name && userState.major) {
      setSubmitted(true);
      setShowDebug(false); // Reset debug view on new submit
    } else {
      alert("Mohon lengkapi Nama dan Jurusan terlebih dahulu!");
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setUserState({ name: "", major: "" });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginPassword === "admin123") {
      setIsAuthenticated(true);
      setShowLogin(false);
      setView("admin");
      setLoginPassword("");
    } else {
      alert("Password salah!");
    }
  };

  const handleAddLaptop = (e) => {
    e.preventDefault();

    if (editingId) {
      // Update existing
      setLaptops(
        laptops.map((l) =>
          l.id === editingId
            ? {
                ...l,
                name: formData.name,
                price: Number(formData.price),
                cpu: Number(formData.cpu),
                ram: Number(formData.ram),
                storage: Number(formData.storage),
                vram: Number(formData.vram),
                image: formData.image,
              }
            : l
        )
      );
      setEditingId(null);
    } else {
      // Add new
      const newLaptop = {
        id: Date.now(),
        name: formData.name,
        price: Number(formData.price),
        cpu: Number(formData.cpu),
        ram: Number(formData.ram),
        storage: Number(formData.storage),
        vram: Number(formData.vram),
        image: formData.image,
      };
      setLaptops([...laptops, newLaptop]);
    }

    setFormData({
      name: "",
      price: "",
      cpu: "",
      ram: "",
      storage: "",
      vram: "",
      image: "",
    });
  };

  const handleEdit = (laptop) => {
    setEditingId(laptop.id);
    setFormData({
      name: laptop.name,
      price: laptop.price,
      cpu: laptop.cpu,
      ram: laptop.ram,
      storage: laptop.storage,
      vram: laptop.vram,
      image: laptop.image || "",
    });
    // Scroll to top of form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: "",
      price: "",
      cpu: "",
      ram: "",
      storage: "",
      vram: "",
      image: "",
    });
  };

  const handleResetData = () => {
    if (
      window.confirm(
        "Reset data ke default? Data yang ditambahkan akan hilang."
      )
    ) {
      setLaptops(INITIAL_LAPTOPS);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Yakin ingin menghapus laptop ini?")) {
      setLaptops(laptops.filter((l) => l.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-red-500/30 transition-colors duration-300">
      {/* Navigation */}
      <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20">
              <Calculator className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
                Decider-T
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Metode TOPSIS
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              title={
                theme === "dark"
                  ? "Switch to Light Mode"
                  : "Switch to Dark Mode"
              }
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="flex gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setView("user")}
                className={cn(
                  "px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                  view === "user"
                    ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                )}
              >
                <User size={16} /> Pengguna
              </button>
              <button
                onClick={() => {
                  if (isAuthenticated) {
                    setView("admin");
                  } else {
                    setShowLogin(true);
                  }
                }}
                className={cn(
                  "px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                  view === "admin"
                    ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                )}
              >
                <LayoutDashboard size={16} /> Admin
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Login Modal */}
        {showLogin && (
          <div className="fixed inset-0 bg-slate-900/50 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
            <Card className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Login Admin
                </h3>
                <button
                  onClick={() => setShowLogin(false)}
                  className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  label="Password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Masukkan password admin..."
                  autoFocus
                />
                <Button type="submit" className="w-full justify-center">
                  Masuk <Lock size={16} />
                </Button>
              </form>
            </Card>
          </div>
        )}

        {view === "user" ? (
          <div className="space-y-8">
            {/* User Input Section */}
            {!submitted ? (
              <section className="max-w-2xl mx-auto text-center space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                    Temukan Laptop Idealmu
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    Sistem pendukung keputusan cerdas berbasis metode TOPSIS
                    untuk mahasiswa.
                  </p>
                </div>

                <Card className="text-left space-y-6 bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800">
                  <div className="grid gap-6 md:grid-cols-2">
                    <Input
                      label="Nama Lengkap"
                      placeholder="Masukkan namamu..."
                      value={userState.name}
                      onChange={(e) =>
                        setUserState({ ...userState, name: e.target.value })
                      }
                    />
                    <Select
                      label="Jurusan Kuliah"
                      value={userState.major}
                      onChange={(e) =>
                        setUserState({ ...userState, major: e.target.value })
                      }
                      options={[
                        { value: "", label: "Pilih Jurusan..." },
                        ...MAJORS.map((m) => ({ value: m.id, label: m.name })),
                      ]}
                    />
                  </div>
                  <Button
                    onClick={handleSubmit}
                    className="w-full justify-center py-3 text-lg shadow-red-500/20 shadow-lg"
                  >
                    Lihat Rekomendasi <ChevronDown size={20} />
                  </Button>
                </Card>
              </section>
            ) : (
              /* Results Section */
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Greeting Header */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                      Halo,{" "}
                      <span className="text-red-500 dark:text-red-400">
                        {userState.name}
                      </span>
                      !
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                      Berikut adalah rekomendasi laptop terbaik yang disesuaikan
                      untuk kebutuhan jurusan{" "}
                      <span className="text-slate-900 dark:text-slate-200 font-semibold">
                        {selectedMajor?.name}
                      </span>
                      .
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={handleReset}
                    className="text-sm"
                  >
                    Cari Ulang
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Trophy className="text-yellow-500" />
                    Top Rekomendasi
                  </h3>
                  <Button
                    variant="ghost"
                    onClick={() => setShowDebug(!showDebug)}
                    className="text-xs"
                  >
                    {showDebug
                      ? "Sembunyikan Detail"
                      : "Lihat Detail Perhitungan"}
                  </Button>
                </div>

                {/* Top Pick Hero */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-rose-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                  <Card className="relative bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700/50 flex flex-col md:flex-row gap-8 items-center p-8">
                    <div className="w-full md:w-1/3 aspect-video bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700 overflow-hidden">
                      {topsisResults[0].image ? (
                        <img
                          src={topsisResults[0].image}
                          alt={topsisResults[0].name}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <Monitor
                          size={64}
                          className="text-slate-400 dark:text-slate-600"
                        />
                      )}
                    </div>
                    <div className="flex-1 space-y-4 w-full">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2 border border-emerald-200 dark:border-emerald-500/20">
                            <Trophy size={12} /> PERINGKAT #1
                          </div>
                          <h4 className="text-3xl font-bold text-slate-900 dark:text-white">
                            {topsisResults[0].name}
                          </h4>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            Nilai Preferensi
                          </p>
                          <p className="text-2xl font-bold text-red-500 dark:text-red-400">
                            {topsisResults[0].preference.toFixed(4)}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                        <SpecItem
                          icon={DollarSign}
                          label="Harga"
                          value={`Rp ${topsisResults[0].price.toLocaleString()}`}
                        />
                        <SpecItem
                          icon={Cpu}
                          label="CPU"
                          value={`${topsisResults[0].cpu} Cores`}
                        />
                        <SpecItem
                          icon={MemoryStick}
                          label="RAM"
                          value={`${topsisResults[0].ram} GB`}
                        />
                        <SpecItem
                          icon={HardDrive}
                          label="Penyimpanan"
                          value={`${topsisResults[0].storage} GB`}
                        />
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Runners Up */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {topsisResults.slice(1).map((laptop, idx) => (
                    <Card
                      key={laptop.id}
                      className="hover:border-slate-400 dark:hover:border-slate-600 transition-colors flex flex-col"
                    >
                      <div className="w-full aspect-video bg-slate-100 dark:bg-slate-900 rounded-lg mb-4 overflow-hidden border border-slate-200 dark:border-slate-800">
                        {laptop.image ? (
                          <img
                            src={laptop.image}
                            alt={laptop.name}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Monitor
                              size={32}
                              className="text-slate-300 dark:text-slate-700"
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-8 h-8 bg-slate-100 dark:bg-slate-900 rounded-lg flex items-center justify-center font-bold text-slate-500 border border-slate-200 dark:border-slate-700 text-sm">
                          #{idx + 2}
                        </div>
                        <span className="text-sm font-mono text-slate-500">
                          V: {laptop.preference.toFixed(4)}
                        </span>
                      </div>
                      <h5 className="font-bold text-lg mb-4 truncate text-slate-900 dark:text-white">
                        {laptop.name}
                      </h5>
                      <div className="space-y-2 text-sm text-slate-500 dark:text-slate-400 mt-auto">
                        <div className="flex justify-between">
                          <span>Harga</span>
                          <span className="text-slate-900 dark:text-slate-200">
                            Rp {laptop.price.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Spek</span>
                          <span className="text-slate-900 dark:text-slate-200">
                            {laptop.cpu}C / {laptop.ram}GB / {laptop.storage}GB
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Debug Tables */}
                {showDebug && (
                  <div className="space-y-8 pt-8 border-t border-slate-200 dark:border-slate-800 animate-in fade-in">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-200">
                      Detail Perhitungan (TOPSIS)
                    </h3>

                    <DebugTable
                      title="1. Data Asli & Konversi Crisp (Skala 1-5)"
                      headers={["Alternatif", ...CRITERIA.map((c) => c.name)]}
                      rows={topsisResults.map((l) => [
                        l.name,
                        ...CRITERIA.map(
                          (c) => `${l[c.id]} -> (${l.scores[c.id]})`
                        ),
                      ])}
                    />

                    <DebugTable
                      title="2. Matriks Ternormalisasi (R)"
                      headers={["Alternatif", ...CRITERIA.map((c) => c.name)]}
                      rows={topsisResults.map((l) => [
                        l.name,
                        ...CRITERIA.map((c) => l.normalized[c.id].toFixed(4)),
                      ])}
                    />

                    <DebugTable
                      title="3. Matriks Ternormalisasi Terbobot (Y)"
                      headers={[
                        "Alternatif",
                        ...CRITERIA.map(
                          (c) => `${c.name} (w=${selectedMajor.weights[c.id]})`
                        ),
                      ]}
                      rows={topsisResults.map((l) => [
                        l.name,
                        ...CRITERIA.map((c) => l.weighted[c.id].toFixed(4)),
                      ])}
                    />

                    <div className="grid md:grid-cols-2 gap-6">
                      <Card>
                        <h4 className="font-bold mb-4 text-emerald-400">
                          Solusi Ideal Positif (A+)
                        </h4>
                        {/* We need to re-calculate ideal solutions for display since they aren't stored in the item */}
                        <div className="space-y-2">
                          {CRITERIA.map((c) => {
                            const values = topsisResults.map(
                              (item) => item.weighted[c.id]
                            );
                            const val =
                              c.type === "benefit"
                                ? Math.max(...values)
                                : Math.min(...values);
                            return (
                              <div
                                key={c.id}
                                className="flex justify-between text-sm"
                              >
                                <span>{c.name}</span>
                                <span className="font-mono">
                                  {val.toFixed(4)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </Card>
                      <Card>
                        <h4 className="font-bold mb-4 text-red-400">
                          Solusi Ideal Negatif (A-)
                        </h4>
                        <div className="space-y-2">
                          {CRITERIA.map((c) => {
                            const values = topsisResults.map(
                              (item) => item.weighted[c.id]
                            );
                            const val =
                              c.type === "benefit"
                                ? Math.min(...values)
                                : Math.max(...values);
                            return (
                              <div
                                key={c.id}
                                className="flex justify-between text-sm"
                              >
                                <span>{c.name}</span>
                                <span className="font-mono">
                                  {val.toFixed(4)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </Card>
                    </div>

                    <DebugTable
                      title="4. Jarak & Preferensi (V)"
                      headers={[
                        "Alternatif",
                        "D+ (Jarak ke Terbaik)",
                        "D- (Jarak ke Terburuk)",
                        "Nilai Preferensi (V)",
                      ]}
                      rows={topsisResults.map((l) => [
                        l.name,
                        l.distPos.toFixed(4),
                        l.distNeg.toFixed(4),
                        <span key="v" className="font-bold text-red-400">
                          {l.preference.toFixed(4)}
                        </span>,
                      ])}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Admin View */
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Kelola Laptop</h2>
              <Button
                variant="secondary"
                onClick={handleResetData}
                className="text-xs"
              >
                <RefreshCw size={14} /> Reset Data Default
              </Button>
            </div>

            <Card className="p-6">
              <form
                onSubmit={handleAddLaptop}
                className="grid grid-cols-2 md:grid-cols-3 gap-4"
              >
                <div className="col-span-2 md:col-span-3 flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-lg text-slate-200">
                    {editingId ? "Edit Laptop" : "Tambah Laptop Baru"}
                  </h3>
                  {editingId && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleCancelEdit}
                      className="text-xs"
                    >
                      Batal Edit
                    </Button>
                  )}
                </div>

                <div className="col-span-2 md:col-span-3">
                  <Input
                    label="Nama Laptop"
                    placeholder="Contoh: Laptop Gaming"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <Input
                  label="Harga (Rp)"
                  type="number"
                  placeholder="5000000"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                />
                <Input
                  label="CPU (Cores)"
                  type="number"
                  placeholder="4"
                  value={formData.cpu}
                  onChange={(e) =>
                    setFormData({ ...formData, cpu: e.target.value })
                  }
                  required
                />
                <Input
                  label="RAM (GB)"
                  type="number"
                  placeholder="8"
                  value={formData.ram}
                  onChange={(e) =>
                    setFormData({ ...formData, ram: e.target.value })
                  }
                  required
                />
                <Input
                  label="Penyimpanan (GB)"
                  type="number"
                  placeholder="256"
                  value={formData.storage}
                  onChange={(e) =>
                    setFormData({ ...formData, storage: e.target.value })
                  }
                  required
                />
                <Input
                  label="VRAM (GB)"
                  type="number"
                  placeholder="0"
                  value={formData.vram}
                  onChange={(e) =>
                    setFormData({ ...formData, vram: e.target.value })
                  }
                  required
                />
                <div className="col-span-2 md:col-span-3">
                  <Input
                    label="URL Gambar (Opsional)"
                    placeholder="https://example.com/laptop.jpg"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                  />
                </div>
                <div className="col-span-2 md:col-span-3 flex justify-end pt-2">
                  <Button type="submit" className="w-full justify-center">
                    {editingId ? (
                      <>
                        <Save size={18} /> Simpan Perubahan
                      </>
                    ) : (
                      <>
                        <Plus size={18} /> Tambah Laptop
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Card>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900 text-slate-400 uppercase font-medium">
                  <tr>
                    <th className="px-6 py-4">Gambar</th>
                    <th className="px-6 py-4">Nama</th>
                    <th className="px-6 py-4">Harga</th>
                    <th className="px-6 py-4">CPU</th>
                    <th className="px-6 py-4">RAM</th>
                    <th className="px-6 py-4">Penyimpanan</th>
                    <th className="px-6 py-4">VRAM</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                  {laptops.map((laptop) => (
                    <tr
                      key={laptop.id}
                      className="hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center">
                          {laptop.image ? (
                            <img
                              src={laptop.image}
                              alt={laptop.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon size={20} className="text-slate-600" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-200">
                        {laptop.name}
                      </td>
                      <td className="px-6 py-4">
                        Rp {laptop.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">{laptop.cpu} Cores</td>
                      <td className="px-6 py-4">{laptop.ram} GB</td>
                      <td className="px-6 py-4">{laptop.storage} GB</td>
                      <td className="px-6 py-4">{laptop.vram} GB</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="secondary"
                            onClick={() => handleEdit(laptop)}
                            className="px-2 py-1"
                            title="Edit"
                          >
                            <Edit size={14} />
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => handleDelete(laptop.id)}
                            className="px-2 py-1"
                            title="Hapus"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// --- SUBCOMPONENTS ---

const SpecItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
      <Icon size={16} />
    </div>
    <div>
      <p className="text-xs text-slate-500 font-medium uppercase">{label}</p>
      <p className="text-sm font-semibold text-slate-900 dark:text-slate-200">
        {value}
      </p>
    </div>
  </div>
);

const DebugTable = ({ title, headers, rows }) => (
  <div className="space-y-3">
    <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
      {title}
    </h4>
    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-medium">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-3 whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white/30 dark:bg-slate-900/30">
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="px-4 py-2 font-mono text-slate-700 dark:text-slate-300 whitespace-nowrap"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
