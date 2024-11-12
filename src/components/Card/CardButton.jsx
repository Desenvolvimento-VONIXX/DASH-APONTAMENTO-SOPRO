function CardButton({ title, onClick }) {
    return (
      <div
        className="w-full max-w-xs p-6 bg-gray-600 font-bold text-xl text-white rounded-md shadow-lg cursor-pointer hover:bg-gray-500 transition-all duration-200 ease-in-out transform hover:scale-105"
        onClick={onClick}
      >
        {title}
      </div>
    );
  }
  
  export default CardButton;
  