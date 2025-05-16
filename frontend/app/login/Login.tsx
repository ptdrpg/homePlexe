
function Login() {
  return (
    <div className="w-[100%] h-[100vh] flex justify-center items-center">
      <div>
        <h1 className="text-3xl font-bold text-center">Welcome to HomePlexe</h1>
        <form className="flex flex-col gap-4 mt-4">
          <input
            type="text"
            placeholder="Username"
            className="border border-gray-300 p-2 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-gray-300 p-2 rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login