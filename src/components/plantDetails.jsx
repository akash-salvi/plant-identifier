/* eslint-disable react/prop-types */
import { Droplets, Sun, ThermometerSun } from "lucide-react";
import AlertEl from "../utils/alertEl";

const PlantDetails = ({ imagePreview, loading, error, plantInfo }) => {
  return (
    <div className="mt-4 bg-white rounded-xl shadow-lg overflow-hidden mb-8">
      <div className="p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {imagePreview && (
            <div className="mb-6">
              <img
                src={imagePreview}
                alt="Selected plant"
                className="w-full h-64 md:h-96 object-contain rounded-lg shadow-lg border bg-black"
              />
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center space-x-2 pb-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
              <span className="text-gray-500">Identifying plant...</span>
            </div>
          )}

          {error && (
            <AlertEl>
              <p>{error}</p>
            </AlertEl>
          )}

          {!loading && plantInfo && (
            <div className="space-y-4 md:space-y-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">{plantInfo.name}</h2>
                <p className="text-sm text-gray-500 italic">{plantInfo.scientificName}</p>
                <p className="text-sm text-gray-500 mt-1">Family: {plantInfo.family}</p>
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 md:mb-4">
                  About
                </h3>
                <p className="text-gray-600 text-sm md:text-base">{plantInfo.description}</p>
              </div>
            </div>
          )}
        </div>

        {!loading && plantInfo && (
          <div className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg">
                <Sun className="h-6 w-6 text-green-600 mb-2" />
                <span className="text-sm text-gray-600 text-center">{plantInfo.care.light}</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
                <Droplets className="h-6 w-6 text-blue-600 mb-2" />
                <span className="text-sm text-gray-600 text-center">{plantInfo.care.water}</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg">
                <ThermometerSun className="h-6 w-6 text-yellow-600 mb-2" />
                <span className="text-sm text-gray-600 text-center">{plantInfo.care.humidity}</span>
              </div>
            </div>

            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 md:mb-4">
              Plant Details
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 md:p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Property
                      </th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(plantInfo.additionalInfo).map(([key, value]) => (
                      <tr key={key}>
                        <td className="px-4 md:px-6 py-4 wrap text-sm font-medium text-gray-900">
                          {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                        </td>
                        <td className="px-4 md:px-6 py-4 wrap text-sm text-gray-500">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 md:mb-4">
                Common Issues
              </h3>
              <ul className="list-disc list-inside space-y-2 text-sm md:text-base">
                {plantInfo.commonIssues.length ? (
                  plantInfo.commonIssues.map((issue, index) => (
                    <li key={index} className="text-gray-600">
                      {issue}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-600">No common issues specified</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantDetails;
