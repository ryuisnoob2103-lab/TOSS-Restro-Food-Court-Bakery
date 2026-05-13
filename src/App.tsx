import { MapPin, Clock, Phone, MessageCircle, ChevronRight, Star, Utensils, Coffee, CakeSlice, ArrowUpRight, X, Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';

const MAPS_LINK = "https://maps.app.goo.gl/eJeb4J1vzGENzYY8A";

const FadeIn: React.FC<{ children: React.ReactNode, delay?: number, className?: string }> = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    className={className}
  >
    {children}
  </motion.div>
);

interface MenuItem {
  name: string;
  price: string;
  desc?: string;
}

const MENU_DATA: Record<string, MenuItem[]> = {
  "Indian Bread": [
    { name: "Lachha Paratha", price: "₹70.00" },
    { name: "Masala Kulcha", price: "₹70.00" },
    { name: "Naan", price: "₹40.00" },
    { name: "Paneer Kulcha", price: "₹90.00" },
    { name: "Tandoori Roti", price: "₹30.00" },
    { name: "Cheese Garlic Naan", price: "₹80.00" },
    { name: "Garlic Naan", price: "₹70.00" },
    { name: "Tawa Roti", price: "₹20.00" }
  ],
  "Basmati Rice": [
    { name: "Jeera Rice", price: "₹160.00" },
    { name: "Pulao", price: "₹190.00", desc: "Green Peas, Brown Onion, Veg" },
    { name: "Steamed Basmati Rice", price: "₹150.00" },
    { name: "Basanti Pulao", price: "₹220.00" }
  ],
  "Dum Biryani": [
    { name: "Awadhi Murg Biryani", price: "₹230.00", desc: "Basmati rice prepared with aromatic spices with succulent chicken & egg" },
    { name: "Egg Biryani", price: "₹200.00", desc: "Basmati rice prepared with aromatic spices & egg" },
    { name: "Murg Tikka Biryani", price: "₹250.00", desc: "Chicken chunks cooked in tandoori rice cooked in dum, feel the smokey style" },
    { name: "Subz Biryani", price: "₹200.00", desc: "Exotic Vegetable & Raita" }
  ],
  "Accompaniments": [
    { name: "Fried Papad", price: "₹40.00" },
    { name: "Green Salad", price: "₹50.00" },
    { name: "Masala Papad", price: "₹60.00" },
    { name: "Onion Salad", price: "₹30.00" },
    { name: "Plain Curd", price: "₹40.00" },
    { name: "Raita Of Your Choice", price: "₹50.00" },
    { name: "Roasted Papad", price: "₹30.00" },
    { name: "Chicken Tikka Salad", price: "₹150.00" }
  ],
  "Indian Main (Non-Veg)": [
    { name: "Chicken Butter Masala (Bone)", price: "₹250.00", desc: "Bone Chicken Roasted In Tandoor & Finished In Makhani Gravy" },
    { name: "Chicken Tikka Masala", price: "₹250.00", desc: "Chicken Chunks Cooked In Tandoor & Finished In Tomato Onion Gravy" },
    { name: "Murg Amritsari Dhaba Style", price: "₹250.00" },
    { name: "Murg As You Like", price: "₹240.00", desc: "Dehati, Masala, Kassa, Curry, Do pyaza" },
    { name: "Murg Handi", price: "₹250.00", desc: "Succulent Chicken Cooked In Rich Brown Gravy" },
    { name: "Murg Kadhai", price: "₹240.00", desc: "Spicy Chicken Preparation With Home Made Kaada Masala" },
    { name: "Murg Musallam", price: "₹300.00" },
    { name: "Murg Punjabi", price: "₹250.00", desc: "Chicken Roasted In Tandoor & Finished In Burnt Onion Gravy" },
    { name: "Murg Tikka Lababdar", price: "₹250.00", desc: "Chicken Chunks Cooked In Tandoor & Finished In Rich Tomato Gravy" },
    { name: "Murg Tikka Makkhan Masala", price: "₹250.00", desc: "Succulent Chicken Roasted In Tandoor & Cooked In Makhani Gravy" },
    { name: "Chicken Nawabi Bharta", price: "₹260.00" },
    { name: "Classic Egg", price: "₹120.00" },
    { name: "Murg Bhuna Masala", price: "₹250.00" },
    { name: "Murg Joshina", price: "₹250.00", desc: "Bone Chicken Cooked In Yellow Gravy Along With Egg" },
    { name: "Rara Murg", price: "₹250.00", desc: "Minced & Bone Chicken Cooked In Right Combination" },
    { name: "Serrated Butter Chicken", price: "₹280.00" }
  ],
  "Dal Selection": [
    { name: "Dal Makhani", price: "₹160.00", desc: "Black Dal Cooked With Butter And Cream Pure Punjabi Style" },
    { name: "Double Dal Tadka", price: "₹150.00", desc: "Yellow Dal Spiced Up With Our Unique Double Tadka" },
    { name: "Egg Dal Tadka", price: "₹170.00", desc: "Yellow Dal Spiced Up With Egg" },
    { name: "Yellow Dal Butter Fry", price: "₹140.00" }
  ],
  "Indian Main (Veg)": [
    { name: "Babycorn Mushroom Masala", price: "₹260.00", desc: "Babycorn & Mushroom Cooked with Makhani Gravy" },
    { name: "Dingri Dolma", price: "₹250.00", desc: "Mushroom & Cottage Cheese Cooked With Makhani Gravy" },
    { name: "Dum Aloo", price: "₹180.00" },
    { name: "Matka Paneer", price: "₹250.00", desc: "Cottage Cheese Cube Tossed In Spinach & Makhani Gravy" },
    { name: "Mix. Veg. Garden Surprise", price: "₹240.00", desc: "Seasonal Veg Prepared In Rich Brown Onion Gravy" },
    { name: "Mushroom Masala", price: "₹250.00" },
    { name: "Paneer Amritsari", price: "₹250.00", desc: "Cottage Cheese Cube Tossed In Spinach & Makhani Gravy" },
    { name: "Paneer Do Pyaza", price: "₹250.00" },
    { name: "Paneer Kadhai", price: "₹250.00" },
    { name: "Paneer Khurchan", price: "₹250.00", desc: "Cottage Cheese Cooked With Onion & Capsicum" },
    { name: "Paneer Kolapuri", price: "₹250.00" },
    { name: "Paneer Makhan Masala", price: "₹250.00", desc: "Fresh Cottage Cheese Cooked In Makhani Gravy" },
    { name: "Paneer Masala", price: "₹250.00" },
    { name: "Paneer Mutter", price: "₹250.00" },
    { name: "Paneer Tikka Lababdar", price: "₹250.00", desc: "Cottage Cheese Cooked In Tandoor Finished In Rich Tomato Gravy" },
    { name: "Paneer Tikka Masala", price: "₹250.00", desc: "Cubes Of Cottage Cheese Roasted In Tandoor & Cooked In Makhani Gravy" },
    { name: "Punjabi Chole Masala", price: "₹180.00", desc: "Chick Pea Cooked In Punjabi Masala Gravy" },
    { name: "Subj Makhani", price: "₹250.00", desc: "Fresh Seasonal Veg Cooked In Makhani Gravy" },
    { name: "Veg Kadhai", price: "₹240.00", desc: "Fresh Seasonal Veg Cooked In Capsicum Brown Onion Gravy" },
    { name: "Veg. Diwani Handi", price: "₹240.00", desc: "Seasonal Veg Prepared In Rich Brown Onion Gravy" },
    { name: "Veg. Keema Kasturi", price: "₹240.00", desc: "Seasonal Fresh Veg Prepared Chopped In Rich Onion Tomato Gravy" },
    { name: "Malai Kofta", price: "₹280.00", desc: "Fresh Cottage Cheese Kofta Balls Cooked In Rich Cashew Gravy" },
    { name: "Toss Special Cottage Cheese", price: "₹280.00", desc: "Chef's Special" },
    { name: "Veg Sam Savera", price: "₹250.00", desc: "Fresh Seasonal Veg Cooked In Sweet & Spicy Gravy" }
  ],
  "Chinese Main": [
    { name: "Chilly Pepper Mushroom", price: "₹220.00", desc: "Button mushroom tossed with wild pepper and garlic" },
    { name: "Cottage Cheese", price: "₹220.00" },
    { name: "Veg Coin In Manchurian Sauce", price: "₹180.00" },
    { name: "Veg Sweet & Sour", price: "₹220.00" },
    { name: "Chicken Manchurian", price: "₹230.00" },
    { name: "Chicken Sweet & Sour", price: "₹230.00", desc: "Fresh Chicken in Delectable Sticky Sweet and Sour Sauce" },
    { name: "Coriander Chilly Chicken", price: "₹230.00" },
    { name: "Sliced Fish In Choice Of Sauce", price: "₹320.00" },
    { name: "Tossed Prawn In Choice Of Sauce", price: "₹320.00" }
  ],
  "Noodles & Pasta": [
    { name: "Chicken Chilly Garlic Noodles", price: "₹200.00" },
    { name: "Chicken Hakka Noodles", price: "₹190.00" },
    { name: "Veg Hakka Noodles", price: "₹150.00" },
    { name: "Chicken American Chopsuey", price: "₹249.00" },
    { name: "Vegetable American Chopsuey", price: "₹199.00" },
    { name: "Butter Chicken Da Pasta (Penne)", price: "₹319.00" },
    { name: "Non Veg Penne Pasta", price: "₹299.00", desc: "Choice Of Sauce White / Red / Mix" },
    { name: "Veg Penne Pasta", price: "₹260.00", desc: "Choice Of Sauce White / Red / Mix" }
  ],
  "Fried Rice Selection": [
    { name: "Chicken Fried Rice", price: "₹190.00" },
    { name: "Chicken Schezwan Fried Rice", price: "₹210.00" },
    { name: "Veg Fried Rice", price: "₹150.00" },
    { name: "Veg Schezwan Fried Rice", price: "₹160.00" },
    { name: "Mix Fried Rice", price: "₹250.00" }
  ],
  "Tandoori Starters (Non-Veg)": [
    { name: "Abu Chilly Kebab", price: "₹280.00", desc: "Chicken Chunks Marinated In Green Chilly Paste Grilled In Tandoor" },
    { name: "Gajab Ka Tikka", price: "₹280.00", desc: "Boneless Chicken Marinated With Ginger, Garlic & Coriander Stems" },
    { name: "Masaledar Murg Tikka", price: "₹280.00", desc: "Chicken Marinated In Spices & Curd Char Grilled" },
    { name: "Murg Kalimirch", price: "₹280.00", desc: "Chicken marinated in indian spices & black pepper crush" },
    { name: "Tandoori Murg", price: "₹280.00", desc: "All Time Favourite Tandoori Chicken" },
    { name: "Amritsari Fish Tikka", price: "₹350.00", desc: "Fresh River Fish Marinated In Yogurt & Indian Spices" },
    { name: "Chicken Seek Kebab", price: "₹300.00", desc: "Chicken keema marinated with Indian spices & garlic" },
    { name: "Toss Ki Pasand", price: "₹499.00", desc: "Assorted Non Vegetarian Kebab Platter Chef Special" }
  ],
  "Tandoori Starters (Veg)": [
    { name: "Pahadi Mushroom Tikka", price: "₹250.00" },
    { name: "Paneer Ajwain Tikka", price: "₹250.00", desc: "Cottage Cheese Marinated With Hung Curd & Carom Seeds" },
    { name: "Zafrani Malai Paneer Tikka", price: "₹250.00", desc: "Cubes Of Cottage Cheese With Cream & Cardamom" },
    { name: "Veg. Hara Bhara Kebab", price: "₹250.00", desc: "Spinach Patty With Vegetable And Peanuts Crumb Fried" }
  ],
  "Dessert & Soups": [
    { name: "Gulab Jamun With Ice Cream", price: "₹60.00" },
    { name: "Hot Gulab Jamun (2 Pcs)", price: "₹50.00" },
    { name: "Choice Of Ice Cream", price: "₹60.00" },
    { name: "Veg Manchow Soup", price: "₹80.00" },
    { name: "Non Veg. Manchow Soup", price: "₹100.00" },
    { name: "Veg Hot & Sour Soup", price: "₹80.00" },
    { name: "Non Veg. Hot & Sour Soup", price: "₹100.00" }
  ],
  "Mocktails & Shakes": [
    { name: "Black Current Mojito", price: "₹120.00" },
    { name: "Mint Mojita", price: "₹120.00" },
    { name: "Chocolate Shake", price: "₹120.00" },
    { name: "Kit Kat Shake", price: "₹120.00" },
    { name: "Oreo Shake", price: "₹120.00" },
    { name: "Cold Coffee With Ice Cream", price: "₹160.00" }
  ],
  "Traditional Lassi": [
    { name: "Aam Sutra", price: "₹120.00" },
    { name: "Lassi - E - Hawai", price: "₹120.00" },
    { name: "Lassi - E - Santra", price: "₹120.00" },
    { name: "Nutty Lassi", price: "₹120.00" },
    { name: "Queens Lassi Strawberry", price: "₹120.00" },
    { name: "Sweetopia", price: "₹120.00" }
  ]
};

