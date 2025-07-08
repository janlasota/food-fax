const Instructions = () => {
  return (
    <div className="w-full sm:w-1/2 bg-white border border-gray-300 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Instructions</h2>
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Categories</h3>
          <p className="text-sm text-blue-700">
            Filter the foods by selecting checkboxes or find a food using the
            combobox.
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-900 mb-2">Comparison</h3>
          <p className="text-sm text-green-700">
            Select multiple foods to compare their nutritional values.
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-semibold text-purple-900 mb-2">Analysis</h3>
          <p className="text-sm text-purple-700">
            View breakdowns in the bottom panel once you select a food.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Instructions;
