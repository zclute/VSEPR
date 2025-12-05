import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Shuffle, RotateCcw, Check, BookOpen } from 'lucide-react';

<div className="bg-red-500 p-10">
  TAILWIND TEST
</div>

const Card = ({ data, isFlipped, onClick }) => {
  return (
    <div 
      className="relative w-full max-w-md h-96 perspective-1000 cursor-pointer group"
      onClick={onClick}
    >
      <div className={`relative w-full h-full duration-500 transform-style-3d transition-all ${isFlipped ? 'rotate-y-180' : ''}`}>
        
        {/* Front of Card */}
        <div className="absolute w-full h-full bg-white rounded-2xl shadow-xl border-2 border-indigo-100 p-8 backface-hidden flex flex-col items-center justify-center text-center hover:border-indigo-300 transition-colors">
          <div className="absolute top-4 left-4 text-xs font-bold tracking-wider text-indigo-400 uppercase">
            Molecule
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <h2 
              className="text-6xl font-bold text-slate-800 mb-4"
              dangerouslySetInnerHTML={{ __html: formatFormula(data.formula) }}
            />
            <p className="text-slate-500 font-medium">{data.name}</p>
          </div>
          <div className="mt-auto text-sm text-indigo-400 font-semibold animate-pulse">
            Click to Flip
          </div>
        </div>

        {/* Back of Card */}
        <div className="absolute w-full h-full bg-indigo-600 rounded-2xl shadow-xl p-6 backface-hidden rotate-y-180 flex flex-col items-center text-white text-center overflow-hidden">
          <div className="absolute top-4 right-4 text-xs font-bold tracking-wider text-indigo-200 uppercase">
            Answer
          </div>
          
          <div className="w-full flex-1 flex flex-col items-center justify-center gap-4">
            <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm p-2 mb-2">
               <MoleculeVisual type={data.visualType} atoms={data.atoms} />
            </div>
            
            <div className="space-y-3">
              <div>
                <span className="text-xs uppercase text-indigo-200 font-bold tracking-widest">Electron Domain Geometry</span>
                <p className="text-xl font-bold">{data.geometry}</p>
              </div>
              <div className="w-16 h-0.5 bg-indigo-400 mx-auto opacity-50"></div>
              <div>
                <span className="text-xs uppercase text-indigo-200 font-bold tracking-widest">Molecular Shape</span>
                <p className="text-xl font-bold text-yellow-300">{data.shape}</p>
              </div>
              {data.angle && (
                <div className="pt-1">
                   <span className="inline-block bg-indigo-800 px-2 py-1 rounded text-xs font-mono text-indigo-200">
                     Angle: {data.angle}
                   </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper to render chemical formulas correctly (subscripts)
const formatFormula = (formula) => {
  return formula.replace(/(\d+)/g, '<sub>$1</sub>');
};

// Simple Ball and Stick Visualizer
const MoleculeVisual = ({ type, atoms }) => {
  // Define positions based on geometry type
  const getPositions = () => {
    switch (type) {
      case 'linear-3': // e.g., CO2
        return [
          { x: 50, y: 50, color: atoms[0] }, // Center
          { x: 20, y: 50, color: atoms[1], bond: 'normal' }, // Left
          { x: 80, y: 50, color: atoms[1], bond: 'normal' }, // Right
        ];
      case 'linear-2': // e.g., HCN (simplified)
         return [
          { x: 50, y: 50, color: atoms[0] }, // Center
          { x: 20, y: 50, color: atoms[1], bond: 'normal' }, // Left
          { x: 80, y: 50, color: atoms[2], bond: 'normal' }, // Right
        ];
      case 'bent': // e.g., SO2, H2O
        return [
          { x: 50, y: 40, color: atoms[0] }, // Center (Top)
          { x: 25, y: 75, color: atoms[1], bond: 'normal' }, // Left Down
          { x: 75, y: 75, color: atoms[1], bond: 'normal' }, // Right Down
        ];
      case 'trigonal-planar': // e.g., BF3
        return [
          { x: 50, y: 55, color: atoms[0] }, // Center
          { x: 50, y: 20, color: atoms[1], bond: 'normal' }, // Top
          { x: 20, y: 75, color: atoms[1], bond: 'normal' }, // Bottom Left
          { x: 80, y: 75, color: atoms[1], bond: 'normal' }, // Bottom Right
        ];
      case 'tetrahedral': // e.g., CH4
        return [
          { x: 50, y: 45, color: atoms[0] }, // Center (Raised slightly)
          { x: 50, y: 10, color: atoms[1], bond: 'normal' }, // Top
          { x: 85, y: 65, color: atoms[1], bond: 'normal' }, // Bottom Right (In Plane)
          { x: 20, y: 75, color: atoms[1], bond: 'wedge' }, // Bottom Left (Front)
          { x: 55, y: 85, color: atoms[1], bond: 'dash' }, // Bottom Middle (Back)
        ];
      case 'trigonal-pyramidal': // e.g., NH3
        return [
          { x: 50, y: 45, color: atoms[0] }, // Center
          { x: 85, y: 65, color: atoms[1], bond: 'normal' }, // Right (In Plane)
          { x: 20, y: 75, color: atoms[1], bond: 'wedge' }, // Left (Front)
          { x: 55, y: 85, color: atoms[1], bond: 'dash' }, // Middle (Back)
        ];
      default:
        return [];
    }
  };

  const coords = getPositions();
  const center = coords[0];

  const getColor = (c) => {
    const map = {
      C: '#374151', // Carbon - Gray/Black
      O: '#EF4444', // Oxygen - Red
      H: '#F3F4F6', // Hydrogen - White
      N: '#3B82F6', // Nitrogen - Blue
      Cl: '#10B981', // Chlorine - Green
      F: '#A7F3D0', // Fluorine - Light Green
      S: '#F59E0B', // Sulfur - Yellow
      B: '#F472B6', // Boron - Pink
      P: '#EA580C', // Phosphorus - Orange
    };
    return map[c] || '#9CA3AF';
  };

  // Render different bond types
  const renderBond = (start, end, type = 'normal', idx) => {
    if (type === 'wedge') {
      // Create a triangle polygon for the wedge
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      // Normalized perpendicular vector
      const perpX = -(dy / len);
      const perpY = (dx / len);
      const width = 6; // Half-width at the atom end
      
      const p1x = end.x + perpX * width;
      const p1y = end.y + perpY * width;
      const p2x = end.x - perpX * width;
      const p2y = end.y - perpY * width;

      return (
        <polygon 
          key={`bond-${idx}`}
          points={`${start.x},${start.y} ${p1x},${p1y} ${p2x},${p2y}`}
          fill="white"
          opacity="0.8"
        />
      );
    } else if (type === 'dash') {
      return (
        <line
          key={`bond-${idx}`}
          x1={start.x}
          y1={start.y}
          x2={end.x}
          y2={end.y}
          stroke="white"
          strokeWidth="4"
          strokeDasharray="5,3"
          opacity="0.6"
        />
      );
    } else {
      return (
        <line
          key={`bond-${idx}`}
          x1={start.x}
          y1={start.y}
          x2={end.x}
          y2={end.y}
          stroke="white"
          strokeWidth="4"
          opacity="0.6"
        />
      );
    }
  };

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
      {/* Draw Bonds first so they are behind atoms */}
      {coords.slice(1).map((pos, idx) => renderBond(center, pos, pos.bond, idx))}
      
      {/* Draw Atoms */}
      {coords.map((pos, idx) => (
        <circle
          key={`atom-${idx}`}
          cx={pos.x}
          cy={pos.y}
          r={pos.size === 'small' ? 8 : 12}
          fill={getColor(pos.color)}
          stroke="white"
          strokeWidth="2"
        />
      ))}
    </svg>
  );
};

export default function VSEPRApp() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cards, setCards] = useState([
    {
      id: 1,
      formula: "CO2",
      name: "Carbon Dioxide",
      geometry: "Linear",
      shape: "Linear",
      visualType: "linear-3",
      atoms: ["C", "O"],
      angle: "180°"
    },
    {
      id: 2,
      formula: "HCN",
      name: "Hydrogen Cyanide",
      geometry: "Linear",
      shape: "Linear",
      visualType: "linear-2",
      atoms: ["C", "H", "N"],
      angle: "180°"
    },
    {
      id: 3,
      formula: "SO2",
      name: "Sulfur Dioxide",
      geometry: "Trigonal Planar",
      shape: "Bent",
      visualType: "bent",
      atoms: ["S", "O"],
      angle: "< 120°"
    },
    {
      id: 4,
      formula: "BF3",
      name: "Boron Trifluoride",
      geometry: "Trigonal Planar",
      shape: "Trigonal Planar",
      visualType: "trigonal-planar",
      atoms: ["B", "F"],
      angle: "120°"
    },
    {
      id: 5,
      formula: "CH2O",
      name: "Formaldehyde",
      geometry: "Trigonal Planar",
      shape: "Trigonal Planar",
      visualType: "trigonal-planar",
      atoms: ["C", "H"], // Simplified visualization (C center, O top, H sides)
      angle: "~120°"
    },
    {
      id: 6,
      formula: "CH4",
      name: "Methane",
      geometry: "Tetrahedral",
      shape: "Tetrahedral",
      visualType: "tetrahedral",
      atoms: ["C", "H"],
      angle: "109.5°"
    },
    {
      id: 7,
      formula: "CCl4",
      name: "Carbon Tetrachloride",
      geometry: "Tetrahedral",
      shape: "Tetrahedral",
      visualType: "tetrahedral",
      atoms: ["C", "Cl"],
      angle: "109.5°"
    },
    {
      id: 8,
      formula: "NH3",
      name: "Ammonia",
      geometry: "Tetrahedral",
      shape: "Trigonal Pyramidal",
      visualType: "trigonal-pyramidal",
      atoms: ["N", "H"],
      angle: "107°"
    },
    {
      id: 9,
      formula: "PH3",
      name: "Phosphine",
      geometry: "Tetrahedral",
      shape: "Trigonal Pyramidal",
      visualType: "trigonal-pyramidal",
      atoms: ["P", "H"],
      angle: "93.5°"
    },
    {
      id: 10,
      formula: "H2O",
      name: "Water",
      geometry: "Tetrahedral",
      shape: "Bent",
      visualType: "bent",
      atoms: ["O", "H"],
      angle: "104.5°"
    },
    {
      id: 11,
      formula: "H2S",
      name: "Hydrogen Sulfide",
      geometry: "Tetrahedral",
      shape: "Bent",
      visualType: "bent",
      atoms: ["S", "H"],
      angle: "92°"
    }
  ]);

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 200);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 200);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    setTimeout(() => {
      const shuffled = [...cards].sort(() => Math.random() - 0.5);
      setCards(shuffled);
      setCurrentIndex(0);
    }, 200);
  };

  const handleReset = () => {
    setIsFlipped(false);
    setTimeout(() => {
        const sorted = [...cards].sort((a,b) => a.id - b.id);
        setCards(sorted);
        setCurrentIndex(0);
    }, 200);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        if (!isFlipped) {
            setIsFlipped(true);
        } else {
            handleNext();
        }
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, currentIndex]); // Dependencies for closure

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-10 px-4 font-sans text-slate-800">
      
      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
                <BookOpen size={24} />
            </div>
            <div>
                <h1 className="text-2xl font-bold leading-none">VSEPR Master</h1>
                <p className="text-xs text-slate-500 font-medium">Chemistry Flashcards</p>
            </div>
        </div>
        <div className="text-right">
            <span className="text-3xl font-bold text-indigo-600">
                {currentIndex + 1}
            </span>
            <span className="text-slate-400 text-lg font-medium">
                /{cards.length}
            </span>
        </div>
      </div>

      {/* Main Card Area */}
      <div className="flex-1 flex items-center justify-center w-full mb-8">
        <Card 
          data={cards[currentIndex]} 
          isFlipped={isFlipped} 
          onClick={() => setIsFlipped(!isFlipped)}
        />
      </div>

      {/* Controls */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-slate-100 p-4 flex items-center justify-between">
        
        <button 
          onClick={handlePrev}
          className="p-3 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
          title="Previous Card (Left Arrow)"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="flex gap-2">
            <button 
                onClick={handleShuffle}
                className="p-3 rounded-lg hover:bg-indigo-50 text-indigo-600 transition-colors flex flex-col items-center gap-1 group"
                title="Shuffle Cards"
            >
                <Shuffle size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                {/* <span className="text-[10px] font-bold uppercase tracking-wider">Shuffle</span> */}
            </button>
            <button 
                onClick={handleReset}
                className="p-3 rounded-lg hover:bg-indigo-50 text-indigo-600 transition-colors flex flex-col items-center gap-1 group"
                title="Reset Order"
            >
                <RotateCcw size={20} className="group-hover:-rotate-180 transition-transform duration-500" />
            </button>
        </div>

        <button 
          onClick={handleNext}
          className="p-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 transition-all active:scale-95"
          title="Next Card (Right Arrow)"
        >
          <ChevronRight size={24} />
        </button>

      </div>

      <div className="mt-8 text-center text-slate-400 text-xs">
        <p>Press <kbd className="font-mono bg-white px-1 border rounded">Space</kbd> to flip/next • <kbd className="font-mono bg-white px-1 border rounded">←</kbd> <kbd className="font-mono bg-white px-1 border rounded">→</kbd> to navigate</p>
      </div>
      
      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}