const MenuView = ({ onContactClick }: { onContactClick: (e: React.MouseEvent) => void }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMenu = Object.entries(MENU_DATA).reduce((acc, [category, items]) => {
    const matchedItems = items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (item.desc && item.desc.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    if (matchedItems.length > 0) {
      acc[category] = matchedItems;
    }
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="pt-32 pb-24 px-6 max-w-7xl mx-auto"
    >
      <div className="flex flex-col items-center mb-12 text-center">
        <h2 className="text-xs font-semibold tracking-[0.3em] text-brand-gold uppercase mb-6">Epicurean Selection</h2>
        <h3 className="text-5xl md:text-7xl font-serif text-white mb-4 italic">Our Menu</h3>
        <div className="h-px w-24 bg-brand-gold/30 mt-4 mb-12"></div>
        
        {/* Search Bar */}
        <div className="relative w-full max-w-md mx-auto group">
          <div className="absolute inset-0 bg-brand-gold/5 blur-xl group-focus-within:bg-brand-gold/10 transition-all rounded-full"></div>
          <div className="relative flex items-center bg-white/5 border border-white/10 rounded-full px-6 py-3 focus-within:border-brand-gold/50 transition-all">
            <Search size={18} className="text-brand-gold mr-3" />
            <input 
              type="text" 
              placeholder="Search for a dish..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-white w-full font-light placeholder:text-gray-600 text-sm"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-gray-500 hover:text-white transition-colors">
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-32">
        {Object.keys(filteredMenu).length > 0 ? (
          Object.entries(filteredMenu).map(([category, items], idx) => (
            <FadeIn key={category} delay={idx * 0.05}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
                <div className="lg:col-span-4 lg:sticky lg:top-32">
                  <h4 className="text-3xl font-serif text-white mb-4">{category}</h4>
                  <p className="text-gray-500 font-light text-sm leading-relaxed max-w-xs">
                    {category.includes("Indian") 
                      ? "Authentic flavors and traditional recipes from the heart of India."
                      : category.includes("Chinese") || category.includes("Oriental")
                      ? "Bold spices and wok-tossed favorites from the East."
                      : category.includes("Tandoori")
                      ? "Clay-oven specialties, perfectly charred and marinated in signature spices."
                      : category.includes("Noodles") || category.includes("Rice")
                      ? "Perfectly prepared bases and meals to satisfy any craving."
                      : category.includes("Lassi") || category.includes("Mocktails") || category.includes("Drinks")
                      ? "Refreshing beverages and artisanal blends to complement your meal."
                      : "Curated selections crafted with the finest ingredients."}
                  </p>
                </div>
                <div className="lg:col-span-8 space-y-12">
                  {items.map((item, i) => (
                    <div key={i} className="group border-b border-white/5 pb-8 last:border-0 transition-colors">
                      <div className="flex justify-between items-end mb-3 font-serif">
                        <span className="text-xl text-white group-hover:text-brand-gold transition-colors">{item.name}</span>
                        <span className="text-brand-gold text-lg">{item.price}</span>
                      </div>
                      {item.desc && <p className="text-gray-400 font-light text-sm italic">{item.desc}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))
        ) : (
          <div className="py-20 text-center">
            <p className="text-gray-500 font-serif italic text-xl">No dishes found matching your search.</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-6 text-brand-gold border-b border-brand-gold/30 hover:border-brand-gold transition-colors pb-1"
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      <div className="mt-32 p-12 rounded-3xl bg-[#151515] border border-brand-gold/20 text-center">
         <h4 className="text-brand-gold font-serif text-2xl mb-4 italic">Special Requests?</h4>
         <p className="text-gray-400 font-light mb-8 max-w-md mx-auto">Our chefs are happy to accommodate dietary requirements or custom bakery orders.</p>
         <a href="#contact" onClick={onContactClick} className="inline-flex items-center gap-2 text-white border-b border-white/20 hover:text-brand-gold hover:border-brand-gold transition-all pb-1">
           Speak to our team <ArrowUpRight size={16} />
         </a>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [view, setView] = useState<'home' | 'menu'>('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, 250]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  const scrollToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (view !== 'home') {
      setView('home');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = scrollToSection('contact');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedImage]);

  return (
    <div className="min-h-screen bg-[#111] text-gray-100 font-sans selection:bg-brand-gold selection:text-[#111]">
      
      {/* HEADER / NAV */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
          isScrolled 
            ? 'bg-[#111]/80 backdrop-blur-xl border-white/10 py-4' 
            : 'bg-transparent border-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-2xl font-serif text-brand-gold tracking-widest uppercase font-bold">
              TOSS
            </span>
            <span className="text-[10px] tracking-[0.2em] text-gray-400 uppercase hidden sm:flex items-center gap-2">
              <span className="w-4 h-px bg-brand-gold/50"></span>
              Restro &bull; Food Court &bull; Bakery
            </span>
          </div>
          <nav className="flex items-center gap-8">
            <button 
              onClick={() => { setView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`text-xs tracking-widest uppercase font-medium transition-colors hidden md:block ${view === 'home' ? 'text-brand-gold' : 'hover:text-brand-gold'}`}
            >
              Home
            </button>
            <button 
              onClick={() => { setView('menu'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`text-xs tracking-widest uppercase font-medium transition-colors hidden md:block ${view === 'menu' ? 'text-brand-gold' : 'hover:text-brand-gold'}`}
            >
              Menu
            </button>
            <a href="#services" onClick={scrollToSection('services')} className="text-xs tracking-widest uppercase font-medium hover:text-brand-gold transition-colors hidden md:block">Experiences</a>
            <a href="#gallery" onClick={scrollToSection('gallery')} className="text-xs tracking-widest uppercase font-medium hover:text-brand-gold transition-colors hidden md:block">Atmosphere</a>
            <a 
              href="#contact"
              onClick={scrollToContact}
              className="group relative px-6 py-2.5 overflow-hidden rounded-full bg-brand-gold/10 hover:bg-brand-gold transition-colors duration-500"
            >
              <div className="absolute inset-0 bg-brand-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
              <span className="relative z-10 text-xs tracking-widest uppercase font-semibold text-brand-gold group-hover:text-[#111] transition-colors duration-500">
                RESERVATION
              </span>
            </a>
          </nav>
        </div>
      </motion.header>

      {/* MAIN CONTENT */}
      <AnimatePresence mode="wait">
        {view === 'home' ? (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* HERO SECTION */}
            <section className="relative h-[100svh] overflow-hidden flex items-center justify-center">
              {/* Parallax Background */}
              <motion.div 
                style={{ y: heroY, opacity: heroOpacity }}
                className="absolute inset-0 z-0 origin-center scale-[1.05]"
              >
                <img 
                  src="https://v2.imgdownloader.com/v1/assets/ed4fa2de-c5c7-4fbf-bb14-bd819b91a6c2/6295a1bb.jpeg" 
                  alt="TOSS Restaurant Interior" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/60 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#111]/80 via-transparent to-[#111]/80"></div>
                <div className="absolute inset-0 bg-[#111]/30"></div>
              </motion.div>

              <div className="relative z-10 w-full max-w-7xl mx-auto px-6 mt-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
                  <div className="max-w-3xl">
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="inline-flex items-center gap-3 mb-8"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full border border-brand-gold/30 bg-brand-gold/10">
                        <MapPin size={12} className="text-brand-gold" />
                      </div>
                      <span className="text-[11px] font-semibold tracking-[0.2em] text-brand-gold uppercase">Ghatshila's Premier Destination</span>
                    </motion.div>
                    
                    <div className="overflow-hidden">
                      <motion.h1 
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        transition={{ duration: 1, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.3 }}
                        className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-serif text-white leading-[0.9] tracking-tight mb-4"
                      >
                        Culinary <br />
                        <span className="text-brand-gold italic pr-4">Excellence.</span>
                      </motion.h1>
                    </div>
                    
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                      className="text-lg md:text-xl text-gray-400 mb-10 max-w-xl leading-relaxed font-light"
                    >
                      Elevate your dining experience at TOSS Restro, Food Court & Bakery. A perfect blend of elegant ambiance, diverse flavors, and artisan baked goods in Dahigora.
                    </motion.p>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                      className="flex flex-col sm:flex-row gap-4"
                    >
                      <a 
                        href={MAPS_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative inline-flex items-center justify-center gap-3 bg-brand-gold text-[#111] px-8 py-4 rounded-full text-sm font-bold tracking-wide uppercase overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
                        <span className="relative z-10 flex items-center gap-2">
                          Visit Us Today
                          <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform duration-500" />
                        </span>
                      </a>
                    </motion.div>

                    {/* Moving Text Marquee */}
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, delay: 0.8 }}
                      className="mt-10 mb-2 overflow-hidden whitespace-nowrap relative w-full sm:max-w-md"
                      style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}
                    >
                      <div className="w-full flex">
                        <motion.div
                          animate={{ x: ["-50%", "0%"] }}
                          transition={{
                            repeat: Infinity,
                            ease: "linear",
                            duration: 15,
                          }}
                          className="flex shrink-0 gap-8 items-center w-max"
                        >
                          {[...Array(8)].map((_, i) => (
                            <div key={i} className="flex shrink-0 gap-8 items-center">
                              <span className="text-brand-gold/80 font-serif text-lg tracking-widest uppercase italic">
                                EAT Baking be Happy
                              </span>
                              <span className="text-white/20 text-xs">✦</span>
                            </div>
                          ))}
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.7 }}
                    className="flex-shrink-0 relative group"
                  >
                    <div className="absolute inset-0 bg-brand-gold/20 blur-2xl group-hover:bg-brand-gold/30 transition-all duration-700"></div>
                    <div className="relative backdrop-blur-md bg-white/5 border border-white/10 p-6 md:p-8 rounded-2xl">
                      <h4 className="text-brand-gold text-sm tracking-widest uppercase font-semibold mb-2">Opening Hours</h4>
                      <div className="text-2xl font-serif text-white mb-6">12 PM &mdash; 11 PM</div>
                      <a 
                        href="#contact"
                        onClick={scrollToContact}
                        className="inline-flex items-center gap-2 text-sm font-medium hover:text-brand-gold transition-colors"
                      >
                        Reserve Your Table Now <ChevronRight size={14} />
                      </a>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Scroll Indicator */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
              >
                <span className="text-[10px] tracking-[0.2em] text-gray-500 uppercase">Scroll</span>
                <div className="w-px h-12 bg-gradient-to-b from-gray-500 to-transparent"></div>
              </motion.div>
            </section>

            {/* OVERVIEW / ABOUT */}
            <section id="about" className="py-32 relative overflow-hidden bg-[#111]">
              <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-gold/5 blur-[120px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
              <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">
                  <div className="lg:col-span-5 order-2 lg:order-1 relative">
                    <FadeIn>
                      <div className="relative rounded-2xl overflow-hidden aspect-[3/4] border border-white/10">
                         <div className="absolute inset-0 bg-[#111]/20 z-10 mix-blend-overlay"></div>
                         <img 
                          src="https://chatgpt.com/backend-api/estuary/public_content/enc/eyJpZCI6Im1fNmEwNDBjMGRiNzg0ODE5MWE1NjY4YTI1YzM1ODYxMzQ6c2VkaW1lbnQ6Ly8wZDlmOWIzMDgwODUyNmUjZmlsZV8wMDAwMDAwMDM1MTg3MWZhYTk2NmFhYzUwMjZmMjVjNSN1bmZ1cmwiLCJ0cyI6IjIwNTg2IiwicCI6InB5aSIsImNpZCI6IjEiLCJzaWciOiJlMjZiZjFjNDI3MmZmMDJlOTM1OGE3ZGZhN2YyYTU4NGI0YjU0NjBhODFjNWM2MGQ1NjBkYmUzZTcyMTI3MDFkIiwidiI6IjAiLCJnaXptb19pZCI6bnVsbCwiY3MiOm51bGwsImNkbiI6bnVsbCwiZm4iOm51bGwsImNkIjpudWxsLCJjcCI6bnVsbCwibWEiOm51bGx9" 
                          alt="Elegant dining table"
                          className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-1000"
                        />
                      </div>
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="absolute -bottom-8 -right-8 md:-right-12 backdrop-blur-xl bg-[#111]/90 border border-brand-gold/30 p-8 rounded-2xl shadow-2xl hidden sm:block"
                      >
                        <Star className="text-brand-gold mb-3 fill-brand-gold" size={24} />
                        <div className="text-3xl font-serif text-white mb-1">Ghatshila</div>
                        <div className="text-xs font-semibold tracking-[0.2em] text-gray-400 uppercase">Prime Location</div>
                      </motion.div>
                    </FadeIn>
                  </div>
                  <div className="lg:col-span-6 lg:col-start-7 order-1 lg:order-2">
                    <FadeIn>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="h-px w-12 bg-brand-gold"></div>
                        <h2 className="text-xs font-semibold tracking-[0.2em] text-brand-gold uppercase">The Atmosphere</h2>
                      </div>
                      <h3 className="text-4xl sm:text-5xl md:text-6xl font-serif text-white mb-8 leading-[1.1]">
                        Elevated dining, <br/>
                        <span className="text-gray-500 italic">right here in Dahigora.</span>
                      </h3>
                      <p className="text-lg text-gray-400 font-light leading-relaxed mb-10">
                        Conveniently located on the 3rd floor above Vishal Mega Mart, TOSS brings a new standard of hospitality. Whether you're looking for an upscale dinner, a casual bite, or premium baked goods, our venue provides memorable moments.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                        {[
                          { title: "Premium Design", desc: "Thoughtfully curated ambiance" },
                          { title: "Central Location", desc: "Main Road accessibility" },
                          { title: "Daily Service", desc: "Open all week, 12 PM - 11 PM" },
                          { title: "Distinct Spaces", desc: "Dining, casual, and dessert" }
                        ].map((item, i) => (
                          <div key={i} className="group cursor-default">
                             <div className="text-white font-medium mb-1 group-hover:text-brand-gold transition-colors">{item.title}</div>
                             <div className="text-sm text-gray-500">{item.desc}</div>
                          </div>
                        ))}
                      </div>
                    </FadeIn>
                  </div>
                </div>
              </div>
            </section>

            {/* EXPERIENCES (BENTO GRID) */}
            <section id="services" className="py-32 bg-[#151515] relative border-t border-white/5">
              <div className="max-w-7xl mx-auto px-6">
                <FadeIn className="text-center mb-20">
                  <h2 className="text-xs font-semibold tracking-[0.2em] text-brand-gold uppercase mb-4">Our Offerings</h2>
                  <h3 className="text-4xl md:text-6xl font-serif text-white">Three Distinct Experiences</h3>
                </FadeIn>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                  <FadeIn delay={0} className="md:col-span-2 group relative h-[400px] rounded-3xl overflow-hidden border border-white/10 bg-[#111]">
                    <img 
                      src="https://chatgpt.com/backend-api/estuary/public_content/enc/eyJpZCI6Im1fNmEwNDBjMGRiNzg0ODE5MWE1NjY4YTI1YzM1ODYxMzQ6c2VkaW1lbnQ6Ly8wZDlmOWIzMDgwODUyNmUjZmlsZV8wMDAwMDAwMDM1MTg3MWZhYTk2NmFhYzUwMjZmMjVjNSN1bmZ1cmwiLCJ0cyI6IjIwNTg2IiwicCI6InB5aSIsImNpZCI6IjEiLCJzaWciOiJlMjZiZjFjNDI3MmZmMDJlOTM1OGE3ZGZhN2YyYTU4NGI0YjU0NjBhODFjNWM2MGQ1NjBkYmUzZTcyMTI3MDFkIiwidiI6IjAiLCJnaXptb19pZCI6bnVsbCwiY3MiOm51bGwsImNkbiI6bnVsbCwiZm4iOm51bGwsImNkIjpudWxsLCJjcCI6bnVsbCwibWEiOm51bGx9" 
                      alt="Fine Dining"
                      className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 group-hover:opacity-50 transition-all duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/40 to-transparent"></div>
                    <div className="absolute inset-x-0 bottom-0 p-8 md:p-12">
                      <Utensils size={32} className="text-brand-gold mb-6 stroke-[1.5]" />
                      <h4 className="text-3xl font-serif text-white mb-3">Fine Dining Restro</h4>
                      <p className="text-gray-300 font-light max-w-md">
                        An elegant setting offering exceptional dishes crafted by culinary experts. Perfect for family dinners.
                      </p>
                    </div>
                  </FadeIn>
                  <FadeIn delay={0.2} className="md:col-span-1 group relative h-[400px] rounded-3xl overflow-hidden border border-white/10 bg-[#111]">
                    <img 
                      src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop" 
                      alt="Food Court"
                      className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 group-hover:opacity-50 transition-all duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/40 to-transparent"></div>
                    <div className="absolute inset-x-0 bottom-0 p-8">
                      <Coffee size={32} className="text-brand-gold mb-6 stroke-[1.5]" />
                      <h4 className="text-2xl font-serif text-white mb-3">Vibrant Food Court</h4>
                      <p className="text-gray-300 font-light text-sm line-clamp-3">
                        A dynamic tasting experience featuring multiple diverse options to satisfy every craving.
                      </p>
                    </div>
                  </FadeIn>
                  <FadeIn delay={0.4} className="md:col-span-1 group relative h-[400px] rounded-3xl overflow-hidden border border-white/10 bg-[#111]">
                     <img 
                       src="https://images.unsplash.com/photo-1621303837174-89787a7d4729?q=80&w=2070&auto=format&fit=crop" 
                       alt="Artisan Bakery"
                       className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 group-hover:opacity-50 transition-all duration-1000"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/40 to-transparent"></div>
                     <div className="absolute inset-x-0 bottom-0 p-8">
                       <CakeSlice size={32} className="text-brand-gold mb-6 stroke-[1.5]" />
                       <h4 className="text-2xl font-serif text-white mb-3">Artisan Bakery</h4>
                       <p className="text-gray-300 font-light text-sm line-clamp-3">
                         Freshly baked breads, customized cakes, and pastries made daily with the finest ingredients.
                       </p>
                     </div>
                  </FadeIn>
                  <FadeIn delay={0.6} className="md:col-span-2 group relative h-[400px] rounded-3xl overflow-hidden border border-white/10 bg-[#111]">
                     <img 
                       src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2098&auto=format&fit=crop" 
                       alt="Events and Celebrations"
                       className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-105 group-hover:opacity-40 transition-all duration-1000"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/40 to-transparent"></div>
                     <div className="absolute inset-0 flex items-center justify-center text-center px-6">
                      <div>
                         <h4 className="text-3xl font-serif text-white mb-4">Host Your Next Event</h4>
                         <p className="text-gray-300 font-light max-w-md mx-auto mb-8">
                           Make your celebrations unforgettable with our tailored event spaces and catering services.
                         </p>
                         <a href="#contact" onClick={scrollToContact} className="inline-flex items-center gap-2 border-b border-brand-gold text-brand-gold pb-1 font-medium hover:text-white hover:border-white transition-colors">
                           Inquire Now <ArrowUpRight size={16} />
                         </a>
                      </div>
                     </div>
                  </FadeIn>
                </div>
              </div>
            </section>

            {/* GALLERY / ATMOSPHERE SECTION */}
            <section id="gallery" className="py-32 bg-[#111] overflow-hidden">
              <div className="max-w-7xl mx-auto px-6">
                <FadeIn className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
                  <div>
                    <h2 className="text-xs font-semibold tracking-[0.2em] text-brand-gold uppercase mb-4">Visual Journey</h2>
                    <h3 className="text-4xl md:text-5xl font-serif text-white">The Atmosphere</h3>
                  </div>
                  <a href="https://maps.app.goo.gl/eJeb4J1vzGENzYY8A" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-400 hover:text-brand-gold transition-colors inline-flex items-center gap-2 pb-2">
                    See more on Google <ArrowUpRight size={14} />
                  </a>
                </FadeIn>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[300px]">
                  <FadeIn delay={0} className="col-span-2 md:col-span-2 row-span-2 group overflow-hidden rounded-2xl relative border border-white/5">
                    <div className="absolute inset-0 cursor-pointer w-full h-full z-20" onClick={() => setSelectedImage("/src/assets/images/regenerated_image_1778654521664.png")}></div>
                    <div className="absolute inset-0 bg-[#111]/20 group-hover:bg-transparent transition-colors z-10 duration-700 pointer-events-none"></div>
                    <img src="/src/assets/images/regenerated_image_1778654521664.png" alt="Elegant Dining Room" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out" />
                  </FadeIn>
                  <FadeIn delay={0.2} className="col-span-1 row-span-1 group overflow-hidden rounded-2xl relative border border-white/5">
                    <div className="absolute inset-0 cursor-pointer w-full h-full z-20" onClick={() => setSelectedImage("/src/assets/images/regenerated_image_1778654976756.jpg")}></div>
                    <div className="absolute inset-0 bg-[#111]/20 group-hover:bg-transparent transition-colors z-10 duration-700 pointer-events-none"></div>
                    <img src="/src/assets/images/regenerated_image_1778654976756.jpg" alt="Gourmet Dessert" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out" />
                  </FadeIn>
                  <FadeIn delay={0.3} className="col-span-1 row-span-1 group overflow-hidden rounded-2xl relative border border-white/5">
                    <div className="absolute inset-0 cursor-pointer w-full h-full z-20" onClick={() => setSelectedImage("https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1926&auto=format&fit=crop")}></div>
                    <div className="absolute inset-0 bg-[#111]/20 group-hover:bg-transparent transition-colors z-10 duration-700 pointer-events-none"></div>
                    <img src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1926&auto=format&fit=crop" alt="Bakery Selection" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out" />
                  </FadeIn>
                  <FadeIn delay={0.4} className="col-span-2 row-span-1 group overflow-hidden rounded-2xl relative border border-white/5">
                    <div className="absolute inset-0 cursor-pointer w-full h-full z-20" onClick={() => setSelectedImage("/src/assets/images/regenerated_image_1778654526284.png")}></div>
                    <div className="absolute inset-0 bg-[#111]/20 group-hover:bg-transparent transition-colors z-10 duration-700 pointer-events-none"></div>
                    <img src="/src/assets/images/regenerated_image_1778654526284.png" alt="Ambient Atmosphere" className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-[1.5s] ease-out object-center" />
                  </FadeIn>
                </div>
              </div>
            </section>

            {/* FOOD HIGHLIGHTS SECTION */}
            <section id="food-highlights" className="py-32 bg-[#151515] relative overflow-hidden border-y border-white/5">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(196,160,82,0.05),transparent)] pointer-events-none"></div>
              <div className="max-w-7xl mx-auto px-6 relative z-10">
                <FadeIn className="text-center mb-20">
                  <h2 className="text-xs font-semibold tracking-[0.2em] text-brand-gold uppercase mb-4">A Taste of Excellence</h2>
                  <h3 className="text-4xl md:text-6xl font-serif text-white italic">Culinary Highlights</h3>
                  <div className="h-px w-24 bg-brand-gold/30 mx-auto mt-8"></div>
                </FadeIn>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
                  <div className="md:col-span-4 space-y-8">
                    <FadeIn delay={0.1}>
                      <div className="group relative rounded-3xl overflow-hidden aspect-[4/5] border border-white/10">
                        <img 
                          src="/src/assets/images/awadhi_murg_biryani_highlight_1778655717048.png" 
                          alt="Authentic Awadhi Murg Biryani" 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent opacity-80"></div>
                        <div className="absolute bottom-6 left-6">
                          <span className="text-brand-gold text-[10px] tracking-[0.2em] uppercase font-bold mb-1 block">Signature</span>
                          <h4 className="text-xl font-serif text-white">Awadhi Murg Biryani</h4>
                        </div>
                      </div>
                    </FadeIn>
                    <FadeIn delay={0.2}>
                      <div className="group relative rounded-3xl overflow-hidden aspect-video border border-white/10">
                        <img 
                          src="https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=1918&auto=format&fit=crop" 
                          alt="Chinese Specialties" 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent opacity-80"></div>
                        <div className="absolute bottom-6 left-6">
                          <h4 className="text-xl font-serif text-white">Chinese Main Course</h4>
                        </div>
                      </div>
                    </FadeIn>
                  </div>

                  <div className="md:col-span-4 flex flex-col pt-0 md:pt-12">
                    <FadeIn delay={0.3} className="h-full">
                      <div className="group relative rounded-3xl overflow-hidden h-full min-h-[400px] border border-white/10">
                        <img 
                          src="/src/assets/images/chole_bhature_highlight_1778655688503.png" 
                          alt="Chole Bhature" 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent opacity-80"></div>
                        <div className="absolute bottom-10 left-10">
                          <span className="text-brand-gold text-[10px] tracking-[0.2em] uppercase font-bold mb-2 block">Indian Classic</span>
                          <h4 className="text-3xl font-serif text-white leading-tight uppercase">Chole <br/>Bhature</h4>
                        </div>
                      </div>
                    </FadeIn>
                  </div>

                  <div className="md:col-span-4 space-y-8">
                    <FadeIn delay={0.4}>
                      <div className="group relative rounded-3xl overflow-hidden aspect-video border border-white/10">
                        <img 
                          src="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=2070&auto=format&fit=crop" 
                          alt="Indian Curries" 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent opacity-80"></div>
                        <div className="absolute bottom-6 left-6">
                          <h4 className="text-xl font-serif text-white">Paneer Butter Masala</h4>
                        </div>
                      </div>
                    </FadeIn>
                    <FadeIn delay={0.5}>
                      <div className="group relative rounded-3xl overflow-hidden aspect-[4/5] border border-white/10">
                        <img 
                          src="https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=1964&auto=format&fit=crop" 
                          alt="Desserts" 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent opacity-80"></div>
                        <div className="absolute bottom-6 left-6">
                          <span className="text-brand-gold text-[10px] tracking-[0.2em] uppercase font-bold mb-1 block">Sweet Finish</span>
                          <h4 className="text-xl font-serif text-white">Traditional Desserts</h4>
                        </div>
                      </div>
                    </FadeIn>
                  </div>
                </div>

                <FadeIn className="mt-20 text-center" delay={0.6}>
                  <button 
                    onClick={() => { setView('menu'); window.scrollTo(0, 0); }}
                    className="group px-12 py-5 rounded-full bg-transparent border border-brand-gold/30 text-brand-gold font-bold tracking-widest uppercase text-xs hover:bg-brand-gold hover:text-[#111] transition-all duration-500 overflow-hidden relative"
                  >
                    <span className="relative z-10 transition-colors duration-500">Explore Full Menu Selection</span>
                    <div className="absolute inset-0 bg-brand-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
                  </button>
                </FadeIn>
              </div>
            </section>
          </motion.div>
        ) : (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MenuView onContactClick={scrollToContact} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* RESERVATION / CONTACT - DARK PREMIUM CARD */}
      <section id="contact" className="py-24 bg-[#111]">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <div className="relative rounded-3xl overflow-hidden bg-[#151515] border border-brand-gold/20 p-8 md:p-16 lg:p-20">
              {/* Abstract luxury lighting inside card */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-gold/10 blur-[100px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-gold/5 blur-[80px] rounded-full pointer-events-none -translate-x-1/2 translate-y-1/2"></div>
              
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16">
                
                <div>
                  <h2 className="text-xs font-semibold tracking-[0.2em] text-brand-gold uppercase mb-6">Experience TOSS</h2>
                  <h3 className="text-4xl md:text-5xl font-serif text-white mb-6">Join us for an unforgettable evening.</h3>
                  <p className="text-gray-400 font-light leading-relaxed mb-10 max-w-md">
                    For reservations, private events, or bakery orders, reach out to us directly or drop by our Ghatshila location. We look forward to serving you.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a 
                      href="tel:" 
                      className="group relative inline-flex items-center justify-center gap-3 bg-brand-gold text-[#111] px-8 py-4 rounded-full text-sm font-bold tracking-wide uppercase overflow-hidden w-full sm:w-auto"
                    >
                      <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
                      <span className="relative z-10 flex items-center gap-2">
                        <Phone size={16} />
                        Call to Book
                      </span>
                    </a>
                    <a 
                      href="#" 
                      className="inline-flex items-center justify-center gap-3 bg-transparent border border-white/20 hover:border-green-500 hover:text-green-400 text-white px-8 py-4 rounded-full text-sm font-bold tracking-wide uppercase transition-colors w-full sm:w-auto"
                    >
                      <MessageCircle size={16} />
                      WhatsApp Us
                    </a>
                  </div>
                </div>

                <div className="flex flex-col justify-center space-y-10 lg:pl-10 border-t lg:border-t-0 lg:border-l border-white/10 pt-10 lg:pt-0">
                  <div className="flex gap-6 items-start group">
                    <div className="w-12 h-12 rounded-full border border-brand-gold/30 flex items-center justify-center shrink-0 bg-brand-gold/5 text-brand-gold group-hover:bg-brand-gold group-hover:text-[#111] transition-colors duration-500">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h4 className="text-brand-gold text-xs font-semibold tracking-[0.2em] uppercase mb-2">Location</h4>
                      <p className="text-gray-300 font-light leading-relaxed">
                        3rd floor, Main Rd, above Vishal Mega Mart,<br/>
                        Dahigora, Ghatshila, Jharkhand 832303
                      </p>
                      <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="text-brand-gold text-sm font-medium mt-3 inline-flex items-center gap-1 hover:text-white transition-colors">
                        Get Directions <ArrowUpRight size={14} />
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-6 items-start group">
                    <div className="w-12 h-12 rounded-full border border-brand-gold/30 flex items-center justify-center shrink-0 bg-brand-gold/5 text-brand-gold group-hover:bg-brand-gold group-hover:text-[#111] transition-colors duration-500">
                      <Clock size={20} />
                    </div>
                    <div>
                      <h4 className="text-brand-gold text-xs font-semibold tracking-[0.2em] uppercase mb-2">Hours of Operation</h4>
                      <div className="text-gray-300 font-light flex items-center justify-between max-w-xs border-b border-white/10 pb-2 mb-2">
                        <span>Monday - Sunday</span>
                        <span>12 PM – 11 PM</span>
                      </div>
                      <p className="text-gray-500 text-sm font-light">Open all week.</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="pt-20 pb-10 bg-[#0a0a0a] border-t border-white/5 mt-auto">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center border-b border-white/5 pb-12 mb-8">
            <div>
              <div className="text-4xl font-serif text-brand-gold tracking-widest uppercase font-bold mb-4">
                TOSS
              </div>
              <p className="text-gray-500 font-light max-w-sm">
                Ghatshila's premier destination for fine dining, food court variety, and artisan bakery delights.
              </p>
            </div>
            <div className="flex flex-col md:items-end gap-4">
              <a href="#services" onClick={scrollToSection('services')} className="text-sm font-medium text-gray-400 hover:text-brand-gold transition-colors">Experiences</a>
              <a href="#gallery" onClick={scrollToSection('gallery')} className="text-sm font-medium text-gray-400 hover:text-brand-gold transition-colors">Atmosphere</a>
              <a href="#contact" onClick={scrollToContact} className="text-sm font-medium text-gray-400 hover:text-brand-gold transition-colors">Contact & Reservations</a>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600 font-light">
            <span>&copy; {new Date().getFullYear()} TOSS Ghatshila. All rights reserved.</span>
            <span className="flex items-center gap-2">
              Designed with <Star size={12} className="text-brand-gold/50" />
            </span>
          </div>
        </div>
      </footer>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0a]/95 backdrop-blur-2xl p-4 sm:p-8 md:p-12"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-brand-gold/70 hover:text-brand-gold transition-all duration-300 bg-[#151515]/50 hover:bg-[#151515] border border-brand-gold/20 hover:border-brand-gold/50 p-3 rounded-full z-20 group"
              onClick={() => setSelectedImage(null)}
            >
              <X size={24} strokeWidth={1.5} className="group-hover:rotate-90 transition-transform duration-500 ease-out" />
            </button>
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-6xl w-full max-h-full flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-0 -mx-10 -my-10 bg-brand-gold/5 blur-[100px] rounded-full z-0 pointer-events-none"></div>
              
              <div className="relative z-10 w-full h-full flex flex-col items-center">
                 <img 
                   src={selectedImage} 
                   alt="Gallery Preview" 
                   className="w-auto h-auto max-w-full max-h-[80vh] object-contain rounded-sm border border-brand-gold/20 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                 />
                 <div className="mt-6 flex flex-col items-center gap-2">
                   <div className="h-px w-12 bg-brand-gold/30"></div>
                   <span className="text-brand-gold/70 text-xs tracking-[0.2em] uppercase font-semibold">TOSS Experience</span>
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


