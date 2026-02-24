import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Flame,
  Smartphone,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📝</span>
            <span className="font-bold text-xl text-slate-900">シュウカン</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/sign-in"
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              ログイン
            </Link>
            <Link
              href="/sign-up"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              無料で始める
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
            毎日の小さな積み重ねが、
            <br />
            <span className="text-blue-600">大きな変化</span>を生む。
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            シュウカンは、あなたの習慣を見える化する日本発の習慣トラッキングアプリです。
            シンプルで美しいUIで、毎日の習慣を楽しく続けられます。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 hover:scale-105 transition-all shadow-lg shadow-blue-600/25"
            >
              無料で始める
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              無料で利用可能
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              登録は30秒
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              クレジットカード不要
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            習慣化を、もっと<span className="text-blue-600">楽しく</span>。
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BarChart3 className="w-8 h-8 text-blue-600" />}
              title="📊 見える化"
              description="達成率やストリークをグラフで可視化。毎日の進捗が一目でわかります。"
            />
            <FeatureCard
              icon={<Flame className="w-8 h-8 text-orange-500" />}
              title="🔥 ストリーク"
              description="連続達成日数を追跡。モチベーションを維持して習慣を定着させましょう。"
            />
            <FeatureCard
              icon={<Smartphone className="w-8 h-8 text-indigo-600" />}
              title="📱 どこでも"
              description="PC・スマホ・タブレット対応。いつでもどこでも習慣をチェックできます。"
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            使い方はとても<span className="text-blue-600">シンプル</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="習慣を登録"
              description="続けたい習慣を追加するだけ。テンプレートからも選べます。"
            />
            <StepCard
              number="2"
              title="毎日チェック"
              description="完了した習慣をワンクリックでチェック。たったそれだけ。"
            />
            <StepCard
              number="3"
              title="成長を実感"
              description="統計とストリークで自分の成長を確認。達成感がやみつきに。"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            今日から、新しい自分を始めよう。
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            無料で始められます。あなたの習慣を、シュウカンが支えます。
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-50 hover:scale-105 transition-all"
          >
            無料アカウントを作成
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-900 text-slate-400">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm">© 2026 シュウカン. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  );
}
