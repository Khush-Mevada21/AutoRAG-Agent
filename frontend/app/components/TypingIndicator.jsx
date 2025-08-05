export default function TypingIndicator() {
  return (
    <div className="flex items-center space-x-2 px-4 py-2">
      <div className="bg-gray-300 rounded-full h-2 w-2 animate-bounce" />
      <div className="bg-gray-300 rounded-full h-2 w-2 animate-bounce delay-75" />
      <div className="bg-gray-300 rounded-full h-2 w-2 animate-bounce delay-150" />
    </div>
  );
}
