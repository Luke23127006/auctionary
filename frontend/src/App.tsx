import AppRouter from "./routes/AppRouter";
import { Toaster } from "react-hot-toast";
import "./App.css";
// import { ThemeSwitcher } from "./components/ThemeSwitcher";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{
          top: 20,
          right: 20,
        }}
        toastOptions={{
          duration: 1500,
          style: {
            marginBottom: "8px",
          },
        }}
      />
      {/* <ThemeSwitcher /> */}
      <AppRouter />
    </>
  );
}

export default App;
