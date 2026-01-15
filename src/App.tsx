import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import Index from "./pages/Index";
import NovaDisciplina from "./pages/NovaDisciplina";
import VisualizarDisciplina from "./pages/VisualizarDisciplina";
import NovaUnidade from "./pages/NovaUnidade";
import VisualizarUnidade from "./pages/VisualizarUnidade";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/disciplina/nova" element={<NovaDisciplina />} />
            <Route path="/disciplina/:id" element={<VisualizarDisciplina />} />
            <Route path="/disciplina/:id/unidade/nova" element={<NovaUnidade />} />
            <Route path="/disciplina/:id/unidade/:unidadeId" element={<VisualizarUnidade />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
