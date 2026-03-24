import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { Target, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { error } = mode === 'signin'
      ? await signIn(email, password)
      : await signUp(email, password);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else if (mode === 'signup') {
      toast({ title: 'Check your email', description: 'We sent you a confirmation link.' });
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[hsl(var(--cat-learning))]/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[hsl(var(--cat-personal))]/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl gradient-hero flex items-center justify-center glow-primary">
            <Target size={24} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">FlowDay</h1>
            <p className="text-xs text-muted-foreground">Productivity Engine</p>
          </div>
        </div>

        {/* Card */}
        <div className="glass-card p-8">
          <h2 className="text-xl font-bold text-foreground mb-1">
            {mode === 'signin' ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            {mode === 'signin' ? 'Sign in to continue your streak' : 'Start tracking your productivity'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                minLength={6}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full gradient-hero text-primary-foreground font-semibold gap-2 glow-primary border-0"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
              {mode === 'signin' ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
