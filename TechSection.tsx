import { MessageSquare, Brain, Search, Sparkles, User, Gamepad2 } from 'lucide-react';

const pipeline = [
  { icon: MessageSquare, title: 'Natural Language Prompt', desc: 'User describes what they want to play in plain English', color: 'text-neon-purple' },
  { icon: Brain, title: 'AI Intent Extraction', desc: 'LLM parses genre, mood, setting, pace, and constraints', color: 'text-neon-violet' },
  { icon: Search, title: 'Game Semantic Search', desc: 'Vector embeddings match intent against game metadata', color: 'text-neon-blue' },
  { icon: Sparkles, title: 'Recommendation Engine', desc: 'Weighted scoring across genre, gameplay, mood, and difficulty', color: 'text-neon-cyan' },
  { icon: User, title: 'Personalization', desc: 'Taste profile adapts based on user interactions and preferences', color: 'text-emerald-400' },
  { icon: Gamepad2, title: 'AI Game Generation', desc: 'Browser-based prototype created from natural language description', color: 'text-neon-pink' },
];

const technologies = [
  { name: 'LLM / Generative AI', desc: 'Natural language understanding and game concept generation' },
  { name: 'Semantic Search', desc: 'Meaning-based game discovery beyond keyword matching' },
  { name: 'Vector Embeddings', desc: 'Games and prompts mapped to shared semantic space' },
  { name: 'Game Metadata', desc: 'Rich structured data: genre, mood, difficulty, platforms' },
  { name: 'Recommendation Algorithms', desc: 'Weighted multi-factor scoring with explainable results' },
  { name: 'Browser Game Generation', desc: 'Instant playable prototypes from text descriptions' },
];

export function TechSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-neon-cyan mb-4">
          <Brain className="w-3.5 h-3.5" />
          Technology
        </div>
        <h2 className="section-title mb-2">The AI behind <span className="gradient-text">GameMind</span></h2>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
          A full pipeline from natural language to playable game, combining multiple AI technologies.
        </p>
      </div>

      {/* Pipeline visualization */}
      <div className="glass-card p-6 md:p-10 mb-10">
        <div className="grid md:grid-cols-6 gap-4 md:gap-2">
          {pipeline.map((step, i) => (
            <div key={step.title} className="relative">
              <div className="glass-card glass-card-hover p-4 text-center h-full animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-10 h-10 rounded-lg glass flex items-center justify-center mx-auto mb-3">
                  <step.icon className={`w-5 h-5 ${step.color}`} />
                </div>
                <h4 className="text-xs font-bold text-white mb-1">{step.title}</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
              {i < pipeline.length - 1 && (
                <div className="hidden md:flex absolute top-1/2 -right-1.5 -translate-y-1/2 z-10">
                  <div className="w-3 h-3 rounded-full bg-neon-purple animate-pulse" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Technology grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {technologies.map((tech, i) => (
          <div key={tech.name} className="glass-card glass-card-hover p-5 animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
            <h4 className="font-display font-semibold text-white mb-2">{tech.name}</h4>
            <p className="text-sm text-slate-400 leading-relaxed">{tech.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
