import React, { useState } from 'react';
import { X, Plus, Trash2, Save, BookOpen, CheckCircle2 } from 'lucide-react';
import type { QuizPack, QuizQuestion } from '../types/game';
import { loadQuizPacks, saveQuizPacks } from '../utils/teacherQuiz';

interface TeacherQuizEditorProps {
  onClose: () => void;
  onSelectQuizToPlay: (pack: QuizPack) => void;
}

export const TeacherQuizEditor: React.FC<TeacherQuizEditorProps> = ({
  onClose,
  onSelectQuizToPlay,
}) => {
  const [packs, setPacks] = useState<QuizPack[]>(loadQuizPacks());
  const [selectedPackId, setSelectedPackId] = useState<string>(packs[0]?.id || '');
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // New pack draft form
  const [newTitle, setNewTitle] = useState<string>('');
  const [newSubject, setNewSubject] = useState<string>('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  const handleCreateNewPack = () => {
    setIsEditing(true);
    setNewTitle('Custom Teacher Quiz');
    setNewSubject('General Knowledge');
    setQuestions([
      {
        id: `q_${Date.now()}`,
        question: 'What is 5 + 5?',
        correctAnswer: '10',
        options: ['10', '8', '12', '15'],
      },
    ]);
  };

  const handleSavePack = () => {
    if (!newTitle.trim()) return;

    const newPack: QuizPack = {
      id: `pack_${Date.now()}`,
      title: newTitle,
      subject: newSubject,
      questions,
    };

    const updated = [...packs, newPack];
    setPacks(updated);
    saveQuizPacks(updated);
    setSelectedPackId(newPack.id);
    setIsEditing(false);
  };

  const handleDeletePack = (id: string) => {
    const updated = packs.filter((p) => p.id !== id);
    setPacks(updated);
    saveQuizPacks(updated);
    if (updated.length > 0) setSelectedPackId(updated[0].id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl overflow-y-auto select-none">
      <div className="relative w-full max-w-3xl my-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl shadow-emerald-500/10">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white font-outfit">Teacher Custom Quiz Creator 📝</h2>
            <p className="text-xs text-slate-400">Create custom question packs for students to slice and learn!</p>
          </div>
        </div>

        {!isEditing ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Available Quiz Packs</span>
              <button
                onClick={handleCreateNewPack}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Quiz</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 max-h-72 overflow-y-auto pr-1">
              {packs.map((pack) => (
                <div
                  key={pack.id}
                  className={`flex flex-col justify-between p-4 rounded-2xl border transition-all ${
                    selectedPackId === pack.id
                      ? 'bg-emerald-500/15 border-emerald-500/80 ring-2 ring-emerald-500/30 text-white'
                      : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/70 text-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-base font-outfit text-white">{pack.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-emerald-300 font-bold">
                        {pack.subject}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{pack.questions.length} Questions included</p>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-700/40">
                    <button
                      onClick={() => onSelectQuizToPlay(pack)}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500 text-slate-950 text-xs font-black hover:bg-emerald-400 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>PLAY THIS QUIZ</span>
                    </button>

                    <button
                      onClick={() => handleDeletePack(pack.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
                      title="Delete Pack"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Create / Edit Pack Form */
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Quiz Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-400"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Subject</label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-bold uppercase text-emerald-400">Questions List</span>
              <button
                onClick={() =>
                  setQuestions([
                    ...questions,
                    {
                      id: `q_${Date.now()}`,
                      question: 'New Question?',
                      correctAnswer: 'Answer A',
                      options: ['Answer A', 'Answer B', 'Answer C', 'Answer D'],
                    },
                  ])
                }
                className="text-xs text-emerald-400 hover:underline font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Question
              </button>
            </div>

            {questions.map((q, qIdx) => (
              <div key={q.id} className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2">
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) => {
                    const updated = [...questions];
                    updated[qIdx].question = e.target.value;
                    setQuestions(updated);
                  }}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-bold"
                  placeholder="Question Prompt..."
                />
                <div className="grid grid-cols-2 gap-2">
                  {q.options.map((opt, optIdx) => (
                    <input
                      key={optIdx}
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const updated = [...questions];
                        updated[qIdx].options[optIdx] = e.target.value;
                        if (optIdx === 0) updated[qIdx].correctAnswer = e.target.value;
                        setQuestions(updated);
                      }}
                      className={`w-full px-2.5 py-1 rounded-lg text-xs border ${
                        optIdx === 0
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold'
                          : 'bg-slate-900 border-slate-700 text-slate-300'
                      }`}
                      placeholder={optIdx === 0 ? 'Correct Answer (Fruit 1)' : `Option ${optIdx + 1}`}
                    />
                  ))}
                </div>
              </div>
            ))}

            <div className="flex items-center gap-3 pt-4">
              <button
                onClick={handleSavePack}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 text-slate-950 font-black text-sm hover:bg-emerald-400 transition-colors shadow-lg"
              >
                <Save className="w-4 h-4" />
                <span>SAVE QUIZ PACK</span>
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-sm hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
