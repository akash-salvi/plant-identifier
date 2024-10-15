import { Info, Search, Upload } from "lucide-react";

const AppDetailsSection = () => (
  <section className="py-12 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">How to Use the App</h2>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Card 1 - Upload */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-center mb-4">
            <Upload className="h-12 w-12 text-green-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Upload an Image</h3>
          <p className="text-gray-600">
            Take a clear photo of a plant and upload it. We support JPG, PNG, and GIF formats up to
            8MB.
          </p>
        </div>

        {/* Card 2 - Analyze */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-center mb-4">
            <Search className="h-12 w-12 text-green-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Analyze the Plant</h3>
          <p className="text-gray-600">
            Once you upload an image, our AI will identify the plant and provide a detailed
            analysis.
          </p>
        </div>

        {/* Card 3 - Get Information */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-center mb-4">
            <Info className="h-12 w-12 text-green-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Get Plant Information</h3>
          <p className="text-gray-600">
            Learn about the plant&apos;s name, family, care instructions, growth rate, toxicity, and
            more!
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default AppDetailsSection;
