export const getCourseColor = (index) => {
    const colors = [
      'bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500',
      'bg-indigo-500', 'bg-orange-500', 'bg-pink-500', 'bg-brown-500'
    ];
    return colors[index % colors.length]; 
};
  