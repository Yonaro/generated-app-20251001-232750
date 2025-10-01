import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
export function LoginPage() {
  const users = useAppStore(state => state.users);
  const login = useAppStore(state => state.login);
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-blue-50 dark:bg-gray-900 p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-100 to-blue-50 dark:from-gray-800 dark:to-gray-900 opacity-50"></div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <Card className="w-full max-w-md shadow-2xl border-blue-200 dark:border-gray-700 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-500 rounded-full text-white">
                <Users className="h-8 w-8" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-50">FloatFlow</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">Select a role to sign in</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Button
                    onClick={() => login(user.id)}
                    className="w-full h-auto justify-start p-4 text-left transition-all duration-200 ease-in-out hover:bg-blue-100 dark:hover:bg-gray-700 hover:shadow-md"
                    variant="outline"
                  >
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                      <p className="font-semibold text-lg text-gray-800 dark:text-gray-200">{user.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}