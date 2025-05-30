import LeafIcon from "../assets/plant-icon.png";

const BodyHeader = () => {
  return (
    <div className="p-8">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <img src={LeafIcon} alt="icon" className="h-12 w-12" />
          <h1 className="ml-3 text-4xl font-bold text-gray-900">PlantBuddy</h1>
        </div>
        <p className="text-xl text-gray-600">Discover and learn about plants instantly</p>
      </div>
    </div>
  );
};

export default BodyHeader;
