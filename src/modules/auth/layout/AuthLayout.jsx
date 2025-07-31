export const AuthLayout = ({ children, title = '', icon }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 dark:bg-gray-800">
      <div className="animate-fadein w-full max-w-md p-8 bg-white dark:bg-gray-700 rounded-lg shadow-md">
        <div className="flex items-center gap-2 mb-6">
          {icon && <div className="text-4xl text-gray-800 dark:text-white">{icon}</div>}
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">{title}</h1>
        </div>
        {children}
      </div>
    </div>
  );
};