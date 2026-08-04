import { BrowserRouter, Route, Routes } from "react-router";
import SignInPage from "./pages/SignInPage";
import ChatAppPage from "./pages/ChatAppPage";
import { Toaster } from "sonner";
import SignUpPage from "./pages/SignUpPage";

function App() {
  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          {/* public routes */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* protected routes */}
          {/* todo: tạo protected routes */}
          <Route path="/" element={<ChatAppPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
