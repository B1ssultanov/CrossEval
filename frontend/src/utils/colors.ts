// Status colors mapping
export const statusColors: { [key: string]: string } = {
  Available: "bg-yellow-200 text-yellow-700",
  Missed: "bg-red-200 text-red-700",
  Submitted: "bg-green-200 text-green-700",
  Future: "bg-blue-200 text-blue-700",
};

// Type colors mapping
export const typeColors: { [key: string]: string } = {
  presentation:
    "bg-yellow-100 text-yellow-600 border-2 border-yellow-500 rounded-lg",
  code: "bg-purple-100 text-purple-600 border-2 border-purple-500 rounded-lg",
  essay: "bg-green-100 text-green-600 border-2 border-green-500 rounded-lg",
  project: "bg-blue-100 text-blue-600 border-2 border-blue-500 rounded-lg",
  quiz: "bg-pink-100 text-pink-600 border-2 border-pink-500 rounded-lg",
};
