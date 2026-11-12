export function PlanSuccess() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Plan Selected Successfully!</h1>
        <p className="text-gray-600">
          Thank you for choosing our plan. You will receive a confirmation email shortly.
        </p>
      </div>
    </div>
  );
}