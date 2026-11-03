import Link from "next/link";
import { FaBook, FaFlask, FaGlobe, FaChild, FaLayerGroup } from "react-icons/fa";

export default function TopCategories() {
  const categories = [
    { name: "Fiction", icon: <FaBook />, iconColor: "text-blue-600" },
    { name: "Science", icon: <FaFlask />, iconColor: "text-green-600" },
    { name: "History", icon: <FaGlobe />, iconColor: "text-orange-500" },
    { name: "Kids", icon: <FaChild />, iconColor: "text-pink-500" },
    { name: "Others", icon: <FaLayerGroup />, iconColor: "text-purple-600" },
  ];

  return (
    
    <div className="bg-base-200 py-20 transition-colors duration-300 border-t border-base-content/10">
      <div className="max-w-7xl mx-auto px-6 text-center">
        
        <h2 className="text-3xl md:text-4xl font-extrabold text-base-content mb-4">
          Explore Top Categories
        </h2>
        <p className="text-base-content/70 mb-12 max-w-2xl mx-auto text-lg">
          Find your favorite genre and dive into a world of endless stories and knowledge.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((cat, index) => (
            <Link 
              key={index} 
              href={`/books?category=${cat.name}`} 
    
              className="group flex flex-col items-center justify-center p-6 bg-base-100 border border-base-content/20 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 hover:border-primary transition-all duration-300"
            >
            
              <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className={cat.iconColor}>
                  {cat.icon}
                </span>
              </div>
              
              {/* text-base-content */}
              <h3 className="text-lg font-bold text-base-content group-hover:text-primary transition-colors">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}