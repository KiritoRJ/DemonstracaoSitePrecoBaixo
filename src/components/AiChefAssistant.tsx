import React, { useState } from 'react';
import { X, Sparkles, ChefHat, Clock, DollarSign, Loader2 } from 'lucide-react';
import { RecipeResult } from '../types';

interface AiChefAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiChefAssistant: React.FC<AiChefAssistantProps> = ({ isOpen, onClose }) => {
  const [ingredients, setIngredients] = useState('');
  const [budget, setBudget] = useState('R$ 30,00');
  const [people, setPeople] = useState('4 pessoas');
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<RecipeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerateRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients, budget, people }),
      });

      if (!res.ok) {
        throw new Error('Falha ao gerar receita com IA');
      }

      const data = await res.json();
      setRecipe(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao conectar com o Chef IA';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Fechar assistente de receitas"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0C2168] text-[#FFBC7D] flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-[#0C2168]">
                Chef PB — Receitas Econômicas
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                Aproveite as ofertas da Quarta da Carne e Quinta do Horti para criar pratos deliciosos.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {!recipe ? (
            <form onSubmit={handleGenerateRecipe} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0C2168] mb-2">
                  Quais ingredientes você tem ou quer comprar?
                </label>
                <input
                  type="text"
                  placeholder="Ex: Frango, arroz, tomate, batata..."
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  className="w-full bg-[#F0F5FA] border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 outline-none focus:border-[#0C2168] font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0C2168] mb-2">
                    Orçamento máximo
                  </label>
                  <input
                    type="text"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full bg-[#F0F5FA] border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 outline-none focus:border-[#0C2168] font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0C2168] mb-2">
                    Serve quantas pessoas?
                  </label>
                  <input
                    type="text"
                    value={people}
                    onChange={(e) => setPeople(e.target.value)}
                    className="w-full bg-[#F0F5FA] border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 outline-none focus:border-[#0C2168] font-medium"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-[#E7353A] text-xs rounded-xl font-medium">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#E7353A] hover:bg-[#d1292e] disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-xs uppercase tracking-wide cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Criando Receita Econômica...</span>
                  </>
                ) : (
                  <>
                    <ChefHat className="w-4 h-4" />
                    <span>Gerar Receita Econômica</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="bg-[#F0F5FA] border border-slate-200 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#E7353A]">
                    Sugestão do Chef PB
                  </span>
                  <div className="flex items-center gap-4 text-xs font-bold text-[#0C2168]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#E7353A]" />
                      {recipe.prepTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-[#0C2168]" />
                      {recipe.costEstimate}
                    </span>
                  </div>
                </div>

                <h3 className="font-display text-2xl font-bold text-[#0C2168]">
                  {recipe.recipeName}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {recipe.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-display font-bold text-sm text-[#0C2168] mb-3">
                    Ingredientes Necessários
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-600 font-medium">
                    {recipe.ingredientsList?.map((ing, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E7353A] shrink-0" />
                        <span>{ing}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-display font-bold text-sm text-[#0C2168] mb-3">
                    Modo de Preparo
                  </h4>
                  <ol className="space-y-3 text-xs text-slate-600 font-medium">
                    {recipe.instructions?.map((step, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="font-bold text-[#E7353A] shrink-0">
                          {idx + 1}.
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {recipe.wholesaleTip && (
                <div className="bg-[#0C2168] text-white rounded-xl p-4 text-xs font-medium">
                  <span className="font-bold text-[#FFBC7D] block mb-1">Dica Cliente PB:</span>
                  {recipe.wholesaleTip}
                </div>
              )}

              <button
                onClick={() => setRecipe(null)}
                className="w-full py-3.5 bg-[#0C2168] hover:bg-[#162F8A] text-white font-bold rounded-xl text-xs transition-colors uppercase tracking-wide cursor-pointer"
              >
                Gerar Outra Receita
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
