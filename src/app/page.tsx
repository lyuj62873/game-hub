import { TestInsertButton } from '@/components/TestInsertButton'

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-6 py-24">
      <h2 className="text-2xl font-bold text-slate-200">Supabase Connection Test</h2>
      <p className="text-slate-400 text-sm">Sign in first, then click to insert a sample favorite.</p>
      <TestInsertButton />
    </div>
  )
}
