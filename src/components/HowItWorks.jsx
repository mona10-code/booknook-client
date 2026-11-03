import { FaSearch, FaBookReader, FaUndoAlt } from "react-icons/fa";

export default function HowItWorks() {
  const steps = [
    {
      id: 1, // id আগের মতোই থাকলো, কিন্তু স্ক্রিনে দেখাবে না
      title: "Find a Book",
      description: "Browse our vast collection and find the perfect book for your next reading adventure.",
      icon: <FaSearch />,
    },
    {
      id: 2,
      title: "Borrow It",
      description: "Click on the borrow button, and the book is yours for a few days. No hassle.",
      icon: <FaBookReader />,
    },
    {
      id: 3,
      title: "Return It",
      description: "Once you finish reading, return it easily so others can enjoy the same story.",
      icon: <FaUndoAlt />,
    },
  ];

  return (
    <div className="bg-base-200 py-24 transition-colors duration-300 border-t border-base-content/10">
      <div className="max-w-7xl mx-auto px-6 text-center">
        
        <h2 className="text-3xl md:text-5xl font-extrabold text-base-content mb-4 tracking-tight">
          How Borrowing Works
        </h2>
        
        <p className="text-base-content/70 mb-16 max-w-2xl mx-auto text-lg md:text-xl">
          Getting your favorite book is just three simple steps away. We make reading accessible for everyone.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div 
              key={step.id} 
              // কার্ডের ডিজাইন
              className="group bg-base-100 border border-base-content/10 rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center"
            >
              {/* আইকন */}
              <div className="w-20 h-20 rounded-2xl bg-primary text-primary-content flex items-center justify-center text-4xl shadow-md mb-6 group-hover:scale-110 transition-transform duration-300">
                {step.icon}
              </div>

              {/* টাইটেল */}
              <h3 className="text-xl md:text-2xl font-bold text-base-content mb-3">
                {step.title}
              </h3>
              
              {/* বর্ণনা */}
              <p className="text-base-content/70 leading-relaxed text-sm md:text-base">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}